import { useState, useEffect } from 'react';
import { loadCollection } from '../lib/dataClient';
import {
  PageLayout,
  PageHeader,
  PageContent,
  LoadingSpinner,
  SectionCard,
  SectionTitle,
  SkillBadge
} from '../components/shared';

/**
 * ResumePage - Professional resume with timeline, skills, and certifications
 */
const ResumePage = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileInfo = {
    name: 'Fenrir',
    title: 'Senior SOC Analyst & Cybersecurity Specialist',
    location: 'Remote | Available Worldwide',
    email: 'fenrir@nebulahost.tech',
    linkedin: 'linkedin.com/in/fenrir-soc',
    github: 'github.com/fenrir-soc',
    summary: "Experienced cybersecurity professional specializing in threat hunting, incident response, and security operations center management. Expert in SIEM technologies, malware analysis, and infrastructure security with a passion for automation and threat intelligence."
  };

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

  if (loading) {
    return <LoadingSpinner icon="⚡" message="Loading resume data..." />;
  }

  const careerExperience = resumeData?.timeline?.filter((item) => item.type === 'career') || [];
  const education = resumeData?.timeline?.filter((item) => item.type === 'education') || [];

  return (
    <PageLayout>
      {/* Custom Header with Profile */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b-2 border-green-400 p-8">
        <PageHeader title={profileInfo.name} subtitle="" />
        <div className="text-center -mt-4">
          <h2 className="text-xl text-blue-400 mb-2">{profileInfo.title}</h2>
          <p className="text-gray-300">{profileInfo.location}</p>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <span className="text-purple-400">📧 {profileInfo.email}</span>
            <span className="text-blue-400">🔗 {profileInfo.linkedin}</span>
            <span className="text-green-400">🐙 {profileInfo.github}</span>
          </div>
        </div>
      </div>

      <PageContent className="space-y-8">
        {/* Summary */}
        <SectionCard borderColor="border-green-400">
          <SectionTitle color="text-green-400">► PROFESSIONAL SUMMARY</SectionTitle>
          <p className="text-gray-300 leading-relaxed">{profileInfo.summary}</p>
        </SectionCard>

        {/* Download Actions */}
        <SectionCard borderColor="border-purple-400">
          <SectionTitle color="text-purple-400">► DOWNLOAD</SectionTitle>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-500 transition-colors rounded">
              📄 Download PDF Resume
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 transition-colors rounded">
              🔍 View Full Portfolio
            </button>
          </div>
        </SectionCard>

        {/* Professional Experience */}
        <SectionCard borderColor="border-blue-400">
          <SectionTitle color="text-blue-400">► PROFESSIONAL EXPERIENCE</SectionTitle>
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
                  {job.technologies?.map((tech, idx) => (
                    <SkillBadge key={idx} variant="green">{tech}</SkillBadge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Technical Expertise */}
        <SectionCard borderColor="border-yellow-400">
          <SectionTitle color="text-yellow-400">► TECHNICAL EXPERTISE</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            {resumeData?.stack && Object.entries(resumeData.stack).map(([category, data]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-lg font-bold text-green-400 flex items-center gap-2">
                  <span>{data.icon}</span>
                  {data.category}
                </h4>
                <div className="space-y-1">
                  {data.technologies?.slice(0, 4).map((tech, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{tech.name}</span>
                      <span className="text-blue-400">{tech.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Education & Certifications */}
        <div className="grid md:grid-cols-2 gap-8">
          <SectionCard borderColor="border-cyan-400">
            <SectionTitle color="text-cyan-400">► EDUCATION</SectionTitle>
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
          </SectionCard>

          <SectionCard borderColor="border-red-400">
            <SectionTitle color="text-red-400">► CERTIFICATIONS</SectionTitle>
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
          </SectionCard>
        </div>
      </PageContent>
    </PageLayout>
  );
};

export default ResumePage;
