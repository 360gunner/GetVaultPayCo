import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://98.83.36.86';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { status: false, message: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const url = `${API_BASE_URL}/${path}`;

  try {
    const contentType = request.headers.get('content-type') || '';
    let body;

    if (contentType.includes('application/json')) {
      body = await request.json();
      body = JSON.stringify(body);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const urlParams = new URLSearchParams();
      formData.forEach((value, key) => {
        urlParams.append(key, value.toString());
      });
      body = urlParams.toString();
    } else {
      body = await request.text();
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': contentType || 'application/x-www-form-urlencoded',
      },
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { status: false, message: 'Proxy request failed' },
      { status: 500 }
    );
  }
}
