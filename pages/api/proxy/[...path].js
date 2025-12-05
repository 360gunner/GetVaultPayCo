import { parse } from 'cookie';

export default async function handler(req, res) {
  const { path } = req.query;
  const fullPath = path.join('/');

  const cookies = parse(req.headers.cookie || '');
  const token = cookies[process.env.COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const url = `${process.env.WP_URL}/wp-json/${fullPath}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
