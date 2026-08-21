"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { CHARACTERS } from "@/app/features/story/story.data";
import type { CharacterId } from "@/app/features/story/story.types";

interface CharacterOverlayProps {
  characterId: CharacterId;
  onClose: () => void;
}

export function CharacterOverlay({ characterId, onClose }: CharacterOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const character = CHARACTERS[characterId];
  const titleId = `character-name-${characterId}`;

  useEffect(() => {
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <section
      className={`character-overlay character-overlay--${character.accent}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="character-overlay__card">
        <Image
          className="character-overlay__portrait"
          src={character.imageSrc}
          alt={`Ilustración de ${character.name}`}
          width={520}
          height={560}
          priority
        />
        <div className="character-overlay__copy">
          <h2 id={titleId}>
            {characterId === "guacamayo" ? (
              <>
                <span className="character-overlay__title-line">Hola, soy el</span>
                <span className="character-overlay__title-line">Guacamayo</span>
                <span className="character-overlay__title-line">verde mayor</span>
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
        aria-label="Cerrar ficha y volver al cuento"
        title="Cerrar"
      >
        {characterId === "guacamayo" ? (
          <Image
            src="/assets/Iconos/Recurso 2@450x.png"
            alt=""
            width={64}
            height={64}
          />
        ) : (
          <X aria-hidden="true" />
        )}
      </button>
    </section>
  );
}
