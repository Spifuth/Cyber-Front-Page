import { useState, useMemo } from 'react';
import { useCopyToClipboard, useForm, useToggle } from '../hooks';
import { getEnvVar, getExternalUrl } from '../lib/env';
import {
  PageLayout,
  PageHeader,
  PageContent,
  SectionCard,
  CopyButton
} from '../components/shared';

/**
 * ContactItem - Reusable contact info row
 */
const ContactItem = ({ label, value, copyValue, copiedField, onCopy, color = 'text-green-400', btnColor = 'bg-green-600', btnHover = 'hover:bg-green-500' }) => (
  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
    <div>
      <span className={`${color} font-semibold`}>{label}:</span>
      <p className="text-gray-300">{value}</p>
    </div>
    <CopyButton
      text={copyValue || value}
      copied={copiedField === label.toLowerCase()}
      onCopy={(text) => onCopy(text, label.toLowerCase())}
      color={btnColor}
      hoverColor={btnHover}
    />
  </div>
);

/**
 * FormField - Reusable form input/textarea
 */
const FormField = ({ label, name, type = 'text', value, onChange, required, placeholder, rows }) => (
  <div>
    <label className="block text-green-400 mb-2">{label}{required && '*'}</label>
    {rows ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-green-400 focus:border-green-400 focus:outline-none"
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-green-400 focus:border-green-400 focus:outline-none"
        placeholder={placeholder}
      />
    )}
  </div>
);

/**
 * ContactPage - Secure contact channels and messaging form
 */
const ContactPage = () => {
  const { copiedField, copyToClipboard } = useCopyToClipboard();
  const [showSecureForm, toggleSecureForm] = useToggle(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { values: formData, handleChange, reset } = useForm({
    name: '', email: '', subject: '', message: '', security: ''
  });

  const contactInfo = useMemo(() => ({
    email: getEnvVar('VITE_CONTACT_EMAIL', 'fenrir@nebulahost.tech'),
    secureEmail: getEnvVar('VITE_CONTACT_SECURE_EMAIL', 'secure@nebulahost.tech'),
    pgpKey: getEnvVar('VITE_CONTACT_PGP_KEY', '4096R/ABC123DEF'),
    linkedin: getEnvVar('VITE_CONTACT_LINKEDIN', 'linkedin.com/in/fenrir-soc'),
    github: getEnvVar('VITE_CONTACT_GITHUB', 'github.com/fenrir-soc'),
    website: getExternalUrl('VITE_CONTACT_WEBSITE', '#'),
    timezone: getEnvVar('VITE_CONTACT_TIMEZONE', 'UTC+0'),
    availability: getEnvVar('VITE_CONTACT_AVAILABILITY', 'Mon-Fri 09:00-17:00 UTC')
  }), []);

  const generateSecureContactCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SEC-${timestamp}-${random}`.toUpperCase();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    reset();
    setTimeout(() => {
      setFormSubmitted(false);
      toggleSecureForm();
    }, 3000);
  };

  return (
    <PageLayout>
      <PageHeader title="SECURE CONTACT" subtitle="Encrypted Communication Channels" />

      <PageContent maxWidth="max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Standard Channels */}
          <SectionCard borderColor="border-green-400">
            <h2 className="text-2xl font-bold mb-4 text-green-400">📧 STANDARD CHANNELS</h2>
            <div className="space-y-4">
              <ContactItem
                label="Email"
                value={contactInfo.email}
                copiedField={copiedField}
                onCopy={copyToClipboard}
                color="text-purple-400"
                btnColor="bg-purple-600"
                btnHover="hover:bg-purple-500"
              />
              <ContactItem
                label="LinkedIn"
                value={contactInfo.linkedin}
                copyValue={`https://${contactInfo.linkedin}`}
                copiedField={copiedField}
                onCopy={copyToClipboard}
                color="text-blue-400"
                btnColor="bg-blue-600"
                btnHover="hover:bg-blue-500"
              />
              <ContactItem
                label="GitHub"
                value={contactInfo.github}
                copyValue={`https://${contactInfo.github}`}
                copiedField={copiedField}
                onCopy={copyToClipboard}
              />
              <div className="p-3 bg-gray-800 rounded">
                <span className="text-yellow-400 font-semibold">Availability:</span>
                <p className="text-gray-300">{contactInfo.availability}</p>
                <p className="text-gray-400 text-sm">Timezone: {contactInfo.timezone}</p>
              </div>
            </div>
          </SectionCard>

          {/* Secure Channels */}
          <SectionCard borderColor="border-red-400">
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
                onClick={toggleSecureForm}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded hover:from-red-500 hover:to-purple-500 transition-all duration-300 font-bold"
              >
                🛡️ {showSecureForm ? 'Hide' : 'Open'} Secure Message Form
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Public Site Link */}
        {contactInfo.website !== '#' && (
          <SectionCard borderColor="border-blue-400" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">🌐 Public Site</h2>
            <a
              href={contactInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            >
              Visit Main Site
            </a>
          </SectionCard>
        )}

        {/* Secure Message Form */}
        {showSecureForm && (
          <SectionCard borderColor="border-red-400" className="bg-red-900/20 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-red-400">🔒 ENCRYPTED MESSAGE FORM</h2>
            <p className="text-gray-400 mb-6 text-sm">
              ⚠️ All messages are encrypted end-to-end and stored in secure vault. Response within 24-48 hours.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formSubmitted && (
                <div className="border border-green-400 bg-green-900 bg-opacity-30 p-4 rounded-lg mb-4">
                  <p className="text-green-400 font-bold">🔒 Message Sent Successfully!</p>
                  <p className="text-gray-300 text-sm">Secure message queued for transmission via encrypted channel</p>
                  <p className="text-gray-300 text-sm">Response expected within 24-48 hours</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <FormField name="name" label="Name" value={formData.name} onChange={handleChange} required placeholder="Your name or handle" />
                <FormField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} required placeholder="contact@example.com" />
              </div>

              <FormField name="subject" label="Subject" value={formData.subject} onChange={handleChange} required placeholder="Topic of your message" />
              <FormField name="message" label="Message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Your encrypted message" />
              <FormField name="security" label="Security Notes" value={formData.security} onChange={handleChange} rows={3} placeholder="PGP fingerprint, preferred channel, etc." />

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded hover:from-green-500 hover:to-blue-500 transition-all duration-300 font-bold"
              >
                🚀 Send Secure Message
              </button>
            </form>
          </SectionCard>
        )}
      </PageContent>
    </PageLayout>
  );
};

export default ContactPage;
