import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCollection } from '../lib/dataClient';

const InfraPage = () => {
  const navigate = useNavigate();
  const [infraData, setInfraData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfra = async () => {
      try {
        const data = await loadCollection('infra');
        setInfraData(data.infrastructure || null);
      } catch (error) {
        console.error('Error loading infrastructure data:', error);
        setInfraData(null);
      } finally {
        setLoading(false);
      }
    };

    loadInfra();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🛰️</div>
            <p>Loading infrastructure map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!infraData) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-400">Infrastructure data unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="bg-gradient-to-r from-gray-900 to-black border-b-2 border-green-400 p-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-green-400 text-black hover:bg-green-300 transition-colors rounded"
        >
          ← Back to Terminal
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-green-400">► INFRASTRUCTURE MAP</h1>
          <p className="text-gray-400">Self-hosted services & monitoring overview</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <section className="border border-green-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
          <h2 className="text-2xl font-bold mb-4 text-green-400">{infraData.title}</h2>
          <p className="text-gray-300 leading-relaxed">{infraData.description}</p>
        </section>

        <section className="border border-blue-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
          <h3 className="text-xl font-bold text-blue-400 mb-4">► ASCII DIAGRAM</h3>
          <pre className="bg-black/80 text-green-300 p-6 rounded-lg overflow-auto text-xs sm:text-sm">
            {infraData.ascii_diagram.join('\n')}
          </pre>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="border border-purple-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
            <h3 className="text-xl font-bold text-purple-400 mb-4">► CORE SERVICES</h3>
            <ul className="space-y-3">
              {infraData.core_services.map((service) => (
                <li key={service.name} className="border border-purple-400/30 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-white">{service.name}</h4>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </div>
                    <span className="text-purple-300 text-sm">{service.status}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-300">
                    {service.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-yellow-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">► MONITORING STACK</h3>
            <div className="space-y-3">
              {infraData.monitoring_stack.map((item) => (
                <div key={item.name} className="border border-yellow-400/30 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.name}</h4>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                    <span className="text-yellow-300 text-sm">{item.status}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-300">
                    {item.integrations.map((integration) => (
                      <span key={integration} className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="border border-red-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
          <h3 className="text-xl font-bold text-red-400 mb-4">► SECURITY CONTROLS</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {infraData.security_controls.map((control) => (
              <div key={control.name} className="border border-red-400/30 rounded-lg p-4">
                <h4 className="text-lg font-bold text-white mb-2">{control.name}</h4>
                <p className="text-gray-300 text-sm mb-2">{control.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  {control.tools.map((tool) => (
                    <span key={tool} className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfraPage;
