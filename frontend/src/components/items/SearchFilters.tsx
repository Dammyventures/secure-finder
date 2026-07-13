import React from 'react';
import { Search, Filter, MapPin, Calendar, Tag, X } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    query: string;
    type: string;
    category: string;
    dateFrom: string;
    dateTo: string;
    location: string;
    radius: number;
  };
  onFilterChange: (key: string, value: any) => void;
  onApply: () => void;
  loading?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onApply,
  loading = false,
}) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'documents', label: 'Documents' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'bags', label: 'Bags & Wallets' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'keys', label: 'Keys' },
    { value: 'pets', label: 'Pets' },
    { value: 'other', label: 'Other' },
  ];

  const itemTypes = [
    { value: '', label: 'All Types' },
    { value: 'lost', label: 'Lost Items' },
    { value: 'found', label: 'Found Items' },
  ];

  const radiusOptions = [
    { value: 1, label: '1 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' },
    { value: 100, label: '100 km' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#F4FDFF]/60 mb-1">Item Type</label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] focus:outline-none focus:ring-2 focus:ring-[#F4FDFF]/20"
          >
            {itemTypes.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1C448E]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#F4FDFF]/60 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] focus:outline-none focus:ring-2 focus:ring-[#F4FDFF]/20"
          >
            {categories.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1C448E]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#F4FDFF]/60 mb-1">Radius (km)</label>
          <select
            value={filters.radius}
            onChange={(e) => onFilterChange('radius', Number(e.target.value))}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] focus:outline-none focus:ring-2 focus:ring-[#F4FDFF]/20"
          >
            {radiusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1C448E]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#F4FDFF]/60 mb-1">From Date</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] focus:outline-none focus:ring-2 focus:ring-[#F4FDFF]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#F4FDFF]/60 mb-1">To Date</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] focus:outline-none focus:ring-2 focus:ring-[#F4FDFF]/20"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => {
            // Reset only advanced filters (keep query, type, category? We'll keep all)
            onFilterChange('dateFrom', '');
            onFilterChange('dateTo', '');
            // Radius reset to 10
            onFilterChange('radius', 10);
          }}
          disabled={loading}
          className="px-4 py-2 text-sm text-[#F4FDFF]/60 hover:text-[#F4FDFF] border border-[#F4FDFF]/20 rounded-xl transition-colors"
        >
          Reset Dates & Radius
        </button>
        <button
          onClick={onApply}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;