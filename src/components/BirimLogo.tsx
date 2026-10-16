import React from 'react';

interface BirimLogoProps {
  variant?: 'white' | 'black';
  className?: string;
  height?: number | string;
  alt?: string;
}

export const BirimLogo: React.FC<BirimLogoProps> = ({
  variant = 'black',
  className = 'h-6 object-contain',
  alt = 'BİRİM'
}) => {
  const src = variant === 'white' ? '/logo-trimmed.png?v=3' : '/logo-black-trimmed.png?v=3';

  return (
    <img
      src={src}
      alt={alt}
      className={`select-none ${className}`}
      crossOrigin="anonymous"
    />
  );
};
