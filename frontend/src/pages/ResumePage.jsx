import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCollection } from '../lib/dataClient';

const ResumePage = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const [timelineData, stackData, certsData] = await Promise.all([
          loadCollection('timeline'),
          loadCollection('stack'),
          loadCollection('certs')
        ]);

        setResumeData({
          timeline: timelineData.timeline,
          stack: stackData.stack,
          certifications: (certsData.certifications || []).filter((cert) => cert.status === '✅')
        });
      } catch (error) {
        console.error('Error loading resume data:', error);
        setResumeData({ timeline: [], stack: {}, certifications: [] });
      } finally {
        setLoading(false);
      }
    };

    loadResumeData();
  }, []);

  const profileInfo = {
    name: 'Fenrir',
    title: 'Senior SOC Analyst & Cybersecurity Specialist',
    location: 'Remote | Available Worldwide',
    email: 'fenrir@nebulahost.tech',
    linkedin: 'linkedin.com/in/fenrir-soc',
    github: 'github.com/fenrir-soc',
    summary:
      "Experienced cybersecurity professional specializing in threat hunting, incident response, and security operations center management. Expert in SIEM technologies, malware analysis, and infrastructure security with a passion for automation and threat intelligence."
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p>Loading resume data...</p>
          </div>
        </div>
      </div>
    );
  }

  const careerExperience = resumeData?.timeline?.filter((item) => item.type === 'career') || [];
  const education = resumeData?.timeline?.filter((item) => item.type === 'education') || [];

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
          <h1 className="text-4xl font-bold mb-2 text-green-400">{profileInfo.name}</h1>
          <h2 className="text-xl text-blue-400 mb-2">{profileInfo.title}</h2>
          <p className="text-gray-300">{profileInfo.location}</p>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <span className="text-purple-400">📧 {profileInfo.email}</span>
            <span className="text-blue-400">🔗 {profileInfo.linkedin}</span>
            <span className="text-green-400">🐙 {profileInfo.github}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <section className="border border-green-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
          <h3 className="text-2xl font-bold mb-4 text-green-400">► PROFESSIONAL SUMMARY</h3>
          <p className="text-gray-300 leading-relaxed">{profileInfo.summary}</p>
        </section>

        <section className="border border-purple-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">► DOWNLOAD</h3>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-500 transition-colors rounded">📄 Download PDF Resume</button>
            <button className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 transition-colors rounded">🔍 View Full Portfolio</button>
          </div>
        </section>

        <section className="border border-blue-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">► PROFESSIONAL EXPERIENCE</h3>
          <div className="space-y-6">
            {careerExperience.map((job) => (
              <div key={job.id} className="border-l-2 border-green-400 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-green-400">{job.title}</h4>
                  <span className="text-gray-400 text-sm">{new Date(job.date).toLocaleDateString()}</span>
                </div>
                <p className="text-purple-400 font-semibold mb-2">{job.organization}</p>
                <p className="text-gray-300 mb-3">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.technologies?.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-yellow-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
          <h3 className="text-2xl font-bold mb-4 text-yellow-400">► TECHNICAL EXPERTISE</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {resumeData?.stack &&
              Object.entries(resumeData.stack).map(([category, data]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-lg font-bold text-green-400 flex items-center gap-2">
                    <span>{data.icon}</span>
                    {data.category}
                  </h4>
                  <div className="space-y-1">
                    {data.technologies?.slice(0, 4).map((tech, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{tech.name}</span>
                        <span className="text-blue-400">{tech.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="border border-cyan-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">► EDUCATION</h3>
            <div className="space-y-4">
              {education.map((item) => (
                <div key={item.id} className="border-l-2 border-blue-400 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-blue-400">{item.title}</h4>
                    <span className="text-gray-400 text-sm">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-purple-400 font-semibold">{item.organization}</p>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-red-400 p-6 rounded-lg bg-gray-900 bg-opacity-50">
            <h3 className="text-2xl font-bold mb-4 text-red-400">► CERTIFICATIONS</h3>
            <div className="space-y-4">
              {resumeData?.certifications?.map((cert) => (
                <div key={cert.id} className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-red-400">{cert.name}</h4>
                    <span className="text-green-400">{cert.status}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{cert.issuedBy}</p>
                  <p className="text-gray-500 text-xs">Issued: {cert.issueDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
