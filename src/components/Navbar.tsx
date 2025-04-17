import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserCircle, MessageCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Plan', path: '/planner' },
    { name: 'Explore', path: '/explore' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Travel Assistant', path: '/chatbot', icon: <MessageCircle className="h-4 w-4 mr-1" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
              <span className="text-xl font-bold text-teal">Journey</span>
              <span className="text-xl font-bold text-coral">Genie</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                    location.pathname === link.path
                      ? 'text-coral bg-muted'
                      : 'text-foreground hover:text-coral'
                  }`}
                >
                  {link.icon && link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="ml-4 flex items-center">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/bookings" 
                    className="mr-2 p-2 rounded-full hover:bg-muted relative"
                    aria-label="Cart"
                  >
                    <ShoppingCart className="h-5 w-5 text-foreground" />
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative rounded-full">
                        <UserCircle className="h-8 w-8 text-teal" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="p-2">
                        <p className="font-medium">{user?.name || 'User'}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" onClick={closeMobileMenu}>Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/bookings" onClick={closeMobileMenu}>Bookings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button variant="default" asChild>
                    <Link to="/login" className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/admin-login">Admin</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-coral focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'text-coral bg-muted'
                  : 'text-foreground hover:text-coral'
              }`}
              onClick={closeMobileMenu}
            >
              {link.icon && link.icon}
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-coral"
                onClick={closeMobileMenu}
              >
                <UserCircle className="h-4 w-4 mr-1" />
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-coral"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-coral"
              onClick={closeMobileMenu}
            >
              <LogIn className="h-4 w-4 mr-1" />
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
