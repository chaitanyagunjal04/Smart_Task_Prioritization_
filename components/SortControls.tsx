import React from 'react';

export interface SortOption {
  key: string;
  label: string;
}

interface SortControlsProps {
  options: SortOption[];
  activeSortKey: string;
  onSortChange: (key: string) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ options, activeSortKey, onSortChange }) => {
  return (
    <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-md flex-shrink-0">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onSortChange(option.key)}
          className={`px-3 py-1 text-xs font-semibold rounded transition-colors duration-200 whitespace-nowrap ${
            activeSortKey === option.key
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SortControls;