'use client';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { AuraOrb } from '@/components/AuraOrb';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

export default function AuraClient({ aura }: { aura: any }) {
  const router = useRouter();

  // The Void State: If user has 0 tx, render an empty state
  if (aura.isVoid) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-32 h-32 rounded-full border border-gray-800 mx-auto flex items-center justify-center shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]">
            <span className="text-gray-800 text-6xl font-serif">?</span>
          </div>
          <div>
            <h1 className="text-2xl font-serif text-gray-500 mb-4 tracking-widest uppercase">The Void</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              No on-chain activity found for this address. The cosmos requires action to generate an aura.
            </p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="mt-12 py-3 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-all backdrop-blur-sm"
          >
            ← Return
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white font-mono flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: aura.colors.accent }}
    >
      {/* Fullscreen 3D Canvas Background. dpr limited for mobile battery saving */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <AuraOrb profile={aura} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 max-w-lg w-full p-4 md:p-8 flex flex-col items-center"
      >
        <div className="text-center mb-auto mt-4 md:mt-8 bg-black/40 p-6 md:p-8 rounded-2xl backdrop-blur-md border border-white/10 w-full">
          <h2 className="text-[10px] md:text-xs tracking-[0.4em] text-gray-400 mb-4 font-sans font-semibold">ON-CHAIN AURA</h2>
          
          {/* Mobile responsive text scaling */}
          <h1 
            className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6 drop-shadow-2xl" 
            style={{ color: '#fff', textShadow: `0 0 30px ${aura.colors.bloom}` }}
          >
            {aura.colors.name}
          </h1>
          
          <div 
            className="inline-block px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest bg-black/60 backdrop-blur-sm shadow-xl" 
            style={{ border: `1px solid ${aura.colors.core}`, color: aura.colors.edge }}
          >
            {aura.rarity} TIER
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-8 mb-6 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[10px] md:text-xs mb-1 uppercase tracking-wider">Energy</span>
              <span className="text-lg md:text-xl font-bold">{aura.energyLevel}%</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/10">
              <span className="text-gray-400 text-[10px] md:text-xs mb-1 uppercase tracking-wider">Archetype</span>
              <span className="text-xs md:text-sm font-bold text-center px-1 md:px-2 leading-tight">{aura.archetype}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[10px] md:text-xs mb-1 uppercase tracking-wider">Spirit</span>
              <span className="text-xs md:text-sm font-bold text-center px-1 md:px-2 leading-tight">{aura.spiritAnimal}</span>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-6"></div>

          <p className="text-gray-200 font-serif text-base md:text-lg leading-relaxed italic text-center px-2 md:px-4">
            "{aura.destiny}"
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/')}
          className="mt-8 md:mt-12 py-3 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-all backdrop-blur-sm"
        >
          ← Read another wallet
        </button>
      </motion.div>
    </div>
  );
}