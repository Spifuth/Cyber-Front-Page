import certs from './data/certs.json';
import filesystem from './data/filesystem.json';
import infra from './data/infra.json';
import learning from './data/learning.json';
import logs from './data/logs.json';
import projects from './data/projects.json';
import skills from './data/skills.json';
import stack from './data/stack.json';
import timeline from './data/timeline.json';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const mockData = {
  profile: {
    name: 'Fenrir',
    role: 'Analyste SOC',
    description:
      "Passionné par la cybersécurité, l'autohébergement, les conteneurs et le monitoring d'infrastructure.",
    techStack: ['Debian', 'Docker', 'Traefik', 'Zabbix', 'ELK', 'Bash/Python'],
    avatar: '/assets/avatar-operator.svg'
  },
  github: {
    username: 'fenrir-soc',
    url: '#',
    avatar: '/assets/github-avatar.svg'
  },
  tools: {
    name: 'IT Tools Suite',
    url: '#',
    description: "Collection d'outils techniques auto-hébergés"
  },
  terminal: {
    neofetchData: {
      os: 'Debian 12',
      host: "Fenrir's LXC Container",
      kernel: '6.1.0-security-hardened',
      uptime: '42 days, 13 hours, 37 minutes',
      packages: '2847 (apt)',
      shell: '/bin/fenrir',
      terminal: 'classified',
      cpu: 'Hyper-intuition 9th Gen',
      gpu: 'Neural Processing Unit v3.14',
      memory: '16 Go de mauvaise foi / 32 Go de curiosité',
      disk: '∞ TB (quantum storage)',
      localip: '127.0.0.1337',
      publicip: '[REDACTED]',
      locale: 'fr_FR.cyberpunk'
    },
    terminalCommands: {
      whoami: 'fenrir',
      pwd: '/home/fenrir/portfolio',
      ls: ['projects/', 'tools/', 'underground/', '.secrets/', 'selfdestruct.exe', 'memes.gif', 'krbtgt_roasted.txt', 'secrets.txt'],
      'cd underground': 'Access granted. Redirecting to secure zone...',
      'curl ittools.nebulahost.tech': 'Connecting to IT Tools Suite...\n> Response: 200 OK\n> Redirecting...',
      'krbtgt roasting': 'Initializing Kerberoasting attack... Redirecting to secure terminal...',
      selfdestruct: 'WARNING: Initiating self-destruct sequence... Are you sure about this?',
      'cat secrets.txt': 'Sorry. This file self-destructed.',
      'cat memes.gif': "Error: Cannot display binary file. (But it's probably a rickroll)",
      'cat krbtgt_roasted.txt': "Recipe: How to burn your Domain Controller\n1. Be overconfident\n2. Skip the manual\n3. Cry\n\n-Fenrir's Cookbook",
      'nmap nebulahost.tech': 'nmap_scan',
      help: 'help_formatted',
      clear: '',
      exit: 'Connection terminated. Goodbye!'
    },
    fileSystem: {
      '/home/fenrir': ['projects/', 'tools/', 'underground/', '.secrets/', 'selfdestruct.exe', 'memes.gif', 'krbtgt_roasted.txt', 'secrets.txt'],
      '/home/fenrir/projects': ['monitoring-dashboard/', 'it-tools/', 'discord-bot/', 'traefik-config/'],
      '/home/fenrir/tools': ['burpsuite.jar', 'nmap', 'wireshark', 'hashcat'],
      '/home/fenrir/.secrets': ['passwords.txt', 'api_keys.enc', 'ssh_keys/']
    },
    motdMessages: [
      'sudo rm -rf / — regrets not included',
      'Trust logs, but verify everything.',
      'There is no patch for human curiosity.',
      'The only secure system is one that is powered off, cast in a block of concrete and sealed in a lead-lined room.',
      "Security through obscurity is no security at all.",
      'Always assume breach. Plan accordingly.',
      "If you think cryptography is the answer to your problem, then you don't know what your problem is.",
      "A backdoor is just a front door that nobody talks about.",
      'The weakest link in any security system is the human element.',
      "There are only two types of companies: those that know they've been hacked, and those that don't."
    ],
    commandHistory: [
      'ssh root@127.0.0.1',
      'curl nebulahost.tech',
      'ps aux | grep suspicious',
      'tail -f /var/log/auth.log',
      'nmap -sS -O target.com',
      'tcpdump -i eth0 port 80',
      'john --wordlist=rockyou.txt hashes.txt',
      'sqlmap -u "http://target.com/page.php?id=1"',
      'msfconsole',
      'hydra -l admin -P passwords.txt ssh://target.com'
    ]
  }
};

const collectionMap = {
  projects,
  logs,
  stack,
  timeline,
  skills,
  infra,
  filesystem,
  learning,
  certs
};

export const getMockCollection = (name) => {
  const payload = collectionMap[name];
  if (!payload) {
    throw new Error(`Mock collection "${name}" is not defined`);
  }
  return clone(payload);
};

export const getMockProfile = () => clone(mockData.profile);
export const getMockGithub = () => clone(mockData.github);
export const getMockTools = () => clone(mockData.tools);
export const getMockTerminal = () => clone(mockData.terminal);
