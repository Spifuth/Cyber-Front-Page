import {
  User,
  Clock,
  Code,
  FileText,
  Server,
  Award,
  BookOpen,
  Mail
} from 'lucide-react';

/**
 * Navigation cards configuration for the HomePage
 * Each card represents a section of the portfolio
 */
export const NAVIGATION_CARDS = [
  {
    id: 'resume',
    to: '/resume',
    icon: User,
    color: 'green',
    badge: 'CV/RESUME',
    title: 'Resume & CV',
    description: 'Professional background, education, and career summary',
    linkText: 'View Resume'
  },
  {
    id: 'timeline',
    to: '/timeline',
    icon: Clock,
    color: 'blue',
    badge: 'CAREER',
    title: 'Career Timeline',
    description: 'Professional journey, roles, and key achievements over time',
    linkText: 'View Timeline'
  },
  {
    id: 'stack',
    to: '/stack',
    icon: Code,
    color: 'purple',
    badge: 'TECHNICAL',
    title: 'Tech Stack',
    description: 'Technologies, frameworks, and tools with expertise levels',
    linkText: 'View Stack'
  },
  {
    id: 'skills',
    to: '/skills',
    icon: FileText,
    color: 'yellow',
    badge: 'SKILLS',
    title: 'Skills Matrix',
    description: 'Visual skills radar chart and competency analysis',
    linkText: 'View Skills'
  },
  {
    id: 'infra',
    to: '/infra',
    icon: Server,
    color: 'red',
    badge: 'INFRASTRUCTURE',
    title: 'Infrastructure',
    description: 'DevOps practices, cloud platforms, and system architecture',
    linkText: 'View Infra'
  },
  {
    id: 'certs',
    to: '/certs',
    icon: Award,
    color: 'indigo',
    badge: 'CREDENTIALS',
    title: 'Certifications',
    description: 'Professional certifications, badges, and achievements',
    linkText: 'View Certs'
  },
  {
    id: 'learning',
    to: '/learning',
    icon: BookOpen,
    color: 'teal',
    badge: 'LEARNING',
    title: 'Learning Path',
    description: 'Continuous learning resources, courses, and knowledge base',
    linkText: 'View Learning'
  },
  {
    id: 'contact',
    to: '/contact',
    icon: Mail,
    color: 'orange',
    badge: 'CONTACT',
    title: 'Get In Touch',
    description: 'Contact information, availability, and communication channels',
    linkText: 'Contact Me'
  },
  {
    id: 'logs',
    to: '/logs',
    icon: FileText,
    color: 'pink',
    badge: 'SYSTEM',
    title: 'System Logs',
    description: 'Development logs, system monitoring, and activity tracking',
    linkText: 'View Logs'
  }
];

/**
 * Maze control settings
 */
export const MAZE_CONFIG = {
  defaultSpeed: 50,
  minSpeed: 10,
  maxSpeed: 200,
  defaultComplexity: 50,
  minComplexity: 10,
  maxComplexity: 100,
  animationDuration: 300
};

/**
 * Terminal commands data - can be extended with backend data
 */
export const TERMINAL_COMMANDS = {
  help: `Available commands:
  
  Navigation:
    resume      - View professional resume
    timeline    - View career timeline
    stack       - View technology stack
    skills      - View skills matrix
    infra       - View infrastructure
    certs       - View certifications
    learning    - View learning resources
    contact     - View contact information
    logs        - Toggle live system logs
    projects    - View projects section
  
  System:
    help        - Show this help message
    clear       - Clear terminal history
    neofetch    - Display system information
    ls          - List directory contents
    cat <file>  - Display file contents
    cd <dir>    - Change directory
    pwd         - Print working directory
    whoami      - Display current user
    date        - Display current date/time
    uptime      - Display system uptime
  
  Fun:
    matrix      - Enter the Matrix
    hackername  - Generate hacker alias
    music       - Play synthwave radio
    mirror      - Run self-diagnostics
    vault       - Access secret vault
    decrypt     - Decrypt a file
  
  External:
    curl <url>  - Fetch URL content
  
  Hidden:
    underground - Access restricted area
    krbtgt roasting - Kerberoasting attack
    selfdestruct - Initiate self-destruct`,
  
  whoami: 'fenrir@nebulahost - Security Researcher & DevOps Engineer',
  pwd: '/home/fenrir',
  uptime: 'up 42 days, 7:13, load average: 0.42, 0.37, 0.31'
};

/**
 * Neofetch system data
 */
export const NEOFETCH_DATA = {
  os: 'Debian GNU/Linux 12 (bookworm) x86_64',
  host: 'Proxmox VE',
  kernel: '6.8.12-5-pve',
  uptime: '42 days, 7 hours, 13 mins',
  packages: '1337 (dpkg)',
  shell: 'zsh 5.9',
  terminal: 'cyber-terminal v1.0',
  cpu: 'Intel Xeon E5-2680 v4 (28) @ 3.3GHz',
  gpu: 'ASPEED Technology ASPEED Graphics Family',
  memory: '8192MiB / 65536MiB',
  disk: '256G / 2T (13%)',
  localip: '10.0.0.42',
  publicip: '*.*.*.* [REDACTED]',
  locale: 'fr_FR.UTF-8'
};
