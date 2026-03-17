import { loadPrompt, type PromptVariant } from "../prompts.js";

export async function handleGetPrompt(args: { variant: string }) {
  const text = loadPrompt(args.variant as PromptVariant);
  return {
    content: [{ type: "text" as const, text }],
  };
}
