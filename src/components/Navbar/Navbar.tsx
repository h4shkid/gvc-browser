import React from 'react';
import { useFilters, SortOption } from '../../contexts/FilterContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.css';

interface Props {
  total: number;
}

const Navbar: React.FC<Props> = ({ total }) => {
  const { sort, setSort, searchTerm, setSearchTerm } = useFilters();
  const { mode, toggle } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>GVCD</h1>
        <div className="theme-toggle" onClick={toggle}>
          <span className="sun">☀️</span>
          <span className="moon">🌙</span>
        </div>
      </div>
      <div className="navbar-center">
        <input
          type="search"
          placeholder="Search by Token ID or trait..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="navbar-right">
        <div style={{ fontWeight: 600 }}>Total: {total} NFTs</div>
        <div className="sort-section">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="id_desc">ID: High to Low</option>
            <option value="id_asc">ID: Low to High</option>
            <option value="rarity">Rarity: High to Low</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 