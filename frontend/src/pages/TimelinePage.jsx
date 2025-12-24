import { PageLayout, PageHeader, PageContent, LoadingSpinner, FilterButton, SkillBadge } from '../components/shared';
import { useDataFetch, useFilter } from '../hooks';
import { formatDate } from '../lib/utils';

/**
 * TimelineEvent - Single timeline entry
 */
function TimelineEvent({ event }) {
  return (
    <div className="relative">
      {/* Timeline dot */}
      <div className="absolute -left-[11px] top-2 w-5 h-5 rounded-full border-2 border-green-400 bg-black" />
      
      {/* Event card */}
      <div className="bg-gray-900/70 border border-green-400/20 rounded-lg p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-green-400">{event.title}</h3>
            <p className="text-gray-400 text-sm">{event.organization}</p>
          </div>
          <span className="text-blue-400 text-sm">{formatDate(event.date)}</span>
        </div>

        <p className="text-gray-300 mb-3">{event.description}</p>

        {event.technologies && event.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.technologies.map((tech) => (
              <SkillBadge key={tech} variant="green">{tech}</SkillBadge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * TimelinePage - Career timeline display
 */
export default function TimelinePage() {
  const { data, loading } = useDataFetch('timeline', {
    defaultValue: { timeline: [] }
  });

  const timeline = data?.timeline || [];
  const { filter, setFilter, filteredItems } = useFilter(timeline, 'type', 'all');

  if (loading) {
    return <LoadingSpinner icon="⏳" message="Loading timeline..." />;
  }

  const filterOptions = ['all', 'career', 'education', 'certification', 'achievement'];

  return (
    <PageLayout>
      <PageHeader
        title="CAREER TIMELINE"
        subtitle="Professional milestones & achievements"
      />

      <PageContent maxWidth="max-w-5xl">
        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filterOptions.map((type) => (
            <FilterButton
              key={type}
              active={filter === type}
              onClick={() => setFilter(type)}
            >
              {type.toUpperCase()}
            </FilterButton>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-green-400 pl-8 space-y-6">
          {filteredItems.map((event) => (
            <TimelineEvent key={event.id} event={event} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No events found for the selected filter.
          </div>
        )}
      </PageContent>
    </PageLayout>
  );
}
