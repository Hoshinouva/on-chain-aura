import { generateAura } from '@/lib/aura-engine';
import { fetchWalletData } from '@/lib/data-fetcher';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address || !address.startsWith('0x')) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
  }

  try {
    const rawStats = await fetchWalletData(address);
    const aura = generateAura(
      address, 
      rawStats.ageInDays, 
      rawStats.txCount, 
      rawStats.chainsExplored
    );
    
    return NextResponse.json(aura);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read chains' }, { status: 500 });
  }
}
