import { PackageOpen } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  onClearFilters?: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/10 p-12 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <PackageOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mb-2">No products found</h3>
      <p className="mb-6 text-muted-foreground max-w-md">
        We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
      </p>
      {onClearFilters && (
        <Button onClick={onClearFilters} variant="outline">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
