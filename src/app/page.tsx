'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import OrbScene from '@/components/OrbScene';
 
export default function Home() {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Consulting the chains...');
  const router = useRouter();

  const handleReveal = () => {
    setError('');
    const trimmed = address.trim();
    if (!trimmed) {
      setError('Please enter a wallet address.');
      return;
    }
    if (!trimmed.startsWith('0x') || trimmed.length !== 42) {
      setError('Please enter a valid 0x wallet address (ENS not yet supported).');
      return;
    }
    
    setLoading(true);
    
    const phrases = [
      'Reading historical energy...',
      'Decoding wallet essence...',
      'Interpreting cosmic transaction patterns...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setLoadingText(phrases[i % phrases.length]);
    }, 1500);

    setTimeout(() => {
      clearInterval(interval);
      router.push(`/aura/${trimmed}`);
    }, 3500);
    };
 
    return (
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        
      {/* 3D Center Object */}
      <OrbScene />
  
      {/* Left Stats Layer */}
      <div className="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col space-y-12 z-10 pointer-events-none">
        <div>
          <p className="text-3xl font-sans mb-1">2.4M+</p>
          <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Wallets Read</p>
          <div className="h-[1px] w-12 bg-white/20 mt-4"></div>
        </div>
        <div>
          <p className="text-3xl font-sans mb-1">99.9%</p>
          <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Aura Accuracy</p>
          <div className="h-[1px] w-12 bg-white/20 mt-4"></div>
        </div>
      </div>
 
      {/* Right Steps Layer */}
      <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col space-y-12 z-10 text-right pointer-events-none">
        <div>
          <p className="text-sm font-sans mb-1 text-gray-300">Connect / 01</p>
          <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Input Wallet</p>
        </div>
        <div>
          <p className="text-sm font-sans mb-1 text-gray-300">Read / 02</p>
          <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Scan Chains</p>
        </div>
        <div>
          <p className="text-sm font-sans mb-1 text-gray-300">Reveal / 03</p>
          <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Discover Aura</p>
        </div>
      </div>
 
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full space-y-16 relative z-10 mt-32 lg:mt-64"
      >
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-7xl font-sans font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 pb-2">
            On-Chain<br />Aura
          </h1>
          <p className="text-gray-400 font-mono text-xs md:text-sm tracking-widest uppercase">What kind of on-chain being are you?</p>
        </div>
         
        {loading ? (
          <div className="text-center space-y-6 h-32 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="h-8 relative w-full flex justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="font-mono text-xs md:text-sm text-gray-400 tracking-widest uppercase absolute"
                >
                  {loadingText}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Enter wallet address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReveal()}
                className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 font-mono text-sm focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 focus:bg-white/10 transition-all duration-300 text-left placeholder:text-gray-600 shadow-inner"
                />
                {error && (
                <p className="text-red-400 text-xs font-mono text-center mt-3">{error}</p>
                )}
                </div>
                <div className="relative group">
                <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-lg group-hover:bg-white/30 transition-all duration-500 opacity-50 group-hover:opacity-100 animate-pulse" style={{ animationDuration: '3s' }} />
                <button 
                onClick={handleReveal}
                className="relative w-full bg-white text-black font-bold py-6 rounded-2xl hover:bg-gray-100 transition-all duration-300 ease-out active:scale-[0.98] text-sm tracking-widest uppercase shadow-xl"
                >
                Reveal My Aura
                </button>
                </div>
                </div>
                )}
                </motion.div>
                </div>
                );
}