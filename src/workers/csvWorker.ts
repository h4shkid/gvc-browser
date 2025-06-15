import { parseCSVLine } from '../utils/csv';

interface WorkerMessage {
  type: 'PARSE_CSV' | 'FILTER_NFTS';
  data: any;
}

interface FilterMessage {
  nfts: any[];
  filters: any;
}

let cachedNfts: any[] = [];

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, data } = e.data;

  switch (type) {
    case 'PARSE_CSV':
      const csvText = data;
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^\uFEFF/, ''));

      const nfts = lines.slice(1)
        .filter(l => l.trim())
        .map(line => {
          const values = parseCSVLine(line);
          const obj: Record<string, string> = {};
          headers.forEach((header, idx) => (obj[header] = values[idx] || ''));
          return obj;
        });

      cachedNfts = nfts; // Cache for future filtering
      (self as unknown as Worker).postMessage({ type: 'PARSED_CSV', data: nfts });
      break;

    case 'FILTER_NFTS':
      // Perform heavy filtering operations in worker thread
      const { nfts: nftsToFilter, filters } = data as FilterMessage;
      
      // Use cached NFTs if available, otherwise use provided
      const targetNfts = nftsToFilter || cachedNfts;
      
      // Basic filtering logic - can be expanded
      const filteredNfts = targetNfts.filter(nft => {
        // Example: search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const tokenId = nft.token_id?.toString().toLowerCase() || '';
          if (!tokenId.includes(searchLower)) {
            return false;
          }
        }
        
        // Add more filter logic here as needed
        return true;
      });

      (self as unknown as Worker).postMessage({ 
        type: 'FILTERED_NFTS', 
        data: filteredNfts 
      });
      break;

    default:
      // Backward compatibility - treat as CSV parsing
      const csvTextLegacy = e.data as unknown as string;
      const linesLegacy = csvTextLegacy.split('\n');
      const headersLegacy = linesLegacy[0].split(',').map(h => h.trim().replace(/^\uFEFF/, ''));

      const nftsLegacy = linesLegacy.slice(1)
        .filter(l => l.trim())
        .map(line => {
          const values = parseCSVLine(line);
          const obj: Record<string, string> = {};
          headersLegacy.forEach((header, idx) => (obj[header] = values[idx] || ''));
          return obj;
        });

      (self as unknown as Worker).postMessage(nftsLegacy);
      break;
  }
}; 