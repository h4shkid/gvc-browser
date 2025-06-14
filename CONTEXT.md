# Good Vibes Club (GVC) Browser Application

## Project Overview
This is a React-based web application for browsing and interacting with the Good Vibes Club NFT collection. The application is built using modern web technologies and provides a rich interface for viewing, filtering, and sorting NFTs.

## Technology Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Framework**: Material-UI (MUI)
- **3D Graphics**: OGL (WebGL library)
- **Testing**: Vitest

## Project Structure

```
gvcdapp/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── styles/        # Global styles and themes
│   ├── utils/         # Utility functions
│   ├── workers/       # Web workers for heavy computations
│   ├── App.tsx        # Main application component
│   ├── config.ts      # Application configuration
│   └── types.ts       # TypeScript type definitions
├── public/            # Static assets
└── node_modules/      # Dependencies
```

## Core Features

### 1. NFT Grid Display
- Displays a grid of NFT cards with lazy loading
- Supports infinite scrolling
- Shows NFT images, traits, and listing information
- Implements efficient rendering with virtualization

### 2. Filtering System
- Filters NFTs based on various traits
- Real-time filtering with immediate UI updates
- Maintains scroll position during filter changes
- Supports multiple filter criteria

### 3. Sorting Capabilities
- Sorts NFTs by price (listed NFTs first)
- Maintains sort order during filtering
- Optimized for performance with large datasets

### 4. Data Management
- Loads NFT data from CSV files
- Integrates with listing data
- Efficient state management for large datasets
- Implements caching strategies

## Key Components

### NFTGrid
The main component responsible for displaying NFTs with features:
- Infinite scrolling
- Lazy loading
- Filter integration
- Sort functionality
- Performance optimizations

### Filter System
- Trait-based filtering
- Price range filtering
- Status filtering (listed/unlisted)
- Real-time updates

### Data Loading
- CSV data processing
- Listing data integration
- Efficient state updates
- Error handling

## Performance Considerations

### Memory Management
- Efficient handling of large datasets
- Lazy loading of images
- Virtualized rendering
- Optimized state updates

### Rendering Optimization
- Component memoization
- Efficient DOM updates
- Scroll performance
- Image loading strategies

## Development Guidelines

### Code Organization
- Component-based architecture
- Separation of concerns
- Type safety with TypeScript
- Consistent file structure

### Best Practices
- Performance-first approach
- Responsive design
- Error handling
- Loading states
- User feedback

## Current Challenges
1. Optimizing infinite scroll performance
2. Ensuring proper sorting of listed vs unlisted NFTs
3. Managing memory usage with large datasets
4. Improving loading states and user feedback

## Future Improvements
1. Enhanced filtering capabilities
2. Advanced sorting options
3. Improved performance optimizations
4. Better error handling and recovery
5. Enhanced user experience features

## Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

## Environment Setup
- Node.js environment required
- Environment variables in `.env` file
- TypeScript configuration in `tsconfig.json`
- Vite configuration in `vite.config.ts` 