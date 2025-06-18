import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useFilters, type ActiveFilter } from '../contexts/FiltersContext';

const FilterTags: React.FC = () => {
  const { getActiveFilters, removeFilter, clearFilters } = useFilters();
  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Box sx={{ 
      px: { xs: 2, md: 3 }, 
      py: 2, 
      borderBottom: '1px solid var(--border-color, #404040)',
      backgroundColor: 'var(--bg, #000000)'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        flexWrap: 'wrap',
        maxWidth: 1600,
        margin: '0 auto'
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'var(--text-secondary, #aaa)', 
            fontWeight: 600,
            mr: 1,
            flexShrink: 0
          }}
        >
          Active Filters:
        </Typography>
        
        {activeFilters.map((filter, index) => (
          <Chip
            key={`${filter.category}-${filter.value}-${index}`}
            label={`${filter.displayCategory}: ${filter.label}`}
            onDelete={() => removeFilter(filter.category, filter.value)}
            size="small"
            sx={{
              backgroundColor: 'rgba(247, 77, 113, 0.15)',
              color: 'var(--text-primary, #fff)',
              border: '1px solid rgba(247, 77, 113, 0.3)',
              '& .MuiChip-deleteIcon': {
                color: 'rgba(247, 77, 113, 0.8)',
                '&:hover': {
                  color: '#f74d71'
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(247, 77, 113, 0.25)'
              },
              fontSize: '0.75rem',
              height: 28
            }}
          />
        ))}
        
        {activeFilters.length > 1 && (
          <Chip
            label="Clear All"
            onClick={clearFilters}
            variant="outlined"
            size="small"
            sx={{
              borderColor: 'var(--text-secondary, #aaa)',
              color: 'var(--text-secondary, #aaa)',
              '&:hover': {
                borderColor: '#f74d71',
                color: '#f74d71',
                backgroundColor: 'rgba(247, 77, 113, 0.1)'
              },
              fontSize: '0.75rem',
              height: 28,
              ml: 1
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default FilterTags;