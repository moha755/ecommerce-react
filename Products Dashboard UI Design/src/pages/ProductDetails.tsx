import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { api, Product } from '../utils/api';
import { formatPrice } from '../utils/helpers';
import { toast } from 'sonner@2.0.3';

interface ProductDetailsProps {
  productId: number;
  onBack: () => void;
}

export function ProductDetails({ productId, onBack }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await api.getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    setIsAddingToCart(true);
    
    // Simulate adding to cart with localStorage
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      setIsAddingToCart(false);
      
      toast.success('Added to cart!', {
        description: `${product.title} has been added to your cart.`,
      });
    }, 500);
  };

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-destructive/10 p-8">
        <div className="text-center">
          <h3 className="mb-2 text-destructive">Error Loading Product</h3>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button onClick={onBack} variant="ghost" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      {/* Product Details */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-xl border bg-muted">
          <div className="relative aspect-square">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain p-8"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="mb-4">{product.title}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(product.rating.rate)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3>Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/20 p-4">
            <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400">
              In Stock - Ready to Ship
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ShoppingCart className="h-5 w-5" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>

          {/* Additional Info */}
          <div className="space-y-3 rounded-lg border p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product ID:</span>
              <span className="font-medium">#{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Availability:</span>
              <span className="font-medium text-green-600 dark:text-green-400">In Stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
