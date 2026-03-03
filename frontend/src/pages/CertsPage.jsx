import { PageLayout, PageHeader, PageContent, LoadingSpinner, SectionCard, FilterButton, SkillBadge } from '../components/shared';
import { useDataFetch, useFilter } from '../hooks';

/**
 * CertificationCard - Individual certification display
 */
function CertificationCard({ cert }) {
  return (
    <SectionCard 
      borderColor="border-green-400/30"
      className="hover:border-green-400 transition-all duration-300"
    >
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

      {cert.skills && cert.skills.length > 0 && (
        <div className="mt-4">
          <h4 className="text-green-400 text-sm font-semibold mb-2">Validated Skills</h4>
          <div className="flex flex-wrap gap-2">
            {cert.skills.map((skill) => (
              <SkillBadge key={skill} variant="green">{skill}</SkillBadge>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

/**
 * CertsPage - Certifications listing page
 */
export default function CertsPage() {
  const { data, loading } = useDataFetch('certs', { 
    defaultValue: { certifications: [] } 
  });

  const certifications = data?.certifications || [];
  const { filter, setFilter, filteredItems } = useFilter(certifications, 'status', 'all');

  if (loading) {
    return <LoadingSpinner icon="🎓" message="Loading certifications..." />;
  }

  const filterOptions = ['all', '✅', '🛠️', '📚'];

  return (
    <PageLayout>
      <PageHeader
        title="CERTIFICATIONS"
        subtitle="Industry-recognized credentials & achievements"
      />

      <PageContent>
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filterOptions.map((option) => (
            <FilterButton
              key={option}
              active={filter === option || (option === 'all' && filter === 'all')}
              onClick={() => setFilter(option === 'all' ? 'all' : option)}
            >
              {option === 'all' ? 'All' : option}
            </FilterButton>
          ))}
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredItems.map((cert) => (
            <CertificationCard key={cert.id} cert={cert} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No certifications found for the selected filter.
          </div>
        )}
      </PageContent>
    </PageLayout>
  );
}
