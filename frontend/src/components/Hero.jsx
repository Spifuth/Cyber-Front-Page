import { useState, useEffect } from 'react';

export default function Hero() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Bienvenue sur NebulaHost';
  const subtitle = 'Nœud principal opérationnel... Connexion sécurisée établie.';
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Typewriter effect for main title
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        // Start subtitle animation
        setTimeout(() => {
          let subtitleIndex = 0;
          const subtitleInterval = setInterval(() => {
            if (subtitleIndex <= subtitle.length) {
              setDisplayedSubtitle(subtitle.slice(0, subtitleIndex));
              subtitleIndex++;
            } else {
              clearInterval(subtitleInterval);
            }
          }, 50);
        }, 500);
      }
    }, 100);

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="text-center max-w-4xl">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-mono font-bold mb-4 text-green-400 relative">
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              {displayedText}
            </span>
            {showCursor && displayedText.length < fullText.length && (
              <span className="text-green-400 animate-pulse">|</span>
            )}
          </h1>
          
          <div className="font-mono text-lg md:text-xl text-gray-400 h-8">
            <span>{displayedSubtitle}</span>
            {showCursor && displayedSubtitle.length >= subtitle.length && (
              <span className="text-green-400 animate-pulse">_</span>
            )}
          </div>
        </div>

        {/* ASCII Art or Terminal-style decoration */}
        <div className="mt-12 font-mono text-green-500/60 text-sm hidden md:block">
          <pre className="animate-pulse">
{`
    ╔══════════════════════════════════════╗
    ║             SYSTEM STATUS             ║
    ╠══════════════════════════════════════╣
    ║ Security Level: ████████████ MAXIMUM ║
    ║ Firewall:       ████████████ ACTIVE  ║
    ║ Intrusion Det:  ████████████ ONLINE  ║
    ║ Access Level:   ████████████ ROOT    ║
    ╚══════════════════════════════════════╝
`}
          </pre>
        </div>

        {/* Glitch effect overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}