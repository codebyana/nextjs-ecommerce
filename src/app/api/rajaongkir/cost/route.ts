import { NextResponse } from 'next/server';

const API_KEY = process.env.RAJAONGKIR_API_KEY;
const BASE_URL = process.env.RAJAONGKIR_BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, weight, courier } = body;

    const response = await fetch(`${BASE_URL}/cost`, {
      method: 'POST',
      headers: { 
        key: API_KEY as string,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        origin: '152', // Jakarta Pusat as default origin
        destination: destination,
        weight: weight.toString(),
        courier: courier
      })
    });

    const data = await response.json();
    return NextResponse.json(data.rajaongkir.results);
  } catch (error) {
    console.error('RajaOngkir Cost Error:', error);
    return NextResponse.json({ error: 'Failed to calculate shipping cost' }, { status: 500 });
  }
}
