import { createTool } from "@mastra/core/tools";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, seeds } from "../../../db";
import { lotCodeSchema } from "./lot-utils";

export const getSeedByLoteTool = createTool({
  id: "get-seed-by-lote",
  description: "Busca registros de semilla por codigo de lote.",
  inputSchema: z.object({
    lote: z.string().min(1),
    incluirInactivos: z.boolean().optional(),
  }),
  execute: async (ctx) => {
    const loteBuscado = lotCodeSchema.parse(ctx.context.lote.toUpperCase());
    const incluirInactivos = ctx.context.incluirInactivos ?? false;

    const filtros = incluirInactivos
      ? eq(seeds.lote, loteBuscado)
      : and(eq(seeds.lote, loteBuscado), eq(seeds.is_active, true));

    const filas = await db.select().from(seeds).where(filtros);

    if (filas.length === 0) {
      return {
        message: incluirInactivos
          ? `No hay registros para el lote ${loteBuscado}.`
          : `No hay registros activos para el lote ${loteBuscado}.`,
      };
    }

    return {
      message: incluirInactivos
        ? `Se encontraron ${filas.length} registro(s) para el lote ${loteBuscado}.`
        : `Se encontraron ${filas.length} registro(s) activos para el lote ${loteBuscado}.`,
      data: filas,
    };
  },
});
