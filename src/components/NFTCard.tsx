import React, { useState, useRef, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Mosaic } from 'react-loading-indicators';
import { useEthPrice } from '../hooks/useEthPrice';
import BadgesList from './BadgesList';
import { loadBadgeData, getNFTBadges, BadgeData } from '../utils/badges';

interface Listing {
  price: number;
  currency: string;
  url: string;
  hasActivity: boolean;
  listing: any;
}

interface NFT {
  id: string;
  name: string;
  image: string;
  badge1?: string;
  badge2?: string;
  badge3?: string;
  badge4?: string;
  badge5?: string;
  traits: {
    [key: string]: string;
  };
  listing?: Listing;
}

interface Props {
  nft: NFT;
  listing?: Listing;
  onClick?: () => void;
  onImageLoad?: (nftId: string) => void;
}

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://ipfs.filebase.io/ipfs/',
  'https://gateway.ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://nftstorage.link/ipfs/',
  'https://w3s.link/ipfs/',
  'https://gateway.pinata.cloud/ipfs/'
];

function getIpfsPath(url: string): string {
  if (!url) return '';
  if (url.startsWith('ipfs://')) {
    return url.slice(7);
  }
  const match = url.match(/\/ipfs\/(.+)/);
  return match ? match[1] : url;
}

const NFTCard: React.FC<Props> = ({ nft, listing, onClick, onImageLoad }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [gatewayIndex, setGatewayIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [badgeData, setBadgeData] = useState<BadgeData>({});
  const imgRef = useRef<HTMLImageElement>(null);
  const ethPrice = useEthPrice();

  useEffect(() => {
    loadBadgeData().then(setBadgeData);
  }, []);

  const ipfsPath = getIpfsPath(nft.image);
  const imageUrl = ipfsPath ? IPFS_GATEWAYS[gatewayIndex] + ipfsPath : '';
  const nftBadges = getNFTBadges(nft, badgeData);

  const handleImageError = () => {
    if (gatewayIndex < IPFS_GATEWAYS.length - 1) {
      setGatewayIndex(gatewayIndex + 1);
    } else {
      setImgError(true);
      setImageLoading(false);
      onImageLoad?.(nft.id); // Consider error as "loaded" for grid display purposes
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImgError(false);
    onImageLoad?.(nft.id);
  };

  return (
    <Card
      sx={{
        background: 'var(--card-bg, #2a2a2a)',
        color: 'var(--text-primary, #fff)',
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        minHeight: nftBadges.length > 0 ? 420 : 380,
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 8 },
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#181a20', flex: '0 0 auto' }}>
        {imageLoading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#181a20' }}>
            <Mosaic color="#66b3ff" size="medium" text="" textColor="" />
          </Box>
        )}
        {!imgError && imageUrl ? (
          <CardMedia
            component="img"
            ref={imgRef}
            src={imageUrl}
            alt={nft.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imageLoading ? 'none' : 'block',
            }}
          />
        ) : (
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#181a20', color: '#fff' }}>
            Image not available
          </Box>
        )}
      </Box>
      
      {/* Badge Section */}
      {nftBadges.length > 0 && (
        <Box sx={{
          px: 2,
          py: 1,
          borderTop: nftBadges.length > 0 ? '1px solid var(--border-color, #404040)' : 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48
        }}>
          <BadgesList 
            badges={nftBadges} 
            size="large" 
            maxVisible={5}
          />
        </Box>
      )}
      
      <CardContent sx={{
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderTop: '1px solid var(--border-color, #404040)',
        minHeight: 56,
        width: '100%',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
          {listing ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-primary, #fff)' }}>
                  {listing.price.toFixed(3)}
                </Typography>
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1em', marginLeft: 2 }}>Ξ</span>
                </Box>
              </Box>
              {ethPrice && (
                <Typography variant="caption" sx={{ color: 'var(--text-secondary, #aaa)', fontWeight: 500, fontSize: '0.85em', mt: 0.5 }}>
                  ${(listing.price * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('$','')}
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" sx={{ color: 'var(--text-secondary, #aaa)' }}>
              Not listed
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary, #aaa)', fontWeight: 600 }}>
            {nft.id}
          </Typography>
          {listing && (
            <IconButton
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#66b3ff', p: 0.5 }}
              onClick={e => e.stopPropagation()}
              size="small"
            >
              <img src="/images/opensea-logo.svg" alt="OpenSea" style={{ width: 20, height: 20, display: 'block' }} />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NFTCard; 