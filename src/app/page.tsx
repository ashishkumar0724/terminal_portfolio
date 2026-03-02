"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamically import terminal to avoid SSR issues
const Terminal = dynamic(() => import("@/components/terminal/terminal"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#1a1a2e]">
      <div className="text-center">
        <div className="text-green-400 font-mono text-xl mb-4">
          Initializing Terminal...
        </div>
        <div className="flex gap-1 justify-center">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Terminal container */}
      <div
        className={cn(
          "flex-1 w-full h-screen",
          "terminal-font",
          "terminal-shadow"
        )}
      >
        <Terminal />
      </div>
    </main>
  );
}
