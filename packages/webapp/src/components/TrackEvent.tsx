"use client";

import { track } from "@vercel/analytics";

type EventName =
  | "editor_opened"
  | "export_clicked"
  | "export_completed"
  | "export_failed"
  | "gallery_viewed"
  | "prompt_copied"
  | "cta_clicked"
  | "github_star_clicked"
  | "npm_install_copied"
  | "template_opened"
  | "faq_expanded";

type EventProperties = Record<string, string | number | boolean>;

export function trackEvent(name: EventName, properties?: EventProperties) {
  try {
    track(name, properties);
  } catch {
    // Silently fail if analytics is not available
  }
}

export function TrackClick({
  event,
  properties,
  children,
  className,
  ...props
}: {
  event: EventName;
  properties?: EventProperties;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      onClick={() => trackEvent(event, properties)}
      {...props}
    >
      {children}
    </div>
  );
}
