// Pruebas de la web en un navegador real (Chromium con Playwright).
// Ejecutar:  npm test        (la primera vez: npm install && npx playwright install chromium)
"use strict";
const { describe, test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { startServer, openApp, closeBrowser, settle, view, loadData, PUBLIC } = require("./helpers");

const PC = loadData("pc");
const RETRO = loadData("retro");
const num = (s) => Number(String(s).replace(/\D/g, "")) || 0;
const pcIndex = (name) => PC.games.findIndex((g) => g[0] === name);
const ROR = pcIndex("Risk of Rain Returns");
const ROR_APP = PC.games[ROR][1];
const VB = RETRO.systems.findIndex((s) => s.key === "vb");
const VB_IDS = RETRO.games.map((g, i) => [g, i]).filter(([g]) => g[1] === VB).map(([, i]) => "r" + i);

let srv, BASE;
before(async () => { srv = await startServer(); BASE = srv.base; });
after(async () => { await closeBrowser(); srv.server.close(); });

const poolN = (page, v = "ruleta") => page.textContent(`#view-${v} .poolN`).then(num);
async function noErrors(errors) { assert.deepEqual(errors, [], "errores de JavaScript en la página"); }

describe("Arranque", () => {
  test("carga servida por HTTP sin errores", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    assert.ok((await poolN(page)) > 100000, "el catálogo debería tener más de 100.000 juegos con los filtros por defecto");
    await noErrors(errors); await ctx.close();
  });

  test("carga abriendo index.html con doble clic (file://)", async () => {
    const { page, errors, ctx } = await openApp("file://" + PUBLIC + "/");
    assert.ok((await poolN(page)) > 100000);
    await noErrors(errors); await ctx.close();
  });

  test("datos guardados corruptos no rompen la página", async () => {
    const { page, errors, ctx } = await openApp(BASE, { storage: {
      "pp2:filters": "{basura", "pp2:list": "[1,2", "pp2:history": '"x"', "pp2:discarded": "{}", "pp2:cfg": "null" } });
    assert.ok((await poolN(page)) > 100000);
    await noErrors(errors); await ctx.close();
  });

  test("filtros guardados con valores que ya no existen se ignoran en vez de vaciar resultados", async () => {
    const { page, errors, ctx } = await openApp(BASE, { storage: {
      "pp2:filters": { origin: "retro", systems: ["xbox"], genres: ["inventado"], tags: ["NoExiste"], from: "abc" } } });
    assert.ok((await poolN(page)) > 30000, "deberían verse todos los juegos de consola");
    await noErrors(errors); await ctx.close();
  });
});

describe("Filtros: siempre visibles y coherentes", () => {
  test("cada ambiente da resultados y al volver a pulsarlo se quita", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    for (const btn of await page.$$("#moods [data-mood]")) {
      const name = (await btn.textContent()).trim();
      await btn.click(); await settle(page);
      assert.equal(await btn.getAttribute("aria-pressed"), "true", name);
      assert.ok((await poolN(page)) > 0, `el ambiente «${name}» no da ningún juego`);
      await btn.click(); await settle(page);
      assert.equal(await page.isHidden("#fCount2"), true, `al quitar «${name}» deberían quedar los filtros a cero`);
    }
    await noErrors(errors); await ctx.close();
  });

  test("cambiar un filtro a mano después de un ambiente lo desmarca y conserva los filtros", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    await page.click('[data-mood="fear"]'); await settle(page);
    await page.selectOption("#f-control", "pad"); await settle(page);
    assert.equal(await page.getAttribute('[data-mood="fear"]', "aria-pressed"), "false", "el ambiente ya no describe los filtros activos");
    assert.equal(await page.getAttribute('[data-g="terror"]', "data-state"), "1", "el género del ambiente sigue aplicado");
    await noErrors(errors); await ctx.close();
  });

  test("años «desde» mayor que «hasta» se corrige en vez de dejar la lista vacía", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    await page.selectOption("#f-from", "2015"); await settle(page);
    await page.selectOption("#f-to", "2000"); await settle(page);
    assert.ok((await poolN(page)) > 0);
    assert.equal(await page.inputValue("#f-from"), "2000");
    assert.equal(await page.inputValue("#f-to"), "2015");
    await noErrors(errors); await ctx.close();
  });

  test("el contador de filtros refleja cada filtro y «Restablecer» lo deja a cero", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    await page.click('#f-origin [data-v="pc"]'); await page.click('[data-g="rpg"]'); await page.click("#f-tags [data-tag]"); await settle(page);
    assert.equal(await page.textContent("#fCount2"), "3");
    await page.click("#reset"); await settle(page);
    assert.equal(await page.isHidden("#fCount2"), true);
    await noErrors(errors); await ctx.close();
  });
});

describe("No repetir", () => {
  test("un juego que ya salió no vuelve a salir en la misma sesión", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    const before = await poolN(page);
    await page.click("#spinBtn");
    await page.waitForSelector("#detail[open]", { timeout: 15000 });
    await page.keyboard.press("Escape"); await settle(page);
    assert.equal(await poolN(page), before - 1, "el juego que salió debería salir del sorteo");
    await noErrors(errors); await ctx.close();
  });

  test("si ya salieron todos los juegos que encajan, se avisa y se ofrece permitir repetidos", async () => {
    const { page, errors, ctx } = await openApp(BASE, { storage: { "pp2:filters": { origin: "retro", systems: ["vb"] }, "pp2:history": VB_IDS } });
    assert.equal(await poolN(page), 0);
    const reel = await page.textContent("#reelArea");
    assert.match(reel, /ya te han salido/i);
    await page.click("#reelArea [data-a='repeat']"); await settle(page);
    assert.equal(await poolN(page), VB_IDS.length);
    await noErrors(errors); await ctx.close();
  });
});

describe("Ruleta", () => {
  test("el carrete abre la ficha del ganador y lo apunta en «Últimas tiradas»", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    await page.click("#spinBtn");
    await page.waitForSelector("#detail[open]", { timeout: 15000 });
    assert.match(await page.textContent(".dhead .minilabel"), /Te toca jugar/);
    await page.keyboard.press("Escape");
    assert.ok((await page.$$("#lastThumbs button")).length >= 1);
    await noErrors(errors); await ctx.close();
  });

  test("la rueda también explica por qué no hay juegos y ofrece una salida", async () => {
    const { page, errors, ctx } = await openApp(BASE, { storage: { "pp2:filters": { origin: "retro", systems: ["vb"] }, "pp2:history": VB_IDS, "pp2:cfg": { rstyle: "wheel" } } });
    assert.ok(await page.isVisible("#wheelEmpty"));
    assert.match(await page.textContent("#wheelEmpty"), /ya te han salido/i);
    await page.click("#wheelEmpty [data-a='repeat']"); await settle(page);
    assert.ok(await page.isHidden("#wheelEmpty"));
    await noErrors(errors); await ctx.close();
  });

  test("«Juego del día» y «Sorpresa sin filtros» abren una ficha aunque los filtros no dejen ningún juego", async () => {
    const { page, errors, ctx } = await openApp(BASE, { storage: { "pp2:filters": { origin: "retro", systems: ["vb"] }, "pp2:history": VB_IDS } });
    await page.click("#dailyBtn"); await page.waitForSelector("#detail[open]");
    assert.match(await page.textContent(".dhead .minilabel"), /Juego del día/);
    await page.keyboard.press("Escape");
    await page.click("#surpriseBtn"); await page.waitForSelector("#detail[open]");
    assert.match(await page.textContent(".dhead .minilabel"), /Sorpresa/);
    await noErrors(errors); await ctx.close();
  });

  test("la rueda clásica también gira y abre la ficha", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    await page.click('#rStyle [data-v="wheel"]'); await page.click("#spinBtn");
    await page.waitForSelector("#detail[open]", { timeout: 15000 });
    await noErrors(errors); await ctx.close();
  });
});

describe("Cartas", () => {
  test("cambiar una carta no vuelve a tapar las que ya estaban destapadas", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    await view(page, "cartas"); await page.click("#dealBtn"); await page.waitForTimeout(1200);
    await page.click("#deal .card:nth-child(1) .back"); await page.click("#deal .card:nth-child(2) .back"); await page.waitForTimeout(800);
    await page.click('#deal .card:nth-child(1) [data-a="re"]'); await page.waitForTimeout(800);
    assert.ok(await page.$eval("#deal .card:nth-child(1)", (c) => c.classList.contains("flipped")), "la carta cambiada se ve");
    assert.ok(await page.$eval("#deal .card:nth-child(2)", (c) => c.classList.contains("flipped")), "la otra carta destapada sigue destapada");
    assert.equal(await page.textContent("#rerolls"), "Cambios: 2");
    await noErrors(errors); await ctx.close();
  });
});

describe("Duelo", () => {
  test("un duelo de 8 llega a un campeón usando el teclado", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    await view(page, "duelo"); await page.click("#duelStart"); await settle(page);
    for (let i = 0; i < 7; i++) { await page.keyboard.press(i % 2 ? "ArrowLeft" : "ArrowRight"); await page.waitForTimeout(120); }
    assert.ok(await page.isVisible(".champ"));
    await noErrors(errors); await ctx.close();
  });

  test("con menos juegos que participantes (número impar) las rondas siguen teniendo sentido", async () => {
    const keep = VB_IDS.slice(0, 5), seen = VB_IDS.slice(5);
    const { page, errors, ctx } = await openApp(BASE, { storage: { "pp2:filters": { origin: "retro", systems: ["vb"] }, "pp2:history": seen } });
    await view(page, "duelo"); await page.click("#duelStart"); await settle(page);
    let picks = 0;
    while (!(await page.isVisible(".champ")) && picks < 10) {
      const round = await page.textContent("#duelArea .round");
      assert.doesNotMatch(round, /\d[.,]\d/, `ronda con números raros: «${round}»`);
      await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(120); picks++;
    }
    assert.ok(await page.isVisible(".champ")); assert.equal(picks, keep.length - 1);
    await noErrors(errors); await ctx.close();
  });
});

describe("Explorar", () => {
  test("si los filtros esconden lo que buscas, se avisa y se puede mostrar", async () => {
    const { page, errors, ctx } = await openApp(BASE, { storage: { "pp2:filters": { origin: "retro" } } });
    await view(page, "explorar"); await page.fill("#xSearch", "Risk of Rain Returns"); await page.waitForTimeout(500);
    assert.match(await page.textContent("#xNotice"), /1 juego más/);
    await page.click("#xNotice [data-x]"); await settle(page);
    assert.ok((await page.$$eval("#xGrid .tile .nm", (a) => a.map((x) => x.textContent))).includes("Risk of Rain Returns"));
    await noErrors(errors); await ctx.close();
  });

  test("Explorar también muestra los juegos que ya salieron", async () => {
    const { page, errors, ctx } = await openApp(BASE, { storage: { "pp2:history": ["p" + ROR] } });
    await view(page, "explorar"); await page.fill("#xSearch", "Risk of Rain Returns"); await page.waitForTimeout(500);
    assert.ok((await page.$$eval("#xGrid .tile .nm", (a) => a.map((x) => x.textContent))).includes("Risk of Rain Returns"));
    assert.ok(await page.isHidden("#xNotice"));
    await noErrors(errors); await ctx.close();
  });

  test("«No me interesa» quita la carátula de Explorar y se puede recuperar en Mi lista", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    await view(page, "explorar"); await page.fill("#xSearch", "Risk of Rain Returns"); await page.waitForTimeout(500);
    await page.click("#xGrid .tile"); await page.waitForSelector("#detail[open]");
    await page.click("#aNo"); await settle(page);
    const names = await page.$$eval("#xGrid .tile .nm", (a) => a.map((x) => x.textContent));
    assert.ok(!names.includes("Risk of Rain Returns"), "la carátula descartada sigue en Explorar");
    assert.match(await page.textContent("#xNotice"), /descartaste/i);
    await view(page, "lista"); await page.click('#lTabs [data-v="disc"]');
    assert.ok((await page.textContent("#lGrid")).includes("Risk of Rain Returns"));
    await page.click("#lGrid .listacts button"); await settle(page);
    assert.ok(!(await page.textContent("#lGrid")).includes("Risk of Rain Returns"));
    await noErrors(errors); await ctx.close();
  });
});

describe("Parecidos", () => {
  test("muestra la barra, ordena por parecido y «Quitar» vuelve al catálogo", async () => {
    const { page, errors, ctx } = await openApp(BASE, { hash: "#p-" + ROR });
    await page.click("#aSim"); await settle(page, 600);
    assert.ok(await page.isVisible("#simbar"));
    assert.equal(await page.inputValue("#xSort"), "sim");
    const first = await page.$$eval("#xGrid .tile .nm", (a) => a.slice(0, 2).map((x) => x.textContent));
    assert.deepEqual(first.sort(), ["Risk of Rain (2013)", "Risk of Rain 2"]);
    await page.click('#simbar [data-a="quitar"]'); await settle(page);
    assert.ok(await page.isHidden("#simbar"));
    assert.notEqual(await page.inputValue("#xSort"), "sim");
    await noErrors(errors); await ctx.close();
  });

  test("pulsar una etiqueta en la ficha filtra por ella, quita «Parecidos» y se puede deshacer", async () => {
    const { page, errors, ctx } = await openApp(BASE, { hash: "#p-" + ROR });
    await page.click("#aSim"); await settle(page, 600);
    await page.click('#simbar [data-a="ficha"]'); await page.waitForSelector("#detail[open]");
    await page.click(".tagl [data-tag]"); await settle(page, 500);
    assert.equal(await page.getAttribute('.modes [data-view="explorar"]', "aria-selected"), "true");
    assert.ok(await page.isHidden("#simbar"), "«Parecidos» sigue activo a escondidas junto al filtro de etiqueta");
    assert.equal((await page.$$('#f-tags [aria-pressed="true"]')).length, 1);
    assert.ok(await page.isVisible("#toastBtn"));
    await page.click("#toastBtn"); await settle(page, 500);
    assert.equal((await page.$$('#f-tags [aria-pressed="true"]')).length, 0);
    assert.ok(await page.isVisible("#simbar"), "deshacer devuelve también «Parecidos»");
    await noErrors(errors); await ctx.close();
  });
});

describe("Mi lista", () => {
  test("quitar un juego guardado se puede deshacer", async () => {
    const { page, errors, ctx } = await openApp(BASE, { hash: "#p-" + ROR });
    await page.click("#aFav"); await page.keyboard.press("Escape");
    await view(page, "lista");
    assert.equal((await page.$$("#lGrid .tile")).length, 1);
    await page.click('#lGrid .listacts button'); await settle(page);
    assert.equal((await page.$$("#lGrid .tile")).length, 0);
    await page.click("#toastBtn"); await settle(page);
    assert.equal((await page.$$("#lGrid .tile")).length, 1);
    await noErrors(errors); await ctx.close();
  });

  test("vaciar el historial se puede deshacer", async () => {
    const { page, errors, ctx } = await openApp(BASE, { storage: { "pp2:history": ["p1", "p2", "p3"] } });
    await view(page, "lista"); await page.click('#lTabs [data-v="hist"]');
    assert.equal((await page.$$("#lGrid .tile")).length, 3);
    await page.click("#lGrid .link"); await settle(page);
    assert.equal((await page.$$("#lGrid .tile")).length, 0);
    await page.click("#toastBtn"); await settle(page);
    assert.equal((await page.$$("#lGrid .tile")).length, 3);
    await noErrors(errors); await ctx.close();
  });

  test("«No me interesa» en un juego guardado lo saca de Guardados", async () => {
    const { page, errors, ctx } = await openApp(BASE, { hash: "#p-" + ROR, storage: { "pp2:list": [{ id: "p" + ROR, played: false }] } });
    await page.click("#aNo"); await settle(page);
    await view(page, "lista");
    assert.equal((await page.$$("#lGrid .tile")).length, 0);
    await noErrors(errors); await ctx.close();
  });

  test("la lista se guarda con identificadores estables y sobrevive a recargar", async () => {
    const { page, errors, ctx } = await openApp(BASE, { storage: { "pp2:list": [{ id: "p" + ROR, played: true }] } });
    await view(page, "lista");
    assert.equal(await page.textContent("#lGrid .tile .nm"), "Risk of Rain Returns");
    assert.ok(await page.isChecked("#lGrid .listacts input"));
    const saved = await page.evaluate(() => localStorage.getItem("pp2:list"));
    assert.match(saved, new RegExp(`steam:${ROR_APP}`), "la lista debería guardarse con el número de Steam, no con la posición en los datos");
    await page.reload(); await page.waitForSelector("#boot", { state: "detached", timeout: 60000 });
    await view(page, "lista");
    assert.equal(await page.textContent("#lGrid .tile .nm"), "Risk of Rain Returns");
    await noErrors(errors); await ctx.close();
  });
});

describe("Ficha y enlaces", () => {
  test("enlace directo con el número de Steam y con el formato antiguo", async () => {
    let { page, errors, ctx } = await openApp(BASE, { hash: "#steam-" + ROR_APP });
    assert.equal(await page.textContent("#dtitle"), "Risk of Rain Returns");
    await noErrors(errors); await ctx.close();
    ({ page, errors, ctx } = await openApp(BASE, { hash: "#p-" + ROR }));
    assert.equal(await page.textContent("#dtitle"), "Risk of Rain Returns");
    await noErrors(errors); await ctx.close();
  });

  test("las fichas enlazan a Google (no a Wikipedia) y los textos no mencionan ficheros que ya no existen", async () => {
    const { page, errors, ctx } = await openApp("file://" + PUBLIC + "/", { hash: "#p-" + ROR });
    const links = await page.$$eval(".links a", (a) => a.map((x) => x.href));
    assert.ok(links.some((h) => h.startsWith("https://www.google.com/search")));
    assert.ok(!links.some((h) => /wikipedia/.test(h)));
    await page.waitForFunction(() => !/Buscando/.test(document.querySelector("#msrc").textContent), null, { timeout: 20000 });
    const html = await page.content();
    assert.doesNotMatch(html, /LEEME/);
    await noErrors(errors); await ctx.close();
  });

  test("con el servidor de Docker (simulado) la ficha muestra tráiler y capturas", async () => {
    const json = (r, o) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(o) });
    const mocks = {
      api: (r) => (r.request().url().includes("/screenshots")
        ? json(r, { count: 2, results: [{ image: "https://shared.akamai.steamstatic.com/a/ss_1.1920x1080.jpg" }, { image: "https://shared.akamai.steamstatic.com/a/ss_2.1920x1080.jpg" }] })
        : json(r, { background_image: "https://shared.akamai.steamstatic.com/a/bg.jpg", description_raw: "desc" })),
      store: (r) => json(r, { [ROR_APP]: { success: true, data: { short_description: "Descripción en español", movies: [{ name: "Tráiler", thumbnail: "https://shared.akamai.steamstatic.com/t.jpg", mp4: { max: "https://shared.akamai.steamstatic.com/m.mp4" } }], screenshots: [] } } }),
    };
    const { page, errors, ctx } = await openApp(BASE, { hash: "#p-" + ROR, mocks });
    await page.waitForFunction(() => /rawg-to-steam/.test(document.querySelector("#msrc").textContent), null, { timeout: 20000 });
    assert.ok((await page.$$('#mthumbs [aria-label="Tráiler"]')).length >= 1);
    assert.equal(await page.textContent("#ddesc"), "Descripción en español");
    await noErrors(errors); await ctx.close();
  });

  test("Ajustes: probar conexión informa y guardar avisa", async () => {
    const { page, errors, ctx } = await openApp(BASE);
    await page.click("#settingsBtn"); await page.click("#r2sTest");
    await page.waitForFunction(() => !/Probando/.test(document.querySelector("#r2sStatus").textContent), null, { timeout: 30000 });
    assert.match(await page.textContent("#r2sStatus"), /Sin respuesta/);
    await page.click('#sform [value="ok"]'); await settle(page);
    assert.match(await page.textContent("#toastTxt"), /Ajustes guardados/);
    await noErrors(errors); await ctx.close();
  });
});

describe("Móvil", () => {
  test("ningún modo se sale de la pantalla y el panel de filtros se cierra con un botón", async () => {
    const { page, errors, ctx } = await openApp(BASE, { mobile: true });
    for (const v of ["ruleta", "cartas", "duelo", "explorar", "lista"]) {
      await view(page, v);
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(w <= 390, `«${v}» desborda en horizontal (${w}px)`);
    }
    await page.click("#filtersBtn"); await settle(page);
    assert.ok(await page.$eval("#filters", (f) => f.classList.contains("open")));
    await page.click("#filtersClose"); await settle(page);
    assert.ok(!(await page.$eval("#filters", (f) => f.classList.contains("open"))));
    await noErrors(errors); await ctx.close();
  });
});
