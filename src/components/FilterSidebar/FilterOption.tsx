import React from 'react';
import './FilterOption.css';

interface FilterOptionProps {
  category: string;
  value: string;
  count: number;
  isChecked: boolean;
  onChange: (category: string, value: string) => void;
}

const FilterOption: React.FC<FilterOptionProps> = ({ category, value, count, isChecked, onChange }) => {
  const handleChange = () => {
    onChange(category, value);
  };

  return (
    <label className="filter-option">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
      />
      <span className="filter-value">{value}</span>
      <span className="filter-count">{count}</span>
    </label>
  );
};

export default FilterOption; 