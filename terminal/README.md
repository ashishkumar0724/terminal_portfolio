
# <p align="center">💻 Terminal Portfolio</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Bun-1.0-F9F1E1?style=for-the-badge&logo=bun&logoColor=black" alt="Bun" />

  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

<p align="center">
  <strong>🚀 Interactive terminal-style portfolio built for performance, accessibility, and developer experience</strong>
</p>

## ✨ Features

### 🖥️ Authentic Terminal Simulation
- **Realistic Bash Interface** - Dark theme with blinking cursor
- **Fira Code Font** - Custom monospace typography with ligatures
- **ANSI Color Support** - Colored output for better readability
- **Custom Scrollbar** - Styled scrollbar matching terminal aesthetic

### ⌨️ Interactive Features
- **Command History** - Navigate with ↑/↓ arrow keys
- **Auto-Completion** - Tab key for command suggestions
- **Typing Animation** - Simulated typing effect for outputs
- **Theme Toggle** - Switch between dark/light modes

### 📋 Portfolio Commands

| Command | Description |
|---------|-------------|
| `whoami` | Display introduction and bio |
| `skills` | Show technical skills with progress bars |
| `projects` | List all projects |
| `experience` | Show work experience/education |
| `education` | Display education details |
| `certifications` | Show certifications and courses |
| `contact` | Display contact information |
| `download` | Download resume (PDF) |
| `neofetch` | ASCII art with system info |
| `theme` | Toggle dark/light mode |
| `help` | List all available commands |

### 🎉 Easter Eggs
- `sudo` - "Permission denied: You are already the admin!"
- `rm -rf` - Harmless joke about immutable portfolio
- `apt update` - Fun package manager responses
- `npm install` - Skill installation joke
- `git status/log` - Portfolio git history

---

## 🚀 Quick Start

### Option 1: Run Without Docker (Recommended for Development)

```bash
# Prerequisites: Node.js 18+ or Bun

# Install dependencies
bun install
# OR
npm install

# Start development server
bun run dev
# OR
npm run dev
```

Open **http://localhost:3000** in your browser.

### Option 2: Run With Docker

```bash
# Build and start development container
docker compose --profile dev up -d

# View logs
docker compose logs -f

# Stop container
docker compose down
```

Open **http://localhost:3000** in your browser.

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui (New York style) |
| **State Management** | Zustand |
| **Icons** | Lucide React |
| **Font** | Fira Code (Google Fonts) |

---

## 📁 Project Structure

```
terminal-portfolio/
├── 📄 package.json              # Dependencies and scripts
├── 📄 next.config.ts            # Next.js configuration
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 tailwind.config.ts        # Tailwind CSS configuration
├── 📄 postcss.config.mjs        # PostCSS configuration
├── 📄 components.json           # shadcn/ui configuration
│
├── 📄 Dockerfile                # Production Docker image
├── 📄 Dockerfile.dev            # Development Docker image
├── 📄 docker-compose.yml        # Production compose config
├── 📄 docker-compose.dev.yml    # Development compose config
├── 📄 .dockerignore             # Docker build exclusions
├── 📄 Makefile                  # Simplified Docker commands
│
├── 📁 public/
│   ├── resume.pdf               # Your downloadable resume
│   └── robots.txt               # SEO configuration
│
└── 📁 src/
    ├── 📁 app/
    │   ├── page.tsx             # Main page (terminal)
    │   ├── layout.tsx           # Root layout
    │   └── globals.css          # Global styles + terminal CSS
    │
    ├── 📁 components/
    │   ├── 📁 terminal/
    │   │   └── terminal.tsx     # Main terminal component
    │   └── 📁 ui/               # shadcn/ui components
    │
    ├── 📁 lib/
    │   ├── portfolio-data.ts    # Your portfolio data
    │   ├── terminal-store.ts    # Zustand state management
    │   ├── command-parser.ts    # Command logic and handlers
    │   └── utils.ts             # Utility functions
    │
    └── 📁 hooks/
        ├── use-mobile.ts        # Mobile detection hook
        └── use-toast.ts         # Toast notification hook
```

---

## 🎨 Customization

### Update Your Information

Edit `src/lib/portfolio-data.ts`:

```typescript
export const portfolioData = {
  personal: {
    name: "Your Name",
    username: "yourname",
    title: "Your Title",
    email: "your@email.com",
    location: "Your City, Country",
    bio: "Your bio here...",
    avatar: "👨‍💻",
  },
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
  },
  skills: {
    // Add your skills with proficiency levels (0-100)
    programming: [
      { name: "JavaScript", level: 90 },
      { name: "Python", level: 85 },
    ],
  },
  projects: [
    {
      name: "project-name",
      type: "dir",
      description: "Project description",
      tech: ["React", "Node.js"],
      link: "https://github.com/...",
    },
  ],
  // ... more fields
};
```

### Add Your Resume

Replace `public/resume.pdf` with your actual resume file.

### Add Custom Commands

Edit `src/lib/command-parser.ts`:

```typescript
const commandHandlers = {
  // Add your custom command
  mycommand: () => ({
    output: ["Custom output here!"],
  }),
};
```

---

## 🐳 Docker Commands

### Using Makefile (Recommended)

```bash
make build        # Build production image
make build-dev    # Build development image
make up           # Start production container
make up-dev       # Start development container (hot-reload)
make down         # Stop all containers
make logs         # View container logs
make shell        # Open shell in container
make clean        # Remove containers and images
make help         # Show all commands
```

### Using Docker Compose

```bash
# Development mode (with hot-reload)
docker compose --profile dev up -d
docker compose --profile dev logs -f
docker compose --profile dev down

# Production mode
docker compose up -d
docker compose logs -f
docker compose down

# Rebuild without cache
docker compose build --no-cache
```

---

## 📋 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `bun run dev` | Start dev server with hot-reload |
| Build | `bun run build` | Build for production |
| Start | `bun run start` | Start production server |
| Lint | `bun run lint` | Run ESLint |

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
bun i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build production image
docker compose build

# Run container
docker compose up -d
```

### Static Export (Optional)

Modify `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',
};
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Container won't start | Check logs: `docker compose logs` |
| Hot-reload not working | Ensure `WATCHPACK_POLLING=true` in .env |
| Module not found | Run `bun install` again |
| CSS not loading | Clear `.next` folder and rebuild |

---

## 📦 Dependencies

### Production Dependencies
- `next` - Next.js framework
- `react` / `react-dom` - React library
- `zustand` - State management
- `tailwind-merge` - Tailwind class merging
- `clsx` - Conditional classes
- `lucide-react` - Icons

### Development Dependencies
- `typescript` - TypeScript compiler
- `tailwindcss` - Tailwind CSS
- `eslint` - Linting
- `@types/*` - Type definitions

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Fira Code](https://github.com/tonsky/FiraCode) - Monospace Font

---

**Built with ❤️ for developers who love terminals!** 🐧
