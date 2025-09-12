# 🖥️ TERMINAL COMMANDS DOCUMENTATION

## Overview
Complete list of available terminal commands in the Cyberpunk Portfolio application, including their inputs, processing, and outputs.

---

## 📋 BASIC COMMANDS

### `help`
- **Input**: `help`
- **Processing**: Displays formatted help menu with all available commands in a clean 2-column layout
- **Output**: ASCII art table showing all commands organized by category (removed tips/new sections)
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
- **Input**: `ls`
- **Processing**: Lists only files from filesystem.json, filters out directories
- **Output**: Formatted file listing (no folders shown, keeps filesystem minimal)
- **Category**: File System

### `cd <directory>`
- **Input**: `cd [directory_name]`
- **Processing**: Gives hints for normal directories, special handling for underground
- **Output**: Hint messages for most directories
- **Special**: `cd underground` → navigates to easter egg page (hidden from help)
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

### `learning`
- **Input**: `learning`
- **Processing**: Navigates to learning resources page
- **Output**: Success message + navigation
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

---

## 🥚 EASTER EGG COMMANDS

### `cd underground`
- **Input**: `cd underground`
- **Processing**: Special directory change that navigates to underground page
- **Output**: Navigation to /underground route
- **Category**: Easter Egg
- **Note**: Hidden from help command, only accessible by knowing the command

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

## 🗑️ REMOVED COMMANDS (As Requested)

The following commands have been removed from the terminal:

### Removed for Simplification
- ❌ **`resources`** - Duplicate of `learning` command
- ❌ **`email`** - Duplicate of `contact` command
- ❌ **`radio`** - Duplicate of `music` command

---

## 📁 FILE SYSTEM BEHAVIOR

### Current Behavior
- **`ls`**: Shows only files, no directories (cleaner output)
- **`cd`**: Provides hints instead of navigation (except underground easter egg)
- **`cat`**: Works normally for file viewing

### File System Structure
The terminal uses `/app/frontend/public/data/filesystem.json` but only shows files in listings to keep the interface focused on commands rather than navigation.

---

## 📝 CURRENT COMMAND COUNT

**Total Active Commands: ~60** across 6 categories:
- **Basic Navigation**: 8 commands
- **Professional**: 10 commands  
- **Fun/Interactive**: 7 commands
- **Easter Eggs**: 3 commands
- **Network Simulation**: 2 commands
- **File System**: Integrated into basic commands

---

## 🎨 INTERFACE IMPROVEMENTS

### Help Command Enhancements
- ✅ **Clean 2-column layout**: Properly aligned commands and descriptions
- ✅ **Removed clutter**: No more tips/new sections at bottom
- ✅ **Consistent spacing**: Better visual organization
- ✅ **Hidden easter eggs**: cd underground not revealed in help

### File System Improvements  
- ✅ **Files only**: `ls` shows only files, not directories
- ✅ **Helpful hints**: `cd` provides guidance instead of navigation
- ✅ **Easter egg preserved**: `cd underground` still works for discovery

---

## 🛡️ SECURITY & VALIDATION

- Input sanitization to prevent XSS
- Command validation against updated whitelist
- Length limits on user input
- Safe rendering of terminal output
- Removed potentially confusing commands

**The terminal is now streamlined, focused, and easier to navigate while maintaining its cyberpunk charm and essential functionality.**