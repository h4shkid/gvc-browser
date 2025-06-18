import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BadgeIcon from './BadgeIcon';
import { Badge } from '../utils/badges';

interface BadgesListProps {
  badges: Badge[];
  maxVisible?: number;
  size?: 'small' | 'medium' | 'large';
  direction?: 'row' | 'column';
  showCount?: boolean;
}

const BadgesList: React.FC<BadgesListProps> = ({ 
  badges, 
  maxVisible = 5, 
  size = 'medium',
  direction = 'row',
  showCount = false
}) => {
  if (!badges || badges.length === 0) {
    return null;
  }

  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        alignItems: 'center',
        gap: direction === 'row' ? 0.5 : 0.25,
        flexWrap: direction === 'row' ? 'wrap' : 'nowrap'
      }}
    >
      {visibleBadges.map((badge, index) => (
        <BadgeIcon 
          key={`${badge.key}-${index}`}
          badge={badge} 
          size={size}
          showTooltip={true}
        />
      ))}
      
      {remainingCount > 0 && (
        <Box
          sx={{
            width: size === 'small' ? 20 : size === 'medium' ? 24 : 32,
            height: size === 'small' ? 20 : size === 'medium' ? 24 : 32,
            borderRadius: '50%',
            backgroundColor: 'rgba(247, 77, 113, 0.2)',
            border: '1px solid rgba(247, 77, 113, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size === 'small' ? '10px' : size === 'medium' ? '12px' : '14px',
            color: 'var(--text-primary, #fff)',
            fontWeight: 'bold'
          }}
        >
          +{remainingCount}
        </Box>
      )}
      
      {showCount && badges.length > 0 && (
        <Typography
          variant="caption"
          sx={{
            color: 'var(--text-secondary, #aaa)',
            ml: direction === 'row' ? 1 : 0,
            mt: direction === 'column' ? 0.5 : 0,
            fontSize: '0.7rem'
          }}
        >
          {badges.length} badge{badges.length !== 1 ? 's' : ''}
        </Typography>
      )}
    </Box>
  );
};

export default BadgesList;