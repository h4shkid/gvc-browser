import { useEffect, useState } from 'react';

export function useEthPrice() {
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const res = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
        const data = await res.json();
        setEthPrice(data.USD);
      } catch (e) {
        setEthPrice(null);
      }
    }
    fetchEthPrice();
    // Optionally refresh every 5 minutes
    const interval = setInterval(fetchEthPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return ethPrice;
} 