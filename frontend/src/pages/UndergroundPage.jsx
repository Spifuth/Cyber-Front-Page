import { useState } from 'react';
import { Eye, EyeOff, Skull } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlitchText, useDelayedState, useToggle } from '../hooks';
import {
  PageLayout,
  CyberBackground,
  BackButton,
  StatusBadge,
  GlitchTitle,
  SectionCard
} from '../components/shared';

const SECRET_FILES = [
  { name: 'shadow_protocols.md', size: '2.3KB', date: '2024-01-15' },
  { name: 'network_topology.json', size: '847B', date: '2024-01-10' },
  { name: 'incident_reports.log', size: '15.2KB', date: '2024-01-08' },
  { name: 'honeypot_data.db', size: '128MB', date: '2024-01-05' }
];

/**
 * FileListItem - Secret file display component
 */
const FileListItem = ({ file }) => (
  <div className="flex items-center justify-between p-3 bg-black/30 rounded border border-gray-700/50 hover:border-red-500/50 transition-colors duration-300 group cursor-pointer">
    <div className="flex items-center space-x-4">
      <span className="font-mono text-red-400 group-hover:text-red-300">
        {file.name}
      </span>
    </div>
    <div className="flex items-center space-x-6 text-gray-500 text-sm">
      <span>{file.size}</span>
      <span>{file.date}</span>
    </div>
  </div>
);

/**
 * UndergroundPage - Secret/classified area with glitch effects
 */
export default function UndergroundPage() {
  const navigate = useNavigate();
  const [isConnected] = useDelayedState(false, 2000);
  const [showSecrets, toggleSecrets] = useToggle(false);
  const glitchText = useGlitchText('UNDERGROUND', { interval: 3000, probability: 0.8 });

  // Auto-connect on mount
  useState(() => {
    // Connection happens via useDelayedState
  });

  return (
    <PageLayout>
      <CyberBackground variant="underground" showScanlines glitching={false} />

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <BackButton onClick={() => navigate('/')} text="exit_underground" />
          <StatusBadge 
            connected={isConnected} 
            connectedText="SECURE_CONNECTION" 
            disconnectedText="CONNECTING..." 
          />
        </div>

        {/* Main Title */}
        <div className="text-center mb-16">
          <GlitchTitle text={glitchText} />
          
          <div className="font-mono text-lg text-gray-400 mb-8">
            <span className="animate-pulse">ACCESS LEVEL: CLASSIFIED</span>
          </div>
          
          {!isConnected && (
            <div className="font-mono text-red-400">
              <span className="animate-pulse">Establishing encrypted tunnel...</span>
            </div>
          )}
        </div>

        {isConnected && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Warning Banner */}
            <SectionCard borderColor="border-red-500/30" className="bg-red-900/20">
              <div className="flex items-center space-x-4">
                <Skull className="w-8 h-8 text-red-400 animate-pulse" />
                <div>
                  <h3 className="font-mono text-red-400 mb-2">ATTENTION: ZONE RESTREINTE</h3>
                  <p className="text-gray-300 text-sm">
                    Vous êtes maintenant dans une zone sécurisée. Toute activité est loggée et monitored.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Terminal Window */}
            <SectionCard borderColor="border-green-500/20" className="bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 border-b border-green-500/30 flex items-center justify-between">
                <span className="font-mono text-green-400">fenrir@underground:~/classified$</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
              
              <div className="p-6 font-mono text-sm space-y-2">
                <div className="text-green-400"># Bienvenue dans la zone underground</div>
                <div className="text-gray-400"># Ici résident les projets secrets, les expérimentations</div>
                <div className="text-gray-400"># et les outils qui ne verront jamais la lumière</div>
                <div className="text-green-400 mt-4"># ls -la classified/</div>
              </div>
            </SectionCard>

            {/* File System */}
            <SectionCard borderColor="border-green-500/20" className="bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-mono text-green-400 text-lg"># CLASSIFIED FILES</h3>
                <button
                  onClick={toggleSecrets}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-800 border border-green-500/30 rounded text-green-400 hover:border-green-400/50 transition-colors duration-300"
                >
                  {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="font-mono text-sm">{showSecrets ? 'HIDE' : 'SHOW'}</span>
                </button>
              </div>

              {showSecrets && (
                <div className="space-y-2 animate-fade-in">
                  {SECRET_FILES.map((file, index) => (
                    <FileListItem key={index} file={file} />
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Secret Message */}
            <div className="bg-gradient-to-r from-gray-900/50 to-red-900/20 border border-red-500/20 rounded-lg p-8 text-center">
              <div className="font-mono text-red-400 mb-4 text-lg">
                "In the depths of cyberspace, we are the guardians."
              </div>
              <div className="font-mono text-gray-400 text-sm">
                - Fenrir, SOC Underground Division
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
