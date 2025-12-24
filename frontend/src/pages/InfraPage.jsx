import { useDataFetch } from '../hooks/useDataFetch';
import {
  PageLayout,
  PageHeader,
  PageContent,
  LoadingSpinner,
  SectionCard,
  SectionTitle,
  ServiceCard,
  ErrorState
} from '../components/shared';

/**
 * InfraPage - Infrastructure overview with services, monitoring, and security
 */
const InfraPage = () => {
  const { data: infraData, loading } = useDataFetch('infra', (data) => data.infrastructure || null);

  if (loading) {
    return <LoadingSpinner icon="🛰️" message="Loading infrastructure map..." />;
  }

  if (!infraData) {
    return <ErrorState message="Infrastructure data unavailable." />;
  }

  return (
    <PageLayout>
      <PageHeader title="INFRASTRUCTURE MAP" subtitle="Self-hosted services & monitoring overview" />

      <PageContent className="space-y-8">
        {/* Overview */}
        <SectionCard borderColor="border-green-400">
          <h2 className="text-2xl font-bold mb-4 text-green-400">{infraData.title}</h2>
          <p className="text-gray-300 leading-relaxed">{infraData.description}</p>
        </SectionCard>

        {/* ASCII Diagram */}
        <SectionCard borderColor="border-blue-400">
          <SectionTitle color="text-blue-400">► ASCII DIAGRAM</SectionTitle>
          <pre className="bg-black/80 text-green-300 p-6 rounded-lg overflow-auto text-xs sm:text-sm">
            {infraData.ascii_diagram.join('\n')}
          </pre>
        </SectionCard>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Core Services */}
          <SectionCard borderColor="border-purple-400">
            <SectionTitle color="text-purple-400">► CORE SERVICES</SectionTitle>
            <ul className="space-y-3">
              {infraData.core_services.map((service) => (
                <ServiceCard
                  key={service.name}
                  name={service.name}
                  description={service.description}
                  status={service.status}
                  tags={service.technologies}
                  borderColor="border-purple-400/30"
                  badgeVariant="purple"
                  statusColor="text-purple-300"
                />
              ))}
            </ul>
          </SectionCard>

          {/* Monitoring Stack */}
          <SectionCard borderColor="border-yellow-400">
            <SectionTitle color="text-yellow-400">► MONITORING STACK</SectionTitle>
            <div className="space-y-3">
              {infraData.monitoring_stack.map((item) => (
                <ServiceCard
                  key={item.name}
                  name={item.name}
                  description={item.description}
                  status={item.status}
                  tags={item.integrations}
                  borderColor="border-yellow-400/30"
                  badgeVariant="yellow"
                  statusColor="text-yellow-300"
                />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Security Controls */}
        <SectionCard borderColor="border-red-400">
          <SectionTitle color="text-red-400">► SECURITY CONTROLS</SectionTitle>
          <div className="grid md:grid-cols-2 gap-4">
            {infraData.security_controls.map((control) => (
              <ServiceCard
                key={control.name}
                name={control.name}
                description={control.description}
                tags={control.tools}
                borderColor="border-red-400/30"
                badgeVariant="red"
              />
            ))}
          </div>
        </SectionCard>
      </PageContent>
    </PageLayout>
  );
};

export default InfraPage;
