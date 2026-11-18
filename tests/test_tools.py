"""Pruebas de los scripts de datos (tools/).

Ejecutar:  python -m unittest discover -s tests -p "test_*.py" -v   (o: npm run test:tools)
No descargan nada: construyen unas fuentes mínimas de ejemplo en una carpeta temporal.
"""
import gzip
import json
import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

try:
    import build_data as bd  # noqa: E402
    HAVE_IJSON = True
except SystemExit:  # falta ijson
    HAVE_IJSON = False
import datparse  # noqa: E402


def read_js(path):
    with open(path, encoding="utf-8") as fh:
        t = fh.read()
    return json.loads(t[t.index(",") + 1:t.rindex(")")])


class DatParse(unittest.TestCase):
    def test_lee_bloques_game_y_rom(self):
        with tempfile.NamedTemporaryFile("w", suffix=".dat", delete=False, encoding="utf-8") as fh:
            fh.write('clrmamepro ( name "x" )\n'
                     'game (\n  comment "Super Mario World (USA)"\n  genre "Platform"\n  releaseyear "1990"\n'
                     '  rom ( name "smw.sfc" size 524288 crc B19ED489 )\n)\n'
                     'game ( name "Zelda (Japan)" users 1 )\n')
        try:
            games = datparse.parse(fh.name)
        finally:
            os.unlink(fh.name)
        self.assertEqual(len(games), 2)
        self.assertEqual(games[0]["comment"], "Super Mario World (USA)")
        self.assertEqual(games[0]["_roms"][0]["crc"], "B19ED489")
        self.assertEqual(games[1]["users"], "1")


@unittest.skipUnless(HAVE_IJSON, "falta ijson (pip install -r tools/requirements.txt)")
class Helpers(unittest.TestCase):
    def test_nombre_base_quita_regiones_y_versiones(self):
        self.assertEqual(bd.base_name("Super Mario World (USA) (Rev 1) [!]"), "Super Mario World")

    def test_regiones(self):
        self.assertEqual(bd.regions_of("Tetris (Japan, USA) (En,Ja)"), {"JP", "US"})

    def test_clave_de_emparejado_ignora_articulos_y_signos(self):
        self.assertEqual(bd.match_key("Legend of Zelda, The - A Link to the Past (USA)"),
                         bd.match_key("The Legend of Zelda: A Link to the Past"))
        self.assertEqual(bd.match_key("Ratchet & Clank"), bd.match_key("Ratchet and Clank"))

    def test_caratula_prefiere_usa_y_disco_1(self):
        cands = {"Game (Europe)": 7, "Game (USA)": 7, "Game (USA) (Disc 2)": 7, "Game (USA) (Beta)": 7}
        self.assertEqual(min(cands, key=lambda n: bd.thumbnail_score(n, cands[n])), "Game (USA)")

    def test_generos(self):
        m = bd.genre_mask(["Action", "Roguelike"])
        self.assertTrue(m & (1 << bd.GENRE_INDEX["accion"]))
        self.assertTrue(m & (1 << bd.GENRE_INDEX["roguelike"]))
        self.assertEqual(bd.genre_mask(["Desconocido"]), 0)

    def test_texto_limpio_y_recortado(self):
        self.assertEqual(bd.clean_text("<b>Hola</b>   &amp; adiós"), "Hola & adiós")
        self.assertTrue(bd.clean_text("palabra " * 100, 30).endswith("…"))


@unittest.skipUnless(HAVE_IJSON, "falta ijson (pip install -r tools/requirements.txt)")
class BuildCompleto(unittest.TestCase):
    """Genera los datos a partir de unas fuentes de juguete y comprueba el resultado."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        src = os.path.join(self.tmp.name, "sources")
        self.out = os.path.join(self.tmp.name, "out")
        os.makedirs(os.path.join(self.out, "desc"))
        os.makedirs(os.path.join(src, "lrdb", "metadat", "genre"))
        os.makedirs(os.path.join(src, "thumbs"))
        steam = [
            {"kind": "steam", "name": "Juego Bueno", "steam_appid": 10, "steam_reviews_count": 500, "steam_reviews_percent": 95,
             "categories": ["Single-player", "Full controller support"], "genres": ["Action"], "tags": ["Pixel Graphics", "Indie"],
             "languages": ["Spanish - Spain"], "release_date": "2020-01-01", "image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/10/header.jpg?t=1",
             "description": "<p>Un juego</p>", "developers": ["Estudio"], "platforms": ["WIN", "LNX"]},
            {"kind": "steam", "name": "Pocas Reseñas", "steam_appid": 11, "steam_reviews_count": 3, "categories": ["Single-player"], "genres": ["Action"]},
        ]
        with gzip.open(os.path.join(src, "steamdb.min.json.gz"), "wt", encoding="utf-8") as fh:
            json.dump(steam, fh)
        snes = "Nintendo - Super Nintendo Entertainment System"
        with open(os.path.join(src, "lrdb", "metadat", "genre", snes + ".dat"), "w", encoding="utf-8") as fh:
            fh.write('game ( comment "Super Mario World (USA)" genre "Platform" rom ( crc 1 ) )\n'
                     'game ( comment "Super Mario World (Japan)" genre "Platform" rom ( crc 2 ) )\n'
                     'game ( comment "Demo Game (USA) (Demo)" genre "Action" rom ( crc 3 ) )\n')
        with open(os.path.join(src, "thumbs", bd.thumbs_repo(snes) + ".txt"), "w", encoding="utf-8") as fh:
            fh.write("Named_Boxarts/Super Mario World (USA).png\nNamed_Snaps/Super Mario World (USA).png\n")
        self.src = src

    def tearDown(self):
        self.tmp.cleanup()

    def test_genera_pc_y_consolas(self):
        bd.build_pc(self.src, self.out)
        bd.build_retro(self.src, self.out)
        pc = read_js(os.path.join(self.out, "pc.js"))
        self.assertEqual([g[0] for g in pc["games"]], ["Juego Bueno"], "los juegos con menos de 10 reseñas quedan fuera")
        g = pc["games"][0]
        self.assertTrue(g[5] & (1 << pc["flags"]["fullpad"]))
        self.assertTrue(g[5] & (1 << pc["flags"]["es"]))
        self.assertEqual(g[13], "", "imagen de Steam en la ruta clásica")
        retro = read_js(os.path.join(self.out, "retro.js"))
        names = [x[0] for x in retro["games"]]
        self.assertEqual(names, ["Super Mario World"], "las regiones se agrupan y las demos se descartan")
        self.assertEqual(retro["games"][0][8], "Super Mario World (USA)")
        self.assertEqual(retro["games"][0][9], 3, "caja + captura")
        self.assertTrue(os.path.exists(os.path.join(self.out, "desc", "p00.js")))

    def test_resultado_estable_entre_ejecuciones(self):
        bd.build_retro(self.src, self.out)
        with open(os.path.join(self.out, "retro.js"), encoding="utf-8") as fh:
            first = fh.read()
        bd.build_retro(self.src, self.out)
        with open(os.path.join(self.out, "retro.js"), encoding="utf-8") as fh:
            self.assertEqual(first, fh.read())


if __name__ == "__main__":
    unittest.main()
