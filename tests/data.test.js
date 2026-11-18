// Comprueba que los datos generados (public/data) son coherentes. No necesita navegador.
"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadData, PUBLIC } = require("./helpers");

const PC = loadData("pc");
const RETRO = loadData("retro");

test("pc.js: cada juego tiene todos sus campos y sus índices son válidos", () => {
  assert.equal(PC.fields.length, 14);
  for (const g of PC.games) {
    assert.equal(g.length, PC.fields.length, g[0]);
    assert.ok(typeof g[0] === "string" && g[0].length > 0);
    assert.ok(g[3] < 2 ** PC.genres.length, `géneros fuera de rango: ${g[0]}`);
    for (const t of g[4]) assert.ok(t >= 0 && t < PC.tags.length, `etiqueta inexistente: ${g[0]}`);
    assert.ok(g[10] >= -1 && g[10] < PC.devs.length, `estudio inexistente: ${g[0]}`);
    assert.ok(g[6] >= -1 && g[6] <= 100);
  }
});

test("retro.js: sistemas, contadores y carátulas coherentes", () => {
  const counts = new Array(RETRO.systems.length).fill(0);
  for (const g of RETRO.games) {
    assert.equal(g.length, RETRO.fields.length, g[0]);
    assert.ok(g[1] >= 0 && g[1] < RETRO.systems.length, `sistema inexistente: ${g[0]}`);
    counts[g[1]]++;
    assert.ok(g[4] >= -1 && g[4] < RETRO.devs.length);
    assert.equal(Boolean(g[8]), g[9] > 0, `carátula y máscara no coinciden: ${g[0]}`);
  }
  RETRO.systems.forEach((s, i) => assert.equal(s.count, counts[i], `contador de ${s.short}`));
});

test("cada juego tiene un identificador estable y único (para Mi lista e historial)", () => {
  const keys = new Set();
  for (const g of PC.games) keys.add(g[1] ? `steam:${g[1]}` : `gog:${g[0].toLowerCase()}`);
  for (const g of RETRO.games) keys.add(`r:${RETRO.systems[g[1]].key}:${g[0].toLowerCase()}`);
  assert.equal(keys.size, PC.games.length + RETRO.games.length);
});

test("descripciones: 40 ficheros por fuente y cada clave apunta a un juego", () => {
  for (const [prefix, total] of [["p", PC.games.length], ["r", RETRO.games.length]]) {
    for (let k = 0; k < 40; k++) {
      const name = `${prefix}${String(k).padStart(2, "0")}`;
      const file = path.join(PUBLIC, "data", "desc", name + ".js");
      assert.ok(fs.existsSync(file), file);
      const d = loadData(path.join("desc", name));
      for (const key of Object.keys(d)) { const i = Number(key); assert.ok(i < total && i % 40 === k, `${name}: ${key}`); }
    }
  }
});

test("index.html enlaza los ficheros que existen", () => {
  const html = fs.readFileSync(path.join(PUBLIC, "index.html"), "utf8");
  for (const ref of [...html.matchAll(/(?:src|href)="((?:css|js|data)\/[^"]+)"/g)].map((m) => m[1])) {
    assert.ok(fs.existsSync(path.join(PUBLIC, ref)), `falta ${ref}`);
  }
});
