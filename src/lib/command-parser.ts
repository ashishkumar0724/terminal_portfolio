import { portfolioData, neofetchAscii } from "./portfolio-data";

export interface CommandResult {
  output: string[];
  isError?: boolean;
  isHtml?: boolean;
  action?: "clear" | "download" | "theme";
}

// Available commands for auto-completion
export const availableCommands = [
  "help",
  "whoami",
  "ls",
  "projects",
  "skills",
  "experience",
  "education",
  "certifications",
  "contact",
  "download",
  "neofetch",
  "theme",
  "clear",
  "echo",
  "date",
  "uptime",
  "uname",
  "cat",
  "cd",
  "pwd",
  "history",
  "exit",
  "sudo",
  "rm",
  "apt",
  "npm",
  "git",
  "python",
  "node",
];

// Helper function to calculate Levenshtein distance for suggestions
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (a.charAt(j - 1) === b.charAt(i - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Find closest matching command
function findClosestCommand(input: string): string | null {
  const trimmed = input.trim().toLowerCase();
  let minDistance = Infinity;
  let closest: string | null = null;

  for (const cmd of availableCommands) {
    const distance = levenshteinDistance(trimmed, cmd);
    if (distance < minDistance && distance <= 3) {
      minDistance = distance;
      closest = cmd;
    }
  }

  return closest;
}

// Format skills with progress bar
function formatSkills(
  category: string,
  skills: { name: string; level: number }[]
): string[] {
  const lines: string[] = [];
  lines.push(`\x1b[1;36m${category}:\x1b[0m`);

  for (const skill of skills) {
    const filled = Math.floor(skill.level / 10);
    const empty = 10 - filled;
    const bar = `${"█".repeat(filled)}${"░".repeat(empty)}`;
    lines.push(
      `  ${skill.name.padEnd(20)} [${bar}] ${skill.level}%`
    );
  }

  return lines;
}

// Command handlers
const commandHandlers: Record<
  string,
  (args: string[]) => CommandResult | Promise<CommandResult>
> = {
  help: () => ({
    output: [
      "\x1b[1;32mAvailable Commands:\x1b[0m",
      "",
      "  \x1b[1;33mwhoami\x1b[0m        Display user introduction and bio",
      "  \x1b[1;33mls\x1b[0m, \x1b[1;33mprojects\x1b[0m    List all projects",
      "  \x1b[1;33mskills\x1b[0m         Display technical skills",
      "  \x1b[1;33mexperience\x1b[0m     Show work experience / education",
      "  \x1b[1;33meducation\x1b[0m      Show education details",
      "  \x1b[1;33mcertifications\x1b[0m Display certifications and courses",
      "  \x1b[1;33mcontact\x1b[0m        Display contact information",
      "  \x1b[1;33mdownload\x1b[0m       Download resume (PDF)",
      "  \x1b[1;33mneofetch\x1b[0m       Display system info with ASCII art",
      "  \x1b[1;33mtheme\x1b[0m          Toggle between dark/light themes",
      "  \x1b[1;33mhistory\x1b[0m        Show command history",
      "",
      "  \x1b[1;33mclear\x1b[0m          Clear the terminal screen",
      "  \x1b[1;33mecho\x1b[0m [text]    Print text to terminal",
      "  \x1b[1;33mdate\x1b[0m           Display current date and time",
      "  \x1b[1;33muptime\x1b[0m         Show system uptime",
      "  \x1b[1;33muname\x1b[0m          Display system information",
      "",
      "  \x1b[1;33mcat\x1b[1;33m [file]      Display file contents",
      "  \x1b[1;33mcd\x1b[0m [dir]       Change directory",
      "  \x1b[1;33mpwd\x1b[0m            Print working directory",
      "",
      "  \x1b[1;33mexit\x1b[0m           Close terminal (just kidding!)",
      "",
      "Tip: Use Tab for auto-completion, Up/Down arrows for history",
    ],
  }),

  whoami: () => ({
    output: [
      `\x1b[1;32m${portfolioData.personal.name}\x1b[0m @ ${portfolioData.personal.title}`,
      "",
      `   ${portfolioData.personal.avatar}  ${portfolioData.personal.bio}`,
      "",
      `   📍 Location: ${portfolioData.personal.location}`,
      `   🌐 GitHub:   ${portfolioData.social.github}`,
      "",
      "Type 'skills' to see my technical abilities, or 'projects' to view my work.",
    ],
  }),

  ls: () => {
    const output: string[] = [
      "\x1b[1;36mtotal 5\x1b[0m",
      "",
    ];

    for (const project of portfolioData.projects) {
      if (project.type === "dir") {
        output.push(
          `\x1b[1;34mdrwxr-xr-x  ${project.name.padEnd(20)}\x1b[0m  ${project.description}`
        );
      } else {
        output.push(
          `-rw-r--r--  ${project.name.padEnd(20)}  ${project.size || "N/A"}`
        );
      }
    }

    output.push("");
    output.push(
      "Use 'cat <project>' for details, or 'cd <project>' to explore."
    );

    return { output };
  },

  projects: () => ({
    output: [
      "\x1b[1;32m📁 Projects Portfolio\x1b[0m",
      "",
      ...portfolioData.projects
        .filter((p) => p.type === "dir")
        .map((p, i) => {
          const stars = p.stars ? `  ⭐ ${p.stars}` : "";
          return [
            `\x1b[1;33m[${i + 1}] ${p.name}\x1b[0m${stars}`,
            `    ${p.description}`,
            `    Tech: ${p.tech?.join(", ")}`,
            `    Link: ${p.link}`,
            "",
          ].join("\n");
        }),
      "Total projects: " +
        portfolioData.projects.filter((p) => p.type === "dir").length,
    ],
  }),

  skills: () => ({
    output: [
      "\x1b[1;32m🛠️ Technical Skills\x1b[0m",
      "",
      ...formatSkills("Cybersecurity", portfolioData.skills.cybersecurity),
      "",
      ...formatSkills("Security Tools", portfolioData.skills.tools),
      "",
      ...formatSkills("Programming", portfolioData.skills.programming),
      "",
      ...formatSkills("Machine Learning", portfolioData.skills.ml),
      "",
      ...formatSkills("Networking", portfolioData.skills.networking),
      "",
      ...formatSkills("Operating Systems", portfolioData.skills.os),
    ],
  }),

  experience: () => ({
    output: [
      "\x1b[1;32m💼 Education & Experience\x1b[0m",
      "",
      ...portfolioData.experience.flatMap((exp, i) => [
        `\x1b[1;36m┌─────────────────────────────────────────\x1b[0m`,
        `│ \x1b[1;33m${exp.role}\x1b[0m`,
        `│ 📍 ${exp.company}`,
        `│ 📅 ${exp.period}`,
        `│`,
        `│ ${exp.description}`,
        `│`,
        ...exp.highlights.map((h) => `│   • ${h}`),
        `\x1b[1;36m└─────────────────────────────────────────\x1b[0m`,
        "",
      ]),
    ],
  }),

  education: () => ({
    output: [
      "\x1b[1;32m🎓 Education\x1b[0m",
      "",
      ...portfolioData.education.flatMap((edu, i) => [
        `\x1b[1;36m┌─────────────────────────────────────────\x1b[0m`,
        `│ \x1b[1;33m${edu.degree}\x1b[0m`,
        `│ 📍 ${edu.institution}`,
        `│ 📅 ${edu.period}`,
        `│ 📊 CGPA: ${edu.gpa}`,
        `\x1b[1;36m└─────────────────────────────────────────\x1b[0m`,
        "",
      ]),
      "\x1b[1;33mRelevant Coursework:\x1b[0m",
      "  • Computer Networks",
      "  • Data Structures & Algorithms",
      "  • Database Management Systems",
      "  • Cybersecurity Fundamentals",
      "  • Probability & Statistics",
    ],
  }),

  certifications: () => ({
    output: [
      "\x1b[1;32m📜 Certifications & Courses\x1b[0m",
      "",
      ...portfolioData.certifications.map((cert, i) => {
        const status = cert.year === "In Progress" ? "🔄" : "✅";
        return `  ${status} \x1b[1;33m${cert.name}\x1b[0m - ${cert.issuer} (${cert.year})`;
      }),
      "",
      "\x1b[1;33mLearning Activities:\x1b[0m",
      "  🎯 Participating in beginner-level CTF challenges",
      "  🎯 Completing practical labs on TryHackMe",
      "  🎯 Following cybersecurity news and research",
      "  🎯 Working on personal security projects",
    ],
  }),

  contact: () => ({
    output: [
      "\x1b[1;32m📬 Contact Information\x1b[0m",
      "",
      `  📧 Email:    ${portfolioData.personal.email}`,
      `  💼 LinkedIn: ${portfolioData.social.linkedin}`,
      `  🐙 GitHub:   ${portfolioData.social.github}`,
      `  📍 Location: ${portfolioData.personal.location}`,
      "",
      "Feel free to reach out for collaboration or internship opportunities!",
    ],
  }),

  download: () => ({
    output: [
      "\x1b[1;32m📥 Downloading resume...\x1b[0m",
      "",
      "Resume download started. Check your downloads folder.",
      `File: resume.pdf (${portfolioData.projects.find((p) => p.name === "resume.pdf")?.size || "150KB"})`,
    ],
    action: "download",
  }),

  neofetch: () => ({
    output: [neofetchAscii],
  }),

  theme: () => ({
    output: [
      "\x1b[1;33m🎨 Toggling theme...\x1b[0m",
      "",
      "Theme switched! Enjoy the new look.",
    ],
    action: "theme",
  }),

  clear: () => ({
    output: [],
    action: "clear",
  }),

  echo: (args) => ({
    output: [args.join(" ") || ""],
  }),

  date: () => ({
    output: [
      new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
    ],
  }),

  uptime: () => {
    const years = 2; // Student for 2 years
    const days = Math.floor(Math.random() * 365);
    const hours = Math.floor(Math.random() * 24);
    const mins = Math.floor(Math.random() * 60);

    return {
      output: [
        `up ${years} years, ${days} days, ${hours}:${mins.toString().padStart(2, "0")}`,
        "",
        "That's how long I've been learning cybersecurity! 🔐",
      ],
    };
  },

  uname: (args) => {
    if (args.includes("-a")) {
      return {
        output: [
          "Interactive Terminal Portfolio 2.0.0 Next.js/16.1.1 TypeScript/5 x86_64 Browser/Modern",
        ],
      };
    }
    return {
      output: ["Interactive Terminal Portfolio"],
    };
  },

  cat: (args) => {
    if (!args.length) {
      return {
        output: ["cat: missing file operand", "Usage: cat <filename>"],
        isError: true,
      };
    }

    const filename = args[0];

    // Check for specific files
    if (filename === "README.md" || filename === "readme") {
      return {
        output: [
          "# Welcome to My Portfolio Terminal! 👋",
          "",
          "This is an interactive terminal-style portfolio.",
          "Type 'help' to see all available commands.",
          "",
          "## Quick Navigation",
          "- `whoami` - Learn about me",
          "- `skills` - Technical skills",
          "- `projects` - View my work",
          "- `certifications` - My certifications",
          "- `contact` - Get in touch",
        ],
      };
    }

    // Check if it's a project
    const project = portfolioData.projects.find(
      (p) => p.name === filename || p.name === filename.replace("/", "")
    );

    if (project) {
      return {
        output: [
          `\x1b[1;36m${project.name}\x1b[0m`,
          "─".repeat(40),
          project.description,
          "",
          project.tech ? `Technologies: ${project.tech.join(", ")}` : "",
          project.link ? `Link: ${project.link}` : "",
          project.stars ? `Stars: ⭐ ${project.stars}` : "",
        ],
      };
    }

    return {
      output: [`cat: ${filename}: No such file or directory`],
      isError: true,
    };
  },

  cd: (args) => {
    const dir = args[0] || "~";

    if (dir === "~" || dir === "/home/guest") {
      return {
        output: [`Changed to home directory: /home/${portfolioData.personal.username}`],
      };
    }

    if (dir === "..") {
      return { output: ["Already at root directory"] };
    }

    const project = portfolioData.projects.find(
      (p) => p.name === dir || p.name === dir.replace("/", "")
    );

    if (project && project.type === "dir") {
      return {
        output: [
          `Entering ${project.name}...`,
          "",
          `\x1b[1;36m${project.name}/\x1b[0m`,
          project.description,
          `Tech: ${project.tech?.join(", ")}`,
          "",
          "Type 'ls' to list files, 'cat README.md' for details.",
        ],
      };
    }

    return {
      output: [`cd: ${dir}: No such file or directory`],
      isError: true,
    };
  },

  pwd: () => ({
    output: [`/home/${portfolioData.personal.username}/portfolio`],
  }),

  history: () => ({
    output: [
      "\x1b[1;32m📜 Command History\x1b[0m",
      "",
      "Use Up/Down arrow keys to navigate through your command history.",
      "The history is stored in memory during your session.",
    ],
  }),

  exit: () => ({
    output: [
      "\x1b[1;33mThanks for visiting!\x1b[0m",
      "",
      "But this is a portfolio, not a real terminal. 😄",
      "Refresh the page to start fresh, or continue exploring!",
      "",
      "Type 'help' to see available commands.",
    ],
  }),

  // Easter eggs
  sudo: (args) => {
    if (args.length === 0) {
      return {
        output: ["sudo: usage: sudo command"],
        isError: true,
      };
    }

    return {
      output: [
        "\x1b[1;31m[sudo] password for guest: \x1b[0m",
        "",
        "Permission denied: You are already the admin! 👑",
        "This is YOUR portfolio - you have full control here.",
      ],
    };
  },

  rm: (args) => {
    if (args.includes("-rf") || args.includes("-r")) {
      return {
        output: [
          "\x1b[1;31m⚠️  DANGER ZONE ⚠️\x1b[0m",
          "",
          "Nice try! 😄 But this portfolio is immutable.",
          "All your data belongs to... you!",
          "",
          "P.S. I see you know your Linux commands! 🐧",
        ],
      };
    }

    return {
      output: [
        "rm: missing operand",
        "Usage: rm [OPTION]... FILE...",
        "",
        "(But let's be honest, you were going to try -rf, weren't you? 😉)",
      ],
    };
  },

  apt: (args) => {
    if (args[0] === "update" || args[0] === "upgrade") {
      return {
        output: [
          "\x1b[1;32mReading package lists... Done\x1b[0m",
          "Building dependency tree... Done",
          "Reading state information... Done",
          "",
          "All packages are already up to date!",
          "This portfolio is always running the latest version. 🚀",
        ],
      };
    }

    if (args[0] === "install") {
      return {
        output: [
          "E: Unable to locate package. This is a portfolio, not a repository! 😄",
          "",
          "But if you're looking to install some skills, check out 'skills' command.",
        ],
        isError: true,
      };
    }

    return {
      output: [
        "apt 2.6.1 (amd64)",
        "Usage: apt [options] command",
        "",
        "This is a simulated terminal for a portfolio.",
        "Package management is not available. 🙃",
      ],
    };
  },

  npm: (args) => {
    if (args[0] === "install" || args[0] === "i") {
      return {
        output: [
          "\x1b[1;32mnpm\x1b[0m WARN deprecated coffee@1.0.0: Coffee not found in portfolio",
          "",
          "added 1 package, and audited 2 packages in 42ms",
          "",
          "found 0 vulnerabilities",
          "",
          "Package 'skills' installed successfully! Check 'skills' command. 😄",
        ],
      };
    }

    if (args[0] === "run") {
      return {
        output: [
          "\x1b[1;32m> portfolio@2.0.0 dev\x1b[0m",
          "> next dev",
          "",
          "Portfolio is already running! You're looking at it. 🎉",
        ],
      };
    }

    return {
      output: [
        "npm v10.2.0",
        "Usage: npm <command>",
        "",
        "Popular commands: install, run, test",
        "",
        "Try 'npm install skills' for a fun surprise! 😉",
      ],
    };
  },

  git: (args) => {
    if (args[0] === "status") {
      return {
        output: [
          "On branch main",
          "Your branch is up to date with 'origin/main'.",
          "",
          "nothing to commit, working tree clean",
          "",
          "This portfolio is in perfect shape! ✨",
        ],
      };
    }

    if (args[0] === "log") {
      return {
        output: [
          "\x1b[1;33mcommit a1b2c3d4e5f6g7h8i9j0\x1b[0m (HEAD -> main, origin/main)",
          "Author: " + portfolioData.personal.name + " <" + portfolioData.personal.email + ">",
          "Date:   " + new Date().toLocaleDateString(),
          "",
          "    Initial commit: Interactive Terminal Portfolio",
          "",
          "    - Added whoami, skills, projects commands",
          "    - Implemented neofetch with ASCII art",
          "    - Added Easter eggs for curious visitors",
        ],
      };
    }

    return {
      output: [
        "git version 2.42.0",
        "Usage: git <command>",
        "",
        "Common commands: status, log, diff, branch",
        "",
        "Try 'git status' or 'git log'!",
      ],
    };
  },

  python: () => ({
    output: [
      "Python 3.11.5 (main, Sep  2 2023, 14:16:33) [GCC 11.4.0]",
      'Type "help", "copyright", "credits" or "license" for more information.',
      "",
      ">>> print('Hello, Portfolio!')",
      "Hello, Portfolio!",
      "undefined",
      ">",
      "",
      "Interactive Python coming soon... maybe! 🐍",
    ],
  }),

  node: () => ({
    output: [
      "Welcome to Node.js v20.9.0.",
      'Type ".help" for more information.',
      "",
      "> console.log('Hello from the portfolio!')",
      "Hello from the portfolio!",
      "undefined",
      ">",
      "",
      "Interactive Node.js coming soon... maybe! 🟢",
    ],
  }),
};

// Main command parser function
export function parseCommand(input: string): CommandResult | Promise<CommandResult> {
  const trimmed = input.trim();

  if (!trimmed) {
    return { output: [] };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Check if command exists
  if (commandHandlers[command]) {
    return commandHandlers[command](args);
  }

  // Try to find similar command
  const closest = findClosestCommand(command);

  if (closest) {
    return {
      output: [
        `\x1b[1;31mCommand not found: ${command}\x1b[0m`,
        "",
        `Did you mean: \x1b[1;33m${closest}\x1b[0m?`,
        "",
        "Type 'help' for a list of available commands.",
      ],
      isError: true,
    };
  }

  return {
    output: [
      `\x1b[1;31mCommand not found: ${command}\x1b[0m`,
      "",
      "Type 'help' for a list of available commands.",
    ],
    isError: true,
  };
}

// Auto-completion function
export function autoComplete(input: string): string[] {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed) {
    return availableCommands;
  }

  return availableCommands.filter((cmd) => cmd.startsWith(trimmed));
}
