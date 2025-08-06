import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState('');
  const [showSecureForm, setShowSecureForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    security: ''
  });

  const contactInfo = {
    email: 'fenrir@nebulahost.tech',
    secureEmail: 'secure@nebulahost.tech',
    pgpKey: '4096R/ABC123DEF',
    linkedin: 'linkedin.com/in/fenrir-soc',
    github: 'github.com/fenrir-soc',
    website: 'https://nebulahost.tech',
    timezone: 'UTC+0',
    availability: 'Mon-Fri 09:00-17:00 UTC'
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the form data
    setHistory(prev => [...prev, { type: 'output', content: '🔒 Secure message queued for transmission via encrypted channel' }]);
    setHistory(prev => [...prev, { type: 'output', content: '✅ Message will be processed within 24-48 hours' }]);
    setFormData({ name: '', email: '', subject: '', message: '', security: '' });
    setShowSecureForm(false);
  };

  const generateSecureContactCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SEC-${timestamp}-${random}`.toUpperCase();
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
          <h1 className="text-4xl font-bold mb-2 text-green-400">► SECURE CONTACT</h1>
          <p className="text-gray-400">Encrypted Communication Channels</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        
        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Standard Contact */}
          <div className="border border-green-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
            <h2 className="text-2xl font-bold mb-4 text-green-400">📧 STANDARD CHANNELS</h2>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <div>
                  <span className="text-purple-400 font-semibold">Email:</span>
                  <p className="text-gray-300">{contactInfo.email}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(contactInfo.email, 'email')}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
                >
                  {copiedField === 'email' ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <div>
                  <span className="text-blue-400 font-semibold">LinkedIn:</span>
                  <p className="text-gray-300">{contactInfo.linkedin}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(`https://${contactInfo.linkedin}`, 'linkedin')}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                >
                  {copiedField === 'linkedin' ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <div>
                  <span className="text-green-400 font-semibold">GitHub:</span>
                  <p className="text-gray-300">{contactInfo.github}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(`https://${contactInfo.github}`, 'github')}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                >
                  {copiedField === 'github' ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-3 bg-gray-800 rounded">
                <span className="text-yellow-400 font-semibold">Availability:</span>
                <p className="text-gray-300">{contactInfo.availability}</p>
                <p className="text-gray-400 text-sm">Timezone: {contactInfo.timezone}</p>
              </div>
            </div>
          </div>

          {/* Secure Contact */}
          <div className="border border-red-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
            <h2 className="text-2xl font-bold mb-4 text-red-400">🔒 SECURE CHANNELS</h2>
            <div className="space-y-4">
              
              <div className="p-3 bg-red-900 bg-opacity-30 rounded border border-red-600">
                <span className="text-red-400 font-semibold">Encrypted Email:</span>
                <p className="text-gray-300 mb-2">{contactInfo.secureEmail}</p>
                <p className="text-gray-400 text-sm">PGP Key: {contactInfo.pgpKey}</p>
                <button 
                  onClick={() => copyToClipboard(contactInfo.secureEmail, 'secureEmail')}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                >
                  {copiedField === 'secureEmail' ? '✓ Copied' : 'Copy Secure Email'}
                </button>
              </div>

              <div className="p-3 bg-purple-900 bg-opacity-30 rounded border border-purple-600">
                <span className="text-purple-400 font-semibold">Contact Code:</span>
                <p className="text-gray-300 font-mono text-sm mb-2">{generateSecureContactCode()}</p>
                <p className="text-gray-400 text-xs">Reference this code for secure communications</p>
              </div>

              <button 
                onClick={() => setShowSecureForm(!showSecureForm)}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded hover:from-red-500 hover:to-purple-500 transition-all duration-300 font-bold"
              >
                🛡️ {showSecureForm ? 'Hide' : 'Open'} Secure Message Form
              </button>
            </div>
          </div>
        </div>

        {/* Secure Contact Form */}
        {showSecureForm && (
          <div className="border border-red-400 p-6 rounded-lg bg-red-900 bg-opacity-20 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-red-400">🔒 ENCRYPTED MESSAGE FORM</h2>
            <p className="text-gray-400 mb-6 text-sm">
              ⚠️ All messages are encrypted end-to-end and stored in secure vault. Response within 24-48 hours.
            </p>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-400 mb-2">Name*</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-green-400 focus:border-green-400 focus:outline-none"
                    placeholder="Your name or handle"
                  />
                </div>
                <div>
                  <label className="block text-green-400 mb-2">Email*</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-green-400 focus:border-green-400 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-green-400 mb-2">Subject*</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-green-400 focus:border-green-400 focus:outline-none"
                >
                  <option value="">Select subject...</option>
                  <option value="security_consultation">Security Consultation</option>
                  <option value="incident_response">Incident Response</option>
                  <option value="collaboration">Collaboration Opportunity</option>
                  <option value="threat_intel">Threat Intelligence Sharing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-green-400 mb-2">Security Clearance (Optional)</label>
                <input 
                  type="text"
                  name="security"
                  value={formData.security}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-green-400 focus:border-green-400 focus:outline-none"
                  placeholder="Security clearance level (if applicable)"
                />
              </div>
              
              <div>
                <label className="block text-green-400 mb-2">Message*</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-green-400 focus:border-green-400 focus:outline-none resize-none"
                  placeholder="Your encrypted message will be processed through secure channels..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded hover:from-green-500 hover:to-blue-500 transition-all duration-300 font-bold"
              >
                🔐 Send Encrypted Message
              </button>
            </form>
          </div>
        )}

        {/* Security Notice */}
        <div className="border border-yellow-400 p-6 rounded-lg bg-yellow-900 bg-opacity-20">
          <h3 className="text-xl font-bold mb-3 text-yellow-400">⚠️ SECURITY NOTICE</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• All communications are monitored for security purposes</li>
            <li>• Sensitive information should be sent via encrypted channels only</li>
            <li>• Response time: 24-48 hours for standard inquiries</li>
            <li>• Emergency security incidents: Use secure email with URGENT prefix</li>
            <li>• PGP public key available upon request for maximum security</li>
          </ul>
        </div>

        {/* Terminal Footer */}
        <div className="text-center py-8 border-t border-gray-700 mt-8">
          <p className="text-gray-500">
            [ Run <span className="text-green-400">email</span> command in terminal for quick contact ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;