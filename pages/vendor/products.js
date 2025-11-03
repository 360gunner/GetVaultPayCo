import { parse } from 'cookie';
import Header from '../../components/Header';
import Table from '../../components/Table';

export default function VendorProducts({ products }) {
  const headers = ['ID', 'Name', 'Price', 'Stock'];
  const rows = products ? products.map(product => [
    product.id,
    product.name,
    `$${product.price}`,
    product.stock_quantity || 'N/A',
  ]) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <div className="mt-6">
            <Table headers={headers} rows={rows} />
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
    // Get user ID
    const userRes = await fetch(`${process.env.WP_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const user = await userRes.json();
    const sellerId = user.id;

    // Fetch products
    const res = await fetch(`${process.env.WP_URL}/wp-json/dokan/v1/products?seller_id=${sellerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const products = await res.json();
    return { props: { products } };
  } catch (error) {
    return { props: { products: [] } };
  }
}
