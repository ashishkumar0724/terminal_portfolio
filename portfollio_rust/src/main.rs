#![no_main]

use wasm_bindgen::prelude::*;
use web_sys::{window, HtmlInputElement, KeyboardEvent};
use std::cell::RefCell;

thread_local! {
    static HISTORY: RefCell<Vec<String>> = RefCell::new(Vec::new());
    static HISTORY_INDEX: RefCell<isize> = RefCell::new(-1);
}

#[wasm_bindgen]
pub fn init_terminal() {
    print_welcome();
}

#[wasm_bindgen(start)]
pub fn main() {
    if let Some(input) = get_input() {
        let _ = input.focus();
        
        let input_for_closure = input.clone();
        let closure = Closure::wrap(Box::new(move |event: KeyboardEvent| {
            match event.key().as_str() {
                "Enter" => handle_command(&input_for_closure),
                "ArrowUp" => {
                    event.prevent_default();
                    navigate_history(&input_for_closure, 1);
                }
                "ArrowDown" => {
                    event.prevent_default();
                    navigate_history(&input_for_closure, -1);
                }
                "Tab" => {
                    event.prevent_default();
                    autocomplete(&input_for_closure);
                }
                _ => {}
            }
        }) as Box<dyn FnMut(KeyboardEvent)>);
        
        input.add_event_listener_with_callback("keydown", closure.as_ref().unchecked_ref())
            .expect("Failed to add keydown listener");
        closure.forget();
    }
}

fn get_input() -> Option<HtmlInputElement> {
    window()
        .and_then(|w| w.document())
        .and_then(|d| d.get_element_by_id("command-input"))
        .and_then(|e| e.dyn_into::<HtmlInputElement>().ok())
}

fn get_output() -> Option<web_sys::HtmlElement> {
    window()
        .and_then(|w| w.document())
        .and_then(|d| d.get_element_by_id("output"))
        .and_then(|e| e.dyn_into::<web_sys::HtmlElement>().ok())
}

fn print_welcome() {
    print_output_colored("
<span style='color: #0ff; font-size: 1.2em'>╔══════════════════════════════════════════════════╗</span>
<span style='color: #0ff; font-size: 1.2em'>║</span>   <span style='color: #ffc600; font-weight: bold'>Terminal Portfolio - Ashish Kumar</span>      <span style='color: #0ff; font-size: 1.2em'>║</span>
<span style='color: #0ff; font-size: 1.2em'>╚══════════════════════════════════════════════════╝</span>

<span style='color: #0f0'>👋 Welcome! Type 'help' to see available commands</span>
");
}

fn handle_command(input: &HtmlInputElement) {
    let command = input.value().trim().to_string();
    
    if !command.is_empty() {
        HISTORY.with(|h| {
            let mut history = h.borrow_mut();
            history.push(command.clone());
        });
        HISTORY_INDEX.with(|idx| {
            let mut index = idx.borrow_mut();
            *index = HISTORY.with(|h| h.borrow().len()) as isize;
        });
    }
    
    print_output(&format!("<span style='color: #0f0'>ashish@portfolio:~$</span> {}", command));
    
    let response = process_command(&command);
    if !response.is_empty() {
        print_output_colored(&response);
    }
    
    input.set_value("");
    let _ = input.focus();
    scroll_to_bottom();
}

fn navigate_history(input: &HtmlInputElement, direction: isize) {
    HISTORY.with(|h| {
        let history = h.borrow();
        if history.is_empty() { return; }
        
        HISTORY_INDEX.with(|idx| {
            let mut index = idx.borrow_mut();
            *index += direction;
            
            if *index < 0 {
                *index = -1;
                input.set_value("");
            } else if (*index as usize) >= history.len() {
                *index = (history.len() - 1) as isize;
                input.set_value(&history[*index as usize]);
            } else {
                input.set_value(&history[*index as usize]);
            }
        });
    });
}

fn autocomplete(input: &HtmlInputElement) {
    let current = input.value();
    let commands = vec!["help", "whoami", "skills", "education", "projects", "contact", "neofetch", "clear", "echo", "certifications"];
    
    for cmd in commands {
        if cmd.starts_with(&current) {
            input.set_value(cmd);
            break;
        }
    }
}

fn print_output(text: &str) {
    if let Some(output) = get_output() {
        let current = output.inner_html();
        output.set_inner_html(&format!("{}<div>{}</div>", current, text));
    }
}

fn print_output_colored(html: &str) {
    if let Some(output) = get_output() {
        let current = output.inner_html();
        output.set_inner_html(&format!("{}<div>{}</div>", current, html));
    }
}

fn scroll_to_bottom() {
    if let Some(output) = get_output() {
        output.set_scroll_top(output.scroll_height());
    }
}

fn process_command(cmd: &str) -> String {
    let parts: Vec<&str> = cmd.split_whitespace().collect();
    let command = parts.first().map(|s| s.to_lowercase()).unwrap_or_default();
    
    match command.as_str() {
        "help" => get_help(),
        "whoami" => get_whoami(),
        "skills" => get_skills(),
        "education" => get_education(),
        "projects" | "ls" => get_projects(),
        "contact" => get_contact(),
        "certifications" => get_certifications(),
        "neofetch" => get_neofetch(),
        "clear" => {
            if let Some(output) = get_output() {
                output.set_inner_html("");
            }
            print_welcome();
            String::new()
        }
        "echo" => {
            if parts.len() > 1 {
                parts[1..].join(" ")
            } else {
                "<span style='color: #888'>Usage: echo [text]</span>".to_string()
            }
        }
        "cat" => {
            if parts.len() > 1 {
                match parts[1] {
                    "projects/ids" => get_project_detail("ids"),
                    "projects/ransomware" => get_project_detail("ransomware"),
                    "projects/traffic" => get_project_detail("traffic"),
                    "projects/password" => get_project_detail("password"),
                    _ => format!("<span style='color: #f44'>File not found: {}</span>\n<span style='color: #888'>Try: cat projects/ids</span>", parts[1])
                }
            } else {
                "<span style='color: #888'>Usage: cat [file]</span>".to_string()
            }
        }
        _ => format!("<span style='color: #f44'>❌ Command not found: '{}'</span>\n<span style='color: #888'>Type 'help' for available commands</span>", cmd)
    }
}

fn get_help() -> String {
    "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>              AVAILABLE COMMANDS</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #0ff'>help</span>              Show this help message
<span style='color: #0ff'>whoami</span>            About me
<span style='color: #0ff'>skills</span>            Technical skills
<span style='color: #0ff'>education</span>         Educational background
<span style='color: #0ff'>projects</span>          List projects
<span style='color: #0ff'>cat [file]</span>        View project details
<span style='color: #0ff'>certifications</span>    Certifications & courses
<span style='color: #0ff'>contact</span>           Contact information
<span style='color: #0ff'>neofetch</span>          System info
<span style='color: #0ff'>clear</span>             Clear terminal

<span style='color: #888'>Navigation:</span>
<span style='color: #0f0'>↑/↓</span>               Command history
<span style='color: #0f0'>Tab</span>               Auto-completion

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string()
}

fn get_whoami() -> String {
    "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>                    ABOUT ME</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #0ff'>👨‍ Name:</span>        Ashish Kumar
<span style='color: #0ff'>🎓 Role:</span>         Cybersecurity Enthusiast & AI/ML Student
<span style='color: #0ff'>📍 Location:</span>     Haryana, India
<span style='color: #0ff'>🎯 Education:</span>    B.Tech CSE (AI/ML), GGSIPU
<span style='color: #0ff'>📊 CGPA:</span>         8.7/10.0
<span style='color: #0ff'>🎓 Year:</span>         Third Year (Expected May 2027)

<span style='color: #888'>Third-year B.Tech student specializing in AI & ML,
currently exploring cybersecurity fundamentals with
hands-on experience in Linux, Python scripting, and
security tools like Wireshark and Kali Linux.</span>

<span style='color: #0ff'> Focus:</span>        Network Security, Threat Detection
<span style='color: #0ff'>🚀 Seeking:</span>       Cybersecurity Internship

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string()
}

fn get_skills() -> String {
    "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>                TECHNICAL SKILLS</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #f90; font-weight: bold'>🔒 Cybersecurity:</span>
   Network Security Fundamentals
   Ethical Hacking Concepts
   OWASP Top 10
   Incident Response Awareness

<span style='color: #f90; font-weight: bold'>🛠️ Security Tools:</span>
   Wireshark     Nmap
   Kali Linux    John the Ripper
   Scapy         Burp Suite (basic)

<span style='color: #f90; font-weight: bold'>💻 Programming:</span>
   Python        Bash Scripting
   SQL           Linux/Ubuntu

<span style='color: #f90; font-weight: bold'>🌐 Networking:</span>
   TCP/IP        HTTP/HTTPS
   DNS           Firewalls

<span style='color: #f90; font-weight: bold'>🤖 Machine Learning:</span>
   Scikit-learn  Pandas
   NumPy         Random Forest
   SVM

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string()
}

fn get_education() -> String {
    "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>                  EDUCATION</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #0ff; font-weight: bold'>Bachelor of Technology (B.Tech)</span>
Computer Science & Engineering with Specialization
in Artificial Intelligence & Machine Learning

🏫 <span style='color: #ccc'>Guru Gobind Singh Indraprastha University</span>
📍 New Delhi, India
📅 Expected Graduation: May 2027
📊 CGPA: 8.7/10.0

<span style='color: #f90; font-weight: bold'>Relevant Coursework:</span>
   • Computer Networks
   • Data Structures & Algorithms
   • Probability & Statistics
   • Database Management Systems
   • Cybersecurity Fundamentals

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string()
}

fn get_projects() -> String {
    "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>                  PROJECTS</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #0f0'>📁 projects/</span>
   ├── <span style='color: #0ff'>ids</span>                 - Network Intrusion Detection
   ├── <span style='color: #0ff'>ransomware</span>          - Ransomware Simulation
   ├── <span style='color: #0ff'>traffic</span>             - Network Traffic Analyzer
   └── <span style='color: #0ff'>password</span>            - Password Security Analysis

<span style='color: #888'>💡 Use 'cat projects/[name]' to view details</span>
<span style='color: #888'>   Example: cat projects/ids</span>

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string()
}

fn get_project_detail(project: &str) -> String {
    match project {
        "ids" => "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>      NETWORK INTRUSION DETECTION SYSTEM</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #888'>📅 Duration:</span> Mar 2024 - Apr 2024

<span style='color: #888'>Built a basic intrusion detection system to identify
network threats using machine learning algorithms.</span>

<span style='color: #f90; font-weight: bold'>Key Features:</span>
   • Worked with NSL-KDD dataset
   • Implemented Random Forest & SVM classifiers
   • Used Scikit-learn for ML implementation
   • Feature engineering & model evaluation
   • Identified DoS and probing attacks

<span style='color: #f90; font-weight: bold'>Tech Stack:</span>
   Python   Scikit-learn   ML

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string(),
        "ransomware" => "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>        RANSOMWARE SIMULATION (EDUCATIONAL)</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #888'>📅 Duration:</span> May 2024 - Jun 2024

<span style='color: #888'>Created a safe, non-malicious simulation to
understand how ransomware works technically.</span>

<span style='color: #f90; font-weight: bold'>Learning Outcomes:</span>
   • File encryption concepts
   • Prevention methods (backups, endpoint security)
   • Developed in isolated environments
   • Incident response procedures
   • Cybersecurity measures importance

<span style='color: #f90; font-weight: bold'>Tech Stack:</span>
   Python   Encryption   Security Research

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string(),
        "traffic" => "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>         NETWORK TRAFFIC ANALYSIS TOOL</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #888'>📅 Duration:</span> Feb 2024 - Mar 2024

<span style='color: #888'>Developed a simple packet analyzer using Python
and Scapy to capture network traffic.</span>

<span style='color: #f90; font-weight: bold'>Key Features:</span>
   • Packet capture using Scapy
   • Protocol identification
   • Network communication pattern analysis
   • Comparison with Wireshark
   • Deep understanding of packet structures

<span style='color: #f90; font-weight: bold'>Tech Stack:</span>
   Python   Scapy   Wireshark

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string(),
        "password" => "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>         PASSWORD SECURITY ANALYSIS</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #888'>📅 Duration:</span> Jan 2024 - Feb 2024

<span style='color: #888'>Experimented with John the Ripper to understand
password cracking techniques.</span>

<span style='color: #f90; font-weight: bold'>Learning Outcomes:</span>
   • Password cracking techniques
   • Strong password practices
   • Security measures (salting & hashing)
   • Authentication system vulnerabilities
   • Common password weaknesses

<span style='color: #f90; font-weight: bold'>Tech Stack:</span>
   John the Ripper   Security   Analysis

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string(),
        _ => "<span style='color: #f44'>Project not found</span>".to_string()
    }
}

fn get_certifications() -> String {
    "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>             CERTIFICATIONS & COURSES</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #0ff'>✅ Introduction to Cybersecurity</span>
   Cisco Networking Academy (2023)

<span style='color: #0ff'>✅ Introduction to Python Programming</span>
   Cisco Networking Academy (2023)

<span style='color: #0ff'>✅ Artificial Intelligence Fundamentals</span>
   IBM (2023)

<span style='color: #0ff'>🔄 Machine Learning</span>
   Colombia Plus University (In Progress)

<span style='color: #0ff'>🔄 Networking Basics</span>
   Cisco Networking Academy (In Progress)

<span style='color: #f90; font-weight: bold'>Learning Activities:</span>
   • Beginner-level CTF challenges
   • TryHackMe practical labs
   • Following cybersecurity news & research
   • Personal security projects

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string()
}

fn get_contact() -> String {
    "
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>
<span style='color: #fff; font-weight: bold'>                 CONTACT INFO</span>
<span style='color: #ffc600; font-weight: bold'>═══════════════════════════════════════════════════</span>

<span style='color: #0ff'>📧 Email:</span>      moryarudra009gmail.com
<span style='color: #0ff'>📱 Phone:</span>      [Your Phone]
<span style='color: #0af'>💼 LinkedIn:</span>  linkedin.com/in/rudramorye
<span style='color: #fff'>🐙 GitHub:</span>    github.com/ashishkumar0724
<span style='color: #ccc'>📍 Location:</span>  Haryana, India

<span style='color: #888'>Seeking cybersecurity internship opportunities
to apply theoretical knowledge and gain practical
experience in threat detection and security analysis.</span>

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string()
}

fn get_neofetch() -> String {
    "
<span style='color: #ffc600'>
    █████╗ ██╗   ██╗███████╗████████╗███████╗███╗   ███╗
   ██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔════╝████╗ ████║
   ███████║██║   ██║███████╗   ██║   █████╗  ██╔██████║
   ██╔══██║██║   ██║╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
   ██║  ██║╚██████╝███████║   ██║   ███████╗██║ ╚═╝ ██║
   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
</span>
<span style='color: #0ff'>ashish@portfolio</span>
─────────────────────────────────────────────────
<span style='color: #f90'>OS</span>           Portfolio OS 2.0
<span style='color: #f90'>Host</span>         Web Browser (Chrome/Firefox)
<span style='color: #f90'>Kernel</span>       Rust + WebAssembly
<span style='color: #f90'>Shell</span>        terminal-portfolio v2.0
<span style='color: #f90'>Theme</span>        Dark (Cobalt2-inspired)
<span style='color: #f90'>Education</span>    B.Tech CSE (AI/ML) - 3rd Year
<span style='color: #f90'>CGPA</span>         8.7/10.0
<span style='color: #f90'>Focus</span>        Cybersecurity & Network Security

<span style='color: #ffc600'>═══════════════════════════════════════════════════</span>
".to_string()
}