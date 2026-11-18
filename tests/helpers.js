// Utilidades compartidas por las pruebas de navegador.
// - Sirve public/ con un servidor estático propio (mismo comportamiento que nginx para los ficheros).
// - Simula todas las peticiones externas (Steam, GitHub, Google Fonts, cdnjs) para que las pruebas
//   funcionen sin internet y den siempre el mismo resultado.
"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PUBLIC = path.join(__dirname, "..", "public");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json" };
// PNG de 1x1 para cualquier imagen externa
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, "http://x");
      let file = path.normalize(path.join(PUBLIC, decodeURIComponent(url.pathname)));
      if (!file.startsWith(PUBLIC)) { res.writeHead(403).end(); return; }
      if (url.pathname.endsWith("/")) file = path.join(file, "index.html");
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404, { "content-type": "text/html" }).end("<h1>404</h1>"); return; }
        res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, base: `http://127.0.0.1:${server.address().port}/` }));
  });
}

let browser;
async function getBrowser() {
  // Playwright se carga solo aquí: las pruebas de datos no lo necesitan
  if (!browser) browser = await require("playwright").chromium.launch();
  return browser;
}
async function closeBrowser() { if (browser) await browser.close(); browser = null; }

/**
 * Abre la web en un contexto limpio (localStorage vacío salvo lo que se pase en `storage`).
 * Devuelve { page, errors } — `errors` acumula errores de JavaScript de la página.
 */
async function openApp(base, { hash = "", storage = null, viewport = { width: 1400, height: 900 }, mobile = false, mocks = {} } = {}) {
  const b = await getBrowser();
  // reducedMotion acelera los giros (la web lo respeta) para que las pruebas vayan rápidas
  const ctx = await b.newContext({ ...(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport }), reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });

  if (storage) {
    await page.addInitScript((s) => { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); }, storage);
  }
  // Peticiones externas simuladas
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (r) => r.fulfill({ status: 200, contentType: "text/css", body: "" }));
  await page.route(/^https:\/\/cdnjs\.cloudflare\.com\//, (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  await page.route(/^https:\/\/(shared\.akamai\.steamstatic\.com|raw\.githubusercontent\.com|cdn\.akamai\.steamstatic\.com)\//, (r) => r.fulfill({ status: 200, contentType: "image/png", body: PNG }));
  await page.route(/^https:\/\/(api\.steampowered\.com|rawg2steam\.phalco\.de)\//, (r) => r.abort());
  // APIs locales (las que en Docker sirve nginx): por defecto no existen, salvo que la prueba las simule
  await page.route("**/api/**", (r) => (mocks.api ? mocks.api(r) : r.fulfill({ status: 404, contentType: "text/html", body: "<h1>404</h1>" })));
  await page.route("**/steam-store/**", (r) => (mocks.store ? mocks.store(r) : r.fulfill({ status: 404, contentType: "text/html", body: "<h1>404</h1>" })));
  await page.route("**/steam-api/**", (r) => (mocks.steamApi ? mocks.steamApi(r) : r.fulfill({ status: 404, contentType: "text/html", body: "<h1>404</h1>" })));

  await page.goto(base + "index.html" + hash);
  await page.waitForSelector("#boot", { state: "detached", timeout: 60000 });
  return { page, ctx, errors };
}

/** Espera a que se apliquen los filtros (change() usa un pequeño retardo). */
const settle = (page, ms = 250) => page.waitForTimeout(ms);

async function view(page, name) { await page.click(`.modes [data-view="${name}"]`); await settle(page); }

/** Lee los datos generados igual que la web (para comprobar resultados de forma independiente). */
function loadData(name) {
  const t = fs.readFileSync(path.join(PUBLIC, "data", name + ".js"), "utf8");
  return JSON.parse(t.slice(t.indexOf(",") + 1, t.lastIndexOf(")")));
}

module.exports = { startServer, openApp, closeBrowser, settle, view, loadData, PUBLIC };
