import { parseCSVLine } from './csv';

export interface Badge {
  key: string;
  displayName: string;
  imagePath: string;
}

export interface BadgeData {
  [key: string]: Badge;
}

let badgeDataCache: BadgeData | null = null;

export async function loadBadgeData(): Promise<BadgeData> {
  if (badgeDataCache) {
    return badgeDataCache;
  }

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/badges.csv`);
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    const badgeData: BadgeData = {};
    
    dataLines.forEach(line => {
      const [key, displayName] = parseCSVLine(line);
      if (key && displayName) {
        badgeData[key.trim()] = {
          key: key.trim(),
          displayName: displayName.trim(),
          imagePath: `${import.meta.env.BASE_URL}badges/${key.trim()}.png`
        };
      }
    });
    
    badgeDataCache = badgeData;
    return badgeData;
  } catch (error) {
    console.error('Failed to load badge data:', error);
    return {};
  }
}

export function getBadgeInfo(badgeKey: string, badgeData: BadgeData): Badge | null {
  if (!badgeKey || !badgeData[badgeKey]) {
    return null;
  }
  return badgeData[badgeKey];
}

export function getNFTBadges(nft: any, badgeData: BadgeData): Badge[] {
  const badges: Badge[] = [];
  
  // Check badge1 through badge5 fields
  for (let i = 1; i <= 5; i++) {
    const badgeKey = nft[`badge${i}`];
    if (badgeKey && badgeKey.trim()) {
      const badge = getBadgeInfo(badgeKey.trim(), badgeData);
      if (badge) {
        badges.push(badge);
      }
    }
  }
  
  return badges;
}

export function getBadgeImageUrl(badgeKey: string): string {
  return `/badges/${badgeKey}.png`;
}

export function getAllBadgeKeys(badgeData: BadgeData): string[] {
  return Object.keys(badgeData);
}

export function getBadgeDisplayName(badgeKey: string, badgeData: BadgeData): string {
  const badge = getBadgeInfo(badgeKey, badgeData);
  return badge ? badge.displayName : badgeKey;
}