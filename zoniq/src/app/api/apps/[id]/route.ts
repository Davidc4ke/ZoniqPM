import { NextResponse } from 'next/server'

const mockApps: Record<string, { id: string; name: string; customer: string; description: string }> = {
  '1': { id: '1', name: 'Claims Portal', customer: 'Acme Insurance', description: 'Customer-facing claims submission and tracking portal' },
  '2': { id: '2', name: 'Invoicing', customer: 'Acme Insurance', description: 'Internal invoicing and billing management system' },
  '3': { id: '3', name: 'Customer Portal', customer: 'Beta Corp', description: 'Self-service customer management portal' },
  '4': { id: '4', name: 'Reporting Service', customer: 'Beta Corp', description: 'Automated reporting and analytics dashboard' },
  '5': { id: '5', name: 'Mobile Companion', customer: 'Gamma Ltd', description: 'Mobile companion app for field agents' },
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const app = mockApps[id]
  if (!app) {
    return NextResponse.json({ error: 'App not found' }, { status: 404 })
  }
  return NextResponse.json(app)
}
