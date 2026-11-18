# Próxima Partida — contexto del proyecto

Web personal de Dani para **elegir y descubrir juegos**: de PC (Steam/GOG) y de consolas emulables en PC.
Sortea juegos con filtros (género, controles, jugadores, duración, época, idioma…) y enseña carátulas,
capturas y tráileres. El catálogo sale de fuentes públicas, **nunca se añaden juegos a mano**.

Estado (19 nov 2026): funciona en local con Docker. Repositorio git con un commit (`first commit`);
la revisión completa y las pruebas automáticas están hechas pero **pendientes de commit**.

## Cómo se usa

- **Completa (Docker):** `docker compose up -d` → <http://localhost:8080>. Si cambia `docker-compose.yml`
  o `nginx.conf`: `docker compose down && docker compose up -d` (los montajes no se recargan solos).
  Los cambios en `public/` se ven recargando con Ctrl+F5.
- **Rápida:** abrir `public/index.html` con doble clic (`file://`). Todo funciona salvo capturas y tráileres de PC.
- **Pruebas:** `npm test` (web + datos), `npm run test:tools` (Python). Primera vez: `npm install` y
  `npx playwright install chromium`.

## Tecnología

- HTML + CSS + JavaScript sin framework ni bundler. Todo el JS está en `public/js/app.js`
  (una IIFE de ~900 líneas, `"use strict"`). Interfaz en español.
- Fuentes de Google Fonts: Rubik Mono One (títulos), Figtree (texto), JetBrains Mono (datos).
  Tema oscuro único a propósito (estética de sala recreativa nocturna).
- Docker: `nginx:1.27-alpine` + `phalcode/rawg-to-steam-redirect:latest`.
- Scripts de datos en Python 3.9+ (`ijson`). Pruebas: `node:test` + Playwright (Chromium) y `unittest`.

## Estructura

```
public/                  Lo único que se publica (nginx monta solo esta carpeta)
  index.html             Marcado de todas las vistas y diálogos
  css/styles.css         Estilos (tokens en :root)
  js/app.js              Toda la lógica
  data/pc.js             83.321 juegos de PC        ┐ generados por tools/build_data.py
  data/retro.js          34.070 juegos, 29 consolas │ (no editar a mano)
  data/desc/{p,r}NN.js   Descripciones en 40+40 trozos, se cargan bajo demanda ┘
tools/                   fetch_sources.py (descarga a sources/), build_data.py, systems.py, datparse.py
tests/                   helpers.js, e2e.test.js (31), data.test.js (5), test_tools.py (9)
docker-compose.yml, nginx.conf, package.json, README.md
sources/                 Fuentes descargadas (ignorada por git, ~60 MB)
```

## Datos

**Fuentes:** volcado [leinstay/steamdb](https://github.com/leinstay/steamdb) del 8 nov 2026 (PC: juegos con ≥10
reseñas en Steam + exclusivos de GOG), [libretro-database](https://github.com/libretro/libretro-database)
(consolas) y listados de [libretro-thumbnails](https://github.com/libretro-thumbnails) (qué carátulas existen).

**Formato:** cada fichero es `ppData("nombre", {...});` en vez de JSON, para que funcione con `file://`
(se inyecta como `<script>`); servido por HTTP se descarga con `fetch` y se parsea igual. Generación determinista
(misma entrada → mismos bytes).

- `pc.js` → `games[i] = [name, appid, year, genres(bitmask), tags[], flags(bitmask), revPct(-1), revCount,
  hours×10, priceCents(-1), dev(idx|-1), metacritic, hltbId, img]`
  - `img`: `""` ruta clásica de Steam · `"h:<hash>"` ruta nueva con hash · URL completa (GOG…)
  - `flags`: fullpad 0, partpad 1, padrec 2, mouseonly 3, kbonly 4, single 5, cooponl 6, cooploc 7, pvponl 8,
    pvploc 9, mmo 10, vronly 11, vrsup 12, free 13, early 14, linux 15, mac 16, touch 17, indie 18, mousefr 19,
    adult 20, gog 21, remoteplay 22, multi 23, es 24 (textos), esvoz 25 (voces)
- `retro.js` → `games[i] = [name, sys, year, genres, dev, users, regions("US,EU…"), adult, thumb, thumbMask]`
  - `thumbMask`: 1 caja, 2 captura, 4 pantalla de título. `systems[]` trae key, label, short, emu, group, count, repo.
- `desc/pNN.js`: `{i: "texto"}` o `{i: ["texto", urlGOG]}` · `desc/rNN.js`: `{i: [texto, editora, saga]}` (trozo = `i % 40`).
- 29 géneros propios (`accion`, `rpg`, `roguelike`…) mapeados desde géneros y etiquetas de Steam/libretro.
- GameCube, Wii, Saturn, Dreamcast y Mega-CD solo tienen título y región (sin género ni año).

## Cómo funciona `app.js`

- **Juegos en memoria:** `ALL` (objetos con `s:0` PC / `s:1` consola). `id` (`p123`, `r45`) es solo para la sesión.
- **Identificadores estables:** lo que se guarda usa `keyOf(g)` → `steam:<appid>`, `gog:<nombre>`,
  `r:<consola>:<nombre>`, para sobrevivir a regenerar los datos. `loadSaved()` migra el formato antiguo (posiciones).
- **localStorage:** `pp2:filters`, `pp2:list` (`[{k, played}]`), `pp2:history`, `pp2:discarded`, `pp2:cfg`.
  Todo se valida al arrancar (`sanitizeFilters`, `loadSaved`): datos corruptos o valores que ya no existen se ignoran.
- **Filtros:** objeto `F`. `DEFAULTS` está **congelado** y se copia con `freshFilters()` (antes compartían
  arrays y «Restablecer» no limpiaba). Los arrays de `F` se sustituyen, nunca se mutan (`tog`).
  `change()` guarda, sincroniza la interfaz y recalcula con un pequeño retardo.
- **Dos listas:** `BROWSE` = juegos que pasan los filtros (lo usa Explorar). `POOL` = `BROWSE` menos el historial
  si «No repetir» está activo (lo usan Ruleta, Cartas y Duelo). El sorteo es ponderado (`weight`): popularidad
  según el modo de descubrimiento y reparto PC/emulado según `F.mix`.
- Etiquetas, duración y voces solo existen en PC: al usarlos se excluyen las consolas (se explica en el panel).
- **Ambientes** (`MOODS`): sustituyen los filtros. Tocar un filtro a mano desmarca el ambiente.
- **Parecidos** (`simScore`): misma saga por el título (`sameSeries`) + etiquetas compartidas ponderadas por rareza
  (IDF) + géneros en común + mismo estudio. Entre PC y consola solo cuenta la misma saga. Se quedan los 300 más
  parecidos (`SIM`) y se muestran en Explorar ordenados; la barra `#simbar` lo deja siempre visible.
- **Vistas:** Ruleta (carrete de carátulas o rueda), Cartas (3/5/7, 3 cambios), Duelo (4/8/16, flechas del teclado,
  ficha de cada rival), Explorar (búsqueda, orden, scroll infinito), Mi lista (guardados, historial, descartados).
- **Ficha** (`openDetail`, `<dialog id="detail">`): fondo, carátula, logo, datos, descripción, imágenes/vídeo,
  enlaces (YouTube, Google, Steam/GOG, HowLongToBeat, PCGamingWiki). Enlace directo: `#steam-<appid>`
  (y el antiguo `#p-N` / `#r-N`).

## Imágenes y vídeo

- **Carátulas PC:** `library_600x900.jpg` del CDN de Steam → si no existe, `header.jpg` en modo «ancho» →
  portada dibujada en canvas. Con Docker, para juegos nuevos (ruta con hash) se pide la ruta exacta en lote a
  `/steam-api/IStoreBrowseService/GetItems` (`exactCover`).
- **Consolas:** caja, pantalla de título y captura de `raw.githubusercontent.com/libretro-thumbnails/...`.
- Si el navegador bloquea imágenes externas (CSP), se detecta con `securitypolicyviolation` y se dibujan portadas.
  Las URLs que fallan se recuerdan (`FAILED`) para no repetirlas.
- **Capturas, descripción y tráileres de PC (solo con Docker):**
  - `/api/games/<appid>` y `/api/games/<appid>/screenshots` → rawg-to-steam-redirect (capturas, fondo, descripción en inglés).
  - `/steam-store/api/appdetails?appids=…&l=spanish` → tráileres (mp4/webm o HLS con hls.js) y descripción en español.
  - Sin Docker se intenta la API pública de Steam, que suele bloquear peticiones del navegador.

## Por qué está hecho así (decisiones)

- **Docker + nginx como puente:** Steam no envía cabeceras CORS y rawg-to-steam-redirect tampoco (Flask sin
  flask-cors), así que todo se pide a la misma dirección que la página y nginx lo reenvía. nginx resuelve nombres en
  cada petición (`resolver 127.0.0.11`) para arrancar aunque r2s o Steam no respondan, y bloquea ficheros ocultos.
- **RAWG ya no se usa** (Dani no puede usarla); se sustituyó por rawg-to-steam-redirect. Ese servidor quita los
  acentos de las descripciones y tiene algún fallo de reintentos: por eso la descripción en español sale de la tienda.
- **Datos como `.js`** para poder abrir la web sin servidor.
- **Wikipedia se cambió por búsquedas de Google** (más precisas): `"título" + plataforma + videojuego`.
- Existe una versión antigua publicada como artefacto de claude.ai: allí no cargan imágenes externas (CSP) y ya no
  está al día con el repositorio. La versión de referencia es la del repositorio.

## Reglas de la interfaz (aprendidas de fallos reales)

1. **Nada filtra a escondidas.** Todo lo que reduce resultados se ve (contador de filtros, barra de Parecidos,
   aviso de juegos que ya salieron).
2. **Ningún estado vacío sin explicación ni salida.** Si no hay juegos, se dice por qué (filtros, ya salieron todos,
   Parecidos) y se ofrece qué hacer (`emptyInfo` / `emptyAction`).
3. **Los cambios grandes se pueden deshacer** (ambientes, Restablecer, etiqueta desde la ficha, quitar de la lista,
   vaciar historial, descartar). El toast acepta una acción y su texto.
4. **Si la búsqueda está oculta por filtros o descartes, se avisa** y se ofrece «Mostrarlos».
5. **Explorar ignora «No repetir»**; solo afecta a los modos al azar.
6. El contenido adulto se oculta también en la búsqueda sin filtros.

## Pruebas

- `tests/e2e.test.js` abre Chromium con Playwright y simula todo lo externo (Steam, GitHub, fuentes, cdnjs, `/api`,
  `/steam-store`), así que no necesita internet y da siempre el mismo resultado. Usa `reducedMotion` para que los giros
  sean rápidos. Cada prueba empieza con el almacenamiento vacío salvo lo que indique `storage`.
- `tests/data.test.js` comprueba la coherencia de `public/data` (no necesita Playwright).
- `tests/test_tools.py` prueba los scripts con unas fuentes de juguete (las que usan `build_data` se saltan sin `ijson`).
- Forma de trabajar: **primero una prueba que reproduzca el fallo, luego el arreglo**, y pasar todas las pruebas
  después de cada cambio.

## Limitaciones conocidas

- Algunos juegos para adultos sin etiquetas en el volcado pueden colarse (se filtra también por palabras del título).
- Las descripciones de la base de datos están en inglés (la tienda de Steam da la española solo con Docker).
- Precios en dólares de la fecha del volcado. Los datos no se actualizan solos: hay que regenerarlos con `tools/`.
- No hay licencia elegida todavía; el repositorio incluye datos de terceros (citados en el README).

## Pendiente

- Hacer commit de la revisión completa y las pruebas.
- Decidir la licencia antes de hacer público el repositorio.
