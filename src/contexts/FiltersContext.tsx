import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadBadgeData, getBadgeDisplayName, BadgeData } from '../utils/badges';

interface FilterOptions {
  gender: Record<string, number>;
  color_group: Record<string, number>;
  color_count: Record<string, number>;
  type_color: Record<string, number>;
  type_type: Record<string, number>;
  body_color: Record<string, number>;
  hair_color: Record<string, number>;
  face_color: Record<string, number>;
  badges: Record<string, number>;
  badgeCount: Record<string, number>;
  body: {
    main: Record<string, number>;
    byType: Record<string, Record<string, number>>;
  };
  background: {
    main: Record<string, number>;
    byType: Record<string, Record<string, number>>;
  };
  face: {
    main: Record<string, number>;
    byType: Record<string, Record<string, number>>;
  };
  hair: {
    main: Record<string, number>;
    byType: Record<string, Record<string, number>>;
  };
}

interface Filters {
  gender: string[];
  color_group: string[];
  color_count: string[];
  type_color: string[];
  type_type: string[];
  body_color: string[];
  hair_color: string[];
  face_color: string[];
  badges: string[];
  badgeCount: string[];
  body: string[];
  background: string[];
  face: string[];
  hair: string[];
  listed: boolean;
  search: string;
  sort: string;
}

export interface SearchSuggestion {
  type: 'trait' | 'token_id';
  category: string;
  value: string;
  count: number;
  label: string;
}

interface FiltersContextType {
  filters: Filters;
  filterOptions: FilterOptions;
  totalNfts: number;
  filteredCount: number;
  setFilter: (category: keyof Filters, value: string | string[] | boolean) => void;
  clearFilters: () => void;
  applyFilters: (nfts: any[]) => any[];
  applySorting: (nfts: any[], listings: any) => any[];
  getSearchSuggestions: (query: string) => SearchSuggestion[];
  setFilteredCount: (count: number) => void;
}

const defaultFilters: Filters = {
  gender: [],
  color_group: [],
  color_count: [],
  type_color: [],
  type_type: [],
  body_color: [],
  hair_color: [],
  face_color: [],
  badges: [],
  badgeCount: [],
  body: [],
  background: [],
  face: [],
  hair: [],
  listed: false,
  search: '',
  sort: 'price_asc',
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [totalNfts, setTotalNfts] = useState<number>(0);
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [badgeData, setBadgeData] = useState<BadgeData>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    gender: {},
    color_group: {},
    color_count: {},
    type_color: {},
    type_type: {},
    body_color: {},
    hair_color: {},
    face_color: {},
    badges: {},
    badgeCount: {},
    body: { main: {}, byType: {} },
    background: { main: {}, byType: {} },
    face: { main: {}, byType: {} },
    hair: { main: {}, byType: {} },
  });

  // Load badge data
  useEffect(() => {
    loadBadgeData().then(setBadgeData);
  }, []);

  const setFilter = (category: keyof Filters, value: string | string[] | boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const applyFilters = useCallback((nfts: any[]) => {
    return nfts.filter(nft => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = ['tokenId', 'gender', 'background', 'body', 'face', 'hair', 'type'];
        const matchesSearch = searchableFields.some(field => 
          String(nft[field]).toLowerCase().includes(searchTerm)
        );
        if (!matchesSearch) return false;
      }

      // Listed filter
      if (filters.listed && !nft.listing) return false;

      // Trait filters
      const traitFilters = [
        'gender', 'color_group', 'color_count', 'type_color', 'type_type',
        'body_color', 'hair_color', 'face_color', 'body', 'background', 'face', 'hair'
      ];

      const traitMatch = traitFilters.every(trait => {
        const filterValue = filters[trait as keyof Filters];
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          return filterValue.includes(nft[trait]);
        }
        return true;
      });

      if (!traitMatch) return false;

      // Badge filters
      if (filters.badges.length > 0) {
        const nftBadges = [];
        for (let i = 1; i <= 5; i++) {
          const badge = nft[`badge${i}`];
          if (badge && badge.trim()) {
            nftBadges.push(badge.trim());
          }
        }
        
        // Check if NFT has any of the selected badges
        const hasBadge = filters.badges.some(selectedBadge => 
          nftBadges.includes(selectedBadge)
        );
        if (!hasBadge) return false;
      }

      // Badge count filters
      if (filters.badgeCount.length > 0) {
        const nftBadges = [];
        for (let i = 1; i <= 5; i++) {
          const badge = nft[`badge${i}`];
          if (badge && badge.trim()) {
            nftBadges.push(badge.trim());
          }
        }
        
        const badgeCount = nftBadges.length.toString();
        if (!filters.badgeCount.includes(badgeCount)) return false;
      }

      return true;
    });
  }, [filters]);

  const applySorting = useCallback((nfts: any[], listings: any) => {
    const sortedNfts = [...nfts];
    
    switch (filters.sort) {
      case 'price_asc':
        return sortedNfts.sort((a, b) => {
          const aListing = listings[a.id];
          const bListing = listings[b.id];
          if (aListing && bListing) {
            return aListing.price - bListing.price;
          } else if (aListing) {
            return -1; // Listed items first
          } else if (bListing) {
            return 1;
          } else {
            return parseInt(a.token_id || a.id) - parseInt(b.token_id || b.id); // Sort by token ID if no listings
          }
        });
        
      case 'price_desc':
        return sortedNfts.sort((a, b) => {
          const aListing = listings[a.id];
          const bListing = listings[b.id];
          if (aListing && bListing) {
            return bListing.price - aListing.price;
          } else if (aListing) {
            return -1; // Listed items first
          } else if (bListing) {
            return 1;
          } else {
            return parseInt(a.token_id || a.id) - parseInt(b.token_id || b.id);
          }
        });
        
      case 'token_id_asc':
        return sortedNfts.sort((a, b) => {
          return parseInt(a.token_id || a.id) - parseInt(b.token_id || b.id);
        });
        
      case 'token_id_desc':
        return sortedNfts.sort((a, b) => {
          return parseInt(b.token_id || b.id) - parseInt(a.token_id || a.id);
        });
        
      case 'rarity_asc':
        return sortedNfts.sort((a, b) => {
          const aRarity = a.rarityScore || 0;
          const bRarity = b.rarityScore || 0;
          return aRarity - bRarity;
        });
        
      case 'rarity_desc':
        return sortedNfts.sort((a, b) => {
          const aRarity = a.rarityScore || 0;
          const bRarity = b.rarityScore || 0;
          return bRarity - aRarity;
        });
        
      default:
        return sortedNfts;
    }
  }, [filters.sort]);

  const getSearchSuggestions = (query: string): SearchSuggestion[] => {
    if (!query || query.length < 1) return [];
    
    const lowerQuery = query.toLowerCase();
    const suggestions: SearchSuggestion[] = [];
    
    // Token ID suggestions
    const matchingTokenIds = tokenIds.filter(id => 
      id.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
    
    matchingTokenIds.forEach(tokenId => {
      suggestions.push({
        type: 'token_id',
        category: 'Token ID',
        value: tokenId,
        count: 1,
        label: `Token #${tokenId}`
      });
    });

    // Simple trait suggestions
    const simpleTraits = [
      { key: 'gender', label: 'Gender' },
      { key: 'color_group', label: 'Color Group' },
      { key: 'color_count', label: 'Color Count' },
      { key: 'type_color', label: 'Type Color' },
      { key: 'type_type', label: 'Type' },
      { key: 'body_color', label: 'Body Color' },
      { key: 'hair_color', label: 'Hair Color' },
      { key: 'face_color', label: 'Face Color' },
      { key: 'badges', label: 'Badge' }
    ];

    simpleTraits.forEach(({ key, label }) => {
      const options = filterOptions[key as keyof FilterOptions] as Record<string, number>;
      if (options) {
        Object.entries(options).forEach(([value, count]) => {
          // Special handling for badges to show display names
          if (key === 'badges') {
            const displayName = getBadgeDisplayName(value, badgeData);
            if (displayName.toLowerCase().includes(lowerQuery) || value.toLowerCase().includes(lowerQuery)) {
              suggestions.push({
                type: 'trait',
                category: label,
                value, // Keep the original badge key for filtering
                count,
                label: `${label}: ${displayName} (${count})`
              });
            }
          } else {
            // Regular trait handling
            if (value.toLowerCase().includes(lowerQuery)) {
              suggestions.push({
                type: 'trait',
                category: label,
                value,
                count,
                label: `${label}: ${value} (${count})`
              });
            }
          }
        });
      }
    });

    // Hierarchical trait suggestions
    const hierarchicalTraits = [
      { key: 'body', label: 'Body' },
      { key: 'background', label: 'Background' },
      { key: 'face', label: 'Face' },
      { key: 'hair', label: 'Hair' }
    ];

    hierarchicalTraits.forEach(({ key, label }) => {
      const options = filterOptions[key as keyof FilterOptions] as { main: Record<string, number>; byType: Record<string, Record<string, number>> };
      if (options && options.byType) {
        Object.entries(options.byType).forEach(([type, styles]) => {
          Object.entries(styles).forEach(([style, count]) => {
            if (style.toLowerCase().includes(lowerQuery)) {
              suggestions.push({
                type: 'trait',
                category: label,
                value: style,
                count,
                label: `${label}: ${style} (${count})`
              });
            }
          });
        });
      }
    });

    // Sort by relevance (exact matches first, then by count)
    return suggestions
      .sort((a, b) => {
        const aExact = a.value.toLowerCase() === lowerQuery;
        const bExact = b.value.toLowerCase() === lowerQuery;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return b.count - a.count;
      })
      .slice(0, 20);
  };

  // Load filter options from CSV data
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetch('/data/gvc_data.csv');
        const csvText = await response.text();
        let rows = csvText.split('\n').slice(1);
        rows = rows.filter(row => row.trim() !== '');
        
        const options = {
          gender: new Set<string>(),
          background: new Set<string>(),
          background_type: new Set<string>(),
          body: new Set<string>(),
          body_type: new Set<string>(),
          body_style: new Set<string>(),
          body_color: new Set<string>(),
          face: new Set<string>(),
          face_type: new Set<string>(),
          face_style: new Set<string>(),
          face_color: new Set<string>(),
          hair: new Set<string>(),
          hair_type: new Set<string>(),
          hair_style: new Set<string>(),
          hair_color: new Set<string>(),
          type: new Set<string>(),
          type_type: new Set<string>(),
          type_color: new Set<string>(),
          color_group: new Set<string>(),
          color_count: new Set<string>(),
        };

        rows.forEach(row => {
          const columns = row.split(',');
          if (columns.length > 1) {
            options.gender.add(columns[1] || '');
            options.background.add(columns[2] || '');
            options.background_type.add(columns[3] || '');
            options.body.add(columns[4] || '');
            options.body_type.add(columns[5] || '');
            options.body_style.add(columns[6] || '');
            options.body_color.add(columns[7] || '');
            options.face.add(columns[8] || '');
            options.face_type.add(columns[9] || '');
            options.face_style.add(columns[10] || '');
            options.face_color.add(columns[11] || '');
            options.hair.add(columns[12] || '');
            options.hair_type.add(columns[13] || '');
            options.hair_style.add(columns[14] || '');
            options.hair_color.add(columns[15] || '');
            options.type.add(columns[16] || '');
            options.type_type.add(columns[17] || '');
            options.type_color.add(columns[18] || '');
            options.color_group.add(columns[22] || '');
            options.color_count.add(columns[23] || '');
          }
        });

        // Convert Sets to objects with counts
        const convertToCountObject = (set: Set<string>): Record<string, number> => {
          const obj: Record<string, number> = {};
          Array.from(set).filter(Boolean).forEach(item => {
            obj[item] = 1; // We'll update with actual counts later
          });
          return obj;
        };

        // Count occurrences
        const counts: Record<string, Record<string, number>> = {};
        const hierarchicalCounts: Record<string, { main: Record<string, number>; byType: Record<string, Record<string, number>> }> = {
          body: { main: {}, byType: {} },
          background: { main: {}, byType: {} },
          face: { main: {}, byType: {} },
          hair: { main: {}, byType: {} },
        };

        // Initialize counts
        Object.keys(options).forEach(key => {
          counts[key] = {};
        });
        counts.badges = {};
        counts.badgeCount = {};

        // Count occurrences from rows
        rows.forEach(row => {
          const columns = row.split(',');
          if (columns.length > 1) {
            // Simple counts
            if (columns[1]) counts.gender[columns[1]] = (counts.gender[columns[1]] || 0) + 1;
            if (columns[7]) counts.body_color[columns[7]] = (counts.body_color[columns[7]] || 0) + 1;
            if (columns[11]) counts.face_color[columns[11]] = (counts.face_color[columns[11]] || 0) + 1;
            if (columns[15]) counts.hair_color[columns[15]] = (counts.hair_color[columns[15]] || 0) + 1;
            if (columns[18]) counts.type_color[columns[18]] = (counts.type_color[columns[18]] || 0) + 1;
            if (columns[17]) counts.type_type[columns[17]] = (counts.type_type[columns[17]] || 0) + 1;
            if (columns[22]) counts.color_group[columns[22]] = (counts.color_group[columns[22]] || 0) + 1;
            if (columns[23]) counts.color_count[columns[23]] = (counts.color_count[columns[23]] || 0) + 1;

            // Badge counts (badge1 through badge5 are at columns 24-28)
            let nftBadgeCount = 0;
            for (let i = 1; i <= 5; i++) {
              const badge = columns[23 + i]; // badge1 is at column 24 (index 23+1)
              if (badge && badge.trim()) {
                counts.badges[badge.trim()] = (counts.badges[badge.trim()] || 0) + 1;
                nftBadgeCount++;
              }
            }
            
            // Count NFTs by badge count (0-5)
            const badgeCountKey = nftBadgeCount.toString();
            counts.badgeCount[badgeCountKey] = (counts.badgeCount[badgeCountKey] || 0) + 1;

            // Hierarchical counts
            if (columns[2]) {
              hierarchicalCounts.background.main[columns[2]] = (hierarchicalCounts.background.main[columns[2]] || 0) + 1;
              if (columns[3]) {
                if (!hierarchicalCounts.background.byType[columns[3]]) {
                  hierarchicalCounts.background.byType[columns[3]] = {};
                }
                hierarchicalCounts.background.byType[columns[3]][columns[2]] = (hierarchicalCounts.background.byType[columns[3]][columns[2]] || 0) + 1;
              }
            }
            if (columns[4]) {
              hierarchicalCounts.body.main[columns[4]] = (hierarchicalCounts.body.main[columns[4]] || 0) + 1;
              if (columns[5]) {
                if (!hierarchicalCounts.body.byType[columns[5]]) {
                  hierarchicalCounts.body.byType[columns[5]] = {};
                }
                hierarchicalCounts.body.byType[columns[5]][columns[4]] = (hierarchicalCounts.body.byType[columns[5]][columns[4]] || 0) + 1;
              }
            }
            if (columns[8]) {
              hierarchicalCounts.face.main[columns[8]] = (hierarchicalCounts.face.main[columns[8]] || 0) + 1;
              if (columns[9]) {
                if (!hierarchicalCounts.face.byType[columns[9]]) {
                  hierarchicalCounts.face.byType[columns[9]] = {};
                }
                hierarchicalCounts.face.byType[columns[9]][columns[8]] = (hierarchicalCounts.face.byType[columns[9]][columns[8]] || 0) + 1;
              }
            }
            if (columns[12]) {
              hierarchicalCounts.hair.main[columns[12]] = (hierarchicalCounts.hair.main[columns[12]] || 0) + 1;
              if (columns[13]) {
                if (!hierarchicalCounts.hair.byType[columns[13]]) {
                  hierarchicalCounts.hair.byType[columns[13]] = {};
                }
                hierarchicalCounts.hair.byType[columns[13]][columns[12]] = (hierarchicalCounts.hair.byType[columns[13]][columns[12]] || 0) + 1;
              }
            }
          }
        });

        setFilterOptions({
          gender: counts.gender,
          color_group: counts.color_group,
          color_count: counts.color_count,
          type_color: counts.type_color,
          type_type: counts.type_type,
          body_color: counts.body_color,
          hair_color: counts.hair_color,
          face_color: counts.face_color,
          badges: counts.badges,
          badgeCount: counts.badgeCount,
          body: hierarchicalCounts.body,
          background: hierarchicalCounts.background,
          face: hierarchicalCounts.face,
          hair: hierarchicalCounts.hair,
        });
        setTotalNfts(rows.length);
        setTokenIds(rows.map(row => row.split(',')[0]).filter(Boolean));
      } catch (error) {
        // Handle error silently
      }
    };

    loadFilterOptions();
  }, []);

  return (
    <FiltersContext.Provider value={{ filters, filterOptions, totalNfts, filteredCount, setFilter, clearFilters, applyFilters, applySorting, getSearchSuggestions, setFilteredCount }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}; 