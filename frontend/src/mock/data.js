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
    url: 'https://ittools.nebulaost.tech',
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
    ls: ['projects/', 'tools/', 'underground/', '.secrets/'],
    'cd underground': 'Access granted. Redirecting to secure zone...',
    'curl ittools.nebulaost.tech': 'Connecting to IT Tools Suite...\n> Response: 200 OK\n> Redirecting...',
    'krbtgt roasting': 'Initializing Kerberoasting attack... Redirecting to secure terminal...',
    help: 'Available commands: whoami, pwd, ls, cd underground, krbtgt roasting, neofetch, curl ittools.nebulaost.tech, clear, exit',
    clear: '',
    exit: 'Connection terminated. Au revoir!'
  }
};