# 🖥️ TERMINAL COMMANDS DOCUMENTATION

## Overview
Complete list of available terminal commands in the Cyberpunk Portfolio application, including their inputs, processing, and outputs.

---

## 📋 BASIC COMMANDS

### `help`
- **Input**: `help`
- **Processing**: Displays formatted help menu with all available commands in a 2-column layout
- **Output**: ASCII art table showing all commands organized by category
- **Category**: Basic Navigation

### `whoami` 
- **Input**: `whoami`
- **Processing**: Returns current user identity from mock data
- **Output**: `fenrir` (hardcoded username)
- **Category**: Basic Navigation

### `pwd`
- **Input**: `pwd` 
- **Processing**: Returns current directory path
- **Output**: Current directory string (e.g., `/home/fenrir`)
- **Category**: Basic Navigation

### `ls`
- **Input**: `ls` or `ls [directory]`
- **Processing**: Lists files/directories from filesystem.json, supports directory navigation
- **Output**: Formatted directory listing with file details
- **Category**: File System

### `cd <directory>`
- **Input**: `cd [directory_name]`
- **Processing**: Changes current directory, validates against filesystem.json
- **Output**: Success message or error if directory doesn't exist
- **Special**: `cd underground` → navigates to easter egg page
- **Category**: File System

### `cat <file>`
- **Input**: `cat [filename]`
- **Processing**: Displays file contents from filesystem.json
- **Output**: File contents or error message if file not found
- **Category**: File System

### `clear`
- **Input**: `clear`
- **Processing**: Clears terminal history array
- **Output**: Empty terminal
- **Category**: Basic Navigation

### `exit`
- **Input**: `exit`
- **Processing**: No action (placeholder)
- **Output**: "Use the X button to close terminal"
- **Category**: Basic Navigation

---

## 🧑‍💼 PROFESSIONAL COMMANDS

### `neofetch`
- **Input**: `neofetch`
- **Processing**: Displays system information in neofetch style from mock data
- **Output**: ASCII art + system specs, skills, location, etc.
- **Category**: Professional

### `resume`
- **Input**: `resume` 
- **Processing**: Navigates to resume page
- **Output**: Success message + navigation
- **Category**: Professional

### `timeline` 
- **Input**: `timeline`
- **Processing**: Navigates to timeline/career page
- **Output**: Success message + navigation
- **Category**: Professional

### `stack`
- **Input**: `stack`
- **Processing**: Navigates to tech stack page
- **Output**: Success message + navigation  
- **Category**: Professional

### `skills`
- **Input**: `skills`
- **Processing**: Navigates to skills radar chart page
- **Output**: Navigation with loading message
- **Category**: Professional

### `infra`
- **Input**: `infra`
- **Processing**: Navigates to infrastructure page
- **Output**: Success message + navigation
- **Category**: Professional

### `certs`
- **Input**: `certs`
- **Processing**: Navigates to certifications page
- **Output**: Success message + navigation
- **Category**: Professional

### `contact`
- **Input**: `contact`
- **Processing**: Navigates to contact information page
- **Output**: Success message + navigation
- **Category**: Professional

### `email` 
- **Input**: `email`
- **Processing**: Same as contact command
- **Output**: Contact page navigation
- **Category**: Professional

### `learning`
- **Input**: `learning`
- **Processing**: Navigates to learning resources page
- **Output**: Success message + navigation
- **Category**: Professional

### `resources`
- **Input**: `resources`
- **Processing**: Same as learning command
- **Output**: Learning page navigation
- **Category**: Professional

### `projects`
- **Input**: `projects`
- **Processing**: Scrolls to projects section on homepage
- **Output**: Confirmation message about scrolling to projects section
- **Category**: Professional

---

## 🎮 FUN & INTERACTIVE COMMANDS

### `matrix`
- **Input**: `matrix`
- **Processing**: Activates Matrix-style character rain effect
- **Output**: Animated Japanese characters falling in terminal
- **Category**: Fun/Visual

### `banner <text>`
- **Input**: `banner [any_text]`
- **Processing**: Converts input text to ASCII art banner
- **Output**: Large ASCII art representation of the text
- **Category**: Fun/Visual

### `logs`
- **Input**: `logs`
- **Processing**: Toggles AnimatedLogsFeed component visibility
- **Output**: Shows/hides floating logs panel with live system monitoring
- **Category**: Fun/Visual

### `hackername`
- **Input**: `hackername`
- **Processing**: Generates random hacker alias from predefined lists
- **Output**: Creative hacker name like "CyberPhantom" or "NeonReaper"
- **Category**: Fun

### `music`
- **Input**: `music`
- **Processing**: Displays synthwave radio player interface
- **Output**: ASCII art radio with synthwave station info
- **Category**: Fun

### `radio`
- **Input**: `radio`
- **Processing**: Same as music command
- **Output**: Synthwave radio interface
- **Category**: Fun

### `mirror`
- **Input**: `mirror`
- **Processing**: Displays system analysis with attitude/personality
- **Output**: Sassy system analysis with security warnings
- **Category**: Fun

### `vault`
- **Input**: `vault`
- **Processing**: Shows encrypted vault interface
- **Output**: Encrypted file listing with access instructions
- **Category**: Fun/Security Theme

### `decrypt <file>`
- **Input**: `decrypt [filename]`
- **Processing**: Simulates file decryption process
- **Output**: Fake decryption progress + "decrypted" content
- **Category**: Fun/Security Theme

### `theme <name>`
- **Input**: `theme [theme_name]`
- **Processing**: Changes terminal color theme, validates against available themes
- **Output**: Theme change confirmation or error for invalid themes
- **Available Themes**: default, matrix, neon, cyber, retro
- **Category**: Customization

### `sudo <command>`
- **Input**: `sudo [any_command]`
- **Processing**: Simulates elevated privileges with fake authentication
- **Output**: Fake authentication + executes underlying command with "elevated" styling
- **Category**: Fun/Security Theme

---

## 🥚 EASTER EGG COMMANDS

### `cd underground`
- **Input**: `cd underground`
- **Processing**: Special directory change that navigates to underground page
- **Output**: Navigation to /underground route
- **Category**: Easter Egg

### `krbtgt roasting`
- **Input**: `krbtgt roasting`
- **Processing**: Simulates Kerberos attack, navigates to krbtgt page
- **Output**: Navigation to /krbtgt route with attack simulation
- **Category**: Easter Egg

### `selfdestruct`
- **Input**: `selfdestruct`
- **Processing**: Triggers system meltdown simulation, navigates to selfdestruct page
- **Output**: Navigation to /selfdestruct route
- **Category**: Easter Egg

---

## 🔍 NETWORK SIMULATION COMMANDS

### `nmap <target>`
- **Input**: `nmap [target_address]`
- **Processing**: Simulates network scan with fake results
- **Output**: Fake nmap scan results with open ports and services
- **Category**: Network/Security Simulation

### `curl <url>`
- **Input**: `curl [url]`
- **Processing**: Simulates HTTP request
- **Output**: Fake HTTP response or error message
- **Category**: Network/Security Simulation

---

## 📁 FILE SYSTEM STRUCTURE

The terminal uses `/app/frontend/public/data/filesystem.json` to simulate a file system:
- Supports directory navigation
- File listing with `ls`
- File reading with `cat`
- Directory structure maintained in JSON format

## 🎨 THEME SYSTEM

The terminal supports multiple color themes:
- **default**: Standard green-on-black
- **matrix**: Matrix movie style
- **neon**: Bright neon colors
- **cyber**: Cyberpunk aesthetic
- **retro**: Vintage computer style

## 🛡️ SECURITY FEATURES

- Input sanitization to prevent XSS
- Command validation against allowed list
- Length limits on user input
- Safe rendering of terminal output

---

## 📝 NOTES FOR REMOVAL

**Commands that could be removed if simplifying:**

1. **Low Usage/Redundant**:
   - `resources` (duplicate of `learning`)
   - `email` (duplicate of `contact`)
   - `radio` (duplicate of `music`)
   - `pwd` (basic utility, rarely used)

2. **Complex/Maintenance Heavy**:
   - `vault` + `decrypt` (complex simulation)
   - `nmap` + `curl` (network simulation)
   - `sudo` (wrapper complexity)

3. **Easter Eggs** (if wanting to be more professional):
   - `hackername`
   - `mirror`
   - Matrix animation in `matrix`

**Essential Commands to Keep**:
- Navigation: `help`, `whoami`, `ls`, `cd`, `clear`
- Professional: `neofetch`, `resume`, `timeline`, `stack`, `skills`, `projects`, `certs`, `contact`
- Interactive: `logs`, `banner`, `theme`
- Easter Eggs: `cd underground`, `krbtgt roasting`, `selfdestruct`