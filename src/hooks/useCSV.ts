import { useEffect, useState } from 'react';

export interface NFT {
  [key: string]: any;
  rarityScore?: number;
}

export function useCSV(path: string) {
  const [data, setData] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let worker: Worker | null = null;
    async function load() {
      try {
        const res = await fetch(path);
        const text = await res.text();
        worker = new Worker(new URL('../workers/csvWorker.ts', import.meta.url), {
          type: 'module'
        });
        worker.postMessage(text);
        worker.onmessage = (e: MessageEvent<NFT[]>) => {
          const nftsWithRarity = calculateRarity(e.data);
          setData(nftsWithRarity);
          setLoading(false);
        };
      } catch (err) {
        setError(String(err));
        setLoading(false);
      }
    }
    load();
    return () => {
      worker?.terminate();
    };
  }, [path]);

  return { data, loading, error };
}

function calculateRarity(nfts: NFT[]): NFT[] {
  if (!nfts || nfts.length === 0) return [];

  const traitCounts: Record<string, Record<string, number>> = {};
  const traitCategories = ['gender', 'background', 'body', 'face', 'hair', 'type'];

  // First, count trait occurrences
  traitCategories.forEach(category => {
    traitCounts[category] = {};
    nfts.forEach(nft => {
      const value = nft[category] as string;
      if (value) {
        traitCounts[category][value] = (traitCounts[category][value] || 0) + 1;
      }
    });
  });

  // Then, calculate rarity score for each NFT
  return nfts.map(nft => {
    let rarityScore = 0;
    traitCategories.forEach(category => {
      const value = nft[category] as string;
      if (value && traitCounts[category][value]) {
        rarityScore += 1 / (traitCounts[category][value] / nfts.length);
      }
    });
    return { ...nft, rarityScore };
  });
} 