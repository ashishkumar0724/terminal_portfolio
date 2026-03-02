import { create } from "zustand";

export interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "system";
  content: string;
  timestamp: number;
  isAnimated?: boolean;
}

interface TerminalState {
  lines: TerminalLine[];
  commandHistory: string[];
  historyIndex: number;
  currentInput: string;
  isTyping: boolean;
  theme: "dark" | "light";
  username: string;
  hostname: string;

  // Actions
  addLine: (line: Omit<TerminalLine, "id" | "timestamp">) => void;
  addLines: (newLines: Omit<TerminalLine, "id" | "timestamp">[]) => void;
  clearLines: () => void;
  addToHistory: (command: string) => void;
  navigateHistory: (direction: "up" | "down") => string | null;
  setCurrentInput: (input: string) => void;
  setIsTyping: (typing: boolean) => void;
  toggleTheme: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  lines: [
    {
      id: crypto.randomUUID(),
      type: "system",
      content:
        "Welcome to the Interactive Terminal Portfolio! Type 'help' to see available commands.",
      timestamp: Date.now(),
    },
  ],
  commandHistory: [],
  historyIndex: -1,
  currentInput: "",
  isTyping: false,
  theme: "dark",
  username: "guest",
  hostname: "portfolio",

  addLine: (line) => {
    set((state) => ({
      lines: [
        ...state.lines,
        {
          ...line,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    }));
  },

  addLines: (newLines) => {
    set((state) => ({
      lines: [
        ...state.lines,
        ...newLines.map((line) => ({
          ...line,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        })),
      ],
    }));
  },

  clearLines: () => {
    set({
      lines: [
        {
          id: crypto.randomUUID(),
          type: "system",
          content: "Screen cleared. Type 'help' for available commands.",
          timestamp: Date.now(),
        },
      ],
    });
  },

  addToHistory: (command) => {
    if (command.trim() && command !== get().commandHistory[0]) {
      set((state) => ({
        commandHistory: [command, ...state.commandHistory].slice(0, 100), // Keep last 100 commands
        historyIndex: -1,
      }));
    }
  },

  navigateHistory: (direction) => {
    const { commandHistory, historyIndex } = get();

    if (commandHistory.length === 0) return null;

    let newIndex = historyIndex;

    if (direction === "up") {
      newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
    } else {
      newIndex = Math.max(historyIndex - 1, -1);
    }

    set({ historyIndex: newIndex });

    if (newIndex === -1) {
      return "";
    }

    return commandHistory[newIndex];
  },

  setCurrentInput: (input) => set({ currentInput: input }),
  setIsTyping: (typing) => set({ isTyping: typing }),

  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    }));
  },
}));
