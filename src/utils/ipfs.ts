import { CONFIG } from '../config';

export function ipfsToUrl(ipfsPath: string, gatewayIndex = 0): string {
  const path = ipfsPath.replace('ipfs://', '');
  return `${CONFIG.IPFS_GATEWAYS[gatewayIndex]}${path}`;
}

export function getImageField(obj: Record<string, any>): string {
  // The user confirmed the header is 'image_original_url'.
  // This is a more direct approach to ensure we get the correct field.
  return (obj['image_original_url'] as string) || '';
} 