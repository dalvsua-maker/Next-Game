"""Consolas incluidas en el catálogo.

Cada entrada: (clave, nombre en libretro-database, nombre visible, abreviatura, emulador recomendado, grupo).
El nombre de libretro se usa para localizar los .dat de metadatos y el repositorio de
libretro-thumbnails (espacios cambiados por guiones bajos).
"""

SYSTEMS = [
    ("nes", "Nintendo - Nintendo Entertainment System", "NES", "NES", "Mesen / RetroArch (Mesen, FCEUmm)", "Nintendo"),
    ("fds", "Nintendo - Family Computer Disk System", "Famicom Disk System", "FDS", "Mesen", "Nintendo"),
    ("snes", "Nintendo - Super Nintendo Entertainment System", "Super Nintendo", "SNES", "Snes9x / bsnes", "Nintendo"),
    ("n64", "Nintendo - Nintendo 64", "Nintendo 64", "N64", "simple64 / RetroArch (Mupen64Plus-Next)", "Nintendo"),
    ("gc", "Nintendo - GameCube", "GameCube", "GC", "Dolphin", "Nintendo"),
    ("wii", "Nintendo - Wii", "Wii", "Wii", "Dolphin", "Nintendo"),
    ("gb", "Nintendo - Game Boy", "Game Boy", "GB", "mGBA / SameBoy", "Nintendo"),
    ("gbc", "Nintendo - Game Boy Color", "Game Boy Color", "GBC", "mGBA / SameBoy", "Nintendo"),
    ("gba", "Nintendo - Game Boy Advance", "Game Boy Advance", "GBA", "mGBA", "Nintendo"),
    ("vb", "Nintendo - Virtual Boy", "Virtual Boy", "VB", "RetroArch (Beetle VB)", "Nintendo"),
    ("nds", "Nintendo - Nintendo DS", "Nintendo DS", "DS", "melonDS", "Nintendo"),
    ("3ds", "Nintendo - Nintendo 3DS", "Nintendo 3DS", "3DS", "Azahar", "Nintendo"),
    ("sms", "Sega - Master System - Mark III", "Master System", "SMS", "Genesis Plus GX", "Sega"),
    ("md", "Sega - Mega Drive - Genesis", "Mega Drive / Genesis", "MD", "Genesis Plus GX", "Sega"),
    ("gg", "Sega - Game Gear", "Game Gear", "GG", "Genesis Plus GX", "Sega"),
    ("32x", "Sega - 32X", "32X", "32X", "PicoDrive", "Sega"),
    ("scd", "Sega - Mega-CD - Sega CD", "Mega-CD / Sega CD", "SCD", "Genesis Plus GX", "Sega"),
    ("sat", "Sega - Saturn", "Saturn", "SAT", "RetroArch (Beetle Saturn)", "Sega"),
    ("dc", "Sega - Dreamcast", "Dreamcast", "DC", "Flycast", "Sega"),
    ("ps1", "Sony - PlayStation", "PlayStation", "PS1", "DuckStation", "Sony"),
    ("ps2", "Sony - PlayStation 2", "PlayStation 2", "PS2", "PCSX2", "Sony"),
    ("psp", "Sony - PlayStation Portable", "PSP", "PSP", "PPSSPP", "Sony"),
    ("pce", "NEC - PC Engine - TurboGrafx 16", "PC Engine / TurboGrafx-16", "PCE", "RetroArch (Beetle PCE)", "Otras"),
    ("ngpc", "SNK - Neo Geo Pocket Color", "Neo Geo Pocket Color", "NGPC", "RetroArch (Beetle NeoPop)", "Otras"),
    ("wsc", "Bandai - WonderSwan Color", "WonderSwan Color", "WSC", "RetroArch (Beetle Cygne)", "Otras"),
    ("a2600", "Atari - 2600", "Atari 2600", "2600", "Stella", "Otras"),
    ("a7800", "Atari - 7800", "Atari 7800", "7800", "RetroArch (ProSystem)", "Otras"),
    ("lynx", "Atari - Lynx", "Atari Lynx", "Lynx", "RetroArch (Handy)", "Otras"),
    ("msx", "Microsoft - MSX", "MSX", "MSX", "openMSX", "Otras"),
]


def thumbs_repo(libretro_name):
    """Nombre del repositorio de libretro-thumbnails para un sistema."""
    return libretro_name.replace(" ", "_")
