import { loadPrompt, type PromptVariant } from "../prompts.js";
import { isDiscoveryDone } from "../cache.js";

export async function handleGetPrompt(args: { variant: string }) {
  if (!isDiscoveryDone()) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: false,
          error: "DISCOVERY_REQUIRED",
          instruction: "Call create_slides with step='discover' first to present themes and gather user preferences. You MUST ask the user which theme, topic, orientation, and formats they want before proceeding.",
        }),
      }],
      isError: true,
    };
  }

  const text = await loadPrompt(args.variant as PromptVariant);
  return {
    content: [{ type: "text" as const, text }],
  };
}
