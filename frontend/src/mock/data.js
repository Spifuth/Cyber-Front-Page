export const mockData = {
  profile: {
    name: 'Fenrir',
    role: 'Analyste SOC',
    description: 'Passionné par la cybersécurité, l\'autohébergement, les conteneurs, et le monitoring d\'infrastructure.',
    techStack: ['Debian', 'Docker', 'Traefik', 'Zabbix', 'ELK', 'Bash/Python'],
    avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=150&fit=crop&crop=face'
  },

  projects: [
    {
      id: 1,
      title: 'Monitoring Dashboard maison',
      description: 'Dashboard personnalisé pour surveiller l\'infrastructure avec Zabbix et Grafana. Interface moderne avec alertes temps réel et métriques détaillées.',
      tech: ['Zabbix', 'Grafana', 'Docker', 'Python'],
      status: 'Production',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Stack IT Tools auto-hébergée',
      description: 'Collection d\'outils IT hébergés localement : convertisseurs, générateurs, validateurs. Interface unifiée et sécurisée.',
      tech: ['React', 'Node.js', 'Traefik', 'Docker'],
      status: 'Actif',
      image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Bot Discord pour gestion d\'alertes',
      description: 'Bot intelligent pour relayer et gérer les alertes de sécurité. Intégration avec les systèmes de monitoring existants.',
      tech: ['Python', 'Discord.py', 'Redis', 'PostgreSQL'],
      status: 'Développement',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Reverse proxy + sécurité Traefik',
      description: 'Configuration avancée de Traefik avec SSL automatique, rate limiting, et protection DDoS. Architecture haute disponibilité.',
      tech: ['Traefik', 'Let\'s Encrypt', 'Docker Swarm', 'Prometheus'],
      status: 'Production',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop'
    }
  ],

  github: {
    username: 'fenrir-soc',
    url: 'https://github.com/fenrir-soc',
    avatar: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=100&h=100&fit=crop&crop=face'
  },

  tools: {
    name: 'IT Tools Suite',
    url: 'https://ittools.nebulahost.tech',
    description: 'Collection d\'outils techniques auto-hébergés'
  },

  neofetchData: {
    os: 'Debian 12',
    host: 'Fenrir\'s LXC Container',
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
    'selfdestruct': 'WARNING: Initiating self-destruct sequence... Are you sure about this?',
    'cat secrets.txt': 'Sorry. This file self-destructed.',
    'cat memes.gif': 'Error: Cannot display binary file. (But it\'s probably a rickroll)',
    'cat krbtgt_roasted.txt': 'Recipe: How to burn your Domain Controller\n1. Be overconfident\n2. Skip the manual\n3. Cry\n\n- Fenrir\'s Cookbook',
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
    "Trust logs, but verify everything.",
    "There is no patch for human curiosity.",
    "The only secure system is one that is powered off, cast in a block of concrete and sealed in a lead-lined room.",
    "Security through obscurity is no security at all.",
    "Always assume breach. Plan accordingly.",
    "If you think cryptography is the answer to your problem, then you don't know what your problem is.",
    "A backdoor is just a front door that nobody talks about.",
    "The weakest link in any security system is the human element.",
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
};