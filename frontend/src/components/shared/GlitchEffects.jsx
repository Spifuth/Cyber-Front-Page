import { useMemo } from 'react';

/**
 * Scanlines - Animated horizontal scan lines overlay
 * 
 * @param {Object} props
 * @param {number} [props.count=20] - Number of scanlines
 * @param {string} [props.color='bg-green-500/20'] - Tailwind color class
 * @param {boolean} [props.intense=false] - More prominent effect
 */
export function Scanlines({ count = 20, color = 'bg-green-500/20', intense = false }) {
  const lines = useMemo(() => Array(count).fill(null), [count]);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {lines.map((_, i) => (
        <div
          key={i}
          className={`absolute w-full h-px ${color} ${intense ? 'animate-pulse' : ''}`}
          style={{
            top: `${(i / count) * 100}%`,
            animation: `scanline ${intense ? '1s' : '2s'} linear infinite ${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

/**
 * GlitchOverlay - Full screen glitch effect overlay
 * 
 * @param {Object} props
 * @param {boolean} [props.active=false] - Whether effect is active
 * @param {string} [props.pattern] - Pattern to display (default: static)
 * @param {string} [props.color='text-red-500'] - Text color
 */
export function GlitchOverlay({ active = false, pattern, color = 'text-red-500' }) {
  const staticPattern = useMemo(() => pattern || Array(100).fill('█▓▒░').join(''), [pattern]);
  
  if (!active) return null;
  
  return (
    <div className={`absolute inset-0 ${color} text-xs leading-none overflow-hidden animate-pulse opacity-20 pointer-events-none`}>
      {Array(30).fill(staticPattern).join('')}
    </div>
  );
}

/**
 * CyberBackground - Gradient background with optional effects
 * 
 * @param {Object} props
 * @param {string} [props.variant='default'] - Background variant
 * @param {boolean} [props.showScanlines=true] - Show scanlines
 * @param {boolean} [props.glitching=false] - Enable glitch mode
 */
export function CyberBackground({ 
  variant = 'default', 
  showScanlines = true, 
  glitching = false,
  children 
}) {
  const gradients = {
    default: 'from-gray-900 via-black to-gray-900',
    danger: 'from-red-900/20 via-black to-orange-900/20',
    underground: 'from-red-900/20 via-black to-green-900/20',
    success: 'from-green-900/20 via-black to-blue-900/20'
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant] || gradients.default}`} />
      {showScanlines && <Scanlines color={glitching ? 'bg-red-500/50' : 'bg-green-500/20'} intense={glitching} />}
      {glitching && <GlitchOverlay active />}
      {children}
    </div>
  );
}

/**
 * TerminalWindow - Styled terminal container
 * 
 * @param {Object} props
 * @param {string} props.prompt - Terminal prompt text
 * @param {string} props.command - Command being executed
 * @param {boolean} [props.shaking=false] - Apply shake animation
 * @param {string} [props.borderColor='border-green-500/30'] - Border color
 * @param {React.ReactNode} props.children - Terminal content
 */
export function TerminalWindow({ 
  prompt = 'user@terminal:~$',
  command,
  shaking = false,
  borderColor = 'border-green-500/30',
  statusIndicator = 'normal', // 'normal', 'warning', 'danger'
  children 
}) {
  const statusColors = {
    normal: ['bg-green-500', 'bg-yellow-500', 'bg-red-500'],
    warning: ['bg-yellow-500 animate-pulse', 'bg-yellow-500', 'bg-red-500'],
    danger: ['bg-red-500 animate-pulse', 'bg-red-500 animate-pulse', 'bg-red-500 animate-pulse']
  };
  
  const dots = statusColors[statusIndicator] || statusColors.normal;

  return (
    <div className={`max-w-5xl mx-auto ${shaking ? 'animate-shake' : ''}`}>
      <div className={`bg-gray-900/95 border ${borderColor} rounded-lg overflow-hidden backdrop-blur-sm`}>
        {/* Terminal Header */}
        <div className={`bg-gray-800 px-4 py-2 border-b ${borderColor} flex items-center justify-between`}>
          <span className="font-mono text-green-400">{prompt}</span>
          <div className="flex items-center space-x-2">
            {dots.map((color, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${color}`} />
            ))}
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 min-h-[400px] font-mono text-sm">
          {command && (
            <div className="mb-4 text-blue-400">
              <span className="text-green-400">{prompt.split(':')[0]}</span>
              <span className="text-white">:</span>
              <span className="text-blue-500">{prompt.split(':')[1]?.replace('$', '')}</span>
              <span className="text-white">$ </span>
              <span className="text-yellow-400">{command}</span>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * AnimatedLine - Single animated terminal line
 * 
 * @param {Object} props
 * @param {string} props.text - Line text
 * @param {string} [props.type='info'] - Line type (info, warning, error, critical, blank)
 * @param {boolean} [props.showCursor=false] - Show blinking cursor
 * @param {React.ReactNode} [props.icon] - Optional icon
 */
export function AnimatedLine({ text, type = 'info', showCursor = false, icon }) {
  const colors = {
    info: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    critical: 'text-red-500 animate-pulse font-bold',
    fatal: 'text-red-500 animate-pulse font-bold',
    blank: 'text-transparent'
  };

  return (
    <div className={`mb-2 ${colors[type] || colors.info} animate-fade-in flex items-center`}>
      {icon}
      <span className="opacity-90">{text}</span>
      {showCursor && type !== 'blank' && (
        <span className="animate-pulse ml-1">_</span>
      )}
    </div>
  );
}

/**
 * BackButton - Styled back navigation button
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {string} [props.text='exit'] - Button text
 * @param {React.ReactNode} [props.icon] - Icon component
 */
export function BackButton({ onClick, text = 'exit', icon }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 text-green-400 hover:text-red-400 transition-colors duration-300 group"
    >
      {icon || (
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      )}
      <span className="font-mono">{text}</span>
    </button>
  );
}

/**
 * StatusBadge - Connection/system status indicator
 * 
 * @param {Object} props
 * @param {boolean} props.connected - Connection state
 * @param {string} [props.connectedText='SECURE_CONNECTION'] - Text when connected
 * @param {string} [props.disconnectedText='CONNECTING...'] - Text when disconnected
 */
export function StatusBadge({ connected, connectedText = 'SECURE_CONNECTION', disconnectedText = 'CONNECTING...' }) {
  return (
    <div className={`flex items-center space-x-2 ${connected ? 'text-green-400' : 'text-red-400'}`}>
      <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`} />
      <span className="font-mono text-sm">{connected ? connectedText : disconnectedText}</span>
    </div>
  );
}

/**
 * GlitchTitle - Animated glitching title text
 * 
 * @param {Object} props
 * @param {string} props.text - Title text
 * @param {string} [props.className] - Additional classes
 */
export function GlitchTitle({ text, className = '' }) {
  return (
    <h1 className={`text-6xl md:text-8xl font-mono font-bold mb-4 text-red-400 relative ${className}`}>
      <span className="bg-gradient-to-r from-red-400 via-green-400 to-red-400 bg-clip-text text-transparent">
        {text}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-green-500/20 blur-3xl -z-10" />
    </h1>
  );
}

// Export all CSS animations that pages might need
export const glitchStyles = `
  @keyframes scanline {
    0% { transform: translateY(0); opacity: 0.5; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  
  @keyframes glitch {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-2px); }
    40% { transform: translateX(2px); }
    60% { transform: translateX(-1px); }
    80% { transform: translateX(1px); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }
  
  .animate-shake {
    animation: shake 0.3s ease-in-out infinite;
  }
`;
