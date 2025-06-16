import React, { useState, useEffect } from 'react';
import { ListingsProvider, useListings } from './contexts/ListingsContext';
import { FiltersProvider, useFilters, SearchSuggestion } from './contexts/FiltersContext';
import { ThemeProvider } from './contexts/ThemeContext';
import NFTGrid from './components/NFTGrid';
import FilterSidebar from './components/FilterSidebar';
import ThemeToggle from './components/Navbar/ThemeToggle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import './App.css';

interface HeaderProps {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (open: boolean) => void;
}

const AppHeader: React.FC<HeaderProps> = ({ isFiltersOpen, setIsFiltersOpen }) => {
  const { filters, setFilter, totalNfts, filteredCount, getSearchSuggestions } = useFilters();
  const { listings, isLoading: listingsLoading } = useListings();
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSearchFilter, setActiveSearchFilter] = useState<SearchSuggestion | null>(null);

  // Update search filter when search value changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter('search', searchValue);
    }, 300); // Debounce search
    
    return () => clearTimeout(timeoutId);
  }, [searchValue, setFilter]);

  // Update search suggestions when search value changes (but not when dropdown is open and scrolling)
  useEffect(() => {
    if (!isDropdownOpen) {
      if (searchValue) {
        const suggestions = getSearchSuggestions(searchValue);
        setSearchSuggestions(suggestions);
      } else {
        setSearchSuggestions([]);
      }
    }
  }, [searchValue, getSearchSuggestions, isDropdownOpen]);

  const clearSearchFilter = () => {
    if (activeSearchFilter) {
      // If it's a trait filter, remove that specific filter value
      if (activeSearchFilter.type === 'trait') {
        let filterKey: keyof typeof filters;
        
        switch (activeSearchFilter.category) {
          case 'Gender': filterKey = 'gender'; break;
          case 'Color Group': filterKey = 'color_group'; break;
          case 'Color Count': filterKey = 'color_count'; break;
          case 'Type': filterKey = 'type_type'; break;
          case 'Type Color': filterKey = 'type_color'; break;
          case 'Body Color': filterKey = 'body_color'; break;
          case 'Face Color': filterKey = 'face_color'; break;
          case 'Hair Color': filterKey = 'hair_color'; break;
          case 'Badge': filterKey = 'badges'; break;
          // All individual trait fields - map to hierarchical filters for consistency
          case 'Background':
          case 'Background Type':
          case 'Background Full':
            filterKey = 'background';
            break;
          case 'Body':
          case 'Body Type':
          case 'Body Style':
          case 'Body Full':
            filterKey = 'body';
            break;
          case 'Face':
          case 'Face Type':
          case 'Face Style':
          case 'Face Full':
            filterKey = 'face';
            break;
          case 'Hair':
          case 'Hair Type':
          case 'Hair Style':
          case 'Hair Full':
            filterKey = 'hair';
            break;
          case 'Type Full':
          default:
            setFilter('search', '');
            setActiveSearchFilter(null);
            setSearchValue('');
            return;
        }
        
        // Remove the specific value from the filter
        const currentValues = filters[filterKey] as string[];
        const newValues = currentValues.filter(v => v !== activeSearchFilter.value);
        setFilter(filterKey, newValues);
      } else {
        // For token ID search, clear the search filter
        setFilter('search', '');
      }
    }
    
    setActiveSearchFilter(null);
    setSearchValue('');
  };

  const handleSearchSuggestionClick = (option: SearchSuggestion) => {
    if (option.type === 'trait') {
      // Apply the specific filter for this category
      let filterKey: keyof typeof filters;
      
      // Map category names to filter keys - comprehensive mapping for all traits
      switch (option.category) {
        case 'Gender': filterKey = 'gender'; break;
        case 'Color Group': filterKey = 'color_group'; break;
        case 'Color Count': filterKey = 'color_count'; break;
        case 'Type': filterKey = 'type_type'; break;
        case 'Type Color': filterKey = 'type_color'; break;
        case 'Body Color': filterKey = 'body_color'; break;
        case 'Face Color': filterKey = 'face_color'; break;
        case 'Hair Color': filterKey = 'hair_color'; break;
        case 'Badge': filterKey = 'badges'; break;
        // All individual trait fields - map to hierarchical filters for consistency
        case 'Background':
        case 'Background Type':
        case 'Background Full':
          filterKey = 'background';
          break;
        case 'Body':
        case 'Body Type':
        case 'Body Style':
        case 'Body Full':
          filterKey = 'body';
          break;
        case 'Face':
        case 'Face Type':
        case 'Face Style':
        case 'Face Full':
          filterKey = 'face';
          break;
        case 'Hair':
        case 'Hair Type':
        case 'Hair Style':
        case 'Hair Full':
          filterKey = 'hair';
          break;
        case 'Type Full':
          // For full type descriptions, fall back to search
          setSearchValue(option.value);
          setFilter('search', option.value);
          setActiveSearchFilter(option);
          setIsDropdownOpen(false);
          return;
        default:
          // Fallback to search if category not recognized
          setSearchValue(option.value);
          setFilter('search', option.value);
          setActiveSearchFilter(option);
          setIsDropdownOpen(false);
          return;
      }
      
      // Apply the filter to the specific category
      const currentValues = filters[filterKey] as string[];
      if (!currentValues.includes(option.value)) {
        setFilter(filterKey, [...currentValues, option.value]);
      }
      
      // Set active search filter to show in search box
      setActiveSearchFilter(option);
      setSearchValue(''); // Clear the actual search input
      setFilter('search', ''); // Clear search filter
      setIsDropdownOpen(false);
    } else if (option.type === 'token_id') {
      // For token IDs, use search
      setSearchValue(option.value);
      setFilter('search', option.value);
      setActiveSearchFilter(option);
      setIsDropdownOpen(false);
    }
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'var(--card-bg, #2a2a2a)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        borderBottom: '1px solid var(--border-color, #404040)',
        zIndex: 1000
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3 }}>
        {/* Left section - Brand and Show Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}badges/any_gvc.png`}
              alt="GVC Logo"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid rgba(102, 179, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '2px'
              }}
            />
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'var(--text-primary, #fff)',
                background: 'linear-gradient(45deg, #66b3ff, #4dabf7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Vibes Browser
            </Typography>
            <Chip
              label="BETA"
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                color: '#ffc107',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                fontSize: '0.65rem',
                fontWeight: 600,
                height: 20
              }}
            />
          </Box>
          
          {!isFiltersOpen && (
            <Button
              variant="outlined"
              onClick={() => setIsFiltersOpen(true)}
              sx={{
                color: 'var(--text-primary, #fff)',
                borderColor: 'var(--border-color, #404040)',
                '&:hover': {
                  borderColor: '#66b3ff',
                  backgroundColor: 'rgba(102, 179, 255, 0.1)'
                }
              }}
            >
              Show Filters
            </Button>
          )}
        </Box>

        {/* Center section - Powered with Vibes */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'var(--text-secondary, #aaa)',
              fontSize: '0.75rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              opacity: 0.8
            }}
          >
            Powered with 
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(45deg, #66b3ff, #4dabf7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                mx: 0.5
              }}
            >
              Vibes
            </Box>
            by{' '}
            <Typography
              component="a"
              href="https://x.com/dapppunk"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'var(--text-primary, #fff)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#66b3ff',
                  textShadow: '0 0 8px rgba(102, 179, 255, 0.5)'
                }
              }}
            >
              Dappunk
            </Typography>
            {' & '}
            <Typography
              component="a"
              href="https://x.com/h4shkid"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'var(--text-primary, #fff)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#66b3ff',
                  textShadow: '0 0 8px rgba(102, 179, 255, 0.5)'
                }
              }}
            >
              H4shkid
            </Typography>
          </Typography>
        </Box>

        {/* Right section - Search, Sort, Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ClickAwayListener onClickAway={() => setIsDropdownOpen(false)}>
            <Box sx={{ position: 'relative', minWidth: 250 }}>
              {activeSearchFilter ? (
                // Show active filter as a chip
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  minHeight: 40,
                  px: 2,
                  border: '1px solid var(--border-color, #404040)',
                  borderRadius: 1,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  minWidth: 250
                }}>
                  <Chip
                    label={activeSearchFilter.label}
                    size="small"
                    onDelete={clearSearchFilter}
                    sx={{
                      backgroundColor: 'rgba(102, 179, 255, 0.2)',
                      color: 'var(--text-primary, #fff)',
                      '& .MuiChip-deleteIcon': {
                        color: 'var(--text-primary, #fff)'
                      },
                      maxWidth: 'calc(100% - 20px)'
                    }}
                  />
                </Box>
              ) : (
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search by token ID or attributes..."
                  value={searchValue}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSearchValue(newValue);
                    if (newValue) {
                      const suggestions = getSearchSuggestions(newValue);
                      setSearchSuggestions(suggestions);
                      setIsDropdownOpen(suggestions.length > 0);
                    } else {
                      setSearchSuggestions([]);
                      setIsDropdownOpen(false);
                    }
                  }}
                  onFocus={() => {
                    if (searchValue && searchSuggestions.length > 0) {
                      setIsDropdownOpen(true);
                    }
                  }}
                  InputProps={{
                    endAdornment: searchValue && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearchValue('');
                          setFilter('search', '');
                        }}
                        sx={{ color: 'var(--text-secondary, #aaa)' }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )
                  }}
                  sx={{
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--text-primary, #fff)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    '& fieldset': {
                      borderColor: 'var(--border-color, #404040)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#66b3ff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#66b3ff',
                    },
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: 'var(--text-secondary, #aaa)',
                  }
                }}
                />
              )}
              {isDropdownOpen && searchSuggestions.length > 0 && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1300,
                    bgcolor: 'var(--card-bg, #2a2a2a)',
                    color: 'var(--text-primary, #fff)',
                    border: '1px solid var(--border-color, #404040)',
                    borderRadius: 1,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    maxHeight: 400,
                    overflow: 'auto',
                    mt: 0.5
                  }}
                >
                  {searchSuggestions.map((option, index) => (
                    <Box
                      key={`${option.category}-${option.value}-${index}`}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderBottom: index < searchSuggestions.length - 1 ? '1px solid var(--border-color, #404040)' : 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 179, 255, 0.1)'
                        }
                      }}
                      onClick={() => handleSearchSuggestionClick(option)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.label}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>
          </ClickAwayListener>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel 
              sx={{ 
                color: 'var(--text-secondary, #aaa)',
                '&.Mui-focused': { color: '#66b3ff' }
              }}
            >
              Sort
            </InputLabel>
            <Select
              value={filters.sort}
              label="Sort"
              onChange={(e) => setFilter('sort', e.target.value)}
              sx={{
                color: 'var(--text-primary, #fff)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--border-color, #404040)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#66b3ff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#66b3ff',
                },
                '& .MuiSvgIcon-root': {
                  color: 'var(--text-primary, #fff)',
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'var(--card-bg, #2a2a2a)',
                    color: 'var(--text-primary, #fff)',
                    border: '1px solid var(--border-color, #404040)',
                  }
                }
              }}
            >
              <MenuItem value="price_asc">Price ↑</MenuItem>
              <MenuItem value="price_desc">Price ↓</MenuItem>
              <MenuItem value="token_id_asc">ID ↑</MenuItem>
              <MenuItem value="token_id_desc">ID ↓</MenuItem>
              <MenuItem value="rarity_asc">Rarity ↑</MenuItem>
              <MenuItem value="rarity_desc">Rarity ↓</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={totalNfts === 0 ? "Loading..." : `${totalNfts} Total`}
              size="small"
              sx={{
                backgroundColor: 'rgba(102, 179, 255, 0.2)',
                color: 'var(--text-primary, #fff)',
                border: '1px solid rgba(102, 179, 255, 0.3)'
              }}
            />
            <Chip 
              label={`${filteredCount} Showing`}
              size="small"
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                color: 'var(--text-primary, #fff)',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}
            />
            <ThemeToggle />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const AppContent: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  return (
    <ListingsProvider>
      <FiltersProvider>
        <div className="app">
          <AppHeader isFiltersOpen={isFiltersOpen} setIsFiltersOpen={setIsFiltersOpen} />

          <div className="main-container">
            {isFiltersOpen && <FilterSidebar />}
            <main className={`content-area ${!isFiltersOpen ? 'filters-hidden' : ''}`}>
              <NFTGrid />
            </main>
          </div>
          
        </div>
      </FiltersProvider>
    </ListingsProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;