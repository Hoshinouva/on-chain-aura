import { ImageResponse } from 'next/og';
import { generateAura } from '@/lib/aura-engine';
import { fetchWalletData } from '@/lib/data-fetcher';



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return new Response('Missing address', { status: 400 });
    }

    // Get the stats
    const rawStats = await fetchWalletData(address);
    const aura = generateAura(
      address,
      rawStats.ageInDays,
      rawStats.txCount,
      rawStats.chainsExplored
    );

    const { core, edge, bloom, accent, name } = aura.colors;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: accent,
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Left: Orb */}
          <div
            style={{
              display: 'flex',
              width: '50%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* The 2D Fake Orb */}
            <div
              style={{
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${core} 0%, ${edge} 100%)`,
                boxShadow: `0 0 120px 40px ${bloom}40, inset 0 0 80px 20px ${core}`,
                display: 'flex',
              }}
            />
          </div>

          {/* Right: Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              paddingRight: '80px',
              paddingLeft: '20px',
            }}
          >
            <div
              style={{
                fontSize: 24,
                letterSpacing: '0.3em',
                color: '#888',
                marginBottom: 20,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              ON-CHAIN AURA
            </div>

            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: 20,
                textShadow: `0 0 40px ${bloom}`,
                lineHeight: 1.1,
              }}
            >
              {name}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 50,
              }}
            >
              <div
                style={{
                  border: `2px solid ${core}`,
                  color: edge,
                  padding: '8px 24px',
                  borderRadius: '9999px',
                  fontSize: 24,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                {aura.rarity} TIER
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 40,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingTop: 20,
                paddingBottom: 20,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#888', fontSize: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Energy</span>
                <span style={{ fontSize: 36, fontWeight: 'bold' }}>{aura.energyLevel}%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#888', fontSize: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Archetype</span>
                <span style={{ fontSize: 32, fontWeight: 'bold' }}>{aura.archetype}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#888', fontSize: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Spirit</span>
                <span style={{ fontSize: 32, fontWeight: 'bold' }}>{aura.spiritAnimal}</span>
              </div>
            </div>

            <div
              style={{
                fontSize: 32,
                fontFamily: 'serif',
                fontStyle: 'italic',
                color: '#ddd',
                lineHeight: 1.4,
              }}
            >
              "{aura.destiny}"
            </div>
            
            <div style={{ position: 'absolute', bottom: 40, right: 80, fontSize: 24, color: '#666' }}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
