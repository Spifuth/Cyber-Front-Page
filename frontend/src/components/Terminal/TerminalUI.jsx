/**
 * TerminalHeader - Window chrome with traffic lights and title
 */
export function TerminalHeader({ currentDir, currentTime }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-green-500/30 flex-shrink-0">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
        <div className="w-3 h-3 bg-green-500 rounded-full" />
      </div>
      <span
        id="terminal-window-title"
        className="text-gray-400 text-xs sm:text-sm truncate mx-2"
      >
        fenrir@nebulahost:{currentDir.replace('/home/fenrir', '~')}
      </span>
      <span className="text-blue-400 text-xs flex-shrink-0">
        {formatTime(currentTime)}
      </span>
    </div>
  );
}

/**
 * TerminalHistoryEntry - Single entry in terminal history
 */
export function TerminalHistoryEntry({ entry }) {
  const getEntryClass = () => {
    switch (entry.type) {
      case 'command':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      case 'output':
      case 'typing':
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className={getEntryClass()}>
      <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm break-words overflow-wrap-anywhere">
        {entry.content}
      </pre>
    </div>
  );
}

/**
 * TerminalHistory - Scrollable history container
 */
export function TerminalHistory({ history, terminalRef, onFocusInput }) {
  return (
    <div
      ref={terminalRef}
      className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0 scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-gray-800/50"
      onClick={onFocusInput}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      aria-label="Historique du terminal"
    >
      {history.map((entry, index) => (
        <TerminalHistoryEntry key={index} entry={entry} />
      ))}
    </div>
  );
}

/**
 * TerminalInput - Command input line with prompt
 */
export function TerminalInput({
  currentCommand,
  onChange,
  onKeyDown,
  inputRef,
  prompt,
  isTyping
}) {
  if (isTyping) return null;

  return (
    <div className="flex items-center text-blue-400 sticky bottom-0 bg-black/95 py-1">
      <span className="text-xs sm:text-sm">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={currentCommand}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="flex-1 bg-transparent text-green-400 ml-1 text-xs sm:text-sm caret-green-400 terminal-input"
        autoComplete="off"
        spellCheck="false"
        placeholder="Type 'help' for available commands..."
        aria-label="Saisissez une commande dans le terminal"
        aria-describedby="terminal-input-hint"
      />
      <span className="animate-pulse text-xs sm:text-sm">|</span>
      <span id="terminal-input-hint" className="sr-only">
        Appuyez sur Entrée pour exécuter la commande. Utilisez les flèches haut et bas pour parcourir l'historique.
      </span>
    </div>
  );
}

export default {
  TerminalHeader,
  TerminalHistory,
  TerminalHistoryEntry,
  TerminalInput
};
