'use client';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { AuraOrb } from '@/components/AuraOrb';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuraClient({ aura }: { aura: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // The Void State
  if (aura.isVoid) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2 }}
          className="max-w-md w-full text-center space-y-12 z-10"
        >
          <div className="w-40 h-40 rounded-full border border-white/5 mx-auto flex items-center justify-center shadow-[inset_0_0_80px_rgba(255,255,255,0.02)] relative">
            <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}></div>
            <span className="text-gray-700 text-6xl font-serif font-light">?</span>
          </div>
          <div>
            <h1 className="text-3xl font-serif text-gray-500 mb-6 tracking-[0.3em] uppercase font-light">The Void</h1>
            <p className="text-gray-500/60 text-xs leading-relaxed font-mono tracking-widest uppercase">
              No on-chain activity found.<br/>The cosmos is silent.
            </p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="mt-12 py-4 px-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] tracking-[0.2em] text-white/50 hover:text-white transition-all backdrop-blur-sm uppercase"
          >
            Return
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-[3000ms]"
      style={{ backgroundColor: aura.colors.accent }}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.15] z-0 mix-blend-overlay pointer-events-none"></div>

      {/* Fullscreen 3D Canvas Background */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            <AuraOrb profile={aura} />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* UI Overlay */}
      <div className="relative z-10 max-w-[520px] w-full p-4 md:p-8 flex flex-col items-center justify-center py-12">
        
        {/* The Glass Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center bg-black/20 p-8 md:p-12 rounded-[2rem] backdrop-blur-2xl border w-full relative overflow-hidden group shadow-2xl"
          style={{ 
            borderColor: `${aura.colors.core}40`,
            boxShadow: `0 30px 60px -10px rgba(0,0,0,0.5), inset 0 1px 0 ${aura.colors.core}60`
          }}
        >
          {/* Rarity Glow Effects (Legendary/Mythic) */}
          {(aura.rarity === 'Legendary' || aura.rarity === 'Mythic') && (
            <>
              <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white opacity-10 blur-3xl rounded-full"></div>
            </>
          )}
          {aura.rarity === 'Mythic' && (
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)] rounded-[2rem] pointer-events-none"
            />
          )}

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-[9px] md:text-[10px] tracking-[0.5em] text-white/40 mb-6 font-mono font-semibold"
          >
            ON-CHAIN AURA
          </motion.h2>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 1.5, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-serif tracking-tight mb-8" 
            style={{ 
              color: '#fff', 
              textShadow: `0 0 40px ${aura.colors.bloom}, 0 0 80px ${aura.colors.core}`,
              fontWeight: 300
            }}
          >
            {aura.colors.name}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="inline-block px-5 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] bg-black/40 backdrop-blur-md font-mono" 
            style={{ 
              border: `1px solid ${aura.colors.core}80`, 
              color: aura.colors.edge,
              boxShadow: aura.rarity === 'Mythic' ? `0 0 20px ${aura.colors.core}40` : 'none'
            }}
          >
            {aura.rarity} TIER
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 1 }}
            className="grid grid-cols-3 gap-2 md:gap-4 mt-12 mb-10 text-sm font-mono"
          >
            <div className="flex flex-col items-center">
              <span className="text-white/30 text-[9px] mb-2 uppercase tracking-[0.2em]">Energy</span>
              <span className="text-lg md:text-xl font-light">{aura.energyLevel}%</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/5">
              <span className="text-white/30 text-[9px] mb-2 uppercase tracking-[0.2em]">Archetype</span>
              <span className="text-[10px] md:text-xs text-center px-1 md:px-2 leading-tight uppercase tracking-wider">{aura.archetype}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white/30 text-[9px] mb-2 uppercase tracking-[0.2em]">Spirit</span>
              <span className="text-[10px] md:text-xs text-center px-1 md:px-2 leading-tight uppercase tracking-wider">{aura.spiritAnimal}</span>
            </div>
          </motion.div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 2 }}
            className="text-white/80 font-serif text-lg md:text-xl leading-relaxed italic text-center px-2 md:px-6 font-light"
          >
            "{aura.destiny}"
          </motion.p>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 1 }}
          onClick={() => router.push('/')}
          className="mt-12 py-4 px-8 rounded-full bg-black/20 hover:bg-white/10 border border-white/10 text-[10px] text-white/50 hover:text-white transition-all backdrop-blur-md font-mono tracking-[0.2em] uppercase"
        >
          Read another wallet
        </motion.button>
      </div>
    </div>
  );
}
