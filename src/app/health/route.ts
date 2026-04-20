export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'central-eloria',
    timestamp: new Date().toISOString(),
  });
}
