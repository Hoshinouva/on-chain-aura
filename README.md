# On-Chain Aura

A crypto-native personality oracle. Read your wallet's energy, discover your archetype, and generate a shareable Aura card based purely on your on-chain behavior.

## Concept
Rather than building a standard financial portfolio tracker, On-Chain Aura translates cold blockchain data (Age, Transaction Count, Chains Explored) into a mystical personality profile (Aura Color, Spirit Animal, Destiny).

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D Visuals:** React Three Fiber, GLSL Shaders, Post-processing Bloom
- **Data Layer:** Covalent API (Primary) / Viem RPCs (Fallback)
- **Share Cards:** Vercel OG (`@vercel/og`)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (see `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Data Fetching Strategy
We use Covalent API to quickly fetch multi-chain transaction summaries. To ensure 100% uptime:
- We ping 5 chains concurrently with a strict 4-second timeout.
- If the Covalent API limits you (429) or times out, it gracefully falls back to querying public RPC nodes via `viem`.
- The data is mapped deterministically to a unique Aura.

## Deployment
This project is optimized for deployment on Vercel. 
The `/api/og` route utilizes Vercel's Edge runtime for lightning-fast image generation when sharing to X/Twitter.