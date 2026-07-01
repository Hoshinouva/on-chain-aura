import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchWalletData } from '@/lib/data-fetcher';
import { generateAura } from '@/lib/aura-engine';
import AuraClient from './AuraClient';

interface Props {
  params: Promise<{ address: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const address = p?.address || '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onchainaura.xyz'; 

  if (!address || typeof address !== 'string' || !address.startsWith('0x')) return { title: 'Invalid Wallet' };

  try {
    const rawStats = await fetchWalletData(address);
    const aura = generateAura(address, rawStats.ageInDays, rawStats.txCount, rawStats.chainsExplored);

    const title = `${aura.colors.name} | On-Chain Aura`;
    const description = `Archetype: ${aura.archetype} • Spirit: ${aura.spiritAnimal} • Energy: ${aura.energyLevel}%`;
    const imageUrl = `${baseUrl}/api/og?address=${address}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (e) {
    return { title: 'Aura Not Found' };
  }
}

export default async function AuraPage({ params }: Props) {
  const p = await params;
  const address = p?.address || '';
  
  if (!address || typeof address !== 'string' || !address.startsWith('0x')) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">Invalid Wallet Address</div>;
  }

  try {
    const rawStats = await fetchWalletData(address);
    const aura = generateAura(address, rawStats.ageInDays, rawStats.txCount, rawStats.chainsExplored);

    return (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <AuraClient aura={aura} />
      </Suspense>
    );
  } catch(e) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">Cosmic Error Occurred</div>;
  }
}
