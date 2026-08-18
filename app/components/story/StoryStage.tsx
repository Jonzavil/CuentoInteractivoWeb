"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Footprints,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CharacterId, StoryScene } from "@/app/features/story/story.types";
import { CharacterOverlay } from "./CharacterOverlay";
import { CipherPuzzle } from "./CipherPuzzle";

interface StoryStageProps {
  scene: StoryScene;
  sceneIndex: number;
  totalScenes: number;
  isPlaying: boolean;
  muted: boolean;
  reducedMotion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPlayingChange: (playing: boolean) => void;
  onToggleMuted: () => void;
  onOpenCharacter: (characterId: CharacterId) => void;
  selectedCharacter: CharacterId | null;
  onCloseCharacter: () => void;
}

export function StoryStage({
  scene,
  sceneIndex,
  totalScenes,
  isPlaying,
  muted,
  reducedMotion,
  onPrevious,
  onNext,
  onPlayingChange,
  onToggleMuted,
  onOpenCharacter,
  selectedCharacter,
  onCloseCharacter,
}: StoryStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [papers, setPapers] = useState([false, false, false]);
  const [, setBearSteps] = useState(0);
  const [showEndingPuzzle, setShowEndingPuzzle] = useState(false);

  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === totalScenes - 1;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (isPlaying) {
      void video.play().catch(() => onPlayingChange(false));
    } else {
      video.pause();
    }
  }, [isPlaying, muted, onPlayingChange, scene.id]);

  function playFromStart() {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().then(() => onPlayingChange(true)).catch(() => onPlayingChange(false));
  }

  function collectPaper(index: number) {
    setPapers((current) => current.map((collected, itemIndex) => collected || itemIndex === index));
  }

  const allPapersCollected = papers.every(Boolean);
  const interaction = scene.interaction;

  return (
    <section className="story-stage" data-scene={scene.id} aria-labelledby="scene-title">
      <video
        key={scene.id}
        ref={videoRef}
        className={videoReady ? "story-video is-ready" : "story-video"}
        src={scene.videoSrc}
        poster={scene.posterSrc}
        playsInline
        preload="metadata"
        muted={muted}
        loop={!reducedMotion}
        onCanPlay={() => setVideoReady(true)}
        onPlay={() => onPlayingChange(true)}
        onPause={() => onPlayingChange(false)}
        onEnded={() => onPlayingChange(false)}
        aria-hidden="true"
      />

      <div className="scene-counter" aria-label={`Escena ${sceneIndex + 1} de ${totalScenes}`}>
        <span>{String(sceneIndex + 1).padStart(2, "0")}</span>
        <i aria-hidden="true" />
        <span>{String(totalScenes).padStart(2, "0")}</span>
      </div>

      <div className="media-controls">
        <button
          className="icon-button icon-button--glass"
          type="button"
          onClick={() => onPlayingChange(!isPlaying)}
          aria-label={isPlaying ? "Pausar animación" : "Reproducir animación"}
          title={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? <Pause aria-hidden="true" fill="currentColor" /> : <Play aria-hidden="true" fill="currentColor" />}
        </button>
        <button
          className="icon-button icon-button--glass"
          type="button"
          onClick={onToggleMuted}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          title={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      </div>

      <h2 id="scene-title" className="visually-hidden">{scene.title}</h2>
      <div className="scene-copy-layer" aria-label="Narración de la escena">
        {scene.copyBlocks.map((copy, index) => (
          <p
            key={`${scene.id}-copy-${index}`}
            className={`scene-copy scene-copy--${copy.tone} scene-copy--${copy.align}${copy.font === "open-sans" ? " scene-copy--open-sans" : ""}`}
            style={{
              "--copy-top": `${copy.top}%`,
              "--copy-left": `${copy.left}%`,
              "--copy-width": `${copy.width}%`,
            } as CSSProperties}
          >
            {copy.text}
          </p>
        ))}
      </div>

      {interaction?.type === "characters" ? (
        <div className="scene-actions scene-actions--characters">
          <button className="action-button action-button--purple" type="button" onClick={() => onOpenCharacter("lola")}>
            Descubre quién es Lola
          </button>
          <button className="action-button action-button--lime" type="button" onClick={() => onOpenCharacter("mario")}>
            Descubre quién es MARIO
          </button>
        </div>
      ) : null}

      {interaction?.type === "reveal" ? (
        <div className="scene-actions">
          <button
            className="action-button action-button--green"
            type="button"
            onClick={onNext}
          >
            <Sparkles aria-hidden="true" />
            {interaction.label}
          </button>
        </div>
      ) : null}

      {interaction?.type === "cipher" ? (
        <div className="scene-interaction scene-interaction--cipher">
          <CipherPuzzle word={interaction.word} />
        </div>
      ) : null}

      {interaction?.type === "character" ? (
        <div className="scene-actions">
          <button className="action-button action-button--blue" type="button" onClick={() => onOpenCharacter(interaction.characterId)}>
            {interaction.label}
          </button>
        </div>
      ) : null}

      {interaction?.type === "papers" ? (
        <div className="paper-game" aria-label="Retira los tres papeles de la planta">
          {papers.map((collected, index) =>
            collected ? null : (
              <button
                key={index}
                className={`paper-piece paper-piece--${index + 1}`}
                type="button"
                onClick={() => collectPaper(index)}
                aria-label={`Retirar papel ${index + 1}`}
              >
                <span aria-hidden="true" />
              </button>
            ),
          )}
          <p className={allPapersCollected ? "paper-game__status is-complete" : "paper-game__status"} role="status">
            {allPapersCollected ? <><Check aria-hidden="true" /> ¡La planta recibe la luz!</> : "Da click en los papeles para ayudarlos"}
          </p>
        </div>
      ) : null}

      {interaction?.type === "bear" ? (
        <div className="bear-game">
          <button
            className="action-button action-button--green"
            type="button"
            onClick={() => {
              setBearSteps((current) => {
                const next = Math.min(3, current + 1);
                if (next === 3) onOpenCharacter("oso");
                return next;
              });
              playFromStart();
            }}
          >
            <Footprints aria-hidden="true" />
            Da click para que el oso avance
          </button>
        </div>
      ) : null}

      {interaction?.type === "ending" ? (
        showEndingPuzzle ? (
          <div className="scene-interaction scene-interaction--ending">
            <CipherPuzzle word={interaction.word} />
          </div>
        ) : (
          <div className="scene-actions">
            <button className="action-button action-button--green" type="button" onClick={() => setShowEndingPuzzle(true)}>
              <Sparkles aria-hidden="true" /> Completa los cuadros amarillos
            </button>
          </div>
        )
      ) : null}

      {selectedCharacter ? (
        <CharacterOverlay characterId={selectedCharacter} onClose={onCloseCharacter} />
      ) : null}

      <button
        className="page-arrow page-arrow--previous"
        type="button"
        onClick={onPrevious}
        disabled={isFirst}
        aria-label="Escena anterior"
        title="Escena anterior"
      >
        <ArrowLeft aria-hidden="true" />
      </button>
      <button
        className="page-arrow page-arrow--next"
        type="button"
        onClick={onNext}
        aria-label={isLast ? "Volver al inicio" : "Siguiente escena"}
        title={isLast ? "Volver al inicio" : "Siguiente escena"}
      >
        <ArrowRight aria-hidden="true" />
      </button>
    </section>
  );
}
