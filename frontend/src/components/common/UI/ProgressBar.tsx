// src/components/common/UI/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  value: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, className = '' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full ${className}`}>
      <div
        className="bg-blue-600 rounded-full transition-all duration-300"
        style={{ 
          width: `${Math.min(100, Math.max(0, value))}%`, 
          height: '100%' 
        }}
      />
    </div>
  );
};

export default ProgressBar;