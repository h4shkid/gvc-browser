import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Badge } from '../utils/badges';

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

  const sizeMap = {
    small: 20,
    medium: 24,
    large: 32
  };

  const iconSize = sizeMap[size];

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
      {!imageError ? (
        <img
          src={badge.imagePath}
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