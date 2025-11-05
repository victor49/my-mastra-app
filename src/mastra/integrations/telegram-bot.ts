import "dotenv/config";
import { Telegraf } from "telegraf";
import { weatherAgent } from "../agents/weather-agent";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN no esta configurado en el entorno.");
}

const bot = new Telegraf(token);

bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;
  const userId = ctx.from?.id ?? chatId;
  const message = ctx.message.text;

  try {
    await ctx.telegram.sendChatAction(chatId, "typing");
  } catch {
    // Ignoramos errores al notificar la accion de escritura para no interrumpir el flujo.
  }

  try {
    const result = await weatherAgent.generate(message, {
      memory: {
        thread: `telegram:thread:${chatId}`,
        resource: `telegram:user:${userId}`,
      },
    });

    const replyText = result.text?.trim();

    if (replyText && replyText.length > 0) {
      await ctx.reply(replyText);
    } else {
      await ctx.reply("No pude generar una respuesta en este momento.");
    }
  } catch (error) {
    console.error("Error procesando mensaje de Telegram:", error);
    await ctx.reply("Ocurrio un error al procesar tu solicitud. Intentalo mas tarde.");
  }
});

bot.on("message", async (ctx) => {
  if ("text" in ctx.message) {
    return;
  }

  await ctx.reply("Por ahora solo puedo procesar mensajes de texto.");
});

bot.launch().then(() => {
  console.log("Bot de Telegram iniciado y listo para recibir mensajes.");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
