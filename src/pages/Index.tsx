
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { getNavigationCategories } from '@/services/categoryService';
import { getProducts, Product } from '@/services/productService';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPostsSection from '@/components/home/BlogPostsSection';
import { supabase } from '@/integrations/supabase/client';

// Import mapSupabaseProductToProduct function for mapping Supabase data to Product
import { mapSupabaseProductToProduct } from '@/services/productService';

const Index = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get categories with subcategories
        const categoriesData = await getNavigationCategories();
        setCategories(categoriesData.filter(cat => cat.showInNavigation !== false));
        
        // Try to get featured products directly from Supabase
        const { data: supabaseProducts, error: featuredError } = await supabase
          .from('products')
          .select('*')
          .eq('attributes->bestSeller', true)
          .order('rating', { ascending: false })
          .limit(6);
          
        if (featuredError) {
          console.error('Error fetching featured products:', featuredError);
          throw new Error('Failed to fetch featured products');
        }
        
        if (supabaseProducts && supabaseProducts.length > 0) {
          // Create an array to hold our mapped products
          const mappedProducts: Product[] = [];
          
          // Use standard for loop to avoid TypeScript deep instantiation issues
          for (let i = 0; i < supabaseProducts.length; i++) {
            // Use type assertion to any to bypass TypeScript's deep type checking
            const productData = supabaseProducts[i] as any;
            const mappedProduct = mapSupabaseProductToProduct(productData);
            mappedProducts.push(mappedProduct);
          }
          
          setFeaturedProducts(mappedProducts);
        } else {
          // Get all products
          const products = await getProducts();
          
          // Select featured products
          // First, try to get products marked as "bestSeller" or with high ratings
          let featured = products.filter(p => p.bestSeller === true);
          
          // If we don't have enough featured products, add products with high ratings
          if (featured.length < 6) {
            const highRatedProducts = products
              .filter(p => !featured.some(fp => String(fp.id) === String(p.id))) // Exclude already featured products
              .sort((a, b) => b.rating - a.rating) // Sort by rating (high to low)
              .slice(0, 6 - featured.length); // Get enough to fill up to 6 slots
            
            featured = [...featured, ...highRatedProducts];
          }
          
          // If we still don't have 6 products, get random ones
          if (featured.length < 6) {
            const randomProducts = [...products]
              .filter(p => !featured.some(fp => String(fp.id) === String(p.id))) // Exclude already featured products
              .sort(() => 0.5 - Math.random()) // Randomize
              .slice(0, 6 - featured.length); // Get enough to fill up to 6 slots
            
            featured = [...featured, ...randomProducts];
          }
          
          setFeaturedProducts(featured);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <MainLayout>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection 
        products={featuredProducts} 
        title="Featured Recovery Products"
        subtitle="Our handpicked selection of the best recovery tools to help you feel better, move better, and perform better."
        viewAllLink="/categories/massage-guns"
        viewAllText="View All Products"
        maxProducts={6}
      />
      <WhyChooseUsSection />
      <NewsletterSection />
      <TestimonialsSection />
      <BlogPostsSection />
    </MainLayout>
  );
};

export default Index;
