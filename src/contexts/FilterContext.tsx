import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { NFT } from '../hooks/useCSV';
import { Listings } from '../hooks/useListings';
import { useCSV } from '../hooks/useCSV';
import { useListings } from '../hooks/useListings';
import { extractTraitFilterOptions, TraitFilterOptions, TRAIT_CATEGORIES } from '../utils/filters';

// Define the shape of our filters
export interface Filters {
  [key: string]: Set<string>;
}

// Define the sort options
export type SortOption = 'price_asc' | 'price_desc' | 'id_asc' | 'id_desc' | 'rarity';

interface FilterContextValue {
  filteredNfts: NFT[];
  totalNfts: number;
  traitFilterOptions: TraitFilterOptions;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: allNfts, loading: nftsLoading } = useCSV();
  const { listings } = useListings();
  const [sort, setSort] = useState<SortOption>('price_desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  const traitFilterOptions = useMemo(() => extractTraitFilterOptions(allNfts), [allNfts]);

  const filteredNfts = useMemo(() => {
    if (nftsLoading) return [];

    const searchableNfts = allNfts.filter(nft => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      // Check token ID
      if (nft.token_id.toString().includes(term)) return true;
      // Check traits
      for (const category of TRAIT_CATEGORIES) {
        const value = nft[category as keyof NFT] as string;
        if (value && value.toLowerCase().includes(term)) {
          return true;
        }
      }
      return false;
    });

    const filtered = searchableNfts.filter(nft => {
      // Trait filters
      for (const category in filters) {
        if (filters[category].size > 0) {
          const value = nft[category as keyof NFT] as string;
          if (!filters[category].has(value)) {
            return false;
          }
        }
      }
      return true;
    });

    // Sorting logic
    const sorted = [...filtered].sort((a, b) => {
      const aListing = listings[a.token_id as string];
      const bListing = listings[b.token_id as string];
      if (!aListing && !bListing) return 0;
      if (!aListing) return 1;
      if (!bListing) return -1;

      switch (sort) {
        case 'price_asc':
          return aListing.price - bListing.price;
        case 'price_desc':
          return bListing.price - aListing.price;
        case 'id_asc':
          return parseInt(a.token_id as string) - parseInt(b.token_id as string);
        case 'id_desc':
          return parseInt(b.token_id as string) - parseInt(a.token_id as string);
        case 'rarity':
          return (b.rarityScore || 0) - (a.rarityScore || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [allNfts, listings, sort, nftsLoading, searchTerm, filters]);

  const value = {
    filteredNfts,
    totalNfts: allNfts.length,
    traitFilterOptions,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}; 