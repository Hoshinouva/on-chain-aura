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
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dormant Background Orb */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: loading ? 0 : [0.3, 0.5, 0.3],
            rotate: loading ? 180 : 0
          }}
          transition={{ 
            duration: loading ? 2 : 10, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)' }}
        />
      </div>

      <div className="absolute inset-0 bg-noise opacity-50 z-0 mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-md w-full space-y-12 z-10 relative">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-4 tracking-tight font-light">On-Chain Aura</h1>
          <p className="text-gray-400 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase">What kind of on-chain being are you?</p>
        </div>
        
        {loading ? (
          <div className="text-center space-y-6 h-32 flex flex-col items-center justify-center">
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border border-white/10 border-t-white/80 rounded-full mx-auto mb-4"
            />
            <div className="h-8 relative w-full flex justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0, filter: 'blur(10px)', y: 5 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(10px)', y: -5 }}
                  transition={{ duration: 0.8 }}
                  className="font-mono text-[10px] md:text-xs text-gray-400 tracking-[0.3em] uppercase absolute"
                >
                  {loadingText}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <input 
                  type="text" 
                  placeholder="Enter wallet address (0x...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReveal()}
                  className="relative w-full bg-black/50 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl p-6 font-mono text-xs focus:outline-none focus:border-white/50 transition-all text-center placeholder-gray-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-400/80 text-[10px] font-mono text-center mt-4 tracking-wider uppercase"
                >
                  {error}
                </motion.p>
              )}
            </div>
            <button 
              onClick={handleReveal}
              className="w-full bg-white/90 text-black font-bold py-5 rounded-xl hover:bg-white transition-all text-xs tracking-[0.3em] uppercase shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
            >
              Reveal
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
