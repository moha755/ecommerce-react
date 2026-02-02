import { Product } from './api';

// Format price to USD currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Filter products by search term
export const filterBySearch = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm.trim()) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product =>
    product.title.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  );
};

// Filter products by category
export const filterByCategory = (products: Product[], category: string): Product[] => {
  if (!category || category === 'all') return products;
  return products.filter(product => product.category === category);
};

// Filter products by price range
export const filterByPriceRange = (
  products: Product[],
  minPrice: number,
  maxPrice: number
): Product[] => {
  return products.filter(
    product => product.price >= minPrice && product.price <= maxPrice
  );
};

// Sort products
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
    default:
      return sorted;
  }
};

// Get unique categories from products
export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = products.map(p => p.category);
  return Array.from(new Set(categories));
};

// Calculate average price
export const calculateAveragePrice = (products: Product[]): number => {
  if (products.length === 0) return 0;
  const total = products.reduce((sum, product) => sum + product.price, 0);
  return total / products.length;
};

// Paginate products
export const paginateProducts = (
  products: Product[],
  currentPage: number,
  itemsPerPage: number
): Product[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return products.slice(startIndex, endIndex);
};

// Calculate total pages
export const getTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage);
};
