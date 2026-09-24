import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      name: 'SELBAR Platform',
      description: 'SELBAR Recommerce API',
      status: 'ok',
      namespaces: []
    },
    { status: 200 }
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    }
  });
}
