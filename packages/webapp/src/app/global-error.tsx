"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[slideshot] Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#FFFDF5",
          color: "#0A0A0A",
          fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              background: "#FF6059",
              border: "3px solid #0A0A0A",
              boxShadow: "5px 5px 0px 0px #0A0A0A",
              marginBottom: 32,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0A0A0A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: '"Impact", sans-serif',
              fontSize: "8rem",
              lineHeight: 1,
              margin: "0 0 -0.25rem",
              letterSpacing: "0.02em",
            }}
          >
            500
          </h1>

          <div
            style={{
              display: "inline-block",
              background: "#FF6059",
              border: "3px solid #0A0A0A",
              padding: "0.5rem 1.5rem",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontFamily: '"Impact", sans-serif',
                fontSize: "1.75rem",
                margin: 0,
                letterSpacing: "0.04em",
              }}
            >
              CRITICAL ERROR
            </h2>
          </div>

          <p
            style={{
              color: "#444",
              fontSize: "1rem",
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            The application encountered a critical error. Please try refreshing
            or return to the home page.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#FFD233",
                border: "3px solid #0A0A0A",
                boxShadow: "5px 5px 0px 0px #0A0A0A",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#0A0A0A",
                padding: "0.75rem 2rem",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 150ms",
              }}
            >
              Try Again
            </button>

            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                border: "3px solid #0A0A0A",
                boxShadow: "5px 5px 0px 0px #0A0A0A",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#0A0A0A",
                padding: "0.75rem 2rem",
                textDecoration: "none",
                fontFamily: "inherit",
                transition: "all 150ms",
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
