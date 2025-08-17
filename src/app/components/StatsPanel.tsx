interface Props {
    applications: any[];
    statusCounts: Record<string, number>;
    platformCounts: Record<string, number>;
    cycleCounts: Record<string, number>;
  }
  
  export default function StatsPanel({
    applications,
    statusCounts,
    platformCounts,
    cycleCounts,
  }: Props) {
    return (
      <div className="sticky top-8 mb-6 space-y-2">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div><strong>Total:</strong> {applications.length}</div>
        <div>
          <strong>By Status:</strong>
          <ul className="ml-4 list-disc">
            {Object.entries(statusCounts).map(([status, count]) => (
              <li key={status}>{status}: {count}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>By Platform:</strong>
          <ul className="ml-4 list-disc">
            {Object.entries(platformCounts).map(([platform, count]) => (
              <li key={platform}>{platform}: {count}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>By Cycle:</strong>
          <ul className="ml-4 list-disc">
            {Object.entries(cycleCounts).map(([cycle, count]) => (
              <li key={cycle}>{cycle}: {count}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  