import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCollection } from '../lib/dataClient';

const CertsPage = () => {
  const navigate = useNavigate();
  const [certsData, setCertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadCerts = async () => {
      try {
        const data = await loadCollection('certs');
        setCertsData(data);
      } catch (error) {
        console.error('Error loading certifications:', error);
        setCertsData({ certifications: [] });
      } finally {
        setLoading(false);
      }
    };

    loadCerts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🎓</div>
            <p>Loading certifications...</p>
          </div>
        </div>
      </div>
    );
  }

  const certifications = certsData?.certifications || [];
  const filteredCerts = filter === 'all' ? certifications : certifications.filter((cert) => cert.status === filter);

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
          <h1 className="text-4xl font-bold mb-2 text-green-400">► CERTIFICATIONS</h1>
          <p className="text-gray-400">Industry-recognized credentials & achievements</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['all', '✅', '🛠️', '📚'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status === 'all' ? 'all' : status)}
              className={`px-4 py-2 rounded border transition-colors ${
                filter === status || (status === 'all' && filter === 'all')
                  ? 'border-green-400 bg-green-500/20 text-green-200'
                  : 'border-gray-700 text-gray-400 hover:border-green-400/40 hover:text-green-200'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredCerts.map((cert) => (
            <div key={cert.id} className="border border-green-400/30 rounded-lg p-6 bg-gray-900/60 hover:border-green-400 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{cert.name}</h3>
                  <p className="text-purple-400 text-sm">{cert.issuedBy}</p>
                </div>
                <span className="text-2xl">{cert.status}</span>
              </div>

              <p className="text-gray-300 text-sm mb-4">{cert.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Issued: {cert.issueDate}</span>
                <span>Expires: {cert.expiryDate || 'N/A'}</span>
              </div>

              {cert.skills && (
                <div className="mt-4">
                  <h4 className="text-green-400 text-sm font-semibold mb-2">Validated Skills</h4>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    {cert.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertsPage;
