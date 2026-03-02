"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTerminalStore } from "@/lib/terminal-store";
import { parseCommand, autoComplete, availableCommands } from "@/lib/command-parser";
import { cn } from "@/lib/utils";
import { portfolioData } from "@/lib/portfolio-data";

// ANSI color code parser
function parseAnsiColors(text: string): React.ReactNode {
  const ansiRegex = /\x1b\[([0-9;]+)m/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  const colorMap: Record<string, string> = {
    "30": "text-gray-800",
    "31": "text-red-500",
    "32": "text-green-500",
    "33": "text-yellow-500",
    "34": "text-blue-400",
    "35": "text-purple-500",
    "36": "text-cyan-400",
    "37": "text-white",
    "40": "bg-gray-800",
    "41": "bg-red-600",
    "42": "bg-green-600",
    "43": "bg-yellow-600",
    "44": "bg-blue-600",
    "45": "bg-purple-600",
    "46": "bg-cyan-600",
    "47": "bg-gray-200",
    "1": "font-bold",
    "0": "",
  };

  text.replace(ansiRegex, (match, codes, offset) => {
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset));
    }

    const styleClasses = codes
      .split(";")
      .map((c: string) => colorMap[c] || "")
      .filter(Boolean)
      .join(" ");

    if (styleClasses) {
      parts.push(
        <span key={key++} className={styleClasses}>
          {text.slice(offset + match.length).split("\x1b")[0]}
        </span>
      );
    }

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).replace(ansiRegex, "");
    parts.push(remaining);
  }

  return parts.length > 0 ? parts : text;
}

// Typing animation component
function TypingText({
  text,
  onComplete,
  speed = 5,
}: {
  text: string;
  onComplete?: () => void;
  speed?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <span>{parseAnsiColors(displayedText)}</span>;
}

// Output line component
function OutputLine({
  content,
  isAnimated,
  onAnimationComplete,
}: {
  content: string;
  isAnimated?: boolean;
  onAnimationComplete?: () => void;
}) {
  if (isAnimated) {
    return (
      <TypingText
        text={content}
        onComplete={onAnimationComplete}
        speed={3}
      />
    );
  }

  return <span>{parseAnsiColors(content)}</span>;
}

// Command suggestions component
function CommandSuggestions({
  suggestions,
  onSelect,
  selectedIndex,
}: {
  suggestions: string[];
  onSelect: (cmd: string) => void;
  selectedIndex: number;
}) {
  if (suggestions.length === 0 || suggestions.length === 1) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-2">
      {suggestions.slice(0, 10).map((cmd, i) => (
        <button
          key={cmd}
          onClick={() => onSelect(cmd)}
          className={cn(
            "px-2 py-0.5 rounded text-sm transition-colors",
            i === selectedIndex
              ? "bg-green-500/20 text-green-400 border border-green-500"
              : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
          )}
        >
          {cmd}
        </button>
      ))}
      {suggestions.length > 10 && (
        <span className="text-gray-500 text-sm self-center">
          +{suggestions.length - 10} more
        </span>
      )}
    </div>
  );
}

// Main terminal component
export default function Terminal() {
  const {
    lines,
    addLine,
    addLines,
    clearLines,
    addToHistory,
    navigateHistory,
    currentInput,
    setCurrentInput,
    isTyping,
    setIsTyping,
    theme,
    toggleTheme,
    username,
    hostname,
  } = useTerminalStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Focus input on click
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Handle command execution
  const executeCommand = useCallback(
    async (cmd: string) => {
      if (!cmd.trim()) return;

      // Add input line
      addLine({
        type: "input",
        content: cmd,
      });

      // Add to history
      addToHistory(cmd);

      // Parse and execute command
      const result = await parseCommand(cmd);

      // Handle special actions
      if (result.action === "clear") {
        clearLines();
        return;
      }

      if (result.action === "theme") {
        toggleTheme();
      }

      if (result.action === "download") {
        // Create download link for resume
        const link = document.createElement("a");
        link.href = portfolioData.resumeUrl;
        link.download = "resume.pdf";
        link.click();
      }

      // Add output lines
      if (result.output.length > 0) {
        const outputLines = result.output.map((line) => ({
          type: result.isError ? "error" : "output",
          content: line,
          isAnimated: false,
        })) as const;

        addLines(outputLines);
      }

      // Clear input
      setCurrentInput("");
      setSuggestions([]);
      setShowSuggestions(false);
    },
    [addLine, addLines, addToHistory, clearLines, setCurrentInput, toggleTheme]
  );

  // Handle key events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle Tab for auto-completion
      if (e.key === "Tab") {
        e.preventDefault();
        const completions = autoComplete(currentInput);

        if (completions.length === 1) {
          setCurrentInput(completions[0] + " ");
          setSuggestions([]);
          setShowSuggestions(false);
        } else if (completions.length > 1) {
          setSuggestions(completions);
          setShowSuggestions(true);
          setSuggestionIndex(0);
        }
        return;
      }

      // Handle Up arrow for history navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevCmd = navigateHistory("up");
        if (prevCmd !== null) {
          setCurrentInput(prevCmd);
        }
        return;
      }

      // Handle Down arrow for history navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextCmd = navigateHistory("down");
        if (nextCmd !== null) {
          setCurrentInput(nextCmd);
        }
        return;
      }

      // Handle suggestion navigation
      if (showSuggestions && suggestions.length > 1) {
        if (e.key === "ArrowRight" || (e.key === "Tab" && suggestions.length > 1)) {
          e.preventDefault();
          setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
          return;
        }

        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setSuggestionIndex((prev) =>
            prev <= 0 ? suggestions.length - 1 : prev - 1
          );
          return;
        }
      }

      // Handle Enter for command execution
      if (e.key === "Enter") {
        e.preventDefault();

        // If suggestion is selected via Tab, complete it
        if (showSuggestions && suggestionIndex >= 0 && suggestions[suggestionIndex]) {
          setCurrentInput(suggestions[suggestionIndex] + " ");
          setShowSuggestions(false);
          setSuggestions([]);
          setSuggestionIndex(-1);
          return;
        }

        executeCommand(currentInput);
        return;
      }

      // Handle Escape to close suggestions
      if (e.key === "Escape") {
        setShowSuggestions(false);
        setSuggestions([]);
        setSuggestionIndex(-1);
        return;
      }

      // Hide suggestions on other keys
      setShowSuggestions(false);
    },
    [
      currentInput,
      executeCommand,
      navigateHistory,
      setCurrentInput,
      showSuggestions,
      suggestions,
      suggestionIndex,
    ]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCurrentInput(value);

      // Update suggestions as user types
      if (value.trim()) {
        const completions = autoComplete(value.split(" ")[0]);
        if (completions.length > 0 && completions[0].toLowerCase().startsWith(value.split(" ")[0].toLowerCase())) {
          setSuggestions(completions);
        } else {
          setSuggestions([]);
        }
      } else {
        setSuggestions(availableCommands);
      }
    },
    [setCurrentInput]
  );

  // Handle suggestion click
  const handleSuggestionSelect = useCallback(
    (cmd: string) => {
      setCurrentInput(cmd + " ");
      setShowSuggestions(false);
      setSuggestions([]);
      setSuggestionIndex(-1);
      focusInput();
    },
    [setCurrentInput, focusInput]
  );

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col font-mono text-sm md:text-base",
        theme === "dark"
          ? "bg-[#1a1a2e] text-gray-100"
          : "bg-[#faf9f6] text-gray-900"
      )}
      onClick={focusInput}
    >
      {/* Terminal header */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 border-b",
          theme === "dark"
            ? "bg-[#16162a] border-gray-700"
            : "bg-gray-100 border-gray-300"
        )}
      >
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-colors" />
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors" />
        </div>
        <div
          className={cn(
            "flex-1 text-center text-xs md:text-sm",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}
        >
          {username}@{hostname} — Interactive Terminal Portfolio
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          className={cn(
            "p-1 rounded transition-colors",
            theme === "dark"
              ? "hover:bg-gray-700 text-gray-400"
              : "hover:bg-gray-200 text-gray-600"
          )}
          title="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-1",
          "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        )}
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {/* Output lines */}
        {lines.map((line) => (
          <div
            key={line.id}
            className={cn(
              "whitespace-pre-wrap break-words",
              line.type === "input" && "flex items-center gap-2",
              line.type === "error" && "text-red-400",
              line.type === "system" && "text-cyan-400"
            )}
          >
            {line.type === "input" ? (
              <>
                <span className="text-green-400 font-bold">
                  {username}@{hostname}
                </span>
                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>:</span>
                <span className="text-blue-400">~</span>
                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>$</span>
                <span className="ml-1">{line.content}</span>
              </>
            ) : (
              <OutputLine content={line.content} isAnimated={line.isAnimated} />
            )}
          </div>
        ))}

        {/* Command suggestions */}
        {showSuggestions && suggestions.length > 1 && (
          <CommandSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            selectedIndex={suggestionIndex}
          />
        )}

        {/* Input line */}
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-bold">
            {username}@{hostname}
          </span>
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>:</span>
          <span className="text-blue-400">~</span>
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full bg-transparent outline-none",
                "font-mono",
                theme === "dark" ? "text-gray-100" : "text-gray-900",
                "placeholder-gray-500"
              )}
              placeholder="Type a command..."
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            {/* Blinking cursor */}
            <span
              className={cn(
                "absolute pointer-events-none animate-blink",
                theme === "dark" ? "text-green-400" : "text-green-600"
              )}
              style={{
                left: `${currentInput.length}ch`,
              }}
            >
              ▋
            </span>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div
        className={cn(
          "px-4 py-2 text-xs border-t flex items-center justify-between",
          theme === "dark"
            ? "bg-[#16162a] border-gray-700 text-gray-500"
            : "bg-gray-100 border-gray-300 text-gray-500"
        )}
      >
        <span>
          Type <kbd className="px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-300">help</kbd> for available commands
        </span>
        <span className="hidden md:block">
          Tab: auto-complete | ↑↓: history | Enter: execute
        </span>
      </div>
    </div>
  );
}
