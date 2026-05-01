#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const SERVER_PATH = new URL("./dist/index.js", import.meta.url).pathname;
const OUTPUT_DIR = path.join(os.homedir(), "Desktop", "slideshot-output");

let requestId = 0;
let serverProcess;
let rl;
let pendingResolvers = new Map();

function startServer() {
  return new Promise((resolve, reject) => {
    serverProcess = spawn("node", [SERVER_PATH], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    rl = createInterface({ input: serverProcess.stdout });

    rl.on("line", (line) => {
      try {
        const msg = JSON.parse(line);
        if (msg.id && pendingResolvers.has(msg.id)) {
          pendingResolvers.get(msg.id)(msg);
          pendingResolvers.delete(msg.id);
        }
      } catch {}
    });

    serverProcess.stderr.on("data", (data) => {
      const text = data.toString();
      if (text.includes("v3.0.0")) resolve();
    });

    serverProcess.on("error", reject);

    send("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "e2e-test", version: "1.0" },
    }).then((res) => {
      send("notifications/initialized", {});
      resolve(res);
    });
  });
}

function send(method, params) {
  return new Promise((resolve) => {
    const id = ++requestId;
    const msg = { jsonrpc: "2.0", id, method, params };
    pendingResolvers.set(id, resolve);
    serverProcess.stdin.write(JSON.stringify(msg) + "\n");
  });
}

function callTool(name, args) {
  return send("tools/call", { name, arguments: args });
}

function parseToolResult(response) {
  if (response.result?.content?.[0]?.text) {
    try {
      const data = JSON.parse(response.result.content[0].text);
      if (data.ok !== undefined && data.success === undefined) data.success = data.ok;
      if (data.slides !== undefined && data.slideCount === undefined && typeof data.slides === "number") data.slideCount = data.slides;
      return data;
    } catch {
      return response.result.content[0].text;
    }
  }
  return response;
}

function cleanOutput() {
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const f of files) {
      try { fs.unlinkSync(path.join(OUTPUT_DIR, f)); } catch {}
    }
  }
}

function listOutput() {
  if (!fs.existsSync(OUTPUT_DIR)) return [];
  return fs.readdirSync(OUTPUT_DIR).filter(f => !f.startsWith("."));
}

function fileExists(p) {
  return fs.existsSync(p);
}

function fileSize(p) {
  try { return fs.statSync(p).size; } catch { return 0; }
}

const results = [];
function log(scenario, status, detail) {
  const icon = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⚠️";
  console.log(`${icon} [${scenario}] ${detail}`);
  results.push({ scenario, status, detail });
}

async function test1_healthCheck() {
  console.log("\n━━━ Scenario 1: Health Check ━━━");
  const res = await callTool("health_check", {});
  const data = parseToolResult(res);
  if ((data.ok === true || data.status === "ok") && (data.serverVersion === "3.0.0" || data.serverVersion === "3.0.1")) {
    log("S1", "PASS", `health_check OK — version=${data.serverVersion}, browser=${data.browser}`);
  } else {
    log("S1", "FAIL", `Unexpected: ${JSON.stringify(data).slice(0, 200)}`);
  }
}

async function test2_discover() {
  console.log("\n━━━ Scenario 2: Discover Flow ━━━");
  const res = await callTool("create_slides", { step: "discover" });
  const data = parseToolResult(res);
  const themeCount = data.themes?.length;
  const hasFlow = !!data.flow || !!data.recommendedFlow;
  const hasQuestions = (data.ask?.length >= 4) || (data.requiredQuestions?.length === 5);

  if (themeCount === 8 && hasQuestions) {
    const qCount = data.ask?.length || data.requiredQuestions?.length;
    log("S2", "PASS", `discover returned ${themeCount} themes, ${qCount} questions`);
    log("S2", hasFlow ? "PASS" : "WARN", `flow present: ${hasFlow}`);
    const themeIds = data.themes.map(t => t.id);
    log("S2", "PASS", `themes: ${themeIds.join(", ")}`);
  } else {
    log("S2", "FAIL", `themes=${themeCount}, questions=${data.ask?.length || data.requiredQuestions?.length}`);
  }
}

async function test3_generic_pdf() {
  console.log("\n━━━ Scenario 3: Generic + PDF Portrait ━━━");
  cleanOutput();

  const schema = await callTool("get_slide_schema", { theme: "generic" });
  const schemaData = parseToolResult(schema);
  log("S3", schemaData.supportedSlideTypes?.length > 0 ? "PASS" : "FAIL",
    `get_slide_schema: ${schemaData.supportedSlideTypes?.length} slide types`);

  const assembleRes = await callTool("assemble_slides", {
    theme: "generic",
    slides: [
      { type: "cover", headline: "AI in Healthcare", subtitle: "Transforming Patient Care" },
      { type: "stats", title: "Key Metrics", cards: [
        { value: "45%", label: "Cost Reduction" },
        { value: "3.2M", label: "Patients Served" },
      ]},
      { type: "list", title: "Applications", items: [
        { title: "Diagnostic AI", description: "Image analysis for radiology" },
        { title: "Drug Discovery", description: "Molecule screening with ML" },
        { title: "Virtual Assistants", description: "24/7 patient support" },
      ]},
      { type: "cta", headline: "Join the Revolution", email: "ai@health.io" },
    ],
  });
  const assembleData = parseToolResult(assembleRes);
  log("S3", assembleData.success ? "PASS" : "FAIL",
    `assemble_slides: ${assembleData.slideCount} slides, htmlPath=${!!assembleData.htmlPath}`);

  if (assembleData.htmlPath && fileExists(assembleData.htmlPath)) {
    log("S3", "PASS", `HTML file exists: ${fileSize(assembleData.htmlPath)} bytes`);

    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["pdf"],
    });
    const renderData = parseToolResult(renderRes);
    log("S3", renderData.success ? "PASS" : "FAIL",
      `render: ${renderData.slideCount} slides, files: ${renderData.files?.length}`);

    const pdfFile = renderData.files?.find(f => f.endsWith(".pdf"));
    log("S3", pdfFile && fileExists(pdfFile) ? "PASS" : "FAIL",
      `PDF: ${pdfFile ? `${fileSize(pdfFile)} bytes` : "NOT FOUND"}`);
  } else {
    log("S3", "FAIL", "HTML file not created");
  }
}

async function test4_instagram_webp() {
  console.log("\n━━━ Scenario 4: Instagram Carousel + WebP Portrait ━━━");
  cleanOutput();

  const assembleRes = await callTool("assemble_slides", {
    theme: "instagram-carousel",
    slides: [
      { type: "cover", headline: "5 Productivity Tips", subtitle: "Boost Your Output" },
      { type: "content", title: "Tip 1: Time Blocking", paragraphs: ["Schedule deep work in 90-min blocks."] },
      { type: "stats", title: "Results", cards: [{ value: "3x", label: "More Focus" }] },
      { type: "list", title: "More Tips", items: [
        { title: "Eliminate distractions" },
        { title: "Use the 2-minute rule" },
      ]},
      { type: "quote", quote: "Productivity is never an accident.", attribution: "Paul J. Meyer" },
      { type: "cta", headline: "Follow for More", action: "Save This Post" },
    ],
  });
  const assembleData = parseToolResult(assembleRes);
  log("S4", assembleData.success ? "PASS" : "FAIL",
    `assemble: ${assembleData.slideCount} slides`);

  if (assembleData.htmlPath) {
    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["webp"],
    });
    const renderData = parseToolResult(renderRes);
    const webpFiles = renderData.files?.filter(f => f.endsWith(".webp")) || [];
    log("S4", webpFiles.length > 0 ? "PASS" : "FAIL",
      `WebP files: ${webpFiles.length}, sizes: ${webpFiles.map(f => fileSize(f)).join(", ")} bytes`);
  }
}

async function test5_pitch_pptx_native() {
  console.log("\n━━━ Scenario 5: Pitch Deck + PPTX Native Landscape ━━━");
  cleanOutput();

  const assembleRes = await callTool("assemble_slides", {
    theme: "pitch-deck",
    orientation: "landscape",
    slides: [
      { type: "cover", headline: "FinPay", subtitle: "The Future of Payments" },
      { type: "content", title: "The Problem", label: "PROBLEM", paragraphs: ["Payments are slow, expensive, fragmented."] },
      { type: "stats", title: "Market Size", label: "TRACTION", cards: [
        { value: "$4.2T", label: "TAM", trend: "+18% YoY" },
        { value: "2.1B", label: "Unbanked Adults" },
      ]},
      { type: "list", title: "Solution", label: "SOLUTION", items: [
        { title: "Instant settlements", description: "Sub-second blockchain transfers" },
        { title: "Zero fees", description: "No interchange, no middlemen" },
      ]},
      { type: "timeline", title: "Roadmap", items: [
        { year: "2024 Q1", description: "MVP Launch" },
        { year: "2024 Q3", description: "Series A" },
        { year: "2025", description: "1M Users" },
      ]},
      { type: "team", title: "Team", members: [
        { name: "Sarah Chen", role: "CEO", emoji: "👩‍💼" },
        { name: "Mike Patel", role: "CTO", emoji: "👨‍💻" },
      ]},
      { type: "cta", headline: "Let's Talk", email: "invest@finpay.io" },
    ],
  });
  const assembleData = parseToolResult(assembleRes);
  log("S5", assembleData.success ? "PASS" : "FAIL",
    `assemble: ${assembleData.slideCount} slides, orientation=${assembleData.orientation}`);

  if (assembleData.htmlPath) {
    const html = fs.readFileSync(assembleData.htmlPath, "utf-8");
    const hasLandscape = html.includes("1920px") || html.includes("1080px");
    log("S5", hasLandscape ? "PASS" : "FAIL", `Landscape dimensions in HTML: ${hasLandscape}`);

    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["pptx"],
      orientation: "landscape",
      pptxMode: "native",
    });
    const renderData = parseToolResult(renderRes);
    const pptxFile = renderData.files?.find(f => f.endsWith(".pptx"));
    log("S5", pptxFile && fileExists(pptxFile) ? "PASS" : "FAIL",
      `PPTX native: ${pptxFile ? `${fileSize(pptxFile)} bytes` : "NOT FOUND"}`);
  }
}

async function test6_browser_pptx_image() {
  console.log("\n━━━ Scenario 6: Browser Shell + PPTX Image Portrait ━━━");
  cleanOutput();

  const assembleRes = await callTool("assemble_slides", {
    theme: "browser-shell",
    slides: [
      { type: "cover", headline: "Senior DevOps Engineer", subtitle: "REMOTE • FULL-TIME", facts: ["$180K-$220K", "Equity included", "Unlimited PTO"] },
      { type: "stats", title: "The Role", cards: [
        { value: "5+", label: "Years Experience" },
        { value: "99.9%", label: "Uptime SLA" },
      ], tags: ["Kubernetes", "Terraform", "AWS"] },
      { type: "steps", title: "What You'll Do", items: [
        { num: 1, title: "Build CI/CD Pipelines", description: "Automate everything from commit to deploy" },
        { num: 2, title: "Scale Infrastructure", description: "Handle 10x traffic growth" },
        { num: 3, title: "Mentor Team", description: "Grow junior engineers" },
      ]},
      { type: "cta", headline: "Apply Now", email: "careers@tech.co", note: "Applications close March 31" },
    ],
  });
  const assembleData = parseToolResult(assembleRes);
  log("S6", assembleData.success ? "PASS" : "FAIL",
    `assemble: ${assembleData.slideCount} slides`);

  if (assembleData.htmlPath) {
    const html = fs.readFileSync(assembleData.htmlPath, "utf-8");
    const hasBrowser = html.includes("browser") && html.includes("brdot-r");
    log("S6", hasBrowser ? "PASS" : "FAIL", `Browser shell chrome in HTML: ${hasBrowser}`);

    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["pptx"],
      pptxMode: "image",
    });
    const renderData = parseToolResult(renderRes);
    const pptxFile = renderData.files?.find(f => f.endsWith(".pptx"));
    log("S6", pptxFile && fileExists(pptxFile) ? "PASS" : "FAIL",
      `PPTX image: ${pptxFile ? `${fileSize(pptxFile)} bytes` : "NOT FOUND"}`);
  }
}

async function test7_dark_png() {
  console.log("\n━━━ Scenario 7: Dark Modern + PNG Portrait ━━━");
  cleanOutput();

  const assembleRes = await callTool("assemble_slides", {
    theme: "dark-modern",
    slides: [
      { type: "cover", headline: "Cybersecurity 2025", subtitle: "Threats & Defenses", badges: ["AI", "Zero Trust", "Cloud"] },
      { type: "stats", title: "Attack Landscape", cards: [
        { value: "38%", label: "YoY Increase" },
        { value: "$4.5M", label: "Avg Breach Cost" },
      ], tags: ["Ransomware", "Phishing", "Supply Chain"] },
      { type: "steps", title: "Defense Framework", items: [
        { num: 1, title: "Assess", description: "Threat modeling and risk analysis" },
        { num: 2, title: "Protect", description: "Zero-trust architecture" },
        { num: 3, title: "Detect", description: "AI-powered anomaly detection" },
        { num: 4, title: "Respond", description: "Automated incident response" },
      ]},
      { type: "code", title: "Zero-Trust Config", code: "policy:\n  default: deny\n  rules:\n    - match: authenticated\n      action: verify_device" },
      { type: "cta", headline: "Secure Your Stack", action: "Get Assessment", email: "security@cyber.io" },
    ],
  });
  const assembleData = parseToolResult(assembleRes);
  log("S7", assembleData.success ? "PASS" : "FAIL",
    `assemble: ${assembleData.slideCount} slides`);

  if (assembleData.htmlPath) {
    const html = fs.readFileSync(assembleData.htmlPath, "utf-8");
    const hasDark = html.includes("#0A0A0F") && html.includes("grid-bg");
    log("S7", hasDark ? "PASS" : "FAIL", `Dark theme CSS in HTML: ${hasDark}`);

    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["png"],
    });
    const renderData = parseToolResult(renderRes);
    const pngFiles = renderData.files?.filter(f => f.endsWith(".png")) || [];
    log("S7", pngFiles.length > 0 ? "PASS" : "FAIL",
      `PNG files: ${pngFiles.length}, sizes: ${pngFiles.map(f => fileSize(f)).join(", ")} bytes`);
  }
}

async function test8_branded_all() {
  console.log("\n━━━ Scenario 8: Branded + All 4 Formats ━━━");
  cleanOutput();

  const assembleRes = await callTool("assemble_slides", {
    theme: "branded",
    slides: [
      { type: "cover", headline: "Q4 Results" },
      { type: "stats", title: "Revenue", cards: [
        { value: "$12M", label: "Revenue" },
        { value: "340K", label: "Users" },
        { value: "4.8", label: "NPS Score" },
      ]},
      { type: "list", title: "Wins", items: [
        { title: "Launched in 3 markets", tag: "Growth" },
        { title: "Reduced churn by 15%", tag: "Retention" },
      ]},
      { type: "comparison", title: "Q3 vs Q4", leftLabel: "Q3", rightLabel: "Q4",
        left: [{ label: "$8M Revenue" }, { label: "250K Users" }],
        right: [{ label: "$12M Revenue" }, { label: "340K Users" }] },
      { type: "cta", headline: "Onwards to Q1", email: "team@brand.co" },
    ],
  });
  const assembleData = parseToolResult(assembleRes);
  log("S8", assembleData.success ? "PASS" : "FAIL",
    `assemble: ${assembleData.slideCount} slides`);

  if (assembleData.htmlPath) {
    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["pdf", "pptx", "png", "webp"],
    });
    const renderData = parseToolResult(renderRes);
    const files = renderData.files || [];
    const hasPdf = files.some(f => f.endsWith(".pdf"));
    const hasPptx = files.some(f => f.endsWith(".pptx"));
    const hasPng = files.some(f => f.endsWith(".png"));
    const hasWebp = files.some(f => f.endsWith(".webp"));
    log("S8", hasPdf ? "PASS" : "FAIL", `PDF: ${hasPdf}`);
    log("S8", hasPptx ? "PASS" : "FAIL", `PPTX: ${hasPptx}`);
    log("S8", hasPng ? "PASS" : "FAIL", `PNG: ${hasPng}`);
    log("S8", hasWebp ? "PASS" : "FAIL", `WebP: ${hasWebp}`);
    log("S8", "PASS", `Total files: ${files.length}`);
  }
}

async function test9_editorial_landscape() {
  console.log("\n━━━ Scenario 9: Editorial + PDF Landscape ━━━");
  cleanOutput();

  const assembleRes = await callTool("assemble_slides", {
    theme: "editorial",
    orientation: "landscape",
    slides: [
      { type: "cover", headline: "Design Trends 2025", subtitle: "Where Aesthetics Meet Function", badges: ["Typography", "Color", "Layout"] },
      { type: "content", title: "The Return of Serif", label: "TREND 01", paragraphs: ["Serif typefaces are making a bold comeback in digital design.", "Brands seek warmth and authority that sans-serif cannot deliver."] },
      { type: "quote", quote: "Design is not just what it looks like. Design is how it works.", attribution: "Steve Jobs", label: "PERSPECTIVE" },
      { type: "stats", title: "By the Numbers", label: "DATA", cards: [
        { value: "72%", label: "Prefer Serif Headers" },
        { value: "3.4s", label: "Faster Comprehension" },
      ]},
      { type: "cta", headline: "Read the Full Report", email: "editor@designmag.com" },
    ],
  });
  const assembleData = parseToolResult(assembleRes);
  log("S9", assembleData.success ? "PASS" : "FAIL",
    `assemble: ${assembleData.slideCount} slides, orientation=${assembleData.orientation}`);

  if (assembleData.htmlPath) {
    const html = fs.readFileSync(assembleData.htmlPath, "utf-8");
    const hasEditorial = html.includes("Playfair Display") && html.includes("#C9963B");
    const hasLandscape = html.includes("1920px");
    log("S9", hasEditorial ? "PASS" : "FAIL", `Editorial theme CSS: ${hasEditorial}`);
    log("S9", hasLandscape ? "PASS" : "FAIL", `Landscape override: ${hasLandscape}`);

    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["pdf"],
      orientation: "landscape",
    });
    const renderData = parseToolResult(renderRes);
    const pdfFile = renderData.files?.find(f => f.endsWith(".pdf"));
    log("S9", pdfFile && fileExists(pdfFile) ? "PASS" : "FAIL",
      `PDF landscape: ${pdfFile ? `${fileSize(pdfFile)} bytes` : "NOT FOUND"}`);
  }
}

async function test10_infographic_webp() {
  console.log("\n━━━ Scenario 10: Infographic + WebP Portrait ━━━");
  cleanOutput();

  const assembleRes = await callTool("assemble_slides", {
    theme: "infographic",
    slides: [
      { type: "cover", headline: "Climate Change in Numbers", subtitle: "2024 Data Report", badges: ["CO2", "Sea Level", "Temperature"] },
      { type: "stats", title: "Key Indicators", label: "GLOBAL DATA", cards: [
        { value: "1.2°C", label: "Avg Temp Rise" },
        { value: "421ppm", label: "CO2 Level" },
        { value: "3.6mm", label: "Sea Level/Year" },
      ]},
      { type: "list", title: "Top Solutions", label: "ACTION ITEMS", items: [
        { title: "Renewable Energy", description: "Solar and wind now cheapest sources" },
        { title: "Carbon Capture", description: "Direct air capture scaling up" },
        { title: "Policy Changes", description: "120 countries with net-zero targets" },
      ]},
      { type: "steps", title: "Path to Net Zero", items: [
        { num: 1, title: "Electrify", description: "Transport & heating" },
        { num: 2, title: "Decarbonize", description: "Grid & industry" },
        { num: 3, title: "Remove", description: "Negative emissions" },
      ]},
      { type: "cta", headline: "Download Full Report" },
    ],
  });
  const assembleData = parseToolResult(assembleRes);
  log("S10", assembleData.success ? "PASS" : "FAIL",
    `assemble: ${assembleData.slideCount} slides`);

  if (assembleData.htmlPath) {
    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["webp"],
    });
    const renderData = parseToolResult(renderRes);
    const webpFiles = renderData.files?.filter(f => f.endsWith(".webp")) || [];
    log("S10", webpFiles.length > 0 ? "PASS" : "FAIL",
      `WebP files: ${webpFiles.length}`);
  }
}

async function test11_raw_html() {
  console.log("\n━━━ Scenario 11: Raw HTML Legacy Flow ━━━");
  cleanOutput();

  const promptRes = await callTool("get_slide_prompt", { variant: "generic" });
  const promptText = promptRes.result?.content?.[0]?.text || "";
  log("S11", promptText.length > 100 ? "PASS" : "FAIL",
    `get_slide_prompt returned ${promptText.length} chars`);
  log("S11", promptText.includes(".slide") ? "PASS" : "FAIL",
    `Contains .slide CSS: ${promptText.includes(".slide")}`);

  const testHtml = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#1a1a1a;padding:48px;display:flex;flex-direction:column;gap:40px;align-items:flex-start;}.slide{position:relative;width:540px;height:675px;padding:32px 40px;overflow:hidden;font-family:'Inter',sans-serif;flex-shrink:0;background:#FFF;}</style>
</head><body>
<div class="slide"><h1 style="font-size:38px;font-weight:700;">Raw HTML Test</h1><p style="font-size:14px;color:#555;margin-top:12px;">This is a legacy raw-HTML flow test slide.</p></div>
<div class="slide"><h1 style="font-size:38px;font-weight:700;">Slide 2</h1><p style="font-size:14px;color:#555;margin-top:12px;">Testing the get_slide_prompt backward compatibility.</p></div>
</body></html>`;

  const previewRes = await callTool("create_slides", { step: "preview", html: testHtml });
  const previewData = parseToolResult(previewRes);
  log("S11", previewData.slideCount === 2 ? "PASS" : "FAIL",
    `preview: ${previewData.slideCount} slides, htmlPath=${!!previewData.htmlPath}`);

  if (previewData.htmlPath) {
    const renderRes = await callTool("render_html_to_images", {
      htmlPath: previewData.htmlPath,
      formats: ["pdf"],
    });
    const renderData = parseToolResult(renderRes);
    log("S11", renderData.success ? "PASS" : "FAIL",
      `render: ${renderData.slideCount} slides`);
  }
}

async function test12_all_types() {
  console.log("\n━━━ Scenario 12: All 11 Slide Types (Generic) ━━━");
  cleanOutput();

  const assembleRes = await callTool("assemble_slides", {
    theme: "generic",
    slides: [
      { type: "cover", headline: "All Types Test", subtitle: "Testing every slide type" },
      { type: "content", title: "Content Slide", paragraphs: ["Paragraph one.", "Paragraph two."], label: "SECTION" },
      { type: "stats", title: "Stats", cards: [{ value: "99%", label: "Accuracy" }, { value: "5ms", label: "Latency" }] },
      { type: "list", title: "List Slide", items: [{ title: "Item A", description: "Description A" }, { title: "Item B", tag: "New" }] },
      { type: "steps", title: "Steps", items: [{ num: 1, title: "First", description: "Do this" }, { num: 2, title: "Second", description: "Then this" }] },
      { type: "comparison", title: "Compare", leftLabel: "Before", rightLabel: "After", left: [{ label: "Slow", description: "100ms" }], right: [{ label: "Fast", description: "5ms" }] },
      { type: "quote", quote: "The only way to do great work is to love what you do.", attribution: "Steve Jobs" },
      { type: "code", title: "Code Example", code: "const x = 42;\nconsole.log(x);" },
      { type: "cta", headline: "Get Started", description: "Join 10,000+ users", email: "hello@test.com", note: "Free forever" },
      { type: "timeline", title: "Our Journey", items: [{ year: "2020", description: "Founded" }, { year: "2023", description: "1M users" }] },
      { type: "team", title: "Team", members: [{ name: "Alice", role: "CEO", emoji: "👩‍💼" }, { name: "Bob", role: "CTO", emoji: "👨‍💻" }] },
    ],
  });
  const assembleData = parseToolResult(assembleRes);
  log("S12", assembleData.success && assembleData.slideCount === 11 ? "PASS" : "FAIL",
    `assemble: ${assembleData.slideCount} slides (expected 11)`);

  if (assembleData.htmlPath) {
    const html = fs.readFileSync(assembleData.htmlPath, "utf-8");
    const slideMatches = html.match(/class="slide/g) || [];
    log("S12", slideMatches.length === 11 ? "PASS" : "FAIL",
      `HTML has ${slideMatches.length} .slide divs (expected 11)`);

    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["pdf"],
    });
    const renderData = parseToolResult(renderRes);
    log("S12", renderData.success && renderData.slideCount === 11 ? "PASS" : "FAIL",
      `render: ${renderData.slideCount} slides rendered`);
  }
}

async function test13_slide_range() {
  console.log("\n━━━ Scenario 13: Partial Render (slideRange) ━━━");
  cleanOutput();

  const assembleRes = await callTool("assemble_slides", {
    theme: "generic",
    slides: [
      { type: "cover", headline: "Slide 1" },
      { type: "content", title: "Slide 2", paragraphs: ["Content"] },
      { type: "stats", title: "Slide 3", cards: [{ value: "42", label: "Answer" }] },
      { type: "list", title: "Slide 4", items: [{ title: "Item" }] },
      { type: "cta", headline: "Slide 5" },
    ],
  });
  const assembleData = parseToolResult(assembleRes);

  if (assembleData.htmlPath) {
    const renderRes = await callTool("render_html_to_images", {
      htmlPath: assembleData.htmlPath,
      formats: ["png"],
      slideRange: [1, 3],
    });
    const renderData = parseToolResult(renderRes);
    const pngFiles = renderData.files?.filter(f => f.endsWith(".png")) || [];
    log("S13", pngFiles.length === 3 ? "PASS" : "FAIL",
      `slideRange [1,3]: ${pngFiles.length} PNG files (expected 3)`);
  }
}

async function test14_iterative_editing() {
  console.log("\n━━━ Scenario 14: Iterative Editing Loop ━━━");
  cleanOutput();

  const v1 = await callTool("assemble_slides", {
    theme: "generic",
    slides: [
      { type: "cover", headline: "Original Headline" },
      { type: "cta", headline: "Original CTA" },
    ],
  });
  const v1Data = parseToolResult(v1);
  const v1Html = fs.readFileSync(v1Data.htmlPath, "utf-8");
  log("S14", v1Html.includes("Original Headline") ? "PASS" : "FAIL", "v1 has original headline");

  const v2 = await callTool("assemble_slides", {
    theme: "generic",
    slides: [
      { type: "cover", headline: "UPDATED Headline" },
      { type: "cta", headline: "UPDATED CTA" },
    ],
  });
  const v2Data = parseToolResult(v2);
  const v2Html = fs.readFileSync(v2Data.htmlPath, "utf-8");
  log("S14", v2Html.includes("UPDATED Headline") ? "PASS" : "FAIL", "v2 has updated headline");
  log("S14", !v2Html.includes("Original Headline") ? "PASS" : "FAIL", "v2 does NOT have old headline");

  if (v2Data.htmlPath) {
    const renderRes = await callTool("render_html_to_images", {
      htmlPath: v2Data.htmlPath,
      formats: ["pdf"],
    });
    const renderData = parseToolResult(renderRes);
    log("S14", renderData.success ? "PASS" : "FAIL", `Render after edit: ${renderData.success}`);
  }
}

async function test15_github_fallback() {
  console.log("\n━━━ Scenario 15: GitHub Fetch Fallback ━━━");

  const promptRes = await callTool("get_slide_prompt", { variant: "branded" });
  const promptText = promptRes.result?.content?.[0]?.text || "";
  log("S15", promptText.length > 100 ? "PASS" : "FAIL",
    `get_slide_prompt (branded) returned ${promptText.length} chars`);
  log("S15", promptText.includes("Space Mono") ? "PASS" : "FAIL",
    `Contains branded CSS (Space Mono): ${promptText.includes("Space Mono")}`);

  const prompt2 = await callTool("get_slide_prompt", { variant: "browser-shell" });
  const prompt2Text = prompt2.result?.content?.[0]?.text || "";
  log("S15", prompt2Text.includes("Bebas Neue") ? "PASS" : "FAIL",
    `browser-shell prompt has Bebas Neue: ${prompt2Text.includes("Bebas Neue")}`);
}

// ── Main ──

async function main() {
  console.log("🚀 Slideshot v3.0.0 E2E Test Suite");
  console.log("════════════════════════════════════\n");

  await startServer();
  console.log("✅ Server started (v3.0.0)\n");

  await test1_healthCheck();
  await test2_discover();
  await test3_generic_pdf();
  await test4_instagram_webp();
  await test5_pitch_pptx_native();
  await test6_browser_pptx_image();
  await test7_dark_png();
  await test8_branded_all();
  await test9_editorial_landscape();
  await test10_infographic_webp();
  await test11_raw_html();
  await test12_all_types();
  await test13_slide_range();
  await test14_iterative_editing();
  await test15_github_fallback();

  // Summary
  console.log("\n════════════════════════════════════");
  console.log("📊 SUMMARY");
  console.log("════════════════════════════════════");
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;
  const warned = results.filter(r => r.status === "WARN").length;
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`⚠️  WARNED: ${warned}`);
  console.log(`📋 TOTAL:  ${results.length}`);

  if (failed > 0) {
    console.log("\n❌ FAILURES:");
    results.filter(r => r.status === "FAIL").forEach(r => {
      console.log(`   [${r.scenario}] ${r.detail}`);
    });
  }

  // Output files summary
  console.log("\n📁 Output Files:");
  const outputFiles = listOutput();
  outputFiles.forEach(f => {
    const fp = path.join(OUTPUT_DIR, f);
    console.log(`   ${f} (${fileSize(fp)} bytes)`);
  });

  serverProcess.kill();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  if (serverProcess) serverProcess.kill();
  process.exit(1);
});
