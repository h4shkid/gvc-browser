# NFTGrid Component - Detailed Documentation

## Overview
The NFTGrid component is responsible for displaying, filtering, sorting, and loading NFTs in the Good Vibes Club application.

## Current Architecture

### 1. Data Flow
```
CSV Data → NFTs → Add Listings → Apply Filters → Sort by Price → Display
```

### 2. State Management
- `nfts`: All 6,969 NFTs loaded from CSV
- `filteredNfts`: NFTs after applying filters and sorting
- `visibleCount`: How many NFTs are currently displayed (starts at 20)
- `preloadedCount`: Currently same as visibleCount
- `loading`: Initial loading state
- `isLoadingMore`: Whether more NFTs are being loaded

### 3. Key Effects

#### Effect 1: Load NFTs from CSV
```javascript
useEffect(() => {
  // Loads all 6,969 NFTs from /data/gvc_data.csv
  // Converts CSV to NFT objects with traits
}, []);
```

#### Effect 2: Filter and Sort NFTs
```javascript
useEffect(() => {
  // 1. Add listing data to NFTs
  // 2. Apply filters using FiltersContext
  // 3. Sort by price (LISTED FIRST, then by ascending price)
  // 4. Update filteredNfts state
}, [filters, nfts, listings, loading, applyFilters]);
```

#### Effect 3: Reset Scroll Position
```javascript
useEffect(() => {
  // Reset visibleCount to 20 when filters change
  // Does NOT reset when listings update (important!)
}, [filters, nfts, loading]);
```

#### Effect 4: Infinite Scroll
```javascript
useEffect(() => {
  // Listen for scroll events
  // When 400px from bottom: load more NFTs
  // Increase visibleCount by 40 (PAGE_SIZE * 2)
}, [visibleCount, preloadedCount, filteredNfts.length, isLoadingMore]);
```

## Current Issues

### Issue 1: Unlisted NFTs Showing Before Listed NFTs
**Problem**: The sorting logic should show listed NFTs first, but unlisted NFTs appear at the top.

**Current Sort Logic**:
```javascript
filtered.sort((a, b) => {
  const aListing = listings[a.id];
  const bListing = listings[b.id];
  if (aListing && bListing) {
    return aListing.price - bListing.price; // Both listed: sort by price
  } else if (aListing) {
    return -1; // A is listed, B is not: A comes first
  } else if (bListing) {
    return 1; // B is listed, A is not: B comes first
  } else {
    return 0; // Neither listed: maintain order
  }
});
```

**Expected Behavior**: Listed NFTs should appear first, sorted by price ascending.

### Issue 2: Infinite Scroll Not Working
**Problem**: Scrolling to the bottom doesn't load more NFTs.

**Current Logic**:
```javascript
if (isLoadingMore || visibleCount >= filteredNfts.length) return;
// ... scroll detection ...
if (shouldLoadMore) {
  setIsLoadingMore(true);
  const nextVisible = Math.min(visibleCount + (PAGE_SIZE * 2), filteredNfts.length);
  setVisibleCount(nextVisible);
}
```

**Possible Issues**:
1. `isLoadingMore` preventing subsequent loads
2. Scroll detection not working properly
3. `visibleCount >= filteredNfts.length` condition too strict
4. Effect dependencies causing re-renders

## Data Structure Examples

### NFT Object Structure
```javascript
{
  id: "1",
  name: "GVC #1",
  image: "https://ipfs.io/ipfs/...",
  token_id: "1",
  tokenId: "1",
  gender: "Female",
  background: "Blue",
  // ... other traits
  listing: {
    price: 0.05,
    currency: "ETH",
    url: "https://opensea.io/assets/..."
  }
}
```

### Listings Object Structure
```javascript
{
  "1": {
    price: 0.05,
    currency: "ETH", 
    url: "https://opensea.io/assets/ethereum/0x.../1"
  },
  "2": {
    price: 0.08,
    currency: "ETH",
    url: "https://opensea.io/assets/ethereum/0x.../2"
  }
  // ... 781 total listings
}
```

## Performance Considerations

### Memory Usage
- All 6,969 NFTs loaded in memory (necessary for filtering)
- Only `visibleCount` NFTs rendered to DOM
- Images load lazily as cards appear

### Render Optimization
- Only visible NFTs create DOM elements
- Hidden preloading was removed to avoid complexity
- React keys prevent unnecessary re-renders

### Scroll Performance
- Passive scroll listeners
- Throttled scroll events (currently disabled for debugging)
- Large batch loading (40 NFTs at a time)

## Debug Information

### What to Check in Console
1. **Initial Load**: Should see filtering results with 6,969 total NFTs
2. **Listings**: Should show ~781 listed NFTs
3. **Scroll Events**: Should see loading triggers when scrolling
4. **Sort Order**: First few NFTs should have `hasListing: true`

### Console Commands for Debugging
```javascript
// Check current state
console.log('Current visible:', document.querySelectorAll('.nft-grid > *').length);
console.log('Scroll container:', document.querySelector('.content-area'));
console.log('Total height:', document.querySelector('.content-area')?.scrollHeight);
```

## Recommended Fixes

### Fix 1: Ensure Proper Sorting
- Add debug logging to verify listed NFTs come first
- Check if `listings[nft.id]` is properly populated
- Verify timing: filters run after listings are loaded

### Fix 2: Fix Infinite Scroll
- Add more detailed scroll debugging
- Verify scroll container selection
- Check if `isLoadingMore` gets stuck
- Simplify loading logic

### Fix 3: Improve Loading UX
- Show loading state more clearly
- Prevent duplicate load triggers
- Add visual feedback when no more content

## Testing Checklist

- [ ] Listed NFTs appear first
- [ ] NFTs sorted by price ascending  
- [ ] Scroll loading works consistently
- [ ] No console spam
- [ ] Memory usage reasonable
- [ ] Filters don't reset scroll position
- [ ] Loading indicator appears/disappears correctly