export const SECRET_LETTERS = ["A", "M", "O", "A", "Í", "A", "Z", "N"] as const;

export function placeSecretLetter(selected: readonly (number | null)[], tile: number, slot: number | null): readonly (number | null)[] {
  if (!Number.isInteger(tile) || tile < 0 || tile >= SECRET_LETTERS.length
    || (slot !== null && (!Number.isInteger(slot) || slot < 0 || slot >= SECRET_LETTERS.length))) return selected;
  const next = Array.from({ length: SECRET_LETTERS.length }, (_, index) => selected[index] === tile ? null : selected[index] ?? null);
  if (slot !== null) next[slot] = tile;
  return next;
}

export function secretLetterResult(selected: readonly (number | null)[]): "success" | "error" | null {
  if (selected.length !== SECRET_LETTERS.length || selected.some((tile) => tile === null)) return null;
  if (new Set(selected).size !== SECRET_LETTERS.length) return "error";
  return selected.map((tile) => SECRET_LETTERS[tile!]).join("") === "AMAZONÍA" ? "success" : "error";
}
