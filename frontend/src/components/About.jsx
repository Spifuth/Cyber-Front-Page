import { useMemo } from 'react';
import { Shield, Server, Code, Monitor } from 'lucide-react';
import { getMockProfile } from '../mocks/mockBackend';
import { getEnvVar, isMockEnabled } from '../lib/env';

export default function About() {
  const mockMode = isMockEnabled();
  const profile = useMemo(() => {
    const baseProfile = getMockProfile();
    if (!mockMode) {
      return {
        ...baseProfile,
        name: getEnvVar('VITE_PROFILE_NAME', baseProfile.name),
        role: getEnvVar('VITE_PROFILE_ROLE', baseProfile.role),
        description: getEnvVar('VITE_PROFILE_DESCRIPTION', baseProfile.description),
        techStack: getEnvVar('VITE_PROFILE_TECH_STACK', baseProfile.techStack.join(', '))
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        avatar: getEnvVar('VITE_PROFILE_AVATAR', baseProfile.avatar)
      };
    }
    return baseProfile;
  }, [mockMode]);

  const skills = [
    { icon: Shield, name: 'Cybersécurité', color: 'text-red-400' },
    { icon: Server, name: 'Infrastructure', color: 'text-blue-400' },
    { icon: Code, name: 'Automation', color: 'text-green-400' },
    { icon: Monitor, name: 'Monitoring', color: 'text-violet-400' }
  ];

  return (
    <section className="py-20 px-4 relative" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-mono font-bold mb-4 text-green-400">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              ./about_fenrir
            </span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Info */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-mono text-green-400 mb-4">
                &gt; whoami
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="font-mono">
                  <span className="text-blue-400">user:</span> {profile.name}
                </div>
                <div className="font-mono">
                  <span className="text-blue-400">role:</span> {profile.role}
                </div>
                <div className="font-mono">
                  <span className="text-blue-400">status:</span> <span className="text-green-400">active</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-lg font-mono text-green-400 mb-4">&gt; description</h4>
              <p className="text-gray-300 leading-relaxed">
                {profile.description}
              </p>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-lg font-mono text-green-400 mb-6">&gt; expertise</h4>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group"
                    >
                      <IconComponent className={`w-5 h-5 ${skill.color} group-hover:scale-110 transition-transform duration-300`} />
                      <span className="text-gray-300 text-sm">{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-lg font-mono text-green-400 mb-4">&gt; tech_stack</h4>
              <div className="flex flex-wrap gap-2">
                {profile.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-black/50 text-green-300 text-sm font-mono border border-green-500/30 rounded-md hover:border-green-400/50 hover:bg-green-500/10 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
