"use client";

import Image from "next/image";
import {
  BookOpen,
  Images,
  ScrollText,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  CHARACTERS,
  STORY_SCENES,
  STORY_SYNOPSIS,
} from "@/app/features/story/story.data";
import { useStory } from "@/app/features/story/StoryProvider";
import type { CharacterId, StoryView } from "@/app/features/story/story.types";
import { StoryStage } from "./StoryStage";
import { CharacterOverlay } from "./CharacterOverlay";

const VIEWS: Array<{ id: StoryView; label: string; icon: typeof BookOpen }> = [
  { id: "cuento", label: "Cuento", icon: BookOpen },
  { id: "sinopsis", label: "Sinopsis", icon: ScrollText },
  { id: "creditos", label: "Créditos", icon: Users },
  { id: "galeria", label: "Galería", icon: Images },
];

export function StoryExperience() {
  const { state, dispatch } = useStory();
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId | null>(null);

  const scene = STORY_SCENES[state.currentSceneIndex];
  const progress = ((state.currentSceneIndex + 1) / STORY_SCENES.length) * 100;

  const setPlaying = useCallback(
    (playing: boolean) => dispatch({ type: "SET_PLAYING", payload: playing }),
    [dispatch],
  );

  const openCharacter = useCallback((characterId: CharacterId) => {
    setPlaying(false);
    setSelectedCharacter(characterId);
  }, [setPlaying]);

  const closeCharacter = useCallback(() => setSelectedCharacter(null), []);

  const goPrevious = useCallback(() => dispatch({ type: "PREVIOUS_SCENE" }), [dispatch]);
  const goNext = useCallback(() => {
    dispatch({
      type: state.currentSceneIndex === STORY_SCENES.length - 1 ? "RESTART" : "NEXT_SCENE",
    });
  }, [dispatch, state.currentSceneIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (state.currentView !== "cuento" || selectedCharacter) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
      ) {
        return;
      }
      if (event.key === "ArrowLeft" && state.currentSceneIndex > 0) goPrevious();
      if (event.key === "ArrowRight") goNext();
      if (event.key === " ") {
        event.preventDefault();
        setPlaying(!state.isPlaying);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious, selectedCharacter, setPlaying, state.currentSceneIndex, state.currentView, state.isPlaying]);

  return (
    <main
      className="story-app"
      data-contrast={state.preferences.highContrast ? "high" : "standard"}
      data-text-scale={state.preferences.textScale}
    >
      <header className="site-header">
        <nav className="main-tabs" aria-label="Secciones del sitio">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-current={state.currentView === id ? "page" : undefined}
              onClick={() => dispatch({ type: "SET_VIEW", payload: id })}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </header>

      {state.currentView === "cuento" ? (
        <div className="story-shell">
          <div className="story-progress">
            <div className="story-progress__label">
              <span>Escena {state.currentSceneIndex + 1}</span>
              <strong>{scene.title}</strong>
            </div>
            <div
              className="story-progress__track"
              role="progressbar"
              aria-label="Progreso del cuento"
              aria-valuemin={1}
              aria-valuemax={STORY_SCENES.length}
              aria-valuenow={state.currentSceneIndex + 1}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <StoryStage
            key={scene.id}
            scene={scene}
            sceneIndex={state.currentSceneIndex}
            totalScenes={STORY_SCENES.length}
            isPlaying={state.isPlaying}
            muted={state.preferences.muted}
            reducedMotion={state.preferences.reducedMotion}
            onPrevious={goPrevious}
            onNext={goNext}
            onPlayingChange={setPlaying}
            onOpenCharacter={openCharacter}
            selectedCharacter={selectedCharacter}
            onCloseCharacter={closeCharacter}
          />
        </div>
      ) : null}

      {state.currentView === "sinopsis" ? (
        <section className="content-view content-view--synopsis" aria-labelledby="synopsis-title">
          <Image src="/assets/ESCENAS/P1.jpg" alt="Lola y Mario al comienzo de su aventura" fill sizes="(max-width: 900px) 100vw, 1100px" priority />
          <div className="content-view__copy">
            <p className="content-view__eyebrow">Una aventura por el Ecuador</p>
            <h2 id="synopsis-title">El bosque necesita guardianes</h2>
            <p>{STORY_SYNOPSIS}</p>
            <button className="action-button action-button--purple" type="button" onClick={() => dispatch({ type: "SET_VIEW", payload: "cuento" })}>
              <BookOpen aria-hidden="true" /> Comenzar el cuento
            </button>
          </div>
        </section>
      ) : null}

      {state.currentView === "creditos" ? (
        <section className="content-view content-view--credits" aria-labelledby="credits-title">
          <div className="credits-art" aria-hidden="true">
            <Image src={CHARACTERS.lola.imageSrc} alt="" width={260} height={360} />
            <Image src={CHARACTERS.mario.imageSrc} alt="" width={260} height={360} />
          </div>
          <div className="credits-copy">
            <p className="content-view__eyebrow">Detrás de la aventura</p>
            <h2 id="credits-title">Créditos</h2>
            <dl>
              <div><dt>Diseño, ilustración y animación</dt><dd>Equipo creativo de Guardianes del bosque</dd></div>
              <div><dt>Adaptación y desarrollo web</dt><dd>Jonathan Zavala</dd></div>
              <div><dt>Proyecto</dt><dd>Cuento interactivo sobre la fauna y los bosques del Ecuador</dd></div>
            </dl>
          </div>
        </section>
      ) : null}

      {state.currentView === "galeria" ? (
        <section className="gallery-view" aria-labelledby="gallery-title">
          <div className="gallery-view__heading">
            <p className="content-view__eyebrow">Compañeros de viaje</p>
            <h2 id="gallery-title">Conoce a los personajes</h2>
          </div>
          <div className="character-grid">
            {(Object.keys(CHARACTERS) as CharacterId[]).map((characterId) => {
              const item = CHARACTERS[characterId];
              return (
                <button key={characterId} className={`character-card character-card--${item.accent}`} type="button" onClick={() => openCharacter(characterId)}>
                  <Image src={item.imageSrc} alt="" width={240} height={300} />
                  <span><strong>{item.name}</strong><small>Ver ficha</small></span>
                </button>
              );
            })}
          </div>
          {selectedCharacter ? (
            <CharacterOverlay characterId={selectedCharacter} onClose={closeCharacter} />
          ) : null}
        </section>
      ) : null}

    </main>
  );
}
