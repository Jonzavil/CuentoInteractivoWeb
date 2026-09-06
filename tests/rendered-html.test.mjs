import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { placeSecretLetter, SECRET_LETTERS, secretLetterResult } from "../app/features/story/letter-order.ts";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the interactive story shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="es">/i);
  assert.match(html, /Lola y Mario: Guardianes del bosque/i);
  assert.doesNotMatch(html, /Escena 1 de 17/i);
  assert.match(html, /Una tarde especial/i);
  assert.match(html, /Sinopsis/i);
  assert.match(html, /Créditos/i);
  assert.match(html, /Galería/i);
  assert.doesNotMatch(html, /Abrir ajustes/i);
  assert.doesNotMatch(html, /Activar sonido|Silenciar/i);
  assert.match(html, /Reproducir escena/i);
  assert.match(html, /aria-label="Progreso del cuento"/i);
  assert.match(html, /aria-valuenow="1"/i);
  assert.doesNotMatch(html, /class="scene-play-button"[^>]*disabled/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("keeps the story content aligned with the delivered media", async () => {
  const [storyData, storyStyles, packageJson, animationFiles, posterFiles] = await Promise.all([
    readFile(new URL("../app/features/story/story.data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../public/assets/ANIMACIONES/", import.meta.url)),
    readdir(new URL("../public/assets/POSTERS/", import.meta.url)),
  ]);

  assert.equal(storyData.match(/videoSrc:/g)?.length, 27);
  assert.equal(storyData.match(/posterSrc:/g)?.length, 27);
  assert.equal(storyData.match(/copyBlocks:/g)?.length, 27);
  assert.doesNotMatch(storyData, /copyPosition:|copyTone:/);
  assert.match(storyData, /Lola y Mario entraron a la biblioteca\\nen busca de una nueva historia/);
  assert.match(storyData, /¿Dónde crees que están Lola y Mario\?/);
  assert.match(storyData, /options: \["Costa", "Sierra", "Amazonía", "Galápagos"\]/);
  assert.match(storyStyles, /\.scene-answer-feedback__panel/);
  assert.match(storyData, /Entre la neblina apareció un oso de anteojos/);
  assert.match(storyStyles, /\.scene-copy \{[^}]*background: rgba\(48, 34, 50, \.36\)/);
  assert.match(storyStyles, /\.scene-copy \{[^}]*color: #fff;/);
  for (const [, video] of storyData.matchAll(/videoSrc: "\/assets\/ANIMACIONES\/([^"]+)"/g)) {
    assert.ok(animationFiles.includes(video), `Missing animation: ${video}`);
  }
  for (const [, poster] of storyData.matchAll(/posterSrc: "\/assets\/POSTERS\/([^"]+)"/g)) {
    assert.ok(posterFiles.includes(poster), `Missing poster: ${poster}`);
  }
  assert.doesNotMatch(packageJson, /react-loading-skeleton|drizzle|tailwind|open-sans/i);

  await Promise.all(
    Array.from({ length: 24 }, (_, index) =>
      access(
        new URL(
          `../public/assets/ANIMACIONES/P${index + 1}.mp4`,
          import.meta.url,
        ),
      ),
    ),
  );

  await access(
    new URL("../public/assets/ANIMACIONES/FONDO1.mp4", import.meta.url),
  );
});

test("moves letters freely between chosen slots and validates the complete message", () => {
  let selected = Array(8).fill(null);
  const solution = [0, 1, 3, 6, 2, 7, 4, 5];
  for (const slot of [7, 2, 5, 0, 3, 6, 1, 4]) {
    assert.equal(secretLetterResult(selected), null);
    selected = placeSecretLetter(selected, solution[slot], slot);
  }
  assert.equal(selected.map((tile) => SECRET_LETTERS[tile]).join(""), "AMAZONÍA");
  assert.equal(secretLetterResult(selected), "success");
  const removed = placeSecretLetter(selected, 5, null);
  assert.equal(removed[7], null);
  assert.equal(secretLetterResult(removed), null);
  assert.equal(secretLetterResult(placeSecretLetter(removed, 5, 7)), "success");
  const moved = placeSecretLetter(selected, 0, 3);
  assert.equal(moved[0], null);
  assert.equal(moved[3], 0);
  assert.equal(moved.includes(6), false);
  assert.equal(moved.filter((tile) => tile === 0).length, 1);
  assert.equal(secretLetterResult(moved), null);
  assert.equal(secretLetterResult([0, 1, 2, 3, 4, 5, 6, 7]), "error");
  assert.equal(secretLetterResult([0, 1, 0, 6, 2, 7, 4, 5]), "error");
  assert.equal(placeSecretLetter(selected, -1, 0), selected);
  assert.equal(placeSecretLetter(selected, 8, 0), selected);
  assert.equal(placeSecretLetter(selected, 0, 8), selected);
});
