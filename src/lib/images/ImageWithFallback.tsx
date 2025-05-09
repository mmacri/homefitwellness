
import React, { useState, useEffect, useRef } from 'react';
import { handleImageError as logImageError } from './imageErrorHandlers';
import { imageUrls } from '@/lib/constants';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  type?: keyof typeof import('@/lib/images/imageOptimizer').MAX_DIMENSIONS;
  disableCacheBusting?: boolean;
  priority?: 'high' | 'low' | 'auto';
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc,
  className,
  type = 'product',
  disableCacheBusting = false,
  priority = 'auto',
  onLoad,
  onError,
  loading,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const cacheKey = useRef<string>(`img_cache_${src}`);
  const isHeroImage = type === 'hero';

  // Determine loading attribute based on type and priority
  const loadingAttribute = loading || isHeroImage || priority === 'high' ? 'eager' : 'lazy';

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

  // Initialize and preload the image
  useEffect(() => {
    if (!src) return;
    
    // For hero images, we always use the source directly without checking cache
    if (isHeroImage) {
      setImgSrc(src);
      setHasError(false);
      setIsLoaded(false);
      
      // Preload image
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
      };
      img.onerror = () => {
        if (!hasError) {
          console.error(`Hero image failed to preload: ${src}`);
          setImgSrc(actualFallback);
          setHasError(true);
          
          // Try loading the fallback
          const fallbackImg = new Image();
          fallbackImg.src = actualFallback;
          fallbackImg.onload = () => setIsLoaded(true);
        }
      };
      return;
    }
    
    // Skip blob URLs and data URLs since they don't need caching
    if (src.startsWith('blob:') || src.startsWith('data:')) {
      setImgSrc(src);
      return;
    }
    
    // Check local storage for cached image status for non-hero images
    const cachedStatus = localStorage.getItem(cacheKey.current);
    if (cachedStatus === 'error') {
      // If we previously had an error with this image, use fallback immediately
      console.log(`Using cached fallback for ${src}`);
      setImgSrc(actualFallback);
      setHasError(true);
      setIsLoaded(true);
      return;
    }
    
    setImgSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src, actualFallback, isHeroImage, hasError]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      console.error(`Image failed to load: ${imgSrc}, using fallback: ${actualFallback}`);
      
      // Cache the error status to avoid future requests for the same broken image
      // Don't cache hero image errors as we want to retry them
      if (src && !src.startsWith('blob:') && !src.startsWith('data:') && !isHeroImage) {
        localStorage.setItem(cacheKey.current, 'error');
      }
      
      // Log the error but don't pass arguments to avoid TypeScript error
      logImageError(imgSrc || '');
      setImgSrc(actualFallback);
      setHasError(true);
      
      // Call the original onError handler if provided
      if (onError) {
        onError(e);
      }
      
      // Dispatch an event that can be caught by parent components
      window.dispatchEvent(new CustomEvent('imageError', { 
        detail: { originalSrc: src, fallbackSrc: actualFallback, type } 
      }));
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    
    // Call the original onLoad handler if provided
    if (onLoad) {
      onLoad(e);
    }
  };

  // Get final image source, skipping cache busting for hero images
  const getImageSrc = () => {
    // Skip cache busting for these cases
    if (disableCacheBusting || !imgSrc || imgSrc.startsWith('blob:') || 
        imgSrc.startsWith('data:') || isHeroImage) {
      return imgSrc;
    }
    
    // Only add cache busting for external URLs, not for local assets
    if (imgSrc.startsWith('/')) {
      return imgSrc;
    }
    
    const cacheBuster = `_cb=${Date.now()}`;
    const separator = imgSrc.includes('?') ? '&' : '?';
    return `${imgSrc}${separator}${cacheBuster}`;
  };

  return (
    <img
      ref={imgRef}
      src={getImageSrc()}
      alt={alt || 'Image'}
      onError={handleError}
      onLoad={handleImageLoad}
      className={className}
      loading={loadingAttribute}
      decoding={isHeroImage ? 'sync' : 'async'}
      fetchPriority={isHeroImage || priority === 'high' ? 'high' : 'auto'}
      {...props}
    />
  );
};
