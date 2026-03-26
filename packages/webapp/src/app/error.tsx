"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[slideshot] Runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="animate-fade-in-up text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF6059] border-[3px] border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] mb-8">
            <AlertTriangle size={36} className="text-[#0A0A0A]" />
          </div>

          <h1 className="font-[var(--font-bebas-neue)] text-[10rem] sm:text-[12rem] leading-none text-[#0A0A0A] -mb-4">
            500
          </h1>

          <div className="inline-block bg-[#FF6059] border-[3px] border-[#0A0A0A] px-6 py-2 mb-6">
            <h2 className="font-[var(--font-bebas-neue)] text-3xl tracking-wide text-[#0A0A0A]">
              Something Went Wrong
            </h2>
          </div>

          <p className="text-[#444] text-base leading-relaxed mb-6 max-w-md mx-auto">
            An unexpected error occurred. You can try again or head back to the
            home page.
          </p>

          {error.message && (
            <div className="bg-[#0A0A0A] border-[3px] border-[#2A2A44] px-5 py-3 mb-10 text-left overflow-x-auto">
              <code className="text-[#FFD233] font-mono text-sm break-all">
                {error.message}
              </code>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-[#FFD233] border-[3px] border-[#0A0A0A] rounded-none shadow-[5px_5px_0px_0px_#0A0A0A] font-bold text-[#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 px-8 py-3 text-base cursor-pointer"
            >
              <RotateCcw size={18} />
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white border-[3px] border-[#0A0A0A] rounded-none shadow-[5px_5px_0px_0px_#0A0A0A] font-bold text-[#0A0A0A] hover:shadow-[8px_8px_0px_0px_#0A0A0A] hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all duration-150 px-8 py-3 text-base"
            >
              <Home size={18} />
              Go Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
