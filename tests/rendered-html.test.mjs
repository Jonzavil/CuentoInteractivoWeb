import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

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
  const [storyData, storyStyles, packageJson, animationFiles] = await Promise.all([
    readFile(new URL("../app/features/story/story.data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../public/assets/ANIMACIONES/", import.meta.url)),
  ]);

  assert.equal(storyData.match(/videoSrc:/g)?.length, 17);
  assert.equal(storyData.match(/posterSrc:/g)?.length, 17);
  assert.equal(storyData.match(/copyBlocks:/g)?.length, 17);
  assert.doesNotMatch(storyData, /copyPosition:|copyTone:/);
  assert.match(storyData, /no encontraban ni un solo libro que llamara su atención/);
  assert.match(storyData, /Así ayudamos a que nuevas plantas crezcan en distintos lugares/);
  assert.match(storyStyles, /\.scene-copy--dark \{ background: transparent/);
  assert.match(storyStyles, /\.scene-copy--light \{ background: transparent/);
  assert.equal(animationFiles.filter((file) => file.endsWith(".mp4")).length, 17);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|drizzle|tailwind|open-sans/i);

  await Promise.all(
    Array.from({ length: 17 }, (_, index) =>
      access(
        new URL(
          `../public/assets/ANIMACIONES/P${index + 1}.mp4`,
          import.meta.url,
        ),
      ),
    ),
  );
});
