import { useNavigate } from 'react-router-dom';
import { Terminal as TerminalIcon, X, Palette, Eye, EyeOff } from 'lucide-react';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Terminal from '../components/Terminal';
import GitHubLink from '../components/GitHubLink';
import ToolsLink from '../components/ToolsLink';
import CyberMaze from '../components/CyberMaze';
import NavigationCard from '../components/NavigationCard';
import { useMazeControls, useTerminalModal } from '../hooks';
import { NAVIGATION_CARDS } from '../lib/constants';

/**
 * MazeControlPanel - Control buttons for the cyber maze background
 */
function MazeControlPanel({ maze }) {
  const {
    isEnabled,
    color,
    opacity,
    showColorPicker,
    colorPickerRef,
    colorOptions,
    toggle,
    selectColor,
    toggleOpacity,
    toggleColorPicker
  } = maze;

  return (
    <div className="fixed top-8 right-8 z-50 flex flex-col gap-2">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={toggle}
        className="bg-gray-900/90 border border-blue-500/50 text-blue-400 p-3 rounded-lg hover:bg-gray-800/90 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm group"
        title={`${isEnabled ? 'Disable' : 'Enable'} Cyber Maze`}
        aria-pressed={isEnabled}
        aria-label={isEnabled ? 'Désactiver le fond Cyber Maze' : 'Activer le fond Cyber Maze'}
      >
        {isEnabled ? (
          <EyeOff className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {isEnabled && (
        <>
          {/* Color Picker */}
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              onClick={toggleColorPicker}
              className="bg-gray-900/90 border border-violet-500/50 text-violet-400 p-3 rounded-lg hover:bg-gray-800/90 hover:border-violet-400 transition-all duration-300 backdrop-blur-sm group"
              title="Change Maze Color"
              aria-haspopup="menu"
              aria-expanded={showColorPicker}
              aria-controls="maze-color-menu"
              aria-label="Changer la couleur du fond Cyber Maze"
            >
              <Palette className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </button>

            {showColorPicker && (
              <ColorPickerMenu
                colorOptions={colorOptions}
                currentColor={color}
                onSelectColor={selectColor}
              />
            )}
          </div>

          {/* Opacity Toggle */}
          <button
            type="button"
            onClick={toggleOpacity}
            className="bg-gray-900/90 border border-green-500/50 text-green-400 p-2 rounded-lg hover:bg-gray-800/90 hover:border-green-400 transition-all duration-300 backdrop-blur-sm group text-xs font-mono"
            title="Toggle Opacity"
            aria-label="Basculer l'opacité du fond Cyber Maze"
          >
            {Math.round(opacity * 100)}%
          </button>
        </>
      )}
    </div>
  );
}

/**
 * ColorPickerMenu - Dropdown menu for selecting maze colors
 */
function ColorPickerMenu({ colorOptions, currentColor, onSelectColor }) {
  return (
    <div
      id="maze-color-menu"
      role="menu"
      className="absolute right-0 top-full mt-2 bg-gray-900/95 border border-violet-500/30 rounded-lg p-3 backdrop-blur-sm min-w-[200px] shadow-lg animate-fade-in"
    >
      <div className="text-violet-400 text-xs font-mono mb-3 text-center">
        Select Maze Color
      </div>
      <div className="space-y-2">
        {colorOptions.map((option) => (
          <button
            key={option.name}
            type="button"
            role="menuitemradio"
            aria-checked={currentColor === option.name}
            aria-label={option.label}
            onClick={() => onSelectColor(option.name)}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 hover:bg-gray-800/50 ${
              currentColor === option.name
                ? 'bg-gray-700/50 border border-violet-400/30'
                : 'border border-transparent'
            }`}
          >
            <div
              className="w-4 h-4 rounded-full border border-gray-600"
              style={{ backgroundColor: option.color }}
            />
            <span className="text-gray-300 text-sm font-mono flex-1 text-left">
              {option.label}
            </span>
            {currentColor === option.name && (
              <div className="w-2 h-2 bg-violet-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * BackgroundEffects - Animated background elements
 */
function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-violet-900/20" />
      <div className="absolute inset-0 bg-pattern-grid opacity-20" />
      {/* Scanlines effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse" />
    </div>
  );
}

/**
 * ProfessionalPortfolio - Grid of navigation cards
 */
function ProfessionalPortfolio() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Professional Portfolio
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Explore my expertise, experience, and professional achievements
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NAVIGATION_CARDS.map((card) => (
            <NavigationCard
              key={card.id}
              to={card.to}
              icon={card.icon}
              color={card.color}
              badge={card.badge}
              title={card.title}
              description={card.description}
              linkText={card.linkText}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * TerminalButton - Floating action button to toggle terminal
 */
function TerminalButton({ isOpen, onClick, buttonRef }) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        type="button"
        ref={buttonRef}
        onClick={onClick}
        className="bg-gray-900/90 border border-green-500/50 text-green-400 p-4 rounded-lg hover:bg-gray-800/90 hover:border-green-400 transition-all duration-300 backdrop-blur-sm group"
        aria-pressed={isOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="cyber-terminal-modal"
        aria-label={isOpen ? 'Fermer le terminal interactif' : 'Ouvrir le terminal interactif'}
      >
        {isOpen ? (
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <TerminalIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
}

/**
 * TerminalModal - Modal container for the interactive terminal
 */
function TerminalModal({ isOpen, dialogRef, onNavigate }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    onNavigate();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-2 sm:p-4"
      role="presentation"
    >
      <div
        id="cyber-terminal-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terminal-window-title"
        className="w-full h-full sm:h-[85vh] md:h-[90vh] lg:h-[85vh] xl:max-w-6xl xl:h-[80vh] bg-gray-900 border border-green-500/50 rounded-lg overflow-hidden flex flex-col"
        tabIndex={-1}
      >
        <Terminal
          onNavigateToUnderground={() => handleNavigate('/underground')}
          onNavigateToKrbtgt={() => handleNavigate('/krbtgt')}
          onNavigateToSelfDestruct={() => handleNavigate('/selfdestruct')}
        />
      </div>
    </div>
  );
}

/**
 * SocialLinks - GitHub and Tools links section
 */
function SocialLinks() {
  return (
    <div className="flex justify-center items-center gap-8 py-16">
      <GitHubLink />
      <ToolsLink />
    </div>
  );
}

/**
 * HomePage - Main landing page component
 * 
 * Features:
 * - Animated cyber maze background with customizable colors
 * - Professional portfolio navigation cards
 * - Interactive terminal modal
 * - Hero, About, and Projects sections
 */
export default function HomePage() {
  const maze = useMazeControls();
  const terminal = useTerminalModal();

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Background Layer */}
      <CyberMaze
        key={`${maze.isEnabled}-${maze.color}-${maze.opacity}`}
        isEnabled={maze.isEnabled}
        color={maze.color}
        opacity={maze.opacity}
      />
      <BackgroundEffects />

      {/* Controls */}
      <MazeControlPanel maze={maze} />

      {/* Main Content */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <ProfessionalPortfolio />
        <SocialLinks />

        {/* Terminal */}
        <TerminalButton
          isOpen={terminal.isOpen}
          onClick={terminal.toggle}
          buttonRef={terminal.buttonRef}
        />
        <TerminalModal
          isOpen={terminal.isOpen}
          dialogRef={terminal.dialogRef}
          onNavigate={terminal.close}
        />
      </div>
    </div>
  );
}
