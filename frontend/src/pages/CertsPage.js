import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CertsPage = () => {
  const navigate = useNavigate();
  const [certsData, setCertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadCertsData = async () => {
      try {
        const response = await fetch('/data/certs.json');
        const data = await response.json();
        setCertsData(data);
      } catch (error) {
        console.error('Error loading certifications data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🏆</div>
            <p>Loading certifications...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusFilter = (certifications, status) => {
    return certifications?.filter(cert => cert.status === status) || [];
  };

  const filteredCerts = filter === 'all' 
    ? certsData?.certifications || []
    : getStatusFilter(certsData?.certifications, filter);

  const getStatusColor = (status) => {
    const colors = {
      '✅': 'text-green-400 border-green-400 bg-green-900',
      '🕓': 'text-yellow-400 border-yellow-400 bg-yellow-900',
      '🚧': 'text-blue-400 border-blue-400 bg-blue-900',
      '❌': 'text-red-400 border-red-400 bg-red-900'
    };
    return colors[status] || 'text-gray-400 border-gray-400 bg-gray-900';
  };

  const getStatusLabel = (status) => {
    const labels = {
      '✅': 'Obtained',
      '🕓': 'In Progress',
      '🚧': 'Scheduled',
      '❌': 'Failed/Retaking'
    };
    return labels[status] || 'Unknown';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Security Management': '🛡️',
      'Incident Response': '🚨',
      'Penetration Testing': '⚔️',
      'Security Fundamentals': '📚',
      'Cloud/DevOps': '☁️',
      'System Administration': '⚙️'
    };
    return icons[category] || '📋';
  };

  const categories = [...new Set(certsData?.certifications?.map(cert => cert.category) || [])];

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b-2 border-green-400 p-8">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-green-400 text-black hover:bg-green-300 transition-colors rounded"
        >
          ← Back to Terminal
        </button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-green-400">► CERTIFICATIONS</h1>
          <p className="text-gray-400">Professional Security Certifications & Training</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        
        {/* Status Legend */}
        <div className="mb-8 bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Status Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certsData?.legend && Object.entries(certsData.legend).map(([status, description]) => (
              <div key={status} className={`border p-3 rounded ${getStatusColor(status)}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">{status}</span>
                  <span className="font-bold">{getStatusLabel(status)}</span>
                </div>
                <p className="text-gray-400 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 text-center">
          <div className="flex justify-center space-x-4 flex-wrap">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded transition-colors ${
                filter === 'all' 
                  ? 'bg-green-400 text-black' 
                  : 'bg-gray-800 text-green-400 hover:bg-gray-700'
              }`}
            >
              All ({certsData?.certifications?.length || 0})
            </button>
            {certsData?.legend && Object.keys(certsData.legend).map((status) => {
              const count = getStatusFilter(certsData.certifications, status).length;
              return (
                <button 
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded transition-colors ${
                    filter === status 
                      ? 'bg-green-400 text-black' 
                      : 'bg-gray-800 text-green-400 hover:bg-gray-700'
                  }`}
                >
                  {status} {getStatusLabel(status)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {filteredCerts.map((cert) => (
            <div 
              key={cert.id}
              className={`border-2 rounded-lg p-6 ${getStatusColor(cert.status)} bg-opacity-20 hover:bg-opacity-30 transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{cert.name}</h3>
                  <p className="text-gray-300 text-sm">{cert.fullName}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl">{cert.status}</span>
                  <p className={`text-sm ${getStatusColor(cert.status)}`}>
                    {getStatusLabel(cert.status)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400 font-semibold">Issuer:</span>
                  <span className="text-gray-300">{cert.issuer}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 font-semibold">Category:</span>
                  <span className="text-gray-300 flex items-center space-x-1">
                    <span>{getCategoryIcon(cert.category)}</span>
                    <span>{cert.category}</span>
                  </span>
                </div>

                {cert.dateObtained && (
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 font-semibold">Obtained:</span>
                    <span className="text-gray-300">{new Date(cert.dateObtained).toLocaleDateString()}</span>
                  </div>
                )}

                {cert.expiryDate && (
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 font-semibold">Expires:</span>
                    <span className="text-gray-300">{new Date(cert.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}

                {cert.credentialId && (
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400 font-semibold">ID:</span>
                    <span className="text-gray-400 text-sm font-mono">{cert.credentialId}</span>
                  </div>
                )}

                <p className="text-gray-400 text-sm leading-relaxed mt-3">
                  {cert.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">► CERTIFICATION CATEGORIES</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryCount = certsData?.certifications?.filter(cert => cert.category === category).length || 0;
              const obtainedCount = certsData?.certifications?.filter(cert => cert.category === category && cert.status === '✅').length || 0;
              
              return (
                <div key={category} className="bg-gray-900 bg-opacity-50 border border-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    <h3 className="text-lg font-bold text-green-400">{category}</h3>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white">{categoryCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Obtained:</span>
                    <span className="text-green-400">{obtainedCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {certsData?.legend && Object.keys(certsData.legend).map((status) => {
            const count = getStatusFilter(certsData.certifications, status).length;
            return (
              <div key={status} className={`border ${getStatusColor(status)} p-4 rounded-lg text-center bg-opacity-20`}>
                <div className="text-3xl mb-2">{status}</div>
                <div className="text-2xl font-bold text-green-400">{count}</div>
                <div className="text-sm text-gray-400">{getStatusLabel(status)}</div>
              </div>
            );
          })}
        </div>

        {/* Terminal Footer */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-500">
            [ Run <span className="text-green-400">certs</span> command in terminal for quick summary ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertsPage;