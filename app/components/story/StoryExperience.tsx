"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { STORY_SCENES, STORY_TITLE } from "@/app/features/story/story.data";
import { useStory } from "@/app/features/story/StoryProvider";

export function StoryExperience() {
  const { state, dispatch } = useStory();
  const videoRef = useRef<HTMLVideoElement>(null);
  const settingsRef = useRef<HTMLDialogElement>(null);
  const [readySceneId, setReadySceneId] = useState<string | null>(null);

  const scene = STORY_SCENES[state.currentSceneIndex];
  const isFirstScene = state.currentSceneIndex === 0;
  const isLastScene = state.currentSceneIndex === STORY_SCENES.length - 1;
  const progress = ((state.currentSceneIndex + 1) / STORY_SCENES.length) * 100;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !state.hasHydrated) return;

    video.muted = state.preferences.muted;

    if (state.isPlaying) {
      void video.play().catch(() => {
        dispatch({ type: "SET_PLAYING", payload: false });
      });
    } else {
      video.pause();
    }
  }, [dispatch, scene.id, state.hasHydrated, state.isPlaying, state.preferences.muted]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && !isFirstScene) {
        dispatch({ type: "PREVIOUS_SCENE" });
      }

      if (event.key === "ArrowRight") {
        dispatch({ type: isLastScene ? "RESTART" : "NEXT_SCENE" });
      }

      if (event.key === " ") {
        event.preventDefault();
        dispatch({ type: "SET_PLAYING", payload: !state.isPlaying });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, isFirstScene, isLastScene, state.isPlaying]);

  function togglePlayback() {
    dispatch({ type: "SET_PLAYING", payload: !state.isPlaying });
  }

  function goForward() {
    dispatch({ type: isLastScene ? "RESTART" : "NEXT_SCENE" });
  }

  function restartStory() {
    dispatch({ type: "RESTART" });
    settingsRef.current?.close();
  }

  return (
    <main
      className="story-app"
      data-contrast={state.preferences.highContrast ? "high" : "standard"}
      data-text-scale={state.preferences.textScale}
    >
      <header className="story-header">
        <div className="story-header__inner">
          <div className="story-brand">
            <Image
              className="story-brand__bird"
              src="/assets/PERSONAJES/GUACAMAYO VERDE MAYOR.png"
              alt=""
              width={68}
              height={48}
              priority
            />
            <div>
              <p className="story-brand__eyebrow">Cuento interactivo</p>
              <h1>{STORY_TITLE}</h1>
            </div>
          </div>

          <button
            className="icon-button icon-button--light"
            type="button"
            onClick={() => settingsRef.current?.showModal()}
            aria-label="Abrir ajustes"
            title="Ajustes"
          >
            <Settings aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="story-progress" aria-label="Progreso del cuento">
        <div className="story-progress__copy">
          <span>
            Escena {state.currentSceneIndex + 1} de {STORY_SCENES.length}
          </span>
          <strong>{scene.title}</strong>
        </div>
        <div
          className="story-progress__track"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STORY_SCENES.length}
          aria-valuenow={state.currentSceneIndex + 1}
          aria-valuetext={`Escena ${state.currentSceneIndex + 1} de ${STORY_SCENES.length}`}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <section className="story-reader" aria-labelledby="scene-title">
        <div className="story-stage">
          <div className="story-stage__fallback" aria-hidden="true">
            <Image
              className="fallback-character fallback-character--lola"
              src="/assets/PERSONAJES/LOLA.png"
              alt=""
              width={246}
              height={354}
              priority
            />
            <Image
              className="fallback-character fallback-character--mario"
              src="/assets/PERSONAJES/MARIO.png"
              alt=""
              width={246}
              height={354}
              priority
            />
          </div>
          <video
            key={scene.id}
            ref={videoRef}
            className={
              readySceneId === scene.id ? "story-video is-ready" : "story-video"
            }
            src={scene.videoSrc}
            aria-label={`Animación: ${scene.title}`}
            aria-describedby="scene-narration"
            playsInline
            preload="metadata"
            muted={state.preferences.muted}
            loop={!state.preferences.reducedMotion}
            onCanPlay={() => setReadySceneId(scene.id)}
            onPlay={() => dispatch({ type: "SET_PLAYING", payload: true })}
            onPause={() => dispatch({ type: "SET_PLAYING", payload: false })}
            onEnded={() => dispatch({ type: "SET_PLAYING", payload: false })}
          />
        </div>

        <div className="story-narrative" aria-live="polite">
          <p className="story-narrative__number">
            {String(state.currentSceneIndex + 1).padStart(2, "0")}
          </p>
          <div>
            <h2 id="scene-title">{scene.title}</h2>
            <p id="scene-narration">{scene.narration}</p>
          </div>
        </div>

        <nav className="story-controls" aria-label="Controles del cuento">
          <button
            className="control-button control-button--secondary"
            type="button"
            onClick={() => dispatch({ type: "PREVIOUS_SCENE" })}
            disabled={isFirstScene}
          >
            <ArrowLeft aria-hidden="true" />
            <span>Atrás</span>
          </button>

          <div className="story-controls__media">
            <button
              className="icon-button icon-button--media"
              type="button"
              onClick={togglePlayback}
              aria-label={state.isPlaying ? "Pausar animación" : "Reproducir animación"}
              title={state.isPlaying ? "Pausar" : "Reproducir"}
            >
              {state.isPlaying ? (
                <Pause aria-hidden="true" fill="currentColor" />
              ) : (
                <Play aria-hidden="true" fill="currentColor" />
              )}
            </button>
            <button
              className="icon-button icon-button--media"
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_MUTED" })}
              aria-label={state.preferences.muted ? "Activar sonido" : "Silenciar"}
              title={state.preferences.muted ? "Activar sonido" : "Silenciar"}
            >
              {state.preferences.muted ? (
                <VolumeX aria-hidden="true" />
              ) : (
                <Volume2 aria-hidden="true" />
              )}
            </button>
          </div>

          <button
            className="control-button control-button--primary"
            type="button"
            onClick={goForward}
          >
            <span>{isLastScene ? "Repetir" : "Siguiente"}</span>
            {isLastScene ? (
              <RotateCcw aria-hidden="true" />
            ) : (
              <ArrowRight aria-hidden="true" />
            )}
          </button>
        </nav>
      </section>

      <dialog
        ref={settingsRef}
        className="settings-dialog"
        aria-labelledby="settings-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="settings-dialog__content">
          <div className="settings-dialog__header">
            <h2 id="settings-title">Ajustes de lectura</h2>
            <button
              className="icon-button"
              type="button"
              onClick={() => settingsRef.current?.close()}
              aria-label="Cerrar ajustes"
              title="Cerrar"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <fieldset className="settings-group">
            <legend>Tamaño del texto</legend>
            <div className="segmented-control">
              <button
                type="button"
                aria-pressed={state.preferences.textScale === "normal"}
                onClick={() =>
                  dispatch({ type: "SET_TEXT_SCALE", payload: "normal" })
                }
              >
                Normal
              </button>
              <button
                type="button"
                aria-pressed={state.preferences.textScale === "large"}
                onClick={() =>
                  dispatch({ type: "SET_TEXT_SCALE", payload: "large" })
                }
              >
                Grande
              </button>
            </div>
          </fieldset>

          <label className="toggle-row">
            <span>
              <strong>Reducir movimiento</strong>
              <small>Las animaciones esperan hasta que las reproduzcas.</small>
            </span>
            <input
              type="checkbox"
              checked={state.preferences.reducedMotion}
              onChange={(event) =>
                dispatch({
                  type: "SET_REDUCED_MOTION",
                  payload: event.target.checked,
                })
              }
            />
          </label>

          <label className="toggle-row">
            <span>
              <strong>Más contraste</strong>
              <small>Refuerza los colores de texto y controles.</small>
            </span>
            <input
              type="checkbox"
              checked={state.preferences.highContrast}
              onChange={(event) =>
                dispatch({
                  type: "SET_HIGH_CONTRAST",
                  payload: event.target.checked,
                })
              }
            />
          </label>

          <button
            className="restart-button"
            type="button"
            onClick={restartStory}
          >
            <RotateCcw aria-hidden="true" />
            Empezar desde el inicio
          </button>
        </div>
      </dialog>
    </main>
  );
}
