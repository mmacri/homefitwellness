import React from 'react';
import { ArrowUpRight, Heart, Check, ShoppingCart, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/productService';
import SaveForLater from '@/components/product/SaveForLater';
import { useToast } from '@/hooks/use-toast';
import { handleAffiliateClick, getAffiliateCookieInfo } from '@/lib/affiliate-utils';

interface ProductInfoProps {
  product: Product;
  onShare: () => void;
  onBuyNow: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onShare, onBuyNow }) => {
  const { toast } = useToast();
  
  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  
  // Check affiliate cookie status
  const affiliateCookie = getAffiliateCookieInfo();

  // Enhanced onBuyNow that uses our affiliate utility
  const handleBuyNowClick = () => {
    if (!product.affiliateUrl && !product.affiliateLink) {
      toast({
        title: "No affiliate link available",
        description: "Sorry, we couldn't find a purchase link for this product."
      });
      return;
    }
    
    // If the original onBuyNow still has important logic, call it
    onBuyNow();
    
    // Use our enhanced affiliate click handler
    const affiliateUrl = product.affiliateUrl || product.affiliateLink;
    if (affiliateUrl) {
      handleAffiliateClick(
        affiliateUrl, 
        String(product.id), // Ensure ID is converted to string
        product.title || product.name, 
        product.asin
      );
    }
  };

  return (
    <div className="md:w-1/2">
      {product.bestSeller && (
        <div className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md mb-2">
          #1 Best Seller
        </div>
      )}
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title || product.name}</h1>
      
      <div className="flex items-center mb-4">
        <div className="flex text-amber-400 mr-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>
              {i < Math.floor(product.rating) ? "★" : 
                i === Math.floor(product.rating) && product.rating % 1 > 0 ? "★" : "☆"}
            </span>
          ))}
        </div>
        <span className="text-gray-600 text-sm">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
      </div>
      
      <div className="mb-6">
        <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        {discountPercentage && (
          <>
            <span className="text-gray-500 line-through ml-2">
              ${product.originalPrice!.toFixed(2)}
            </span>
            <span className="text-green-600 ml-2">
              Save {discountPercentage}%
            </span>
          </>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700">
          {product.shortDescription || product.description.substring(0, 150) + '...'}
        </p>
      </div>
      
      <div className="mb-6 flex items-center">
        <span className={`inline-flex items-center ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
          {product.inStock ? (
            <>
              <Check className="h-5 w-5 mr-1" />
              In Stock
            </>
          ) : (
            <>
              <span className="h-5 w-5 mr-1">✕</span>
              Out of Stock
            </>
          )}
        </span>
      </div>
      
      {/* Affiliate Cookie Timer */}
      {affiliateCookie.active && (
        <div className="mb-6 p-3 bg-indigo-50 rounded-md flex items-center text-sm border border-indigo-100">
          <Clock className="h-4 w-4 mr-2 text-indigo-600" />
          <span>
            Your Amazon support cookie is active! Purchases made within the next 
            <span className="font-semibold text-indigo-700"> {affiliateCookie.hoursRemaining}h {affiliateCookie.minutesRemaining}m </span> 
            will support our site. Thank you!
          </span>
        </div>
      )}
      
      <div className="mb-8 flex space-x-4">
        <Button 
          className="flex items-center bg-amber-500 hover:bg-amber-600"
          onClick={handleBuyNowClick}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Buy on Amazon
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
        
        <SaveForLater 
          productId={String(product.id)} // Converting to string to match SaveForLater component's expected type
          productName={product.title || product.name}
        />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onShare}
          className="rounded-full"
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-3">About this item</h3>
        {product.features && product.features.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">{product.description}</p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
