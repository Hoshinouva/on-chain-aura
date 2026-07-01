export type ArchetypeId = 'restless_degen' | 'yield_nomad' | 'chain_elder';
export type RarityTier = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface AuraProfile {
  address: string;
  archetype: string;
  archetypeId: ArchetypeId;
  spiritAnimal: string;
  destiny: string;
  lore: string;
  energyLevel: number; // 0-100
  rarity: RarityTier;
  isVoid?: boolean;
  colors: {
    name: string;
    core: string;
    edge: string;
    bloom: string;
    accent: string;
  };
}

// Map age/exploration to color palletes
const AURA_COLORS = {
  celestial_indigo: { name: 'Celestial Indigo', core: '#243B8A', edge: '#7B61FF', bloom: '#8A7DFF', accent: '#0B1026' },
  solar_gold: { name: 'Solar Gold', core: '#D4A017', edge: '#FFD76A', bloom: '#FFF1B3', accent: '#1A1405' },
  radioactive_green: { name: 'Radioactive Green', core: '#00FF85', edge: '#B6FF00', bloom: '#8AFFB8', accent: '#04140A' },
  crimson_nova: { name: 'Crimson Nova', core: '#C1121F', edge: '#FF5A5F', bloom: '#FF9AA2', accent: '#170304' },
  astral_white: { name: 'Astral White', core: '#DDEBFF', edge: '#FFFFFF', bloom: '#FFFFFF', accent: '#05070B' },
  ether_silver: { name: 'Ether Silver', core: '#AAB6D6', edge: '#E6ECFF', bloom: '#FFFFFF', accent: '#0E1018' },
  obsidian_purple: { name: 'Obsidian Purple', core: '#2A183B', edge: '#8E44FF', bloom: '#B57DFF', accent: '#09040F' }
};

import textBanks from '../data/aura-banks.json';

// Simple deterministic hash function from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function generateAura(
  address: string,
  ageInDays: number,
  txCount: number,
  chainsExplored: number
): AuraProfile {

  // Intercept Void state if absolutely no history (determined by fetcher falling back to 0 on exact query)
  if (txCount === 0) {
    return {
      address,
      archetype: 'The Void',
      archetypeId: 'restless_degen', // default structural
      spiritAnimal: 'None',
      destiny: 'The cosmos is silent.',
      lore: 'No activity detected.',
      energyLevel: 0,
      rarity: 'Common',
      isVoid: true,
      colors: { name: 'Void', core: '#000', edge: '#111', bloom: '#000', accent: '#000' }
    };
  }

  const seed = hashString(address);
  
  // 1. Archetype (Age)
  let archetypeId: ArchetypeId;
  let archetypeGroup: 'new' | 'mid' | 'old';
  
  if (ageInDays > 1095) { // 3+ years
    archetypeGroup = 'old';
    archetypeId = 'chain_elder';
  } else if (ageInDays > 365) { // 1-3 years
    archetypeGroup = 'mid';
    archetypeId = 'yield_nomad';
  } else {
    archetypeGroup = 'new';
    archetypeId = 'restless_degen';
  }
  const archetype = textBanks.archetypes[archetypeGroup];

  // 2. Energy (Tx Count - Log Scale)
  // 10 tx ≈ 20%, 100 tx ≈ 50%, 1000 tx ≈ 95%
  let energyLevel = Math.floor(Math.log10(Math.max(txCount, 1)) * 31.6);
  if (energyLevel < 5) energyLevel = 5;
  if (energyLevel > 99) energyLevel = 99;

  // 3. Aura Color (Age + Exploration)
  let color = AURA_COLORS.ether_silver; // default
  const highExploration = chainsExplored > 2;

  if (archetypeGroup === 'old' && highExploration) color = AURA_COLORS.celestial_indigo;
  if (archetypeGroup === 'old' && !highExploration) color = AURA_COLORS.solar_gold;
  if (archetypeGroup === 'new' && highExploration) color = AURA_COLORS.radioactive_green;
  if (archetypeGroup === 'new' && !highExploration) color = AURA_COLORS.crimson_nova;
  if (archetypeGroup === 'mid' && highExploration) color = AURA_COLORS.obsidian_purple;
  
  // 4. Rarity (Age Score + Activity Score + Exploration Score)
  const ageScore = ageInDays > 1000 ? 3 : ageInDays > 300 ? 2 : 1;
  const actScore = txCount > 500 ? 3 : txCount > 50 ? 2 : 1;
  const expScore = chainsExplored > 4 ? 3 : chainsExplored > 1 ? 2 : 1;
  
  const totalScore = ageScore + actScore + expScore;
  let rarity: RarityTier = 'Common';
  if (totalScore >= 9) rarity = 'Mythic';
  else if (totalScore >= 8) rarity = 'Legendary';
  else if (totalScore >= 7) rarity = 'Epic';
  else if (totalScore >= 5) rarity = 'Rare';

  // Override to Astral White if Mythic (Rarest of rare)
  if (rarity === 'Mythic') color = AURA_COLORS.astral_white;

  // 5. Spirit Animal
  const animalIndex = seed % textBanks.animals.length;
  const spiritAnimal = textBanks.animals[animalIndex];

  // 6. Destiny
  const destinies = textBanks.destinies[archetypeId];
  const destinyIndex = seed % destinies.length;
  const destiny = destinies[destinyIndex];

  return {
    address,
    archetype: archetype.name,
    archetypeId,
    spiritAnimal,
    destiny,
    lore: archetype.lore,
    energyLevel,
    rarity,
    colors: color
  };
}