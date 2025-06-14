import React, { useState } from 'react';
import './FilterGroup.css';

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="filter-group">
      <button className="filter-group-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className={`chevron ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </button>
      {isOpen && <div className="filter-group-content">{children}</div>}
    </div>
  );
};

export default FilterGroup; 