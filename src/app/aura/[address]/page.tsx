import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchWalletData } from '@/lib/data-fetcher';
import { generateAura } from '@/lib/aura-engine';
import AuraClient from './AuraClient';

interface Props {
  params: { address: string };
}

// Generate X / OpenGraph Meta Tags based on the wallet
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const address = params.address;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://onchainaura.xyz'; // fallback for local

  if (!address.startsWith('0x')) return { title: 'Invalid Wallet' };

  try {
    const rawStats = await fetchWalletData(address);
    const aura = generateAura(address, rawStats.ageInDays, rawStats.txCount, rawStats.chainsExplored);

    const title = `${aura.colors.name} | On-Chain Aura`;
    const description = `Archetype: ${aura.archetype} • Spirit: ${aura.spiritAnimal} • Energy: ${aura.energyLevel}%`;
    // Point to the OG API route we just built
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

// Server Component handles the fetch
export default async function AuraPage({ params }: Props) {
  const address = params.address;
  const rawStats = await fetchWalletData(address);
  const aura = generateAura(address, rawStats.ageInDays, rawStats.txCount, rawStats.chainsExplored);

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AuraClient aura={aura} />
    </Suspense>
  );
}