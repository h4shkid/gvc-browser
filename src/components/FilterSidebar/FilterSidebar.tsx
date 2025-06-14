import React from 'react';
import './FilterSidebar.css';
import { useFilters } from '../../contexts/FilterContext';
import FilterGroup from './FilterGroup';
import FilterOption from './FilterOption';
import { TRAIT_CATEGORIES } from '../../utils/filters';

const FilterSidebar: React.FC = () => {
  const { traitFilterOptions, filters, setFilters } = useFilters();

  const handleFilterChange = (category: string, value: string) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (!newFilters[category]) {
        newFilters[category] = new Set();
      }

      if (newFilters[category].has(value)) {
        newFilters[category].delete(value);
      } else {
        newFilters[category].add(value);
      }

      // If the set for a category is empty, remove the category from the filters
      if (newFilters[category].size === 0) {
        delete newFilters[category];
      }

      return newFilters;
    });
  };

  return (
    <aside className="filter-sidebar">
      <h2>Filters</h2>
      <div className="filter-scroll-area">
        {TRAIT_CATEGORIES.map(category => (
          <FilterGroup key={category} title={category.charAt(0).toUpperCase() + category.slice(1)}>
            {traitFilterOptions[category] && Object.entries(traitFilterOptions[category])
              .sort(([, aCount], [, bCount]) => bCount - aCount)
              .map(([value, count]) => (
                <FilterOption
                  key={value}
                  category={category}
                  value={value}
                  count={count}
                  isChecked={filters[category]?.has(value) || false}
                  onChange={handleFilterChange}
                />
              ))}
          </FilterGroup>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
