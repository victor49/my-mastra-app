import { createTool } from "@mastra/core/tools";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, seeds } from "../../../db";
import { computeNextLotCode, lotCodeSchema } from "./lot-utils";

export const registerSeedTool = createTool({
  id: "register-seed",
  description: "Registra un nuevo ingreso fisico de semilla y asigna el siguiente lote disponible.",
  inputSchema: z.object({
    peso_kg: z.number().positive(),
    origen: z.string().min(1),
    lote: z.string().min(1).optional(),
  }),
  async execute(ctx) {
    const pesoKg = ctx.context.peso_kg;
    const origen = ctx.context.origen.trim();
    const loteInput = ctx.context.lote?.toUpperCase();

    const activeLots = await db
      .select({ lote: seeds.lote })
      .from(seeds)
      .where(eq(seeds.is_active, true));

    let loteAsignado: string;

    if (loteInput) {
      const loteValidado = lotCodeSchema.parse(loteInput);
      const ocupado = activeLots.some((lot) => lot.lote.toUpperCase() === loteValidado);

      if (ocupado) {
        throw new Error(`El lote ${loteValidado} ya esta asignado y activo. Elija otro o cierre el existente.`);
      }

      loteAsignado = loteValidado;
    } else {
      loteAsignado = computeNextLotCode(activeLots.map((lot) => lot.lote));
    }

    const resultado = await db
      .insert(seeds)
      .values({
        peso_kg: pesoKg,
        origen,
        lote: loteAsignado,
        is_active: true,
        created_at: new Date(),
      })
      .returning();

    return {
      message: `Registro insertado exitosamente con el lote ${loteAsignado}.`,
      data: resultado[0],
    };
  },
});
