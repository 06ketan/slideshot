import { launchBrowser } from "slideshot";
import { defaultOutDir } from "../helpers.js";

export async function handleHealthCheck(version: string) {
  try {
    const browser = await launchBrowser();
    const browserVersion = await browser.version();
    await browser.close();
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          ok: true,
          serverVersion: version,
          browser: browserVersion,
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
          outDir: defaultOutDir(),
          pid: process.pid,
        }, null, 2),
      }],
    };
  } catch (err: any) {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ ok: false, error: err.message, platform: process.platform }),
      }],
      isError: true,
    };
  }
}
