import puppeteer, { type Browser, type Page } from "puppeteer";

const LAUNCH_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--disable-software-rasterizer",
  "--single-process",
  "--no-zygote",
];

export async function launchBrowser(): Promise<Browser> {
  try {
    return await puppeteer.launch({
      headless: true,
      args: LAUNCH_ARGS,
      timeout: 30000,
    });
  } catch (err: any) {
    throw new Error(
      `browser_launch_failed: ${err.message}. ` +
      `Ensure Chromium is available. On containers, verify /dev/shm size or set --disable-dev-shm-usage.`,
    );
  }
}

export async function setupPage(
  browser: Browser,
  width: number,
  height: number,
  scale: number,
): Promise<Page> {
  const page = await browser.newPage();
  await page.setViewport({
    width: width + 96,
    height: height + 96,
    deviceScaleFactor: scale,
  });
  return page;
}
