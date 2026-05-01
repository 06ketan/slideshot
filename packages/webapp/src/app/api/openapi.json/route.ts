const spec = {
  openapi: "3.1.0",
  info: {
    title: "slideshot API",
    description:
      "Convert HTML slides to high-res PNG, WebP, PDF, and PPTX. Use as ChatGPT Action, OpenWebUI tool, or any OpenAPI client.",
    version: "2.7.0",
    contact: {
      name: "Ketan Chavan",
      url: "https://github.com/06ketan/slideshot",
    },
    license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
  },
  servers: [{ url: "https://slideshot.chavan.in" }],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description:
          "API key for authenticating render requests. Same-origin browser requests are exempt.",
      },
    },
  },
  paths: {
    "/api/render": {
      post: {
        operationId: "renderSlides",
        summary: "Render HTML slides to PNG, WebP, PDF, and/or PPTX",
        description:
          "Accepts an HTML string containing .slide elements, screenshots each at high resolution, and returns a ZIP file with the rendered images, optional PDF, and optional PPTX. Requires x-api-key header for external callers.",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["html"],
                properties: {
                  html: {
                    type: "string",
                    description: "Full HTML string containing slide elements",
                  },
                  selector: {
                    type: "string",
                    default: ".slide",
                    description: "CSS selector for slide elements",
                  },
                  width: {
                    type: "integer",
                    default: 540,
                    description: "Slide width in CSS pixels",
                  },
                  height: {
                    type: "integer",
                    default: 675,
                    description: "Slide height in CSS pixels",
                  },
                  scale: {
                    type: "integer",
                    default: 4,
                    minimum: 1,
                    maximum: 6,
                    description: "Device scale factor (4 = 2160x2700 output)",
                  },
                  formats: {
                    type: "array",
                    items: { type: "string", enum: ["png", "webp", "pdf", "pptx"] },
                    default: ["png", "webp", "pdf"],
                    description: "Output formats to include in ZIP",
                  },
                  webpQuality: {
                    type: "integer",
                    default: 95,
                    minimum: 0,
                    maximum: 100,
                    description: "WebP compression quality",
                  },
                  slideRange: {
                    type: "array",
                    items: { type: "integer" },
                    minItems: 2,
                    maxItems: 2,
                    description: "Render slides N-M only (1-indexed), e.g. [1, 3]",
                  },
                  pptxFilename: {
                    type: "string",
                    default: "carousel.pptx",
                    description: "Custom filename for the PPTX file in the ZIP",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "ZIP file containing rendered slides",
            content: {
              "application/zip": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          "400": {
            description: "Invalid request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid API key",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
    "/api/prompt": {
      get: {
        operationId: "getSlidePrompt",
        summary: "Get AI prompt template for generating slide HTML",
        description:
          "Returns a prompt template you can give to any AI to generate HTML slides compatible with slideshot.",
        parameters: [
          {
            name: "variant",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["generic", "branded", "instagram-carousel", "infographic", "pitch-deck", "dark-modern", "editorial", "browser-shell"],
              default: "generic",
            },
            description:
              "Theme variant: 'generic' (clean minimal), 'branded' (Ketan Slides), 'instagram-carousel' (bold vibrant), 'infographic' (data-heavy), 'pitch-deck' (professional), 'dark-modern' (neon glassmorphism), 'editorial' (magazine serif), 'browser-shell' (browser window chrome)",
          },
        ],
        responses: {
          "200": {
            description: "Prompt template",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    variant: { type: "string" },
                    prompt: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  return new Response(JSON.stringify(spec, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
