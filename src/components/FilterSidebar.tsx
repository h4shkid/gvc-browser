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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import { loadBadgeData, getBadgeDisplayName, BadgeData } from '../utils/badges';
import './FilterSidebar.css';

const FilterSidebar: React.FC = () => {
  const { filters, filterOptions, conditionalFilters, setFilter, clearFilters } = useFilters();
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
    selectedValues: string[],
    onChange: (values: string[]) => void
  ) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const toggleCategory = (category: string) => {
      const newExpanded = new Set(expandedCategories);
      if (newExpanded.has(category)) {
        newExpanded.delete(category);
      } else {
        newExpanded.add(category);
      }
      setExpandedCategories(newExpanded);
    };

    const toggleValue = (value: string) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onChange(newValues);
    };

    // Safety check to prevent crashes
    if (!options || !options.main) {
      return null;
    }

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'var(--text-primary)' }}>
          {label}
        </Typography>
        
        <Box sx={{ pl: 1 }}>
          {Object.entries(options.main)
            .sort(([,a], [,b]) => b - a)
            .map(([mainCategory, count]) => {
              // Special handling for background - only show subcategories for "1 of 1" (matching old system)
              const shouldShowSubcategories = label === 'Background' ? mainCategory === '1 of 1' : true;
              const hasSubcategories = shouldShowSubcategories && options.byType && options.byType[mainCategory] && Object.keys(options.byType[mainCategory]).length > 0;
              const isExpanded = expandedCategories.has(mainCategory);
              const isSelected = selectedValues.includes(mainCategory);
              
              return (
                <Box key={mainCategory} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleValue(mainCategory)}
                          sx={{
                            color: 'var(--text-secondary)',
                            '&.Mui-checked': { color: '#66b3ff' },
                            p: 0.5
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minWidth: 200 }}>
                          <span style={{ fontSize: '0.875rem' }}>{mainCategory}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>({count})</span>
                        </Box>
                      }
                      sx={{ 
                        margin: 0,
                        '& .MuiFormControlLabel-label': { color: 'var(--text-primary)', width: '100%' }
                      }}
                    />
                    
                    {hasSubcategories && (
                      <IconButton
                        size="small"
                        onClick={() => toggleCategory(mainCategory)}
                        sx={{ color: 'var(--text-secondary)', ml: 1 }}
                      >
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    )}
                  </Box>
                  
                  {/* Subcategories */}
                  {hasSubcategories && isExpanded && options.byType && options.byType[mainCategory] && (
                    <Box sx={{ pl: 3, mt: 1 }}>
                      {Object.entries(options.byType[mainCategory])
                        .sort(([,a], [,b]) => b - a)
                        .map(([subCategory, subCount]) => (
                          <FormControlLabel
                            key={subCategory}
                            control={
                              <Checkbox
                                checked={selectedValues.includes(subCategory)}
                                onChange={() => toggleValue(subCategory)}
                                sx={{
                                  color: 'var(--text-secondary)',
                                  '&.Mui-checked': { color: '#66b3ff' },
                                  p: 0.5
                                }}
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minWidth: 160 }}>
                                <span style={{ fontSize: '0.8rem' }}>{subCategory}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>({subCount})</span>
                              </Box>
                            }
                            sx={{ 
                              margin: 0,
                              display: 'flex',
                              mb: 0.5,
                              '& .MuiFormControlLabel-label': { color: 'var(--text-primary)', width: '100%' }
                            }}
                          />
                        ))}
                    </Box>
                  )}
                </Box>
              );
            })}
        </Box>
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

  const renderFilterGroup = (title: string, children: React.ReactNode, defaultExpanded: boolean = true) => {
    return (
      <Accordion 
        defaultExpanded={defaultExpanded}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderBottom: '1px solid var(--border-color, #404040)',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'var(--text-secondary, #aaa)' }} />}
          sx={{
            padding: '8px 16px 8px 0',
            minHeight: 'auto',
            '&.Mui-expanded': { minHeight: 'auto' },
            '& .MuiAccordionSummary-content': { margin: '8px 0' },
            '& .MuiAccordionSummary-expandIconWrapper': { marginRight: '8px' }
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
            }}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: '0 0 16px 0' }}>
          {children}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box
      sx={{
        width: { xs: '100vw', sm: '320px' },
        maxWidth: { xs: '100vw', sm: '320px' },
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

        {/* Market Section */}
        {renderFilterGroup('Market', (
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.listed}
                onChange={(e) => setFilter('listed', e.target.checked)}
                sx={{
                  color: 'var(--text-secondary)',
                  '&.Mui-checked': { color: '#66b3ff' },
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
              '& .MuiFormControlLabel-label': { color: 'var(--text-primary)' }
            }}
          />
        ))}

        {/* Basic Attributes */}
        {renderFilterGroup('Basic Attributes', (
          <>
            {renderSimpleFilter('Gender', filterOptions.gender, filters.gender[0] || '', (value) => setFilter('gender', value ? [value] : []))}
            {renderSimpleFilter('Type', filterOptions.type_type, filters.type_type[0] || '', (value) => setFilter('type_type', value ? [value] : []))}
          </>
        ))}

        {/* Physical Traits */}
        {renderFilterGroup('Physical Traits', (
          <>
            {renderHierarchicalFilter('Background', filterOptions.backgroundHierarchical, filters.background, (values) => setFilter('background', values))}
            {renderHierarchicalFilter('Body', filterOptions.bodyHierarchical, filters.body, (values) => setFilter('body', values))}
            {renderHierarchicalFilter('Face', filterOptions.faceHierarchical, filters.face, (values) => setFilter('face', values))}
            {renderHierarchicalFilter('Hair', filterOptions.hairHierarchical, filters.hair, (values) => setFilter('hair', values))}
          </>
        ))}

        {/* Colors (with conditional logic matching old system) */}
        {renderFilterGroup('Colors', (
          <>
            {renderSimpleFilter('Body Color', filterOptions.body_color, filters.body_color[0] || '', (value) => setFilter('body_color', value ? [value] : []))}
            {/* Face Color only shows when Glasses type face styles are selected */}
            {conditionalFilters.shouldShowFaceColor('') && 
              renderSimpleFilter('Face Color', filterOptions.face_color, filters.face_color[0] || '', (value) => setFilter('face_color', value ? [value] : []))
            }
            {/* Hair Color only shows when Hair type hair styles are selected */}
            {conditionalFilters.shouldShowHairColor('') && 
              renderSimpleFilter('Hair Color', filterOptions.hair_color, filters.hair_color[0] || '', (value) => setFilter('hair_color', value ? [value] : []))
            }
            {renderSimpleFilter('Type Color', filterOptions.type_color, filters.type_color[0] || '', (value) => setFilter('type_color', value ? [value] : []))}
            {renderSimpleFilter('Color Group', filterOptions.color_group, filters.color_group[0] || '', (value) => setFilter('color_group', value ? [value] : []))}
            {/* Color Count only shows 3, 4, 5 options (old system logic) */}
            {renderSimpleFilter('Color Count', conditionalFilters.getFilteredColorCount(), filters.color_count[0] || '', (value) => setFilter('color_count', value ? [value] : []))}
          </>
        ))}

        {/* Badges */}
        {renderFilterGroup('Badges', (
          <>
            {renderBadgeCountFilter()}
            {renderBadgeFilter()}
          </>
        ))}
      </Box>
    </Box>
  );
};

export default FilterSidebar; 