import { parse } from 'cookie';
import Header from '../../components/Header';
import StatsCard from '../../components/StatsCard';

export default function VendorDashboard({ summary }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {summary && Object.entries(summary).map(([key, value]) => (
              <StatsCard key={key} title={key} value={value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies[process.env.COOKIE_NAME];

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const res = await fetch(`${process.env.WP_URL}/wp-json/dokan/v1/orders/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const summary = await res.json();
    return { props: { summary } };
  } catch (error) {
    return { props: { summary: null } };
  }
}
