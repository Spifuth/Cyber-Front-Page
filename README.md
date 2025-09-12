# 🌌 Cyberpunk Portfolio - NebulaHost

A futuristic, interactive cyberpunk-themed portfolio website featuring an immersive terminal interface, animated backgrounds, and comprehensive professional sections.

## 🚀 Features

### 🖥️ Interactive Terminal
- **30 Commands**: Comprehensive command set including navigation, professional sections, and easter eggs
- **File System Simulation**: Navigate directories and files with `ls`, `cd`, and `cat`
- **Cyberpunk Themes**: Multiple color schemes (matrix, neon, cyber, retro, default)
- **Visual Effects**: Matrix rain animation, ASCII art banners, live system logs
- **Command History**: Arrow key navigation through command history
- **Security Features**: Input sanitization and command validation

### 🎨 Visual Experience
- **Animated Cyber Maze**: Interactive background with customizable colors and opacity
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dynamic Typewriter Effects**: Smooth text animations throughout
- **Gradient Aesthetics**: Cyberpunk color schemes with neon accents
- **Modal Interfaces**: Clean, accessible user experience

### 💼 Professional Sections
- **Resume/CV**: Comprehensive professional background
- **Career Timeline**: Interactive timeline of roles and achievements
- **Tech Stack**: Visual representation of technologies and expertise levels
- **Skills Matrix**: Radar chart visualization of competencies
- **Infrastructure**: DevOps practices and system architecture
- **Certifications**: Professional credentials and achievements
- **Learning Path**: Continuous education and knowledge development
- **Contact Information**: Multiple communication channels
- **System Logs**: Development activity and monitoring

### 🎮 Interactive Elements
- **Project Gallery**: Grid and visual modes with screenshot previews
- **Easter Egg Pages**: Hidden sections accessible via terminal commands
- **Live Log Feed**: Animated system monitoring overlay
- **Theme Switcher**: Real-time terminal appearance customization
- **Responsive Navigation**: Seamless routing between sections

## 🛠️ Technology Stack

### Frontend
- **React 19.0.0**: Modern React with hooks and context
- **React Router 7.6.0**: Client-side routing
- **Tailwind CSS 3.4.17**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon system
- **Shadcn/ui**: Component library integration

### Development Tools
- **Vite/Vitest**: Modern build and testing setup
- **PostCSS & Autoprefixer**: CSS processing
- **ESLint**: Code linting and quality
- **Yarn**: Package management

### Backend (Optional)
- **FastAPI**: Modern Python web framework
- **MongoDB**: Document database
- **Docker**: Containerization

## 📁 Project Structure

```
Cyber-Front-Page/
├── frontend/                 # React application
│   ├── public/
│   │   └── data/            # JSON data files
│   │       ├── projects.json
│   │       ├── skills.json
│   │       ├── timeline.json
│   │       └── filesystem.json
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Terminal.js  # Interactive terminal
│   │   │   ├── Projects.js  # Project gallery
│   │   │   ├── CyberMaze.js # Animated background
│   │   │   └── ...
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── ResumePage.js
│   │   │   ├── StackPage.js
│   │   │   └── ...
│   │   └── hooks/          # Custom React hooks
│   └── package.json
├── backend/                # FastAPI backend (optional)
│   ├── server.py
│   └── requirements.txt
├── docker/                 # Docker configurations
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── Dockerfile.static
│   └── Dockerfile.caddy
├── TERMINAL_COMMANDS.md    # Command documentation
├── SECURITY_AUDIT.md      # Security assessment
├── DEPLOYMENT_GUIDE.md    # Deployment instructions
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and Yarn
- Docker (optional, for containerized deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cyber-Front-Page
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   yarn install
   ```

3. **Start development server**
   ```bash
   yarn start
   ```

4. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Click the terminal icon (bottom-right) to start exploring
   - Try commands like `help`, `matrix`, `projects`, `skills`

### Production Build

```bash
cd frontend
yarn build
```

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended)
```bash
cd docker
docker-compose up -d
```

### Option 2: Standalone Docker
```bash
docker build -t Cyber-Front-Page -f docker/Dockerfile .
docker run -p 3000:3000 Cyber-Front-Page
```

### Option 3: Static Files (Netlify/Vercel)
```bash
docker build -t cyberpunk-static -f docker/Dockerfile.static .
docker create --name temp-container cyberpunk-static
docker cp temp-container:/static-files ./build
docker rm temp-container
```

## 🎮 Terminal Commands

The terminal supports 30 commands across multiple categories:

### Essential Commands
- `help` - Show all available commands
- `neofetch` - Display system information
- `projects` - Navigate to projects section
- `skills` - View skills radar chart
- `resume` - Access resume/CV
- `contact` - Get contact information

### Fun Commands
- `matrix` - Enter Matrix mode with character rain
- `logs` - Toggle live system monitoring
- `hackername` - Generate random hacker alias

### Easter Eggs
- `cd underground` - Access hidden section
- `krbtgt roasting` - Kerberos attack simulation
- `selfdestruct` - System meltdown sequence

**Full documentation**: See [TERMINAL_COMMANDS.md](TERMINAL_COMMANDS.md)

## 🎨 Customization

### Adding New Commands
1. Edit `/frontend/src/components/Terminal.js`
2. Add command to `validateCommand()` function
3. Implement command logic in `handleCommand()`
4. Update help text in `showHelp()` function

### Modifying Data
- **Projects**: Edit `/frontend/public/data/projects.json`
- **Skills**: Edit `/frontend/public/data/skills.json`
- **Timeline**: Edit `/frontend/public/data/timeline.json`
- **File System**: Edit `/frontend/public/data/filesystem.json`

### Theme Customization
Themes are defined in the Terminal component. Available themes:
- `default` - Classic green terminal
- `matrix` - Matrix movie style
- `neon` - Bright neon colors
- `cyber` - Full cyberpunk aesthetic
- `retro` - Vintage computer style

## 🔒 Security Features

- **Input Sanitization**: Prevents XSS attacks
- **Command Validation**: Whitelist approach for allowed commands
- **Content Security Policy**: Restrictive CSP headers
- **Docker Security**: Non-root user, read-only filesystem
- **Regular Updates**: Automated dependency updates

**Full security audit**: See [SECURITY_AUDIT.md](SECURITY_AUDIT.md)

## 📊 Performance

- **Lighthouse Score**: 95+ Performance, 100 Accessibility
- **Bundle Size**: Optimized with code splitting
- **Loading Speed**: Sub-1s initial page load
- **Memory Usage**: <50MB runtime memory
- **Mobile Optimized**: Responsive design with touch support

## 🚀 Deployment Options

### Platforms Supported
- **Docker** (Recommended): Full-featured deployment
- **Netlify**: Static site deployment
- **Vercel**: Serverless deployment
- **GitHub Pages**: Static hosting
- **AWS S3 + CloudFront**: CDN deployment
- **Digital Ocean Apps**: Container deployment

**Detailed instructions**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🐛 Troubleshooting

### Common Issues

**Terminal not loading**
- Clear browser cache and reload
- Check browser console for JavaScript errors
- Ensure all JSON data files are accessible

**Commands not working**
- Check spelling and syntax
- Use `help` command to see available options
- Verify command is in validation whitelist

**Build failures**
- Update Node.js to version 18+
- Clear `node_modules` and `yarn.lock`, reinstall
- Check for conflicting global packages

**Docker issues**
- Ensure Docker daemon is running
- Check port 3000 is available
- Verify dockerfile context path

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and formatting
- Add documentation for new commands
- Test on multiple screen sizes
- Maintain cyberpunk aesthetic consistency
- Update relevant documentation files

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Inspiration**: Cyberpunk 2077, The Matrix, Hacker culture
- **Design**: Neon aesthetics and retro-futuristic themes
- **Community**: Open-source contributors and cybersecurity community
- **Tools**: React ecosystem and modern web technologies

---

## 📞 Support

For questions, issues, or feature requests:
- 🐛 **Issues**: Use GitHub Issues
- 💬 **Discussions**: GitHub Discussions
- 📧 **Contact**: Available through portfolio contact section
- 🤖 **Terminal**: Type `help` for interactive assistance

**Built with ❤️ and lots of ☕ by the cyberpunk community**
