// Image utility functions for handling WebP and IPFS images

export interface ImageLoadResult {
  url: string;
  isWebP: boolean;
  success: boolean;
}

/**
 * Generate WebP image URL from token ID
 */
export function getWebPImageUrl(tokenId: string): string {
  return `${import.meta.env.BASE_URL}nfts/${tokenId}.webp`;
}

/**
 * Generate IPFS image URL with gateway fallback system
 */
export function getIpfsImageUrl(ipfsUrl: string, gatewayIndex: number = 0): string {
  const IPFS_GATEWAYS = [
    'https://ipfs.io/ipfs/',
    'https://ipfs.filebase.io/ipfs/',
    'https://gateway.ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
    'https://nftstorage.link/ipfs/',
    'https://w3s.link/ipfs/',
    'https://gateway.pinata.cloud/ipfs/'
  ];

  if (!ipfsUrl) return '';
  
  let ipfsPath = ipfsUrl;
  if (ipfsUrl.startsWith('ipfs://')) {
    ipfsPath = ipfsUrl.slice(7);
  } else {
    const match = ipfsUrl.match(/\/ipfs\/(.+)/);
    ipfsPath = match ? match[1] : ipfsUrl;
  }

  const gateway = IPFS_GATEWAYS[gatewayIndex] || IPFS_GATEWAYS[0];
  return gateway + ipfsPath;
}

/**
 * Test if an image URL can be loaded successfully
 */
export function testImageLoad(url: string, timeout: number = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    const img = new Image();
    const timeoutId = setTimeout(() => {
      resolve(false);
    }, timeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      resolve(false);
    };

    img.src = url;
  });
}

/**
 * Smart image loading strategy: Try WebP first, fallback to IPFS
 */
export async function loadOptimalImage(
  tokenId: string, 
  ipfsUrl: string,
  preferWebP: boolean = true
): Promise<ImageLoadResult> {
  
  if (preferWebP) {
    // Try WebP first
    const webpUrl = getWebPImageUrl(tokenId);
    const webpSuccess = await testImageLoad(webpUrl, 2000);
    
    if (webpSuccess) {
      return {
        url: webpUrl,
        isWebP: true,
        success: true
      };
    }
  }

  // Fallback to IPFS with gateway rotation
  const IPFS_GATEWAYS = [
    'https://ipfs.io/ipfs/',
    'https://ipfs.filebase.io/ipfs/',
    'https://gateway.ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
    'https://nftstorage.link/ipfs/',
    'https://w3s.link/ipfs/',
    'https://gateway.pinata.cloud/ipfs/'
  ];

  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    const ipfsImageUrl = getIpfsImageUrl(ipfsUrl, i);
    const ipfsSuccess = await testImageLoad(ipfsImageUrl, 3000);
    
    if (ipfsSuccess) {
      return {
        url: ipfsImageUrl,
        isWebP: false,
        success: true
      };
    }
  }

  // All attempts failed
  return {
    url: '',
    isWebP: false,
    success: false
  };
}

/**
 * Gateway performance cache for IPFS optimization
 */
const gatewayCache = new Map<string, number>();

/**
 * Get cached best gateway index for an IPFS path
 */
export function getCachedGatewayIndex(ipfsPath: string): number {
  const cacheKey = ipfsPath.split('/')[0];
  return gatewayCache.get(cacheKey) || 0;
}

/**
 * Cache successful gateway index for future use
 */
export function cacheGatewayIndex(ipfsPath: string, gatewayIndex: number): void {
  const cacheKey = ipfsPath.split('/')[0];
  gatewayCache.set(cacheKey, gatewayIndex);
}

/**
 * For modal/popup: Always prefer IPFS for highest quality
 */
export async function loadHighQualityImage(ipfsUrl: string): Promise<ImageLoadResult> {
  return loadOptimalImage('', ipfsUrl, false); // preferWebP = false for high quality
}

/**
 * For grid display: Prefer WebP for fast loading
 */
export async function loadGridImage(tokenId: string, ipfsUrl: string): Promise<ImageLoadResult> {
  const result = await loadOptimalImage(tokenId, ipfsUrl, true); // preferWebP = true for speed
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`NFT ${tokenId}: ${result.isWebP ? 'WebP' : 'IPFS'} - ${result.success ? 'Success' : 'Failed'}`);
  }
  
  return result;
}