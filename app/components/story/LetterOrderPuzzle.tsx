"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { placeSecretLetter, SECRET_LETTERS, secretLetterResult } from "@/app/features/story/letter-order";

const TILE_POSITIONS = [
  [28.4, 54.84, -8], [42, 52.92, -12], [57.2, 58.36, 30], [71.6, 55.16, 180],
  [33.2, 70.52, -35], [46.8, 66.36, 85], [53.2, 75.64, -20], [66, 72.12, -30],
] as const;

interface LetterOrderPuzzleProps {
  onSolved: () => void;
  onIncorrect: () => void;
}

type TilePosition = { x: number; y: number; angle: number };
type Drag = {
  tile: number;
  pointer: number;
  startX: number;
  startY: number;
  centerX: number;
  centerY: number;
  moved: boolean;
  previous: TilePosition;
};

export function LetterOrderPuzzle({ onSolved, onIncorrect }: LetterOrderPuzzleProps) {
  const [selected, setSelected] = useState<readonly (number | null)[]>(() => Array(8).fill(null));
  const [positions, setPositions] = useState<TilePosition[]>(() => TILE_POSITIONS.map(([x, y, angle]) => ({ x, y, angle })));
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [draggedTile, setDraggedTile] = useState<number | null>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const dragRef = useRef<Drag | null>(null);
  const reported = useRef(false);

  useEffect(() => {
    if (draggedTile !== null) return;
    const result = secretLetterResult(selected);
    if (!result) { reported.current = false; return; }
    if (reported.current) return;
    reported.current = true;
    if (result === "success") onSolved();
    else onIncorrect();
  }, [selected, draggedTile, onSolved, onIncorrect]);

  function startDrag(event: PointerEvent<HTMLButtonElement>, tile: number) {
    if (event.button !== 0 || dragRef.current || !gameRef.current) return;
    event.preventDefault();
    event.currentTarget.focus();
    const area = gameRef.current.getBoundingClientRect();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2 - area.left) / area.width * 100;
    const y = (rect.top + rect.height / 2 - area.top) / area.height * 100;
    dragRef.current = { tile, pointer: event.pointerId, startX: event.clientX, startY: event.clientY,
      centerX: x, centerY: y, moved: false, previous: positions[tile] };
    event.currentTarget.setPointerCapture(event.pointerId);
    setActiveTile(tile);
    setDraggedTile(tile);
    setPositions((current) => current.map((position, index) => index === tile ? { x, y, angle: 0 } : position));
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointer || !gameRef.current) return;
    const area = gameRef.current.getBoundingClientRect();
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;
    if (!drag.moved) return;
    const x = Math.min(96.5, Math.max(3.5, drag.centerX + dx / area.width * 100));
    const y = Math.min(94, Math.max(6, drag.centerY + dy / area.height * 100));
    setPositions((current) => current.map((position, index) => index === drag.tile ? { x, y, angle: 0 } : position));
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointer) return;
    if (cancelled) {
      setPositions((current) => current.map((position, index) => index === drag.tile ? { ...drag.previous, angle: 0 } : position));
    } else if (drag.moved) {
      const slot = slotsRef.current.findIndex((element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return event.clientX >= rect.left && event.clientX <= rect.right
          && event.clientY >= rect.top && event.clientY <= rect.bottom;
      });
      placeTile(drag.tile, slot === -1 ? null : slot);
    }
    dragRef.current = null;
    setDraggedTile(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function placeTile(tile: number, slot: number | null) {
    const displaced = slot === null ? null : selected[slot];
    if (displaced !== null && displaced !== tile) {
      const [x, y] = TILE_POSITIONS[displaced];
      setPositions((current) => current.map((position, index) => index === displaced ? { x, y, angle: 0 } : position));
    }
    setSelected((current) => placeSecretLetter(current, tile, slot));
  }

  return (
    <div ref={gameRef} className="letter-order-game" aria-labelledby="letter-order-prompt">
      <p id="letter-order-prompt" className="letter-order-game__prompt">
        TOCA Y ARRASTRA LAS LETRAS A LOS CUADROS<br />
        MORADOS PARA DESCUBRIR EL MENSAJE SECRETO.
      </p>
      <div className="letter-order-game__slots" role="group" aria-label="Cuadros para el mensaje secreto">
        {SECRET_LETTERS.map((_, index) => (
          <button
            key={index}
            ref={(element) => { slotsRef.current[index] = element; }}
            type="button"
            className="letter-order-game__slot"
            aria-label={`Cuadro ${index + 1}${selected[index] === null ? " vacío" : `: ${SECRET_LETTERS[selected[index]!]}`}. Selecciona una letra y toca aquí para colocarla.`}
            onClick={() => {
              if (activeTile === null) return;
              placeTile(activeTile, index);
              setActiveTile(null);
            }}
          />
        ))}
      </div>
      <div className="letter-order-game__tiles" role="group" aria-label="Letras para mover">
        {SECRET_LETTERS.map((letter, tile) => {
          const slot = selected.indexOf(tile);
          const snapped = slot !== -1 && draggedTile !== tile;
          // Centers of the eight equal slots (88% width, 1.2cqw gaps, 16:9 stage).
          const position = snapped ? { x: 10.975 + slot * 11.15, y: 37.844, angle: 0 } : positions[tile];
          return (
            <button
              key={tile}
              className={`letter-order-game__tile${draggedTile === tile ? " is-dragging" : ""}${activeTile === tile ? " is-selected" : ""}`}
              type="button"
              aria-label={`Mover letra ${letter}${slot !== -1 ? ` del cuadro ${slot + 1}` : ""}`}
              aria-pressed={activeTile === tile}
              style={{ left: `${position.x}%`, top: `${position.y}%`, "--tile-angle": `${position.angle}deg` } as CSSProperties}
              onPointerDown={(event) => startDrag(event, tile)}
              onPointerMove={moveDrag}
              onPointerUp={(event) => finishDrag(event)}
              onPointerCancel={(event) => finishDrag(event, true)}
              onLostPointerCapture={(event) => finishDrag(event, true)}
              onClick={() => {
                setActiveTile(tile);
                setPositions((current) => current.map((item, index) => index === tile ? { ...item, angle: 0 } : item));
              }}
              onKeyDown={(event) => {
                const delta = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[event.key];
                if (!delta) return;
                event.preventDefault();
                event.stopPropagation();
                setPositions((current) => current.map((item, index) => index === tile ? {
                  x: Math.min(96.5, Math.max(3.5, position.x + delta[0])),
                  y: Math.min(94, Math.max(6, position.y + delta[1])), angle: 0,
                } : item));
                setSelected((current) => placeSecretLetter(current, tile, null));
                setActiveTile(tile);
              }}
            >{letter}</button>
          );
        })}
      </div>
      <span className="visually-hidden" role="status">
        {selected.filter((tile) => tile !== null).length} de 8 letras colocadas.
      </span>
    </div>
  );
}
