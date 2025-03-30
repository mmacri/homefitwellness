import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import CategoryHero from '@/components/CategoryHero';
import SubcategoryHero from '@/components/SubcategoryHero';
import { getCategoryBySlug } from '@/services/categoryService';
import { getProductsByCategory } from '@/lib/product-utils';
import { generateCategoryBreadcrumbs } from '@/lib/category-utils';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';
