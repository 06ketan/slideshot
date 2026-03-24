export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "slideshot",
    url: "https://slideshot.chavan.in",
    logo: "https://slideshot.chavan.in/icon.svg",
    sameAs: [
      "https://github.com/06ketan/slideshot",
      "https://www.npmjs.com/package/slideshot",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "slideshot",
    url: "https://slideshot.chavan.in",
    description:
      "Free, open-source tool that converts HTML+CSS into high-resolution PNG, WebP, and PDF carousel slides.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "slideshot",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: "https://slideshot.chavan.in",
    downloadUrl: "https://www.npmjs.com/package/slideshot",
    softwareVersion: "latest",
    description:
      "Convert HTML+CSS into high-resolution PNG, WebP, and PDF carousel slides. Use from the web editor, CLI (npx slideshot), or MCP server.",
    featureList: [
      "HTML to PNG conversion",
      "HTML to WebP conversion",
      "HTML to PDF conversion",
      "Up to 6x scale rendering",
      "AI prompt templates",
      "CLI tool (npx slideshot)",
      "MCP server for AI integration",
      "Web editor with live preview",
    ],
    screenshot: "https://slideshot.chavan.in/og-image.png",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function HowToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function HomePageSchemas() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "slideshot",
        url: "https://slideshot.chavan.in",
        logo: "https://slideshot.chavan.in/icon.svg",
        sameAs: [
          "https://github.com/06ketan/slideshot",
          "https://www.npmjs.com/package/slideshot",
        ],
      },
      {
        "@type": "WebSite",
        name: "slideshot",
        url: "https://slideshot.chavan.in",
        description:
          "Free, open-source tool that converts HTML+CSS into high-resolution PNG, WebP, and PDF carousel slides.",
      },
      {
        "@type": "SoftwareApplication",
        name: "slideshot",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        url: "https://slideshot.chavan.in",
        downloadUrl: "https://www.npmjs.com/package/slideshot",
        description:
          "Convert HTML+CSS into high-resolution PNG, WebP, and PDF carousel slides via web editor, CLI, or MCP server.",
        featureList: [
          "HTML to PNG conversion",
          "HTML to WebP conversion",
          "HTML to PDF conversion",
          "Up to 6x scale rendering",
          "8 AI prompt templates",
          "CLI tool (npx slideshot)",
          "MCP server for AI integration",
          "Web editor with live preview",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is slideshot?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Slideshot is a free, open-source tool that converts HTML+CSS into high-resolution PNG, WebP, and PDF carousel slides. It works via a web editor, CLI (npx slideshot), or MCP server for AI integration.",
            },
          },
          {
            "@type": "Question",
            name: "How do I convert HTML to slides?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Use the web editor at slideshot.chavan.in/editor to paste your HTML and export, or run 'npx slideshot ./slides.html --scale 4' in your terminal. Each element with the .slide class becomes one image.",
            },
          },
          {
            "@type": "Question",
            name: "Is slideshot free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Slideshot is 100% free and open source under the MIT license. No account required, no data stored.",
            },
          },
          {
            "@type": "Question",
            name: "What export formats does slideshot support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Slideshot exports to PNG, WebP, and PDF at up to 6x scale resolution. All formats are bundled into a single ZIP file.",
            },
          },
          {
            "@type": "Question",
            name: "Can I use slideshot with AI tools like Claude or ChatGPT?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Slideshot includes an MCP server (slideshot-mcp) that integrates with Claude Desktop, Cursor IDE, and other MCP clients. For ChatGPT, you can use Custom GPTs with the slideshot OpenAPI spec.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Convert HTML to Carousel Slides",
        description:
          "Step-by-step guide to converting HTML+CSS into high-resolution carousel slides using slideshot.",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Write or generate HTML",
            text: "Create HTML with .slide class elements, or use an AI prompt template from the gallery to generate slide HTML.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Open the editor or use the CLI",
            text: "Paste your HTML into the web editor at slideshot.chavan.in/editor, or save it as a file and run 'npx slideshot ./slides.html'.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Configure and export",
            text: "Choose your export formats (PNG, WebP, PDF), set the scale (up to 6x), and click Export or run the CLI command.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Download your slides",
            text: "Download the ZIP file containing your high-resolution carousel slides, ready for LinkedIn, Instagram, or presentations.",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://slideshot.chavan.in",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
