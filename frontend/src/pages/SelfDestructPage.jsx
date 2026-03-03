import { useState, useMemo } from 'react';
import { ArrowLeft, Skull, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSequentialLines, useCountdown, useSafeTimers } from '../hooks';
import {
  PageLayout,
  CyberBackground,
  TerminalWindow,
  AnimatedLine,
  BackButton
} from '../components/shared';

const getLineIcon = (type) => {
  const icons = {
    error: <AlertTriangle className="w-4 h-4 inline mr-2" />,
    critical: <Skull className="w-4 h-4 inline mr-2 animate-bounce" />,
    warning: <Zap className="w-4 h-4 inline mr-2" />
  };
  return icons[type] || null;
};

const DESTRUCT_LINES = [
  { text: '[!] WARNING: UNAUTHORIZED SYSTEM ACCESS DETECTED', delay: 800, type: 'warning' },
  { text: '[!] Initiating emergency protocols...', delay: 1000, type: 'warning' },
  { text: '[x] ALERT: Multiple roast attempts logged in system', delay: 1200, type: 'error' },
  { text: '[!] System integrity compromised by user incompetence', delay: 1000, type: 'warning' },
  { text: '[x] ERROR: Detected unauthorized Kerberoasting activities', delay: 1500, type: 'error' },
  { text: '', delay: 500, type: 'blank' },
  { text: '[💀] CRITICAL: Activating emergency fallback exploit...', delay: 1000, type: 'critical' },
  { text: '[!] Executing: rm -rf /', delay: 1200, type: 'warning' },
  { text: '[x] Permission denied: User not root 😅', delay: 1500, type: 'error' },
  { text: '[!] Attempting alternative destruction methods...', delay: 1000, type: 'warning' },
  { text: '[x] Error: Cannot delete /etc/passwd - File not found', delay: 1000, type: 'error' },
  { text: '[x] Error: /dev/null is full (how?)', delay: 800, type: 'error' },
  { text: '[x] Error: Kernel panic failed - kernel too stable', delay: 1000, type: 'error' },
  { text: '[!] Warning: Attempting to divide by zero...', delay: 1200, type: 'warning' },
  { text: '[x] Error: Mathematics.exe has stopped working', delay: 1000, type: 'error' },
  { text: '', delay: 800, type: 'blank' },
  { text: '[💥] FALLBACK: Initiating psychological destruction...', delay: 1500, type: 'critical' },
  { text: '[!] Your favorite show has been cancelled', delay: 1000, type: 'warning' },
  { text: '[!] All your passwords are now "password123"', delay: 1000, type: 'warning' },
  { text: '[!] Your browser history has been sent to your mom', delay: 1200, type: 'warning' },
  { text: '[💀] ULTIMATE WEAPON: Rickroll.exe activated', delay: 1500, type: 'critical' }
];

/**
 * SelfDestructPage - Fake self-destruct sequence with humor
 */
export default function SelfDestructPage() {
  const navigate = useNavigate();
  const timers = useSafeTimers();
  const [showMeltdown, setShowMeltdown] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [allLinesShown, setAllLinesShown] = useState(false);

  const { count, start: startCountdown } = useCountdown(3, {
    onComplete: () => timers.setTimeout(() => setAllLinesShown(true), 1000)
  });

  const { visibleLines, currentLine } = useSequentialLines(DESTRUCT_LINES, {
    autoStart: true,
    onComplete: () => {
      timers.setTimeout(() => {
        setShowMeltdown(true);
        timers.setTimeout(() => {
          setShowCountdown(true);
          startCountdown();
        }, 2000);
      }, 1000);
    }
  });

  return (
    <PageLayout>
      <CyberBackground variant="danger" showScanlines glitching={showMeltdown} />

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <BackButton onClick={() => navigate('/')} text="emergency_exit" />
          
          <div className="flex items-center space-x-4 text-sm font-mono">
            {showMeltdown && (
              <div className="flex items-center space-x-2 text-red-500 animate-pulse">
                <Skull className="w-5 h-5 animate-bounce" />
                <span>SYSTEM_MELTDOWN</span>
                <Zap className="w-5 h-5 animate-spin" />
              </div>
            )}
            <div className="text-gray-400">
              Status: <span className="text-red-400">SELF_DESTRUCTING</span>
            </div>
          </div>
        </div>

        {/* Terminal */}
        <TerminalWindow
          prompt="root@self-destruct-sequence:~/emergency$"
          command="./selfdestruct --force --no-mercy"
          shaking={showMeltdown}
          borderColor="border-red-500/50"
          statusIndicator="danger"
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

          {/* Meltdown Effect */}
          {showMeltdown && (
            <div className="mt-6 space-y-4 text-center">
              <div className="text-red-500 text-4xl font-bold animate-pulse">
                SYSTEM OVERLOAD
              </div>
              <div className="text-red-400 text-lg animate-bounce">
                💥 CRITICAL FAILURE IMMINENT 💥
              </div>
              
              {/* Fake BSOD */}
              <div className="bg-blue-600/20 border-2 border-blue-500 p-4 rounded">
                <div className="text-white font-mono text-center space-y-2">
                  <div className="text-2xl">:(</div>
                  <div>Your PC ran into a problem and needs to restart.</div>
                  <div className="text-sm">Just kidding, this is still a browser.</div>
                </div>
              </div>
            </div>
          )}

          {/* Countdown */}
          {showCountdown && (
            <div className="mt-8 text-center">
              <div className="text-red-400 text-6xl font-bold animate-pulse mb-4">
                {count > 0 ? count : '💥'}
              </div>
              <div className="text-yellow-400 text-xl animate-bounce">
                {count > 0 ? "This message will self-destruct in..." : "BOOM! (Just kidding)"}
              </div>
            </div>
          )}

          {/* Final Message */}
          {allLinesShown && (
            <div className="mt-8 border border-red-500/30 bg-red-900/10 rounded-lg p-6 animate-fade-in">
              <div className="text-center space-y-6">
                <div className="text-4xl animate-bounce">🎉</div>
                
                <div className="text-green-400 text-2xl font-bold font-mono">
                  SELF-DESTRUCTION... FAILED!
                </div>
                
                <div className="text-yellow-400 text-lg">
                  Turns out this computer is too stubborn to die.
                </div>
                
                <div className="text-gray-400 text-sm space-y-2 bg-gray-800/30 p-4 rounded">
                  <div>🎯 <strong>Destruction Attempt:</strong> Epic fail</div>
                  <div>💻 <strong>System Status:</strong> Still running (unfortunately)</div>
                  <div>🤡 <strong>User Status:</strong> Trolled successfully</div>
                  <div>🎭 <strong>Reality Check:</strong> You're still in a browser</div>
                </div>

                <div className="border-t border-gray-700 pt-4 text-xs text-gray-500 italic">
                  "I tried to delete System32 but it said 'Access Denied'.<br/>
                  Even my computer doesn't trust me." - Anonymous SOC Analyst
                </div>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-800 to-green-700 text-white font-mono border border-green-500/30 rounded-lg hover:from-green-700 hover:to-green-600 transition-all group"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour au monde des vivants</span>
                  </span>
                </button>
                
                <div className="text-xs text-gray-500">
                  Pro tip: Next time, try turning it off and on again 😏
                </div>
              </div>
            </div>
          )}
        </TerminalWindow>
      </div>

      <style jsx>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-1deg); } 75% { transform: translateX(5px) rotate(1deg); } }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}</style>
    </PageLayout>
  );
}
