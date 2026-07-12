import { NextResponse } from 'next/server';

const API_KEY = process.env.RAJAONGKIR_API_KEY;
const BASE_URL = process.env.RAJAONGKIR_BASE_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get('province');

  if (!provinceId) {
    return NextResponse.json({ error: 'Province ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${BASE_URL}/city?province=${provinceId}`, {
      headers: { key: API_KEY as string },
      cache: 'no-store'
    });
    const data = await response.json();

    if (data?.rajaongkir?.status?.code !== 200) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data.rajaongkir.results || []);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
