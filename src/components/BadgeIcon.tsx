import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Badge } from '../utils/badges';
import { CONFIG } from '../config';

interface BadgeIconProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({ 
  badge, 
  size = 'medium', 
  showTooltip = true 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(badge.imagePath);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeMap = {
    small: 20,
    medium: 24,
    large: 32
  };

  const iconSize = sizeMap[size];

  // IPFS gateway fallback logic
  const tryLoadImage = (url: string, timeout = 3000): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timer = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        reject(new Error('Timeout'));
      }, timeout);

      img.onload = () => {
        clearTimeout(timer);
        resolve(url);
      };

      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error('Failed to load'));
      };

      img.src = url;
    });
  };

  const loadImageWithFallback = async () => {
    if (!badge.imagePath) {
      setImageError(true);
      setImageLoading(false);
      return;
    }

    // If it's not an IPFS URL, load directly
    if (!badge.imagePath.includes('ipfs/')) {
      setCurrentImageUrl(badge.imagePath);
      setImageLoading(false);
      return;
    }

    // Extract IPFS hash from the path
    const ipfsHash = badge.imagePath.split('ipfs/')[1];
    if (!ipfsHash) {
      setImageError(true);
      setImageLoading(false);
      return;
    }

    // Try each IPFS gateway
    for (let i = 0; i < CONFIG.IPFS_GATEWAYS.length; i++) {
      try {
        const gatewayUrl = `${CONFIG.IPFS_GATEWAYS[i]}${ipfsHash}`;
        await tryLoadImage(gatewayUrl);
        setCurrentImageUrl(gatewayUrl);
        setImageLoading(false);
        return;
      } catch (error) {
        // Continue to next gateway
        continue;
      }
    }

    // All gateways failed
    setImageError(true);
    setImageLoading(false);
  };

  useEffect(() => {
    loadImageWithFallback();
  }, [badge.imagePath]);

  const badgeIcon = (
    <Box
      sx={{
        width: iconSize,
        height: iconSize,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: imageError ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        cursor: showTooltip ? 'help' : 'default',
        '&:hover': showTooltip ? {
          transform: 'scale(1.1)',
          border: '1px solid rgba(102, 179, 255, 0.5)',
          boxShadow: '0 2px 8px rgba(102, 179, 255, 0.3)'
        } : {}
      }}
    >
      {!imageError && !imageLoading ? (
        <img
          src={currentImageUrl}
          alt={badge.displayName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
      ) : imageLoading ? (
        <Box
          sx={{
            fontSize: size === 'small' ? '6px' : size === 'medium' ? '8px' : '10px',
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
            fontWeight: 'normal'
          }}
        >
          ...
        </Box>
      ) : (
        <Box
          sx={{
            fontSize: size === 'small' ? '8px' : size === 'medium' ? '10px' : '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '1'
          }}
        >
          {badge.key.charAt(0).toUpperCase()}
        </Box>
      )}
    </Box>
  );

  if (showTooltip) {
    return (
      <Tooltip 
        title={badge.displayName}
        placement="top"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'var(--card-bg, #2a2a2a)',
              color: 'var(--text-primary, #fff)',
              border: '1px solid var(--border-color, #404040)',
              fontSize: '0.75rem',
              fontWeight: 500
            }
          },
          arrow: {
            sx: {
              color: 'var(--card-bg, #2a2a2a)'
            }
          }
        }}
      >
        {badgeIcon}
      </Tooltip>
    );
  }

  return badgeIcon;
};

export default BadgeIcon;