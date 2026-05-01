export interface CoverSlide {
  type: "cover";
  headline: string;
  subtitle?: string;
  badges?: string[];
  facts?: string[];
}

export interface ContentSlide {
  type: "content";
  title: string;
  paragraphs: string[];
  label?: string;
}

export interface StatsSlide {
  type: "stats";
  title?: string;
  label?: string;
  cards: Array<{
    value: string;
    label: string;
    sub?: string;
    trend?: string;
  }>;
  tags?: string[];
}

export interface ListSlide {
  type: "list";
  title: string;
  label?: string;
  items: Array<{
    title: string;
    description?: string;
    tag?: string;
  }>;
}

export interface StepsSlide {
  type: "steps";
  title: string;
  label?: string;
  items: Array<{
    num: number;
    title: string;
    description: string;
  }>;
}

export interface ComparisonSlide {
  type: "comparison";
  title?: string;
  leftLabel: string;
  rightLabel: string;
  left: Array<{ label: string; description?: string }>;
  right: Array<{ label: string; description?: string }>;
}

export interface QuoteSlide {
  type: "quote";
  quote: string;
  attribution?: string;
  label?: string;
}

export interface CodeSlide {
  type: "code";
  title: string;
  code: string;
  language?: string;
}

export interface CtaSlide {
  type: "cta";
  headline: string;
  description?: string;
  action?: string;
  email?: string;
  note?: string;
}

export interface TimelineSlide {
  type: "timeline";
  title: string;
  items: Array<{
    year: string;
    description: string;
  }>;
}

export interface TeamSlide {
  type: "team";
  title: string;
  members: Array<{
    name: string;
    role: string;
    emoji?: string;
  }>;
}

export type SlideData =
  | CoverSlide
  | ContentSlide
  | StatsSlide
  | ListSlide
  | StepsSlide
  | ComparisonSlide
  | QuoteSlide
  | CodeSlide
  | CtaSlide
  | TimelineSlide
  | TeamSlide;

export type SlideType = SlideData["type"];

export interface AssembleInput {
  theme: string;
  slides: SlideData[];
  orientation?: "portrait" | "landscape";
  brandName?: string;
}
