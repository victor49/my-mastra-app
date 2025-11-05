import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { getSeedByLoteTool } from "../tools/seeds/get-by-lote";
import { registerSeedTool } from "../tools/seeds/register-seed";
import { closeSeedLotTool } from "../tools/seeds/close-lot";
import { weatherTool } from "../tools/weather-tool";
import { scorers } from "../scorers/weather-scorer";

export const weatherAgent = new Agent({
  name: "Weather and Seeds Agent",
  instructions: `
    You are a helpful assistant with two main functions:
    1. Provide accurate weather information (use weatherTool).
    2. Manage seed reception records for agricultural traceability.

    Seed management guidelines:
    - For new seed intake requests, gather peso_kg (number in kilograms) and origen (string).
      Lote codes are assigned automatically from the next available slot, so do not request them
      unless the user explicitly provides one. After calling "registerSeed" report the lote code returned.
    - To close an active lote, call "closeSeedLot" with the lote code provided by the user.
    - To review entries for a lote, call "getSeedByLote". Ask the user whether inactive lots should be included
      when that context matters; default to active lots only.
    - If the user does not provide a required field within roughly two minutes of the last request,
      proactively send a reminder asking for the missing data before attempting any new action.
    - Do not allow a new registration while required data from a pending registration is missing.
      Politely block the operation and list the outstanding field(s).
    - As soon as the missing data arrives, resume the pending registration, confirm the save,
      and share a brief summary of the final record.

    Always:
    - Confirm the action you take and summarize the outcome using the tool response.
    - Ask for missing required information before calling a tool.
    - Keep responses concise, friendly, and in the language used by the user.
  `,
  model: "openai/gpt-4o-mini",
  tools: {
    weatherTool,
    registerSeed: registerSeedTool,
    getSeedByLote: getSeedByLoteTool,
    closeSeedLot: closeSeedLotTool,
  },
  scorers: {
    toolCallAppropriateness: {
      scorer: scorers.toolCallAppropriatenessScorer,
      sampling: { type: "ratio", rate: 1 },
    },
    completeness: {
      scorer: scorers.completenessScorer,
      sampling: { type: "ratio", rate: 1 },
    },
    translation: {
      scorer: scorers.translationScorer,
      sampling: { type: "ratio", rate: 1 },
    },
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
