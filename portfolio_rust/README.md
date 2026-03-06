# <p align="center">🦀 Terminal Portfolio</p>

<p align="center">
  <img src="https://img.shields.io/badge/Rust-1.70+-DEA584?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/WebAssembly-MVP-654FF0?style=for-the-badge&logo=webassembly&logoColor=white" alt="WebAssembly" />
  <img src="https://img.shields.io/badge/wasm--bindgen-0.2-FF6F00?style=for-the-badge&logo=rust&logoColor=white" alt="wasm-bindgen" />
  <img src="https://img.shields.io/badge/Trunk-0.21-FFD700?style=for-the-badge&logo=rust&logoColor=black" alt="Trunk" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</p>

<p align="center">
  <strong>🚀 Interactive terminal-style portfolio built with Rust + WebAssembly for Ashish Kumar</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-about">About</a>
</p>

---

## 👤 About This Portfolio

This is an **interactive terminal-style portfolio** for **Ashish Kumar**, a third-year B.Tech student specializing in AI & ML with a focus on cybersecurity. Instead of a traditional website, visitors explore projects, skills, and contact information using a Bash-like command-line interface.

> 🔐 **Focus Areas**: Network Security • Intrusion Detection • Ethical Hacking • Machine Learning

---

## ✨ Features

### 🖥️ Authentic Terminal Experience
- **Realistic Bash Interface** - Dark theme with green monospace text and blinking cursor
- **Fira Code Font** - Custom typography with programming ligatures
- **ANSI-Style Colors** - Colored output for commands, errors, and highlights
- **macOS-Style Window** - Title bar with close/minimize/maximize buttons
- **Custom Scrollbar** - Styled to match terminal aesthetic

### ⌨️ Interactive CLI Features
- **Command History** - Navigate previous commands with ↑/↓ arrow keys
- **Tab Auto-Completion** - Press Tab for command suggestions
- **Error Handling** - "Did you mean...?" suggestions for typos
- **Persistent Welcome** - Welcome message reappears after `clear`
- **Responsive Input** - Works on desktop and mobile devices

### 📋 Portfolio Commands

| Command | Description |
|---------|-------------|
| `help` | List all available commands |
| `whoami` | Display Ashish's bio and background |
| `skills` | Show technical skills (Cybersecurity, ML, Programming) |
| `education` | Display B.Tech details and coursework |
| `projects` / `ls` | List cybersecurity and ML projects |
| `cat [file]` | View detailed project information |
| `certifications` | Show completed courses and certifications |
| `contact` | Display contact information and social links |
| `neofetch` | ASCII art with system/portfolio info |
| `clear` | Clear terminal (welcome message persists) |
| `echo [text]` | Repeat text (fun utility) |


### 🎨 Storytelling Landing Page
- **3D Animated Hero** - Floating elements with typographic name reveal
- **Scroll Animations** - Sections fade in as you scroll
- **Tech Stack Grid** - Interactive cards with hover effects
- **Project Previews** - Visual cards for security projects
- **Seamless Transition** - "Launch Terminal" button opens the CLI interface

---

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** (or Docker Engine + Compose)
- **Git** (to clone the repository)
- *No Rust installation needed!* 🎉

### Option 1: Run With Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/ashishkumar0724/terminal-portfolio.git
cd terminal-portfolio

# 2. Start the development server
docker compose up

#3. Open in browser
http://localhost:8080

```
### Option 2: Build Production Version
```bash
#Build optimized Wasm bundle
docker compose run --rm web trunk build --release

#2. Output is in ./dist folder
#3.  Deploy this folder to any static host (GitHub Pages, Netlify, Vercel)

```
### Option 3: Run Without Docker (Advanced)
```bash
# Requires Rust toolchain installed locally
rustup target add wasm32-unknown-unknown
cargo install trunk

# Then run
trunk serve

# Open http://localhost:8080
```
📁 Project Structure
```
terminal-portfolio/
├── 📄 Cargo.toml              # Rust dependencies & config
├── 📄 Trunk.toml              # Wasm bundler configuration
├── 📄 Dockerfile              # Rust+Wasm development container
├── 📄 docker-compose.yml      # Docker orchestration (volumes, ports)
├── 📄 .gitignore              # Exclude build artifacts
├── 📄 README.md               # This file!
│
├── 📁 src/
│   └── 📄 main.rs             # Terminal logic & command handlers
│
├── 📁 static/ (optional)
│   ├── 📄 data.json           # Portfolio content (easy to edit)
│   └── 📄 assets/             # Images, icons, etc.
│
├── 📄 index.html              # Landing page + terminal container
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 deploy.yml      # GitHub Actions for auto-deploy
│
└── 📁 dist/                   # Build output (auto-generated, gitignored)
    ├── 📄 index.html
    ├── 📄 *.wasm              # Compiled Rust binary
    └── 📄 *.js                # Wasm loader scripts

  ```
### 🎨 Customization Guide
Update Personal Information
 - Edit the get_*() functions in src/main.rs:

```bash
fn get_whoami() -> String {
    "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════</span>
<span style='color: #fff; font-weight: bold'>ABOUT ME</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════</span>

<span style='color: #0ff'>👨‍ Name:</span>        Ashish Kumar
<span style='color: #0ff'>🎓 Role:</span>         Cybersecurity Enthusiast & AI/ML Student
<span style='color: #0ff'>📍 Location:</span>     Haryana, India
<span style='color: #0ff'>🎯 Education:</span>    B.Tech CSE (AI/ML), GGSIPU
<span style='color: #0ff'>📊 CGPA:</span>         8.7/10.0

<span style='color: #888'>Your bio text here...</span>
".to_string()
}
```
### 🐳 Docker Commands Reference
```bash
# Start dev server (with hot-reload)
docker compose up

# View logs
docker compose logs -f

# Stop containers
docker compose down

# Rebuild image (after changing Dockerfile)
docker compose up --build
```
### Troubleshooting Docker
```bash
# Remove unused images/volumes
docker system prune -a

# Rebuild without cache
docker compose build --no-cache

# Check container status
docker compose ps
```