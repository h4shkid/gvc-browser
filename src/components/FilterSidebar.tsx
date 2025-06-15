import React, { useState, useEffect } from 'react';
import { useFilters } from '../contexts/FiltersContext';
import { useListings } from '../contexts/ListingsContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { loadBadgeData, getBadgeDisplayName, BadgeData } from '../utils/badges';
import './FilterSidebar.css';

const FilterSidebar: React.FC = () => {
  const { filters, filterOptions, setFilter, clearFilters } = useFilters();
  const { listings } = useListings();
  const [badgeData, setBadgeData] = useState<BadgeData>({});
  const listedCount = Object.keys(listings).length;

  useEffect(() => {
    loadBadgeData().then(setBadgeData);
  }, []);

  const renderSimpleFilter = (
    label: string,
    options: Record<string, number>,
    value: string,
    onChange: (value: string) => void,
    formatLabel?: (value: string) => string
  ) => {
    return (
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel 
            sx={{ 
              color: 'var(--text-secondary)',
              '&.Mui-focused': { color: '#66b3ff' }
            }}
          >
            {label}
          </InputLabel>
          <Select
            value={value}
            label={label}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              color: 'var(--text-primary)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--border-color)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#66b3ff',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#66b3ff',
              },
              '& .MuiSvgIcon-root': {
                color: 'var(--text-secondary)',
              }
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {Object.entries(options).map(([option, count]) => (
              <MenuItem key={option} value={option}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{formatLabel ? formatLabel(option) : option}</span>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>({count})</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  const renderHierarchicalFilter = (
    label: string,
    options: { main: Record<string, number>; byType: Record<string, Record<string, number>> },
    value: string,
    onChange: (value: string) => void
  ) => {
    return (
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel 
            sx={{ 
              color: 'var(--text-secondary)',
              '&.Mui-focused': { color: '#66b3ff' }
            }}
          >
            {label}
          </InputLabel>
          <Select
            value={value}
            label={label}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              color: 'var(--text-primary)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--border-color)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#66b3ff',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#66b3ff',
              },
              '& .MuiSvgIcon-root': {
                color: 'var(--text-secondary)',
              }
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {Object.entries(options.main).map(([option, count]) => (
              <MenuItem key={option} value={option}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{option}</span>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>({count})</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  const renderBadgeCountFilter = () => {
    return renderSimpleFilter(
      'Badge Count', 
      filterOptions.badgeCount, 
      filters.badgeCount[0] || '', 
      (value) => setFilter('badgeCount', value ? [value] : []),
      (value) => {
        if (value === '0') return 'No badges';
        return `${value} badge${value === '1' ? '' : 's'}`;
      }
    );
  };

  const renderBadgeFilter = () => {
    if (!filterOptions.badges || Object.keys(filterOptions.badges).length === 0) {
      return null;
    }

    return renderSimpleFilter(
      'Badges',
      filterOptions.badges,
      filters.badges[0] || '',
      (value) => setFilter('badges', value ? [value] : []),
      (value) => getBadgeDisplayName(value, badgeData)
    );
  };

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        borderRight: '1px solid var(--border-color)',
        height: '100%',
        overflowY: 'auto',
        background: 'var(--card-bg)',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'var(--bg)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'var(--border-color)',
          borderRadius: '4px',
          '&:hover': {
            background: '#66b3ff',
          }
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}
        >
          Filters
        </Typography>
        
        <Button
          variant="outlined"
          onClick={clearFilters}
          fullWidth
          size="small"
          sx={{ 
            mb: 3,
            borderColor: '#66b3ff',
            color: '#66b3ff',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#66b3ff',
              backgroundColor: 'rgba(102, 179, 255, 0.1)'
            }
          }}
        >
          Clear All Filters
        </Button>

        <Divider sx={{ mb: 3, borderColor: 'var(--border-color)' }} />

        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.1em'
          }}
        >
          Market
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={filters.listed}
              onChange={(e) => setFilter('listed', e.target.checked)}
              sx={{
                color: 'var(--text-secondary)',
                '&.Mui-checked': {
                  color: '#66b3ff',
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Listed Only</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                ({listedCount})
              </span>
            </Box>
          }
          sx={{ 
            mb: 3,
            '& .MuiFormControlLabel-label': {
              color: 'var(--text-primary)',
            }
          }}
        />

        <Divider sx={{ mb: 3, borderColor: 'var(--border-color)' }} />

        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.1em'
          }}
        >
          Attributes
        </Typography>

        {renderSimpleFilter('Gender', filterOptions.gender, filters.gender[0] || '', (value) => setFilter('gender', value ? [value] : []))}
        {renderHierarchicalFilter('Background', filterOptions.background, filters.background[0] || '', (value) => setFilter('background', value ? [value] : []))}
        {renderHierarchicalFilter('Body', filterOptions.body, filters.body[0] || '', (value) => setFilter('body', value ? [value] : []))}
        {renderHierarchicalFilter('Face', filterOptions.face, filters.face[0] || '', (value) => setFilter('face', value ? [value] : []))}
        {renderHierarchicalFilter('Hair', filterOptions.hair, filters.hair[0] || '', (value) => setFilter('hair', value ? [value] : []))}
        
        <Divider sx={{ my: 3, borderColor: 'var(--border-color)' }} />
        
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.1em'
          }}
        >
          Colors
        </Typography>

        {renderSimpleFilter('Body Color', filterOptions.body_color, filters.body_color[0] || '', (value) => setFilter('body_color', value ? [value] : []))}
        {renderSimpleFilter('Face Color', filterOptions.face_color, filters.face_color[0] || '', (value) => setFilter('face_color', value ? [value] : []))}
        {renderSimpleFilter('Hair Color', filterOptions.hair_color, filters.hair_color[0] || '', (value) => setFilter('hair_color', value ? [value] : []))}
        {renderSimpleFilter('Type Color', filterOptions.type_color, filters.type_color[0] || '', (value) => setFilter('type_color', value ? [value] : []))}
        
        <Divider sx={{ my: 3, borderColor: 'var(--border-color)' }} />
        
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.1em'
          }}
        >
          Other
        </Typography>

        {renderSimpleFilter('Color Group', filterOptions.color_group, filters.color_group[0] || '', (value) => setFilter('color_group', value ? [value] : []))}
        {renderSimpleFilter('Color Count', filterOptions.color_count, filters.color_count[0] || '', (value) => setFilter('color_count', value ? [value] : []))}
        
        <Divider sx={{ my: 3, borderColor: 'var(--border-color)' }} />
        
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.1em'
          }}
        >
          Badges
        </Typography>

        {renderBadgeCountFilter()}
        {renderBadgeFilter()}
      </Box>
    </Box>
  );
};

export default FilterSidebar; 