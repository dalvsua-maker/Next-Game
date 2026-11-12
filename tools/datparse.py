"""Lector mínimo del formato .dat de clrmamepro que usa libretro-database.

Devuelve una lista de diccionarios, uno por bloque `game ( ... )`, con sus campos
y, si los hay, los bloques `rom ( ... )` en la clave `_roms`.
"""
import re

TOKEN = re.compile(r'"((?:[^"\\]|\\.)*)"|(\()|(\))|([^\s()"]+)')


def parse(path):
    with open(path, encoding="utf-8", errors="replace") as fh:
        txt = fh.read()

    toks = []
    for m in TOKEN.finditer(txt):
        if m.group(1) is not None:
            toks.append(("s", m.group(1)))
        elif m.group(2):
            toks.append(("(", None))
        elif m.group(3):
            toks.append((")", None))
        else:
            toks.append(("w", m.group(4)))

    def block(i):
        d, roms = {}, []
        while i < len(toks) and toks[i][0] != ")":
            key = toks[i][1]
            i += 1
            if i < len(toks) and toks[i][0] == "(":
                sub, i = block(i + 1)
                if key == "rom":
                    roms.append(sub)
            elif i < len(toks):
                d.setdefault(key, toks[i][1])
                i += 1
        if roms:
            d["_roms"] = roms
        return d, i + 1

    out, i = [], 0
    while i < len(toks):
        if toks[i][0] == "w" and i + 1 < len(toks) and toks[i + 1][0] == "(":
            name = toks[i][1]
            d, i = block(i + 2)
            if name == "game":
                out.append(d)
        else:
            i += 1
    return out
