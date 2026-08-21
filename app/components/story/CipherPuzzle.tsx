"use client";

import { Lightbulb } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CipherPuzzleProps {
  word: "AYUDA" | "COSTA" | "SIERRA";
  variant?: "default" | "message";
  onSolved?: () => void;
  onIncorrect?: () => void;
}

export function CipherPuzzle({ word, variant = "default", onSolved, onIncorrect }: CipherPuzzleProps) {
  const [letters, setLetters] = useState(() => word.split("").map(() => ""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const reportedResult = useRef(false);
  const complete = letters.every(Boolean);
  const solved = letters.join("") === word;
  const prompt = variant === "message" ? "¡Ayúdala a descifrarlo!" : "Completa los cuadros amarillos";

  useEffect(() => {
    if (!complete || reportedResult.current) return;
    reportedResult.current = true;
    if (solved) onSolved?.();
    else onIncorrect?.();
  }, [complete, onIncorrect, onSolved, solved]);

  function updateLetter(index: number, value: string) {
    const letter = value.toUpperCase().replace(/[^A-ZÑ]/g, "").slice(-1);
    setLetters((current) =>
      current.map((currentLetter, letterIndex) =>
        letterIndex === index ? letter : currentLetter,
      ),
    );
    if (letter && index < word.length - 1) inputs.current[index + 1]?.focus();
  }

  function revealHint() {
    const firstEmpty = letters.findIndex((letter) => !letter);
    if (firstEmpty === -1) return;
    setLetters((current) =>
      current.map((letter, index) => (index === firstEmpty ? word[index] : letter)),
    );
    inputs.current[Math.min(firstEmpty + 1, word.length - 1)]?.focus();
  }

  return (
    <div className={`cipher cipher--${word.toLowerCase()} cipher--${variant}`} aria-label={`Descifra una palabra de ${word.length} letras`}>
      <p className="cipher__prompt">{prompt}</p>
      <div className="cipher__letters">
        {word.split("").map((expectedLetter, index) => (
          <input
            key={`${expectedLetter}-${index}`}
            ref={(element) => {
              inputs.current[index] = element;
            }}
            value={letters[index]}
            maxLength={1}
            inputMode="text"
            aria-label={`Letra ${index + 1} de ${word.length}`}
            className={variant !== "message" && letters[index] && letters[index] !== expectedLetter ? "is-wrong" : ""}
            onChange={(event) => updateLetter(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !letters[index] && index > 0) {
                inputs.current[index - 1]?.focus();
              }
            }}
          />
        ))}
      </div>
      {solved ? (
        <p className="visually-hidden" role="status">¡Descubriste {word}!</p>
      ) : (
        <button className="action-button action-button--hint" type="button" onClick={revealHint} aria-label="Mostrar una letra" title="Mostrar una letra">
          <Lightbulb aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
