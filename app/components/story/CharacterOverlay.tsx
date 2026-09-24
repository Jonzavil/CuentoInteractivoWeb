"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { CHARACTERS } from "@/app/features/story/story.data";
import type { CharacterId } from "@/app/features/story/story.types";

interface CharacterOverlayProps {
  characterId: CharacterId;
  onClose: () => void;
  variant?: "story" | "gallery";
}

export function CharacterOverlay({ characterId, onClose, variant = "story" }: CharacterOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const character = CHARACTERS[characterId];
  const titleId = `character-name-${characterId}`;

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    if (variant === "gallery") document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus({ preventScroll: true });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (variant === "gallery") document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [onClose, variant]);

  return (
    <section
      className={`character-overlay character-overlay--${character.accent}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="character-overlay__card">
        {character.imageSrc ? (
          <Image
            className="character-overlay__portrait"
            src={character.imageSrc}
            alt={`Ilustración de ${character.name}`}
            width={520}
            height={560}
            priority
          />
        ) : null}
        <div className="character-overlay__copy">
          <h2 id={titleId}>
            {characterId === "guacamayo" ? (
              <>
                <span className="character-overlay__title-line">Hola, soy el</span>
                <span className="character-overlay__title-line">Guacamayo</span>
                <span className="character-overlay__title-line">verde mayor</span>
              </>
            ) : characterId === "oso" ? (
              <>
                <span className="character-overlay__title-line">Hola, soy el</span>
                <span className="character-overlay__title-line">Oso de anteojos</span>
              </>
            ) : characterId === "delfin" ? (
              <>
                <span className="character-overlay__title-line">Hola, soy el</span>
                <span className="character-overlay__title-line">Delfín rosado</span>
              </>
            ) : characterId === "pinguino" ? (
              <>
                <span className="character-overlay__title-line">Hola, soy el</span>
                <span className="character-overlay__title-line">Pingüino de</span>
                <span className="character-overlay__title-line">Galápagos</span>
              </>
            ) : (
              <>
                {characterId === "lola" || characterId === "mario" ? "Hola, soy" : "Hola, soy el"}{" "}
                {character.name}
              </>
            )}
          </h2>
          <p>
            {characterId === "lola" ? (
              <>
                Una pequeña científica curiosa,
                <br />
                valiente y siempre dispuesta a
                <br />
                descubrir cosas nuevas.
              </>
            ) : characterId === "mario" ? (
              <>
                Un pequeño explorador curioso,
                <br />
                divertido y siempre listo para vivir
                <br />
                nuevas aventuras.
              </>
            ) : characterId === "guacamayo" ? (
              <>
                Vivo en los bosques de la Costa
                <br />
                ecuatoriana y necesito grandes
                <br />
                árboles para alimentarme, refugiarme
                <br />
                y formar mi familia.
              </>
            ) : characterId === "oso" ? (
              <>
                Soy tranquilo y curioso que
                <br />
                vive en los bosques andinos
                <br />
                del Ecuador.
              </>
            ) : characterId === "delfin" ? (
              <>
                Vivo en los ríos de la Amazonía
                <br />
                ecuatoriana y me alimento de
                <br />
                peces. Necesito aguas limpias y
                <br />
                libres de basura para nadar,
                <br />
                alimentarme y vivir.
              </>
            ) : (
              character.description
            )}
          </p>
        </div>
      </div>
      <button
        ref={closeRef}
        className="character-overlay__close"
        type="button"
        onClick={onClose}
        aria-label="Cerrar ficha del personaje"
        title="Cerrar"
      >
        <X aria-hidden="true" />
      </button>
    </section>
  );
}
