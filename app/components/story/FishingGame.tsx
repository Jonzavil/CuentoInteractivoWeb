"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// Positions and sizes follow the fish illustration supplied for this scene.
const FISH = [
  { x: 22, y: 25, width: 23, angle: -16, flip: true },
  { x: 58, y: 20, width: 29, angle: 8, flip: false },
  { x: 85, y: 25, width: 16, angle: -23, flip: true },
  { x: 40, y: 51, width: 34, angle: 5, flip: true },
  { x: 77, y: 45, width: 16, angle: 12, flip: false },
  { x: 20, y: 75, width: 29, angle: 6, flip: false },
  { x: 63, y: 72, width: 23, angle: -15, flip: true },
  { x: 87, y: 74, width: 23, angle: -48, flip: true },
] as const;

export function FishingGame({ fishImageSrc, onSolved }: {
  fishImageSrc: string;
  onSolved: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [caught, setCaught] = useState<readonly number[]>([]);
  const caughtRef = useRef(new Set<number>());
  const fishRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const celebrationRef = useRef<HTMLAudioElement>(null);

  function catchFish(index: number) {
    if (caughtRef.current.has(index)) return;
    caughtRef.current.add(index);
    setCaught([...caughtRef.current]);
    if (caughtRef.current.size === FISH.length) {
      void celebrationRef.current?.play().catch(() => {});
      onSolved();
    } else {
      const next = FISH.findIndex((_, fish) => !caughtRef.current.has(fish));
      fishRefs.current[next]?.focus({ preventScroll: true });
    }
  }

  return (
    <div className="fishing-game" aria-label="Atrapa los peces para alimentar al pingüino">
      <audio ref={celebrationRef} src="/assets/tonos/celebracion.mp3" preload="auto" aria-hidden="true" />
      {!started ? (
        <div className="fishing-game__intro">
          <h3>¡ES HORA DE PESCAR!</h3>
          <p>Atrapa los peces para<br />alimentar al pingüino.</p>
          <button type="button" className="fishing-game__start" onClick={() => setStarted(true)} aria-label="Comenzar a pescar">
            <Image src="/assets/Iconos/Recurso 3@450x.png" alt="" width={100} height={100} />
          </button>
        </div>
      ) : (
        <>
          <p className="fishing-game__progress" role="status">Peces atrapados: {caught.length} de {FISH.length}</p>
          {FISH.map((fish, index) => caught.includes(index) ? null : (
            <button
              key={index}
              ref={(element) => { fishRefs.current[index] = element; }}
              type="button"
              className="fishing-game__fish"
              style={{ left: `${fish.x}%`, top: `${fish.y}%`, width: `${fish.width}%` }}
              aria-label={`Atrapar pez ${index + 1}`}
              autoFocus={index === 0}
              onClick={() => catchFish(index)}
            >
              <span className="fishing-game__fish-art" style={{ transform: `rotate(${fish.angle}deg) scaleX(${fish.flip ? -1 : 1})` }}>
                <Image src={fishImageSrc} alt="" width={2160} height={1215} draggable={false} />
              </span>
              <Image className="fishing-game__target" src="/assets/Iconos/Recurso 3@450x.png" alt="" width={100} height={100} />
            </button>
          ))}
        </>
      )}
    </div>
  );
}
