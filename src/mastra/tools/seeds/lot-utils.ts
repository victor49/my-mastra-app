import { z } from "zod";

export const LOT_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const lotCodeSchema = z
  .string()
  .trim()
  .min(1, "El lote no puede estar vacio.")
  .regex(/^[A-Z]+$/, "El lote solo puede contener letras mayusculas.")
  .refine(
    (value) => value.split("").every((char) => char === value[0]),
    "El lote debe repetirse con la misma letra (ej. A, BB, CCC).",
  );

export function computeNextLotCode(activeLots: string[]): string {
  const activeSet = new Set(activeLots.map((lot) => lot.toUpperCase()));
  let length = 1;

  while (length <= 10) {
    for (const letter of LOT_LETTERS) {
      const candidate = letter.repeat(length);
      if (!activeSet.has(candidate)) {
        return candidate;
      }
    }

    length += 1;
  }

  throw new Error("No hay codigos de lote disponibles. Libere o cierre lotes existentes.");
}
