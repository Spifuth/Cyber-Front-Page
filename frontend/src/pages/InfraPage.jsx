import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InfraPage = () => {
  const navigate = useNavigate();
  const [infraData, setInfraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    const loadInfraData = async () => {
      try {
        const response = await fetch('/data/infra.json');
        const data = await response.json();
        setInfraData(data);
      } catch (error) {
        console.error('Error loading infrastructure data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInfraData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🏗️</div>
            <p>Loading infrastructure diagram...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-400' : 'text-red-400';
  };

  const getUptimeColor = (uptime) => {
    const percentage = parseFloat(uptime);
    if (percentage >= 99.5) return 'text-green-400';
    if (percentage >= 98.0) return 'text-yellow-400';
    return 'text-red-400';
  };

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
          <h1 className="text-4xl font-bold mb-2 text-green-400">► {infraData?.infrastructure?.title || 'INFRASTRUCTURE'}</h1>
          <p className="text-gray-400">{infraData?.infrastructure?.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        
        {/* ASCII Infrastructure Diagram */}
        <div className="mb-12 bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-green-400 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4 text-green-400">► NETWORK TOPOLOGY</h2>
          <pre className="text-green-400 text-sm leading-relaxed whitespace-pre overflow-x-auto">
            {infraData?.infrastructure?.ascii_diagram?.join('\n')}
          </pre>
        </div>

        {/* Infrastructure Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {infraData?.infrastructure?.metrics && Object.entries(infraData.infrastructure.metrics).map(([key, value]) => (
            <div key={key} className="bg-gray-900 bg-opacity-50 border border-blue-400 p-4 rounded-lg text-center">
              <div className={`text-2xl font-bold mb-2 ${
                key.includes('uptime') || key.includes('Uptime') ? getUptimeColor(value.toString()) : 'text-blue-400'
              }`}>
                {value}
              </div>
              <div className="text-gray-400 text-xs">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
              </div>
            </div>
          ))}
        </div>

        {/* Components Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {infraData?.infrastructure?.components?.map((component, index) => (
            <div 
              key={index}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                selectedComponent === index 
                  ? 'border-green-400 bg-gray-900 bg-opacity-70 transform scale-105' 
                  : 'border-gray-700 bg-gray-900 bg-opacity-30 hover:border-green-600'
              }`}
              onClick={() => setSelectedComponent(selectedComponent === index ? null : index)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-green-400">{component.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${
                    component.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                  } animate-pulse`}></span>
                  <span className={getStatusColor(component.status)} text-sm>
                    {component.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-purple-400 font-semibold">{component.technology}</p>
                <p className="text-gray-400 text-sm mt-1">{component.description}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Uptime</span>
                <span className={`font-bold ${getUptimeColor(component.uptime)}`}>
                  {component.uptime}
                </span>
              </div>
              
              {/* Detailed view when selected */}
              {selectedComponent === index && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Technology:</p>
                      <p className="text-green-400">{component.technology}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status:</p>
                      <p className={getStatusColor(component.status)}>{component.status}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-gray-500 text-sm">Description:</p>
                    <p className="text-gray-300">{component.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* System Status Summary */}
        <div className="mt-12 bg-gray-900 bg-opacity-50 border border-purple-400 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">► SYSTEM STATUS</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-3">Active Services</h3>
              <div className="space-y-2">
                {infraData?.infrastructure?.components?.filter(comp => comp.status === 'active').map((comp, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{comp.name}</span>
                    <span className="text-green-400">✓ {comp.uptime}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">Performance Metrics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Overall Uptime:</span>
                  <span className={getUptimeColor(infraData?.infrastructure?.metrics?.totalUptime)}>
                    {infraData?.infrastructure?.metrics?.totalUptime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Services:</span>
                  <span className="text-blue-400">{infraData?.infrastructure?.metrics?.totalServices}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Containers:</span>
                  <span className="text-green-400">{infraData?.infrastructure?.metrics?.activeContainers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Monthly Data:</span>
                  <span className="text-yellow-400">{infraData?.infrastructure?.metrics?.monthlyData}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Threats Blocked:</span>
                  <span className="text-red-400">{infraData?.infrastructure?.metrics?.blockedThreats}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="text-center py-8 border-t border-gray-700 mt-12">
          <p className="text-gray-500">
            [ Infrastructure monitored 24/7 with Zabbix + Grafana + Custom Scripts ]
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfraPage;