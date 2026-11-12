"""Genera los datos de la web (public/data) a partir de las fuentes descargadas.

Uso:
    python tools/fetch_sources.py          # descarga las fuentes en ./sources
    python tools/build_data.py             # escribe public/data/pc.js, retro.js y desc/*.js

Fuentes:
    sources/steamdb.min.json.gz            volcado de https://github.com/leinstay/steamdb
    sources/lrdb/metadat/...               https://github.com/libretro/libretro-database
    sources/thumbs/<Sistema>.txt           listado de https://github.com/libretro-thumbnails

Los ficheros de salida son JavaScript (`ppData("nombre", {...});`) para que la web
funcione también abriendo index.html con doble clic, sin servidor.
"""
import argparse
import collections
import gzip
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import datparse  # noqa: E402
from systems import SYSTEMS, thumbs_repo  # noqa: E402

try:
    import ijson
except ImportError:  # pragma: no cover
    sys.exit("Falta la dependencia ijson: pip install -r tools/requirements.txt")

# Número de ficheros en que se reparten las descripciones (se cargan bajo demanda).
DESC_SHARDS = 40

# ---------------------------------------------------------------- géneros
GENRES = ["accion", "aventura", "rpg", "estrategia", "simulacion", "gestion", "puzle", "plataformas", "shooter",
          "shmup", "lucha", "beatemup", "carreras", "deportes", "terror", "roguelike", "metroidvania", "novela",
          "pointclick", "supervivencia", "mundoabierto", "ritmo", "cartas", "casual", "arcade", "sigilo", "mmo",
          "party", "educativo"]
GENRE_INDEX = {g: i for i, g in enumerate(GENRES)}

# Géneros y etiquetas de Steam / libretro -> género propio
GENRE_MAP = {}


def _map(genre, *names):
    for n in names:
        GENRE_MAP.setdefault(n.lower(), set()).add(genre)


_map("accion", "Action", "Action-Adventure", "Hack and Slash", "Hack and slash/Beat 'em up", "Action RPG", "Character Action Game", "Spectacle fighter", "Combat", "Gun", "Breakout")
_map("aventura", "Adventure", "Action-Adventure", "Interactive Fiction", "Walking Simulator", "Point-and-click", "Point & Click", "Interactive Movie", "Interactive Comic", "Detective", "Investigation", "Detective-mystery")
_map("rpg", "RPG", "Role-playing (RPG)", "Role-playing", "JRPG", "Action RPG", "CRPG", "Party-Based RPG", "Strategy RPG", "Tactical RPG", "MMORPG", "Dungeon Crawler", "Mystery Dungeon")
_map("estrategia", "Strategy", "Turn-based strategy (TBS)", "Real Time Strategy (RTS)", "RTS", "Grand Strategy", "4X", "Turn-Based Strategy", "Turn-Based Tactics", "Tactical", "Tower Defense", "Wargame", "Auto Battler", "Real Time Tactics", "Strategy RPG", "Tactical RPG", "Shogi", "Board / Shogi")
_map("simulacion", "Simulation", "Simulator", "Life Sim", "Farming Sim", "Automobile Sim", "Flight", "Space Sim", "Medical Sim", "Political Sim", "Flight Simulator", "Driving")
_map("gestion", "Management", "City Builder", "Colony Sim", "Base-Building", "Resource Management", "Economy", "Automation", "Managerial", "Capitalism", "God Game", "Time Management", "Trading")
_map("puzle", "Puzzle", "Logic", "Puzzle-Platformer", "Match 3", "Sokoban", "Hidden Object", "Escape Room", "Thinking", "Word Game", "Breakout", "Programming")
_map("plataformas", "Platform", "Platformer", "2D Platformer", "3D Platformer", "Precision Platformer", "Puzzle-Platformer", "Collectathon", "Metroidvania")
_map("shooter", "Shooter", "FPS", "Third-Person Shooter", "Arena Shooter", "Hero Shooter", "Looter Shooter", "Boomer Shooter", "Top-Down Shooter", "Twin Stick Shooter", "Lightgun Shooter", "On-Rails Shooter", "Battle Royale", "Gun")
_map("shmup", "Shoot'em Up", "Shoot 'Em Up", "Shoot 'em Up", "Bullet Hell")
_map("lucha", "Fighting", "2D Fighter", "3D Fighter", "Martial Arts", "Wrestling", "Boxing", "Beat'em Up / Fighting", "Fighting / Beat'em Up")
_map("beatemup", "Beat'em Up", "Beat 'em up", "Hack and slash/Beat 'em up", "Beat'em Up / Fighting", "Fighting / Beat'em Up")
_map("carreras", "Racing", "Combat Racing", "Offroad", "Motorbike", "Driving")
_map("deportes", "Sports", "Sport", "Football (Soccer)", "Basketball", "Golf", "Tennis", "Boxing", "Sports with Animals", "Hunting and Fishing", "Fishing", "Football", "Wrestling", "Mini Golf", "Football (American)", "Pool", "Hunting")
_map("terror", "Horror", "Survival Horror", "Psychological Horror")
_map("roguelike", "Roguelike", "Rogue-like", "Rogue-lite", "Action Roguelike", "Traditional Roguelike", "Roguelike Deckbuilder", "Roguevania")
_map("metroidvania", "Metroidvania", "Roguevania")
_map("novela", "Visual Novel", "Dating Sim", "Otome", "Choose Your Own Adventure")
_map("pointclick", "Point & Click", "Point-and-click", "Hidden Object")
_map("supervivencia", "Survival", "Open World Survival Craft", "Crafting", "Survival Horror")
_map("mundoabierto", "Open World", "Sandbox")
_map("ritmo", "Rhythm", "Music", "Music / Dancing", "Dancing", "Sing", "Rhythm / Sing")
_map("cartas", "Card & Board Game", "Card Game", "Board Game", "Deckbuilding", "Card Battler", "Trading Card Game", "Board", "Card", "Solitaire", "Chess", "Tabletop", "Mahjong", "Gambling", "Board / Mini Games", "Roguelike Deckbuilder")
_map("casual", "Casual", "Casual Game", "Clicker", "Idler", "Cozy")
_map("arcade", "Arcade", "Pinball", "Score Attack", "Breakout")
_map("sigilo", "Stealth")
_map("mmo", "Massively Multiplayer", "MMO", "MMORPG")
_map("party", "Party Game", "Party", "Minigames", "Mini Games", "Quiz", "Quiz/Trivia", "Trivia", "Quiz / Party", "Mini Games / Quiz", "Social Deduction")
_map("educativo", "Educational", "Education", "Educational / Mini Games", "Mini Games / Educational", "Quiz / Educational", "Typing")


def genre_mask(names):
    mask = 0
    for n in names:
        for g in GENRE_MAP.get((n or "").lower(), ()):
            mask |= 1 << GENRE_INDEX[g]
    return mask


ADULT_TAGS = {"hentai", "nsfw", "sexual content", "nudity", "adult", "mature"}
# Etiquetas que ya se representan con géneros o banderas y no se guardan como etiqueta
NON_TAGS = set(GENRE_MAP.keys()) | {"indie", "singleplayer", "multiplayer", "early access", "free to play", "co-op", "pvp",
                                    "pve", "2d", "3d", "controller", "vr", "local multiplayer", "online co-op", "local co-op",
                                    "split screen", "4 player local", "mouse only", "e-sports", "sexual content", "nudity",
                                    "hentai", "nsfw", "mature"}

# Banderas de los juegos de PC (posición del bit). La web usa el mismo mapa (pc.js -> flags).
FLAGS = dict(fullpad=0, partpad=1, padrec=2, mouseonly=3, kbonly=4, single=5, cooponl=6, cooploc=7, pvponl=8, pvploc=9,
             mmo=10, vronly=11, vrsup=12, free=13, early=14, linux=15, mac=16, touch=17, indie=18, mousefr=19, adult=20,
             gog=21, remoteplay=22, multi=23, es=24, esvoz=25)
SPANISH = {"Spanish - Spain", "Spanish - Latin America", "Spanish"}
HEADER_RE = re.compile(r"https://shared\.akamai\.steamstatic\.com/store_item_assets/steam/apps/(\d+)/(?:([0-9a-f]{20,})/)?header\.jpg$")


def clean_text(text, limit=320):
    text = html.unescape(re.sub(r"<[^>]+>", " ", text or ""))
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > limit:
        text = text[:limit].rsplit(" ", 1)[0] + "…"
    return text


def write_js(name, obj, path):
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("ppData(" + json.dumps(name) + "," + json.dumps(obj, separators=(",", ":"), ensure_ascii=False) + ");")


class Interner:
    """Guarda cada texto una sola vez y devuelve su índice (-1 si está vacío)."""

    def __init__(self):
        self.items, self._index = [], {}

    def __call__(self, value):
        if not value:
            return -1
        if value not in self._index:
            self._index[value] = len(self.items)
            self.items.append(value)
        return self._index[value]


# ---------------------------------------------------------------- PC
def pc_flags(g, cats, tl):
    flags = 0

    def on(key):
        nonlocal flags
        flags |= 1 << FLAGS[key]

    if "Full controller support" in cats or "Controller support" in cats: on("fullpad")
    if "Partial Controller Support" in cats: on("partpad")
    if "Gamepad Recommended" in cats or "controller" in tl: on("padrec")
    if "Mouse Only Option" in cats or "mouse only" in tl: on("mouseonly")
    if "Keyboard Only Option" in cats: on("kbonly")
    if "Single-player" in cats or "singleplayer" in tl: on("single")
    if cats & {"Online Co-op", "Co-op"} or "online co-op" in tl: on("cooponl")
    if cats & {"Shared/Split Screen Co-op", "LAN Co-op", "Local Co-op"} or "local co-op" in tl: on("cooploc")
    if cats & {"Online PvP", "PvP"}: on("pvponl")
    if cats & {"Shared/Split Screen PvP", "LAN PvP"}: on("pvploc")
    if cats & {"Shared/Split Screen", "Local Multi-Player"} or tl & {"local multiplayer", "split screen", "4 player local"}:
        if "Shared/Split Screen Co-op" in cats:
            on("cooploc")
        elif "Shared/Split Screen PvP" in cats:
            on("pvploc")
        else:
            on("cooploc"); on("pvploc")
    if cats & {"MMO"} or "massively multiplayer" in tl: on("mmo")
    if "VR Only" in cats: on("vronly")
    if cats & {"VR Supported", "VR Support", "Tracked Controller Support"}: on("vrsup")
    if "free to play" in tl or g.get("price_final_usd") == 0: on("free")
    if "early access" in tl or (g.get("early_access_date") and not g.get("release_date")): on("early")
    platforms = g.get("platforms") or []
    if "LNX" in platforms: on("linux")
    if "MAC" in platforms: on("mac")
    if "Touch Only Option" in cats: on("touch")
    if "indie" in tl: on("indie")
    if tl & {"point & click", "point-and-click", "hidden object", "clicker", "idler", "visual novel", "card game", "solitaire"} or "Mouse Only Option" in cats: on("mousefr")
    if tl & ADULT_TAGS: on("adult")
    if g["kind"] == "gog_exclusive": on("gog")
    if "Remote Play Together" in cats: on("remoteplay")
    if cats & {"Multi-player", "Online Multi-Player"}: on("multi")
    if set(g.get("languages") or []) & SPANISH: on("es")
    if set(g.get("voiceovers") or []) & SPANISH: on("esvoz")
    return flags


def build_pc(sources, out):
    devs, tag_count, raw = Interner(), collections.Counter(), []
    with gzip.open(os.path.join(sources, "steamdb.min.json.gz"), "rb") as fh:
        for g in ijson.items(fh, "item"):
            reviews = g.get("steam_reviews_count") or 0
            if g["kind"] != "gog_exclusive" and reviews < 10:
                continue
            if not g.get("name"):
                continue
            cats = set(g.get("categories") or [])
            tags = g.get("tags") or []
            genres = g.get("genres") or []
            tl = {t.lower() for t in tags} | {x.lower() for x in genres}
            if "Single-player" not in cats and not (cats & {"Multi-player", "Co-op", "PvP", "Online PvP", "Online Co-op", "MMO"}) and not genres:
                continue

            # Imagen: "" = ruta clásica de Steam, "h:<hash>" = ruta nueva con hash, o URL completa (GOG...)
            url = re.sub(r"\?.*", "", g.get("image") or "")
            m = HEADER_RE.match(url)
            if m and str(g.get("steam_appid")) == m.group(1):
                img = "h:" + m.group(2) if m.group(2) else ""
            else:
                img = url

            date = g.get("release_date") or g.get("store_release_date") or ""
            year = int(date[:4]) if date[:4].isdigit() else 0
            hours = g.get("hltb_main_hours") or g.get("average_playtime_hours") or 0
            hltb = 0
            if g.get("hltb_url"):
                m = re.search(r"/game/(\d+)", g["hltb_url"])
                hltb = int(m.group(1)) if m else 0
            own_tags = [t for t in tags if t.lower() not in NON_TAGS][:10]
            tag_count.update(own_tags)
            pct = g.get("steam_reviews_percent")
            price = g.get("price_final_usd")
            raw.append(dict(
                rec=[g["name"], g.get("steam_appid") or 0, year, genre_mask(list(genres) + list(tags)), own_tags,
                     pc_flags(g, cats, tl), -1 if pct is None else pct, reviews, round(hours * 10),
                     -1 if price is None else price, devs((g.get("developers") or [None])[0]),
                     g.get("metacritic_score") or 0, hltb, img],
                desc=clean_text(g.get("description")),
                gog=g.get("gog_url") or ""))

    tag_list = [t for t, c in tag_count.most_common() if c >= 12]
    tag_index = {t: i for i, t in enumerate(tag_list)}
    games = []
    for r in raw:
        r["rec"][4] = [tag_index[t] for t in r["rec"][4] if t in tag_index][:8]
        games.append(r["rec"])
    print(f"PC: {len(games)} juegos, {len(tag_list)} etiquetas, {len(devs.items)} estudios")

    write_js("pc", dict(fields="name,appid,year,genres,tags,flags,revPct,revCount,hours10,priceCents,dev,metacritic,hltb,img".split(","),
                        genres=GENRES, flags=FLAGS, tags=tag_list, devs=devs.items, games=games),
             os.path.join(out, "pc.js"))
    shards = [{} for _ in range(DESC_SHARDS)]
    for i, r in enumerate(raw):
        value = [r["desc"], r["gog"]] if r["gog"] else r["desc"]
        if value:
            shards[i % DESC_SHARDS][i] = value
    for k in range(DESC_SHARDS):
        write_js(f"p{k:02d}", shards[k], os.path.join(out, "desc", f"p{k:02d}.js"))


# ---------------------------------------------------------------- consolas
BAD_DUMP = re.compile(r"\((?:[^)]*\b(?:Beta|Proto|Prototype|Sample|Demo|Pirate|Hack|Kiosk|Program|Test|Aftermarket|Unl|BIOS|Debug|Promo|Competition|Trial|Preview|Taikenban|Tech Demo|Homebrew)\b[^)]*)\)", re.I)
REGIONS = {"USA": "US", "World": "WLD", "Europe": "EU", "Japan": "JP", "Spain": "ES", "Germany": "DE", "France": "FR",
           "Italy": "IT", "Korea": "KR", "Brazil": "BR", "Australia": "AU", "Asia": "ASIA", "China": "CN"}
REGION_ORDER = ["US", "EU", "JP", "WLD", "ES"]


def base_name(name):
    name = re.sub(r"\s*\[[^\]]*\]", "", name)
    return re.sub(r"\s*\([^)]*\)", "", name).strip()


def regions_of(name):
    out = set()
    for group in re.findall(r"\(([^)]*)\)", name):
        for part in group.split(","):
            part = part.strip()
            if part in REGIONS:
                out.add(REGIONS[part])
    return out


def region_rank(regions):
    for i, r in enumerate(["US", "WLD", "EU", "JP"]):
        if r in regions:
            return i
    return 9


def match_key(name):
    """Clave para emparejar títulos aunque cambien artículos, signos o '&'."""
    b = base_name(name).lower()
    m = re.match(r"^(.*?), (the|a|an|le|la|les|el|los|las|die|der|das)( - .*)?$", b)
    if m:
        b = m.group(2) + " " + m.group(1) + (m.group(3) or "")
    b = re.sub(r"^(the|a|an) ", "", b)
    return re.sub(r"[^a-z0-9]", "", b.replace("&", "and"))


def thumbnail_index(sources, libretro_name):
    """match_key -> {nombre de fichero: máscara (1 caja, 2 captura, 4 pantalla de título)}"""
    path = os.path.join(sources, "thumbs", thumbs_repo(libretro_name) + ".txt")
    idx = {}
    if not os.path.exists(path):
        return idx
    with open(path, encoding="utf-8", errors="replace") as fh:
        for line in fh:
            m = re.match(r"Named_(Boxarts|Snaps|Titles)/(.+)\.png$", line.rstrip("\n"))
            if not m:
                continue
            bit = {"Boxarts": 1, "Snaps": 2, "Titles": 4}[m.group(1)]
            d = idx.setdefault(match_key(m.group(2)), {})
            d[m.group(2)] = d.get(m.group(2), 0) | bit
    return idx


def thumbnail_score(name, mask):
    low = name.lower()
    if "(usa" in low: score = 0
    elif "(world" in low: score = 1
    elif "(europe" in low or "(spain" in low: score = 2
    elif "(japan" in low: score = 4
    else: score = 3
    if BAD_DUMP.search(name): score += 10
    if re.search(r"\((?:Disc|Disk) [2-9]", name): score += 5
    if not mask & 1: score += 3
    score += (3 - bin(mask).count("1")) * 0.5
    if re.search(r"\((?:Rev|v\d)", name): score += 0.2
    return score


def build_retro(sources, out):
    metadat = os.path.join(sources, "lrdb", "metadat")
    devs, games, descs, systems = Interner(), [], [], []

    for si, (key, lr_name, label, short, emulator, group) in enumerate(SYSTEMS):
        thumbs = thumbnail_index(sources, lr_name)
        entries = {}

        def add(name, info):
            if BAD_DUMP.search(name):
                return
            b = base_name(name)
            if not b or len(b) < 2:
                return
            regs = regions_of(name)
            k = match_key(name) or b
            e = entries.get(k)
            if e is None:
                e = entries[k] = dict(name=b, regions=set(), best=99, info={})
            e["regions"] |= regs
            rank = region_rank(regs)
            for field, value in info.items():
                if value and (field not in e["info"] or rank < e["best"]):
                    e["info"][field] = value
            e["best"] = min(e["best"], rank)

        # Metadatos (agrupados por CRC de la ROM cuando existe)
        by_crc = {}
        for folder in ["genre", "releaseyear", "developer", "publisher", "maxusers", "franchise"]:
            path = os.path.join(metadat, folder, lr_name + ".dat")
            if not os.path.exists(path):
                continue
            for g in datparse.parse(path):
                name = g.get("comment") or g.get("name")
                if not name:
                    continue
                crc = g["_roms"][0].get("crc") if g.get("_roms") else None
                e = by_crc.setdefault(crc or name, {"name": name})
                for field in ["genre", "releaseyear", "developer", "publisher", "users", "description", "franchise"]:
                    if g.get(field) and field not in e:
                        e[field] = g[field]
        for e in by_crc.values():
            add(e["name"], e)
        # Títulos sin metadatos (No-Intro / Redump) para consolas que no tienen otra fuente
        for folder in ["no-intro", "redump"]:
            path = os.path.join(metadat, folder, lr_name + ".dat")
            if os.path.exists(path):
                for g in datparse.parse(path):
                    if g.get("name"):
                        add(re.sub(r"\s*\((?:Disc|Disk|Side) [^)]*\)", "", g["name"]), {})

        first = len(games)
        has_metadata = len(by_crc) > 100
        for k, e in sorted(entries.items(), key=lambda kv: kv[1]["name"].lower()):
            info = e["info"]
            if has_metadata and not (info.get("genre") or info.get("releaseyear") or info.get("developer")):
                continue
            mask = 0
            for part in re.split(r"\s*/\s*", info.get("genre", "")):
                mask |= genre_mask([part])
            year = info.get("releaseyear", "")
            year = int(year) if str(year)[:4].isdigit() else 0
            try:
                users = int(info.get("users") or 0)
            except ValueError:
                users = 0
            regs = ",".join(sorted(e["regions"], key=lambda r: (REGION_ORDER.index(r) if r in REGION_ORDER else 9, r)))
            thumb, thumb_mask = "", 0
            if thumbs.get(k):
                cands = thumbs[k]
                thumb = min(cands, key=lambda n: thumbnail_score(n, cands[n]))
                thumb_mask = cands[thumb]
            descs.append((len(games), clean_text(info.get("description"), 360) if info.get("description") else "",
                          info.get("publisher") or "", info.get("franchise") or ""))
            games.append([e["name"], si, year, mask, devs(info.get("developer")), users, regs,
                          1 if info.get("genre") == "Adult" else 0, thumb, thumb_mask])
        systems.append(dict(key=key, label=label, short=short, emu=emulator, group=group, count=len(games) - first,
                            repo=thumbs_repo(lr_name)))
        print(f"  {short:<5} {len(games) - first:>6}")
    print(f"Consolas: {len(games)} juegos")

    write_js("retro", dict(fields="name,sys,year,genres,dev,users,regions,adult,thumb,thumbMask".split(","),
                           genres=GENRES, systems=systems, devs=devs.items, games=games),
             os.path.join(out, "retro.js"))
    shards = [{} for _ in range(DESC_SHARDS)]
    for idx, desc, publisher, franchise in descs:
        if desc or publisher or franchise:
            shards[idx % DESC_SHARDS][idx] = [desc, publisher, franchise]
    for k in range(DESC_SHARDS):
        write_js(f"r{k:02d}", shards[k], os.path.join(out, "desc", f"r{k:02d}.js"))


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--sources", default=os.path.join(root, "sources"), help="carpeta con las fuentes descargadas")
    ap.add_argument("--out", default=os.path.join(root, "public", "data"), help="carpeta de salida")
    args = ap.parse_args()
    if not os.path.exists(os.path.join(args.sources, "steamdb.min.json.gz")):
        sys.exit(f"No encuentro las fuentes en {args.sources}. Ejecuta antes: python tools/fetch_sources.py")
    os.makedirs(os.path.join(args.out, "desc"), exist_ok=True)
    build_pc(args.sources, args.out)
    build_retro(args.sources, args.out)


if __name__ == "__main__":
    main()
