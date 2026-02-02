import { Search, Menu, Moon, Sun } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onMenuToggle: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export function Navbar({
  searchTerm,
  onSearchChange,
  onMenuToggle,
  darkMode,
  onDarkModeToggle,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <span className="font-bold text-white">P</span>
          </div>
          <h1 className="hidden sm:block">Productly</h1>
        </div>

        {/* Search Bar */}
        <div className="relative ml-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 bg-input-background"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onDarkModeToggle}
          className="hidden sm:flex"
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
