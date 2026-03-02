/**
 * Portfolio Data for Ashish Kumar
 * Interactive Terminal Portfolio
 */

export const portfolioData = {
  // Personal Information
  personal: {
    name: "Ashish Kumar",
    username: "ashish",
    title: "B.Tech Student | AI/ML & Cybersecurity Enthusiast",
    email: "ashish.kumar@email.com",
    location: "Haryana, India",
    website: "https://github.com/ashishkumar0724",
    bio: `Third-year B.Tech student in Computer Science with specialization in AI & ML, 
currently exploring cybersecurity fundamentals. Passionate about network security, 
ethical hacking, and building security tools. Actively participating in CTF challenges 
and completing practical labs on TryHackMe to build hands-on skills.`,
    avatar: "🔐",
  },

  // Social Links
  social: {
    github: "https://github.com/ashishkumar0724",
    linkedin: "https://linkedin.com/in/rudramorye",
    twitter: "https://twitter.com/ashishkumar",
  },

  // Technical Skills
  skills: {
    cybersecurity: [
      { name: "Network Security", level: 75 },
      { name: "Ethical Hacking", level: 70 },
      { name: "OWASP Top 10", level: 65 },
      { name: "Incident Response", level: 60 },
    ],
    tools: [
      { name: "Wireshark", level: 80 },
      { name: "Nmap", level: 75 },
      { name: "Kali Linux", level: 80 },
      { name: "Burp Suite", level: 60 },
      { name: "John the Ripper", level: 70 },
      { name: "Scapy", level: 75 },
    ],
    programming: [
      { name: "Python", level: 85 },
      { name: "Bash Scripting", level: 75 },
      { name: "SQL", level: 70 },
    ],
    ml: [
      { name: "Scikit-learn", level: 75 },
      { name: "Pandas", level: 80 },
      { name: "NumPy", level: 80 },
    ],
    networking: [
      { name: "TCP/IP", level: 75 },
      { name: "HTTP/HTTPS", level: 70 },
      { name: "DNS", level: 70 },
      { name: "Firewalls", level: 65 },
    ],
    os: [
      { name: "Linux (Ubuntu/Kali)", level: 85 },
      { name: "Windows", level: 75 },
    ],
  },

  // Work Experience (Currently a student)
  experience: [
    {
      company: "Guru Gobind Singh Indraprastha University",
      role: "B.Tech Student - AI/ML Specialization",
      period: "2023 - 2027 (Expected)",
      description: "Pursuing Computer Science & Engineering with specialization in AI & ML",
      highlights: [
        "Current CGPA: 8.7/10.0",
        "Relevant coursework: Computer Networks, DSA, DBMS, Cybersecurity Fundamentals",
        "Actively participating in CTF challenges and security labs",
      ],
    },
  ],

  // Projects
  projects: [
    {
      name: "ids-ml",
      type: "dir",
      description: "Network Intrusion Detection System using Machine Learning - Identifies network threats using Random Forest and SVM classifiers",
      tech: ["Python", "Scikit-learn", "NSL-KDD"],
      link: "https://github.com/ashishkumar0724/ids-ml",
      stars: 0,
    },
    {
      name: "ransomware-sim",
      type: "dir",
      description: "Educational ransomware simulation for understanding encryption concepts and prevention methods",
      tech: ["Python", "Cryptography"],
      link: "https://github.com/ashishkumar0724/ransomware-sim",
      stars: 0,
    },
    {
      name: "packet-analyzer",
      type: "dir",
      description: "Network traffic analysis tool using Python and Scapy to capture and analyze packets",
      tech: ["Python", "Scapy", "Wireshark"],
      link: "https://github.com/ashishkumar0724/packet-analyzer",
      stars: 0,
    },
    {
      name: "password-security",
      type: "dir",
      description: "Password security analysis tool - Understanding cracking techniques and security measures",
      tech: ["Python", "John the Ripper"],
      link: "https://github.com/ashishkumar0724/password-security",
      stars: 0,
    },
    {
      name: "resume.pdf",
      type: "file",
      description: "Downloadable resume in PDF format",
      size: "150KB",
    },
  ],

  // Education
  education: [
    {
      institution: "Guru Gobind Singh Indraprastha University (GGSIPU)",
      degree: "B.Tech CSE (AI/ML Specialization)",
      period: "2023 - 2027",
      gpa: "8.7/10.0",
    },
  ],

  // Certifications
  certifications: [
    {
      name: "Introduction to Cybersecurity",
      issuer: "Cisco Networking Academy",
      year: "2023",
    },
    {
      name: "Introduction to Python Programming",
      issuer: "Cisco Networking Academy",
      year: "2023",
    },
    {
      name: "Artificial Intelligence Fundamentals",
      issuer: "IBM",
      year: "2023",
    },
    {
      name: "Machine Learning",
      issuer: "Columbia University",
      year: "In Progress",
    },
    {
      name: "Networking Basics",
      issuer: "Cisco Networking Academy",
      year: "In Progress",
    },
  ],

  // System Info for neofetch
  systemInfo: {
    os: "Kali Linux 2024.1 x86_64",
    kernel: "6.5.0-kali3-amd64",
    shell: "bash 5.2.15",
    resolution: "1920x1080",
    theme: "Catppuccin Mocha",
    icons: "Papirus-Dark",
    terminal: "kitty 0.31.0",
    cpu: "Intel Core i5-10400 (12) @ 4.3GHz",
    gpu: "NVIDIA GTX 1650",
    memory: "16GB DDR4 3200MHz",
  },

  // Resume download URL
  resumeUrl: "/resume.pdf",
};

// ASCII Art for neofetch command
export const neofetchAscii = `
   ██████████████████  ████████         ${portfolioData.personal.username}@portfolio
 ████████████████████████  ████████     ─────────────────────────
████████████████████████  █████████    \x1b[34mOS:\x1b[0m ${portfolioData.systemInfo.os}
███████████████████████   █████████    \x1b[34mHost:\x1b[0m Interactive Terminal Portfolio
████████████████████████  █████████    \x1b[34mKernel:\x1b[0m ${portfolioData.systemInfo.kernel}
█████████████████████████  ████████    \x1b[34mUptime:\x1b[0m ${portfolioData.education[0].period}
██████████████████████████  ███████    \x1b[34mShell:\x1b[0m ${portfolioData.systemInfo.shell}
███████████████████████████  ██████    \x1b[34mResolution:\x1b[0m ${portfolioData.systemInfo.resolution}
████████████████████████████          \x1b[34mTheme:\x1b[0m ${portfolioData.systemInfo.theme}
██████████████████████████████        \x1b[34mIcons:\x1b[0m ${portfolioData.systemInfo.icons}
███████████████████████████████       \x1b[34mTerminal:\x1b[0m ${portfolioData.systemInfo.terminal}
 ███████████████████████████████      \x1b[34mCPU:\x1b[0m ${portfolioData.systemInfo.cpu}
   ████████████████████████████       \x1b[34mGPU:\x1b[0m ${portfolioData.systemInfo.gpu}
                                    \x1b[34mMemory:\x1b[0m ${portfolioData.systemInfo.memory}

\x1b[40m   \x1b[41m   \x1b[42m   \x1b[43m   \x1b[44m   \x1b[45m   \x1b[46m   \x1b[47m   \x1b[0m
`;
