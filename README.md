# Próxima Partida

Recomendador de juegos de PC y de consolas emulables. Elige al azar entre más de 117.000 títulos con filtros de género, controles, jugadores, duración, época, idioma y más, y enseña carátulas, capturas y tráileres de cada juego.

## Modos

- **Ruleta**: un carrete de carátulas (o una rueda clásica) que se para en tu próxima partida.
- **Cartas**: reparte 3, 5 o 7 cartas boca abajo, dales la vuelta y cambia las que no te convenzan.
- **Duelo**: elige entre parejas de juegos, con su ficha completa, hasta que quede un campeón.
- **Explorar**: estantería infinita con búsqueda y orden.
- **Mi lista**: juegos guardados, historial y descartados (se guardan en el navegador).

También tiene ambientes de un clic ("Quiero sufrir", "Sofá con amigos", "Nostalgia 16 bits"…), etiquetas de Steam, juego del día y fichas con capturas, tráileres y enlaces a Steam, HowLongToBeat, PCGamingWiki, Google y YouTube.

## Cómo arrancarla

### Opción A · Completa, con Docker (recomendada)

Carátulas, capturas, descripción en español y tráileres.

```bash
docker compose up -d
```

Abre <http://localhost:8080>. Para pararla: `docker compose down`.

Se levantan dos contenedores:

| Servicio | Imagen | Para qué |
|---|---|---|
| `r2s` | [`phalcode/rawg-to-steam-redirect`](https://github.com/Phalcode/rawg-to-steam-redirect) | Capturas, fondo y descripción de Steam con la API de RAWG |
| `web` | `nginx:1.27-alpine` | Sirve `public/` y hace de puente con Steam (`/api`, `/steam-store`, `/steam-api`) |

Steam no permite que una página web le pida datos directamente desde el navegador; por eso todo pasa por nginx en la misma dirección que la página.

### Opción B · Rápida, sin servidor

Abre `public/index.html` con doble clic. Funciona todo menos las capturas y tráileres de PC (sí hay carátulas, fondos y logos de PC, y caja, pantalla de título y captura de consola).

En **Ajustes** (icono del engranaje) puedes cambiar la dirección del servidor rawg-to-steam y probar la conexión.

## Estructura

```
public/                 Web estática (lo único que se publica)
  index.html
  css/styles.css
  js/app.js
  data/                 Catálogo generado por tools/build_data.py
    pc.js               83.321 juegos de PC
    retro.js            34.070 juegos de 29 consolas
    desc/*.js           Descripciones, se cargan bajo demanda
tests/                  Pruebas automáticas (navegador, datos y scripts)
tools/                  Scripts para regenerar los datos (Python 3.9+)
  fetch_sources.py      Descarga las fuentes en sources/
  build_data.py         Genera public/data a partir de sources/
  systems.py            Consolas incluidas y emulador recomendado
  datparse.py           Lector de ficheros .dat de libretro
docker-compose.yml
nginx.conf
```

Los datos van en ficheros `.js` (no `.json`) para que la web funcione también abriendo `index.html` directamente, sin servidor.

## Pruebas

Hay tres grupos de pruebas. Las de la web abren Chromium de verdad y recorren todos los modos (ruleta, cartas, duelo, Explorar, Mi lista, ficha, ajustes y móvil). No necesitan internet porque simulan Steam, GitHub y las fuentes.

```bash
npm install                        # instala Playwright (solo la primera vez)
npx playwright install chromium    # descarga el navegador (solo la primera vez)
npm test                           # web + coherencia de los datos (~1 minuto)
npm run test:tools                 # scripts de Python de tools/
```

Conviene pasarlas después de cada cambio y siempre después de regenerar el catálogo.

## Regenerar el catálogo

Necesitas Python 3.9 o superior y git.

```bash
pip install -r tools/requirements.txt
python tools/fetch_sources.py     # descarga ~60 MB en sources/ (ignorada por git)
python tools/build_data.py        # reescribe public/data
```

Para añadir o quitar consolas, edita `tools/systems.py` y vuelve a ejecutar los dos scripts.

## Fuentes de datos

- **PC**: volcado público [leinstay/steamdb](https://github.com/leinstay/steamdb) (Steam, GOG, HowLongToBeat, Metacritic…). Se incluyen los juegos con al menos 10 reseñas en Steam y los exclusivos de GOG. Precios en dólares de la fecha del volcado.
- **Consolas**: [libretro-database](https://github.com/libretro/libretro-database) (No-Intro, Redump y psxdatacenter).
- **Imágenes**: CDN de Steam y [libretro-thumbnails](https://github.com/libretro-thumbnails).
- **Capturas, descripciones y tráileres de PC**: Steam, a través de [rawg-to-steam-redirect](https://github.com/Phalcode/rawg-to-steam-redirect).

Para emular, usa copias de juegos que tengas.
