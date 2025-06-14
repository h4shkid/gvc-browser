import { NFT } from '../hooks/useCSV';

export const TRAIT_CATEGORIES = ['gender', 'background', 'body', 'face', 'hair', 'type'];

export interface TraitFilterOptions {
  [category: string]: {
    [value: string]: number;
  };
}

export function extractTraitFilterOptions(nfts: NFT[]): TraitFilterOptions {
  const options: TraitFilterOptions = {};

  TRAIT_CATEGORIES.forEach(category => {
    options[category] = {};
  });

  nfts.forEach(nft => {
    TRAIT_CATEGORIES.forEach(category => {
      const value = nft[category as keyof NFT] as string;
      if (value) {
        if (!options[category][value]) {
          options[category][value] = 0;
        }
        options[category][value]++;
      }
    });
  });

  return options;
} 