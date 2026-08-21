"use client";

import Image from "next/image";
import {
  Check,
  Footprints,
  Sparkles,
  X,
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
  onOpenCharacter,
  selectedCharacter,
  onCloseCharacter,
}: StoryStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const toneRef = useRef<HTMLAudioElement>(null);
  const allowToneToFinishRef = useRef(false);
  const [videoReady, setVideoReady] = useState(false);
  const [hasAnimationEnded, setHasAnimationEnded] = useState(false);
  const [papers, setPapers] = useState([false, false, false]);
  const [, setBearSteps] = useState(0);
  const [showEndingPuzzle, setShowEndingPuzzle] = useState(false);
  const [showCipherError, setShowCipherError] = useState(false);
  const [cipherAttempt, setCipherAttempt] = useState(0);
  const [showGuacamayoAction, setShowGuacamayoAction] = useState(false);

  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === totalScenes - 1;
  const waitsForAnimationEnd = scene.id === "la-biblioteca"
    || scene.id === "un-bosque-enorme"
    || scene.id === "guacamayo-verde-mayor";
  const toneFinishesOnce = scene.id === "un-bosque-enorme" || scene.id === "guacamayo-verde-mayor";
  const autoPlays = scene.id === "fondo-1" || scene.id === "mensaje-ayuda";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tone = toneRef.current;
    video.muted = autoPlays || muted;
    if (isPlaying || autoPlays) {
      void video.play().catch(() => onPlayingChange(false));
      void tone?.play().catch(() => undefined);
    } else {
      video.pause();
      if (!(toneFinishesOnce && allowToneToFinishRef.current && !tone?.ended)) {
        tone?.pause();
      }
    }
  }, [autoPlays, isPlaying, muted, onPlayingChange, scene.id, toneFinishesOnce]);

  function playFromStart() {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    if (toneRef.current) {
      toneRef.current.currentTime = 0;
      void toneRef.current.play().catch(() => undefined);
    }
    void video.play().then(() => onPlayingChange(true)).catch(() => onPlayingChange(false));
  }

  function startPlayback() {
    const video = videoRef.current;
    if (!video) return;
    void toneRef.current?.play().catch(() => undefined);
    void video.play().catch(() => onPlayingChange(false));
  }

  function collectPaper(index: number) {
    setPapers((current) => current.map((collected, itemIndex) => collected || itemIndex === index));
  }

  function handleNext() {
    if (scene.id === "guacamayo-verde-mayor" && !showGuacamayoAction) {
      setShowGuacamayoAction(true);
      return;
    }
    onNext();
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
        preload="auto"
        autoPlay={autoPlays}
        muted={autoPlays || muted}
        loop={!reducedMotion && !waitsForAnimationEnd}
        onLoadedData={(event) => {
          const video = event.currentTarget;
          if (!autoPlays && !isPlaying && video.currentTime === 0 && Number.isFinite(video.duration)) {
            video.pause();
            video.currentTime = Math.min(0.001, video.duration);
          }
        }}
        onCanPlay={() => setVideoReady(true)}
        onPlay={() => {
          allowToneToFinishRef.current = false;
          setHasAnimationEnded(false);
          onPlayingChange(true);
        }}
        onPause={(event) => {
          const video = event.currentTarget;
          if (
            toneFinishesOnce &&
            (video.ended || (Number.isFinite(video.duration) && video.duration - video.currentTime < 0.15))
          ) {
            allowToneToFinishRef.current = true;
          }
          onPlayingChange(false);
        }}
        onEnded={() => {
          if (toneFinishesOnce) allowToneToFinishRef.current = true;
          if (waitsForAnimationEnd) setHasAnimationEnded(true);
          onPlayingChange(false);
        }}
        aria-hidden="true"
      />

      {scene.toneSrc ? (
        <audio
          key={scene.toneSrc}
          ref={toneRef}
          src={scene.toneSrc}
          preload="auto"
          loop={!toneFinishesOnce}
          onEnded={() => {
            allowToneToFinishRef.current = false;
          }}
          aria-hidden="true"
        />
      ) : null}

      {!autoPlays && !isPlaying && !(waitsForAnimationEnd && hasAnimationEnded) ? (
        <button
          className="scene-play-button"
          type="button"
          onClick={startPlayback}
          aria-label="Reproducir escena"
          title="Reproducir escena"
        >
          <Image
            src="/assets/Iconos/Recurso 3@450x.png"
            alt=""
            width={100}
            height={100}
            priority
          />
        </button>
      ) : null}

      <h2 id="scene-title" className="visually-hidden">{scene.title}</h2>
      <div className="scene-copy-layer" aria-label="Narración de la escena">
        {(scene.id === "guacamayo-verde-mayor" && showGuacamayoAction ? [] : scene.copyBlocks).map((copy, index) => (
          <p
            key={`${scene.id}-copy-${index}`}
            className={`scene-copy scene-copy--${copy.tone} scene-copy--${copy.align}`}
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

      {interaction?.type === "characters" && hasAnimationEnded ? (
        <div className="scene-actions scene-actions--characters">
          <button className="action-button action-button--purple" type="button" onClick={() => onOpenCharacter("lola")}>
            Descubre quién es Lola
          </button>
          <button className="action-button action-button--lime" type="button" onClick={() => onOpenCharacter("mario")}>
            Descubre quién es Mario
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
            {interaction.label}
          </button>
        </div>
      ) : null}

      {interaction?.type === "cipher" ? (
        <div className="scene-interaction scene-interaction--cipher">
          <CipherPuzzle
            key={`${scene.id}-${cipherAttempt}`}
            word={interaction.word}
            variant={scene.id === "mensaje-ayuda" ? "message" : "default"}
            onSolved={scene.id === "mensaje-ayuda" ? onNext : undefined}
            onIncorrect={scene.id === "mensaje-ayuda" ? () => setShowCipherError(true) : undefined}
          />
        </div>
      ) : null}

      {showCipherError ? (
        <div className="scene-answer-feedback" role="dialog" aria-modal="true" aria-labelledby="incorrect-answer-title">
          <div className="scene-answer-feedback__panel">
            <p>
              <strong id="incorrect-answer-title">¡Ups! Ese no es el mensaje</strong>
              {"\n"}Mira nuevamente
              {"\n"}los símbolos e
              {"\n"}inténtalo otra vez.
            </p>
          </div>
          <button
            className="scene-answer-feedback__close"
            type="button"
            autoFocus
            aria-label="Cerrar e intentar nuevamente"
            onClick={() => {
              setShowCipherError(false);
              setCipherAttempt((attempt) => attempt + 1);
            }}
          >
            <X aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {interaction?.type === "character" && (scene.id !== "guacamayo-verde-mayor" || showGuacamayoAction) ? (
        <div className="scene-actions">
          <button className="action-button action-button--blue" type="button" onClick={() => onOpenCharacter(interaction.characterId)}>
            {interaction.label}
          </button>
        </div>
      ) : null}

      {interaction?.type === "choice" ? (
        <div className="scene-choice-game" aria-labelledby="scene-choice-prompt">
          <p id="scene-choice-prompt" className="scene-choice-game__prompt">
            {interaction.prompt}
          </p>
          <div className="scene-choice-game__options">
            {interaction.options.map((option) => (
              <button key={option} type="button" onClick={onNext}>
                {option}
              </button>
            ))}
          </div>
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
        <Image
          src="/assets/Iconos/Recurso 1@450x.png"
          alt=""
          width={64}
          height={64}
        />
      </button>
      <button
        className="page-arrow page-arrow--next"
        type="button"
        onClick={handleNext}
        aria-label={isLast ? "Volver al inicio" : "Siguiente escena"}
        title={isLast ? "Volver al inicio" : "Siguiente escena"}
      >
        <Image
          src="/assets/Iconos/Recurso 2@450x.png"
          alt=""
          width={64}
          height={64}
        />
      </button>
    </section>
  );
}
