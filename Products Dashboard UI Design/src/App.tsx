import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ProductDetails } from './pages/ProductDetails';
import { Toaster } from './components/ui/sonner';

type Page = 'dashboard' | 'products' | 'categories' | 'orders';
type View = 'dashboard' | 'product-details';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('products');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const handleViewProduct = (id: number) => {
    setSelectedProductId(id);
    setCurrentView('product-details');
    window.scrollTo(0, 0);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProductId(null);
  };

  const handlePageChange = (page: string) => {
    setActivePage(page as Page);
    setCurrentView('dashboard');
    setSelectedProductId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />

      <div className="flex">
        <Sidebar
          activePage={activePage}
          onPageChange={handlePageChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {activePage === 'products' && currentView === 'dashboard' && (
              <Dashboard
                searchTerm={searchTerm}
                onViewProduct={handleViewProduct}
              />
            )}

            {activePage === 'products' && currentView === 'product-details' && selectedProductId && (
              <ProductDetails
                productId={selectedProductId}
                onBack={handleBackToDashboard}
              />
            )}

            {activePage === 'dashboard' && (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed bg-muted/10 p-12">
                <div className="text-center">
                  <h2 className="mb-2">Dashboard Overview</h2>
                  <p className="text-muted-foreground">
                    This section would contain analytics and insights.
                  </p>
                </div>
              </div>
            )}

            {activePage === 'categories' && (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed bg-muted/10 p-12">
                <div className="text-center">
                  <h2 className="mb-2">Categories</h2>
                  <p className="text-muted-foreground">
                    This section would display product categories management.
                  </p>
                </div>
              </div>
            )}

            {activePage === 'orders' && (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed bg-muted/10 p-12">
                <div className="text-center">
                  <h2 className="mb-2">Orders</h2>
                  <p className="text-muted-foreground">
                    This section would display order management.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
