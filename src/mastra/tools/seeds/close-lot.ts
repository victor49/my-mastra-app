import { createTool } from "@mastra/core/tools";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, seeds } from "../../../db";
import { lotCodeSchema } from "./lot-utils";

export const closeSeedLotTool = createTool({
  id: "close-seed-lot",
  description: "Cierra un lote activo de semilla para liberar su codigo.",
  inputSchema: z.object({
    lote: z.string().min(1),
  }),
  async execute(ctx) {
    const loteCierre = lotCodeSchema.parse(ctx.context.lote.toUpperCase());

    const resultado = await db
      .update(seeds)
      .set({
        is_active: false,
        closed_at: new Date(),
      })
      .where(and(eq(seeds.lote, loteCierre), eq(seeds.is_active, true)))
      .returning();

    if (resultado.length === 0) {
      return {
        message: `No se encontro un lote activo con el codigo ${loteCierre}.`,
      };
    }

    return {
      message: `Lote ${loteCierre} cerrado correctamente.`,
      data: resultado[0],
    };
  },
});
