import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Flame, Zap, Skull, AlertTriangle, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSequentialLines, useSafeTimers } from '../hooks';
import {
  PageLayout,
  CyberBackground,
  TerminalWindow,
  AnimatedLine,
  BackButton
} from '../components/shared';

/**
 * Detect browser and return roast message
 */
const detectBrowser = () => {
  const ua = navigator.userAgent;
  const browsers = [
    { match: 'Brave', name: 'Brave', icon: '🦁', msg: "Brave? More like 'please-Google-don't-look' mode." },
    { match: 'Chrome', name: 'Chrome', icon: '🌈', msg: "Your telemetry has already been sent to Mountain View." },
    { match: 'Firefox', name: 'Firefox', icon: '🦊', msg: "You think you're safe with Firefox? Please, Mozillians are watching." },
    { match: 'Edge', name: 'Edge', icon: '📎', msg: "Edge user detected. We called Clippy and he's disappointed." },
    { match: 'Safari', name: 'Safari', icon: '🍎', msg: "Welcome, iOS pentester. You've already lost." },
    { match: 'OPR', name: 'Opera', icon: '🎭', msg: "Opera GX? Cyberpunk isn't a browser theme, dude." }
  ];
  
  const found = browsers.find(b => ua.includes(b.match) && !ua.includes('Edge') && !ua.includes('OPR'));
  return found || { name: 'unknown', icon: '🌐', msg: "Nice try. Unknown browser detected." };
};

const getLineIcon = (type) => {
  const icons = {
    error: <AlertTriangle className="w-4 h-4 inline mr-2" />,
    fatal: <Skull className="w-4 h-4 inline mr-2 animate-bounce" />,
    warning: <Monitor className="w-4 h-4 inline mr-2" />
  };
  return icons[type] || null;
};

/**
 * KrbtgtPage - Kerberoasting simulation with browser roast
 */
export default function KrbtgtPage() {
  const navigate = useNavigate();
  const timers = useSafeTimers();
  const [showGlitch, setShowGlitch] = useState(false);
  const [showRoastedEffect, setShowRoastedEffect] = useState(false);
  const [allLinesShown, setAllLinesShown] = useState(false);
  
  const browserInfo = useMemo(() => detectBrowser(), []);

  const lines = useMemo(() => [
    { text: '[!] Initiating browser security check...', delay: 800, type: 'warning' },
    { text: `[!] Browser check: ${browserInfo.name} detected ${browserInfo.icon}`, delay: 1000, type: 'warning' },
    { text: `[x] ${browserInfo.msg}`, delay: 1500, type: 'error' },
    { text: '[x] Error: Burp Suite browser not detected', delay: 1000, type: 'error' },
    { text: "[!] Only Burp's Chromium-based browser can bypass surveillance", delay: 1200, type: 'warning' },
    { text: '', delay: 500, type: 'blank' },
    { text: '[*] Proceeding anyway... (YOLO mode activated)', delay: 1000, type: 'info' },
    { text: '[*] Initiating Kerberoasting...', delay: 1000, type: 'info' },
    { text: '[*] Target: krbtgt@NEBULAHOST.TECH', delay: 800, type: 'info' },
    { text: '[*] Dumping service ticket...', delay: 1200, type: 'info' },
    { text: '[!] Warning: AES256 encryption not supported on this toaster', delay: 1000, type: 'warning' },
    { text: '[x] Error: krbtgt has detected impure intentions', delay: 1200, type: 'error' },
    { text: '[!] SYSTEM CHECK: Verifying environment...', delay: 1500, type: 'warning' },
    { text: '', delay: 800, type: 'blank' },
    { text: '[x] Error: You do not possess the AZ-900 certification', delay: 1000, type: 'error' },
    { text: '[x] Error: Tails OS not detected — operation aborted', delay: 1000, type: 'error' },
    { text: "[!] Security Tip: Real pentesters use Tails. Not this... thing.", delay: 1500, type: 'warning' },
    { text: "[💀] Fatal: krbtgt roasted... too hard. It's now a charcoal blob.", delay: 2000, type: 'fatal' }
  ], [browserInfo]);

  const { visibleLines, isComplete, currentLine } = useSequentialLines(lines, {
    autoStart: true,
    onComplete: () => {
      timers.setTimeout(() => {
        setShowGlitch(true);
        timers.setTimeout(() => {
          setShowRoastedEffect(true);
          timers.setTimeout(() => setAllLinesShown(true), 4000);
        }, 2000);
      }, 1000);
    }
  });

  return (
    <PageLayout>
      <CyberBackground variant="danger" showScanlines glitching={showGlitch} />

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <BackButton onClick={() => navigate('/')} text="exit_kerberoasting" />
          
          <div className="flex items-center space-x-4 text-sm font-mono">
            {showGlitch && (
              <div className="flex items-center space-x-2 text-red-500 animate-pulse">
                <Flame className="w-5 h-5" />
                <span>SYSTEM_OVERLOAD</span>
                <Zap className="w-5 h-5" />
              </div>
            )}
            <div className="text-gray-400">
              Browser: <span className="text-yellow-400">{browserInfo.name}</span> |
              Target: <span className="text-red-400">krbtgt@NEBULAHOST.TECH</span>
            </div>
          </div>
        </div>

        {/* Terminal */}
        <TerminalWindow
          prompt="root@kerberoasting-lab:~/attacks/active-directory$"
          command="python3 kerberoast.py --target krbtgt --stealth-mode"
          shaking={showGlitch}
          borderColor={showGlitch ? 'border-red-500/50' : 'border-green-500/30'}
          statusIndicator={showGlitch ? 'danger' : 'normal'}
        >
          {visibleLines.map((line, idx) => (
            <AnimatedLine
              key={idx}
              text={line.text}
              type={line.type}
              showCursor={idx === currentLine - 1}
              icon={getLineIcon(line.type)}
            />
          ))}

          {/* Glitch Effect */}
          {showGlitch && (
            <div className="mt-6 space-y-2 text-red-500 animate-pulse text-center">
              <div className="text-2xl font-bold mb-4">SYSTEM FAILURE</div>
              <div className="text-lg animate-bounce">💀 KRBTGT.EXE HAS STOPPED WORKING 💀</div>
              <div className="text-sm mt-2 text-red-400">
                {browserInfo.icon} Browser: {browserInfo.name} | Status: COMPROMISED
              </div>
            </div>
          )}

          {/* Roasted Effect */}
          {showRoastedEffect && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded">
              <div className="text-red-400 text-center animate-pulse">
                <div className="text-6xl mb-4">🔥</div>
                <div className="text-xl font-bold mb-2">ROASTED STATUS: MAXIMUM</div>
              </div>
            </div>
          )}

          {/* Final Message */}
          {allLinesShown && (
            <div className="mt-8 border border-red-500/30 bg-red-900/10 rounded-lg p-6 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="text-red-400 text-2xl font-bold font-mono">MISSION FAILED</div>
                <div className="text-yellow-400 text-lg">Try harder.</div>
                
                <div className="text-gray-400 text-sm space-y-2">
                  <div>{browserInfo.icon} <strong>Browser Issue:</strong> {browserInfo.name} - major OPSEC fail</div>
                  <div>🎯 <strong>Skill Issue:</strong> Maybe try HackTheBox first?</div>
                  <div>📚 <strong>Certification Missing:</strong> AZ-900 required</div>
                  <div>🔥 <strong>Result:</strong> krbtgt is now a BBQ snack</div>
                </div>

                <div className="border-t border-gray-700 pt-4 text-xs text-gray-500 italic">
                  "In Soviet Russia, krbtgt roasts YOU!" - Fenrir
                </div>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-800 to-red-700 text-white font-mono border border-red-500/30 rounded-lg hover:from-red-700 hover:to-red-600 transition-all group"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour au terminal</span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </TerminalWindow>
      </div>

      <style jsx>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
        .animate-shake { animation: shake 0.3s ease-in-out infinite; }
      `}</style>
    </PageLayout>
  );
}
