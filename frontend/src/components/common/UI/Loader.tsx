import React, { useState } from 'react';

// ============================================================
// 1. The Loader component (your original, untouched)
// ============================================================
interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'ring' | 'bars';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  const renderVariant = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`${sizeClasses[size]} animate-spin`}>
            <svg
              className={`${colorClasses[color]} w-full h-full`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        );

      case 'dots':
        return (
          <div className={`${sizeClasses[size]} flex space-x-1`}>
            <div
              className={`w-1/3 h-full rounded-full ${colorClasses[color]} animate-bounce`}
              style={{ animationDelay: '0ms' }}
            />
            <div
              className={`w-1/3 h-full rounded-full ${colorClasses[color]} animate-bounce`}
              style={{ animationDelay: '150ms' }}
            />
            <div
              className={`w-1/3 h-full rounded-full ${colorClasses[color]} animate-bounce`}
              style={{ animationDelay: '300ms' }}
            />
          </div>
        );

      case 'ring':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div
              className={`w-full h-full rounded-full border-2 ${colorClasses[color]} border-opacity-20`}
            />
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-full border-2 ${colorClasses[color]} border-t-transparent animate-spin`}
            />
          </div>
        );

      case 'bars':
        return (
          <div className={`${sizeClasses[size]} flex space-x-1`}>
            <div
              className={`w-1/4 h-full ${colorClasses[color]} animate-pulse`}
              style={{ animationDelay: '0ms' }}
            />
            <div
              className={`w-1/4 h-full ${colorClasses[color]} animate-pulse`}
              style={{ animationDelay: '100ms' }}
            />
            <div
              className={`w-1/4 h-full ${colorClasses[color]} animate-pulse`}
              style={{ animationDelay: '200ms' }}
            />
            <div
              className={`w-1/4 h-full ${colorClasses[color]} animate-pulse`}
              style={{ animationDelay: '300ms' }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Full‑screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        <div className="text-center">
          {renderVariant()}
          {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  // Inline loader
  return (
    <div className={`flex items-center ${className}`}>
      {renderVariant()}
      {text && <span className="ml-3 text-gray-600">{text}</span>}
    </div>
  );
};

// ============================================================
// 2. Demo page – rename this to avoid conflict with Loader
// ============================================================
const LoaderDemo: React.FC = () => {
  const [variant, setVariant] = useState<'spinner' | 'dots' | 'ring' | 'bars'>('spinner');
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [color, setColor] = useState<'primary' | 'secondary' | 'white'>('primary');
  const [text, setText] = useState('Loading...');
  const [showFullScreen, setShowFullScreen] = useState(false);

  const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];
  const colors: Array<'primary' | 'secondary' | 'white'> = ['primary', 'secondary', 'white'];

  const colorBg = {
    primary: 'bg-white',
    secondary: 'bg-white',
    white: 'bg-gray-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Loader Component</h1>
        <p className="text-gray-500 mt-2">Interactive demo &amp; gallery</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Live Preview */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Live Preview</h2>

          <div className="space-y-4">
            {/* Variant */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Variant</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as any)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="spinner">Spinner</option>
                <option value="dots">Dots</option>
                <option value="ring">Ring</option>
                <option value="bars">Bars</option>
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Size</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-1 text-sm rounded-md border ${
                      size === s
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Color</label>
              <div className="flex gap-2 mt-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === c ? 'border-blue-600' : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor:
                        c === 'primary' ? '#2563eb' : c === 'secondary' ? '#4b5563' : '#ffffff',
                      borderColor: color === c ? '#2563eb' : 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Text */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Optional text"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Full‑screen toggle */}
            <button
              onClick={() => setShowFullScreen(true)}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Show Full‑Screen
            </button>
          </div>

          {/* Preview area */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-center justify-center min-h-[120px] border border-gray-200">
            <Loader
              variant={variant}
              size={size}
              color={color}
              text={text}
              fullScreen={false}
            />
          </div>
        </div>

        {/* Right: Gallery */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(['spinner', 'dots', 'ring', 'bars'] as const).map((v) => (
              <div key={v} className="bg-white rounded-xl shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 capitalize mb-3">{v}</h3>
                <div className="space-y-4">
                  {sizes.map((s) => (
                    <div key={s} className="flex items-center gap-4 flex-wrap">
                      <span className="w-8 text-xs font-mono text-gray-400">{s}</span>
                      {colors.map((c) => (
                        <div
                          key={`${v}-${s}-${c}`}
                          className={`p-2 rounded-lg ${colorBg[c]} flex items-center justify-center`}
                          style={{ minWidth: 60, minHeight: 60 }}
                        >
                          <Loader variant={v} size={s} color={c} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full‑screen modal (simulated) */}
      {showFullScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full">
            <button
              onClick={() => setShowFullScreen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <Loader
              variant={variant}
              size={size}
              color={color}
              text={text}
              fullScreen={false}
            />
            <p className="mt-4 text-center text-sm text-gray-500">
              Full‑screen overlay (click ✕ to close)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// 3. Exports
// ============================================================
export default Loader;          // main component
export { LoaderDemo };          // demo page (optional)