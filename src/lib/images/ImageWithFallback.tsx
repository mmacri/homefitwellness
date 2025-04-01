
import React, { useState, useEffect } from 'react';
import { handleImageError } from './imageErrorHandlers';
import { imageUrls } from '@/lib/constants';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  type?: 'product' | 'category' | 'blog' | 'hero';
  disableCacheBusting?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc,
  className,
  type = 'product',
  disableCacheBusting = false,
  onLoad,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  // Set default fallback based on image type
  const defaultFallback = () => {
    switch (type) {
      case 'product':
        return imageUrls.PRODUCT_DEFAULT;
      case 'category':
        return imageUrls.CATEGORY_DEFAULT;
      case 'blog':
        return 'https://ext.same-assets.com/1001010126/blog-placeholder.jpg';
      case 'hero':
        return imageUrls.HERO_DEFAULT;
      default:
        return 'https://placehold.co/600x400?text=Image+Not+Found';
    }
  };

  const actualFallback = fallbackSrc || defaultFallback();

  useEffect(() => {
    // Reset error state and update source when src prop changes
    if (src) {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      handleImageError(src || '');
      console.log(`Image failed to load: ${src}, using fallback: ${actualFallback}`);
      setImgSrc(actualFallback);
      setHasError(true);
    }
  };

  // Add cache busting parameter if needed
  const getImageSrc = () => {
    if (disableCacheBusting || !imgSrc) return imgSrc;
    
    const cacheBuster = `_cb=${Date.now()}`;
    const separator = imgSrc.includes('?') ? '&' : '?';
    return `${imgSrc}${separator}${cacheBuster}`;
  };

  return (
    <img
      src={getImageSrc()}
      alt={alt || 'Image'}
      onError={handleError}
      className={className}
      loading="lazy"
      onLoad={onLoad}
      {...props}
    />
  );
};
