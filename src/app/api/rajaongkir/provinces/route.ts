import { NextResponse } from 'next/server';

const API_KEY = process.env.RAJAONGKIR_API_KEY;
const BASE_URL = process.env.RAJAONGKIR_BASE_URL;

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key is missing' }, { status: 500 });
    }

    const response = await fetch(`${BASE_URL}/province`, {
      headers: { key: API_KEY },
      cache: 'no-store'
    });

    const data = await response.json();

    if (data?.rajaongkir?.status?.code !== 200) {
      console.error('RajaOngkir Error:', data?.rajaongkir?.status?.description);
      return NextResponse.json([], { status: 200 }); // Return empty array to prevent crash
    }

    return NextResponse.json(data.rajaongkir.results || []);
  } catch (error) {
    console.error('Fetch provinces error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
