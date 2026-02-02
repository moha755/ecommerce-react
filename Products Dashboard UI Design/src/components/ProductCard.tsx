import { Star, Eye } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Product } from '../utils/api';
import { formatPrice } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: number) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur">
              {product.category}
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 min-h-[3rem]">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(product.rating.rate)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.rating.count})
            </span>
          </div>

          {/* Price and Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            <Button
              onClick={() => onViewDetails(product.id)}
              size="sm"
              className="gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
export function ProductCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-3 p-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
