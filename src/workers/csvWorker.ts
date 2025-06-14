import { parseCSVLine } from '../utils/csv';

self.onmessage = (e: MessageEvent<string>) => {
  const csvText = e.data;
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

  (self as unknown as Worker).postMessage(nfts);
}; 