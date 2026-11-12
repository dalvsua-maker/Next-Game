"""Descarga las fuentes de datos en ./sources (carpeta ignorada por git).

Uso:
    python tools/fetch_sources.py                 # todo
    python tools/fetch_sources.py --no-steam      # solo consolas
    python tools/fetch_sources.py --systems snes md

Necesita git instalado. Descarga:
    - steamdb.min.json.gz (~55 MB) de https://github.com/leinstay/steamdb
    - las carpetas metadat de https://github.com/libretro/libretro-database (clon parcial)
    - el listado de carátulas de cada consola en https://github.com/libretro-thumbnails
      (solo los nombres de fichero, sin descargar las imágenes)
"""
import argparse
import os
import shutil
import subprocess
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from systems import SYSTEMS, thumbs_repo  # noqa: E402

STEAMDB_URL = "https://github.com/leinstay/steamdb/releases/latest/download/steamdb.min.json.gz"
LIBRETRO_DB = "https://github.com/libretro/libretro-database"
THUMBS_ORG = "https://github.com/libretro-thumbnails/"
METADAT = ["genre", "releaseyear", "developer", "publisher", "maxusers", "franchise", "redump", "no-intro"]


def git(*args, cwd=None):
    subprocess.run(["git", *args], cwd=cwd, check=True)


def fetch_steamdb(dest):
    path = os.path.join(dest, "steamdb.min.json.gz")
    print(f"Descargando {STEAMDB_URL} …")
    tmp = path + ".part"
    with urllib.request.urlopen(STEAMDB_URL) as resp, open(tmp, "wb") as fh:
        shutil.copyfileobj(resp, fh)
    os.replace(tmp, path)
    print(f"  {os.path.getsize(path) / 1e6:.1f} MB")


def fetch_libretro_db(dest):
    repo = os.path.join(dest, "lrdb")
    if os.path.isdir(os.path.join(repo, ".git")):
        print("Actualizando libretro-database …")
        git("pull", "--quiet", "--depth", "1", cwd=repo)
    else:
        print("Clonando libretro-database (solo metadat) …")
        git("clone", "--quiet", "--depth", "1", "--filter=blob:none", "--sparse", LIBRETRO_DB, repo)
    git("sparse-checkout", "set", *[f"metadat/{d}" for d in METADAT], cwd=repo)


def fetch_thumbnail_lists(dest, systems):
    lists = os.path.join(dest, "thumbs")
    clones = os.path.join(dest, "thumbs_git")
    os.makedirs(lists, exist_ok=True)
    os.makedirs(clones, exist_ok=True)
    for key, lr_name, *_ in SYSTEMS:
        if systems and key not in systems:
            continue
        name = thumbs_repo(lr_name)
        repo = os.path.join(clones, name)
        if os.path.isdir(os.path.join(repo, ".git")):
            git("fetch", "--quiet", "--depth", "1", "--filter=blob:none", "origin", cwd=repo)
            ref = "FETCH_HEAD"
        else:
            git("clone", "--quiet", "--depth", "1", "--filter=blob:none", "--no-checkout", THUMBS_ORG + name, repo)
            ref = "HEAD"
        out = subprocess.run(["git", "ls-tree", "-r", "--name-only", ref], cwd=repo, check=True,
                             capture_output=True, text=True, encoding="utf-8").stdout
        with open(os.path.join(lists, name + ".txt"), "w", encoding="utf-8", newline="\n") as fh:
            fh.write(out)
        print(f"  {key:<6} {out.count(chr(10)):>7} imágenes")


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dest", default=os.path.join(root, "sources"), help="carpeta de destino")
    ap.add_argument("--no-steam", action="store_true", help="no descargar el volcado de Steam")
    ap.add_argument("--no-retro", action="store_true", help="no descargar los datos de consolas")
    ap.add_argument("--systems", nargs="*", help="claves de consola (por ejemplo: snes md ps1)")
    args = ap.parse_args()
    if shutil.which("git") is None:
        sys.exit("Necesitas git instalado.")
    os.makedirs(args.dest, exist_ok=True)
    if not args.no_steam:
        fetch_steamdb(args.dest)
    if not args.no_retro:
        fetch_libretro_db(args.dest)
        print("Listando carátulas de libretro-thumbnails …")
        fetch_thumbnail_lists(args.dest, set(args.systems or []))
    print("Listo. Ahora: python tools/build_data.py")


if __name__ == "__main__":
    main()
