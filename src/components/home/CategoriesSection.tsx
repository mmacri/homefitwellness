
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getNavigationCategories, Category } from '@/services/categoryService';

interface CategoriesSectionProps {
  categories?: Category[];
}

const DEFAULT_IMAGE = '/placeholder.svg';
const FALLBACK_IMAGE = '/placeholder.svg';

// Helper function to add cache busting to image URLs
const addCacheBusting = (url: string): string => {
  if (!url) return FALLBACK_IMAGE;
  
  // Don't add cache busting to local images
  if (url.startsWith('/')) return url;
  
  // Add timestamp as cache buster
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories: propCategories }) => {
  const [categories, setCategories] = useState<Category[]>(propCategories || []);
  const [isLoading, setIsLoading] = useState(!propCategories);

  useEffect(() => {
    if (propCategories) {
      setCategories(propCategories);
      return;
    }

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const loadedCategories = await getNavigationCategories();
        setCategories(loadedCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [propCategories]);

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Browse Recovery Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden border shadow-md">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Browse Recovery Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Card key={category.id} className="overflow-hidden hover:shadow-xl transition-shadow border shadow-md">
              <CardContent className="p-0">
                <Link 
                  to={`/categories/${category.slug}`} 
                  className="block"
                  title={`Browse ${category.name} category`}
                  aria-label={`Browse ${category.name} category with ${category.subcategories?.length || 0} subcategories`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={addCacheBusting(category.imageUrl || FALLBACK_IMAGE)} 
                      alt={`${category.name} category image`} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">{category.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 bg-card text-card-foreground">
                    <p className="text-muted-foreground text-sm mb-3">
                      {category.description || `Browse our selection of ${category.name.toLowerCase()}`}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-primary font-medium">
                        {category.subcategories?.length || 0} Subcategories
                      </span>
                      <div className="text-primary flex items-center">
                        View Products <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
