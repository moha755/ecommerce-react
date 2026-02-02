import { useState, useEffect, useMemo } from 'react';
import { Package, FolderOpen, DollarSign, CheckCircle } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { FilterBar } from '../components/FilterBar';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';
import { api, Product } from '../utils/api';
import {
  filterBySearch,
  filterByCategory,
  filterByPriceRange,
  sortProducts,
  calculateAveragePrice,
  paginateProducts,
  getTotalPages,
  formatPrice,
  SortOption,
} from '../utils/helpers';

interface DashboardProps {
  searchTerm: string;
  onViewProduct: (id: number) => void;
}

export function Dashboard({ searchTerm, onViewProduct }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          api.getAllProducts(),
          api.getCategories(),
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        
        // Calculate max price from products
        const max = Math.ceil(Math.max(...productsData.map(p => p.price)));
        setMaxPrice(max);
        setPriceRange([0, max]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply all filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Apply search filter
    result = filterBySearch(result, searchTerm);
    
    // Apply category filter
    result = filterByCategory(result, selectedCategory);
    
    // Apply price range filter
    result = filterByPriceRange(result, priceRange[0], priceRange[1]);
    
    // Apply sorting
    result = sortProducts(result, sortBy);
    
    return result;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  // Paginate results
  const paginatedProducts = useMemo(() => {
    return paginateProducts(filteredProducts, currentPage, itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = getTotalPages(filteredProducts.length, itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const avgPrice = calculateAveragePrice(products);
    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      averagePrice: avgPrice,
      inStock: products.length, // All products are in stock in this demo
    };
  }, [products, categories]);

  // Check if filters are active
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== maxPrice ||
    sortBy !== 'default' ||
    searchTerm.trim() !== '';

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, maxPrice]);
    setSortBy('default');
  };

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-destructive/10 p-8">
        <div className="text-center">
          <h3 className="mb-2 text-destructive">Error Loading Products</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          iconColor="bg-gradient-to-br from-blue-600 to-blue-700"
          isLoading={isLoading}
        />
        <StatsCard
          title="Categories"
          value={stats.totalCategories}
          icon={FolderOpen}
          iconColor="bg-gradient-to-br from-purple-600 to-purple-700"
          isLoading={isLoading}
        />
        <StatsCard
          title="Average Price"
          value={formatPrice(stats.averagePrice)}
          icon={DollarSign}
          iconColor="bg-gradient-to-br from-green-600 to-green-700"
          isLoading={isLoading}
        />
        <StatsCard
          title="In Stock"
          value={stats.inStock}
          icon={CheckCircle}
          iconColor="bg-gradient-to-br from-orange-600 to-orange-700"
          isLoading={isLoading}
        />
      </div>

      {/* Filter Bar */}
      {!isLoading && (
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          maxPrice={maxPrice}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortChange={setSortBy as (value: string) => void}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState onClearFilters={hasActiveFilters ? handleClearFilters : undefined} />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewProduct}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
