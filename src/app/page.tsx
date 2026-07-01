'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-sans mb-3 tracking-tight">On-Chain Aura</h1>
          <p className="text-gray-300 font-mono text-sm tracking-wide">What kind of on-chain being are you?</p>
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
                className="w-full bg-white/5 border border-white/10 rounded-xl p-5 font-mono text-sm focus:outline-none focus:border-white/40 transition-colors text-left placeholder:text-gray-400"
              />
              {error && (
                <p className="text-red-400 text-xs font-mono text-center mt-3">{error}</p>
              )}
            </div>
            <button 
              onClick={handleReveal}
              className="w-full bg-white text-black font-bold py-5 rounded-xl hover:bg-gray-200 transition-all duration-150 ease-out active:scale-[0.97] text-sm tracking-widest uppercase shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              Reveal My Aura
            </button>
          </div>
        )}
      </div>
    </div>
  );
}