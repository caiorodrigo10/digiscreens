
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Monitor, 
  Film, 
  Users, 
  BookOpen, 
  BadgeDollarSign, 
  BarChart, 
  ChevronRight,
  Menu,
  X,
  Handshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Terminais',
    href: '/terminais',
    icon: <Monitor className="h-5 w-5" />,
  },
  {
    title: 'Mídias',
    href: '/midias',
    icon: <Film className="h-5 w-5" />,
  },
  {
    title: 'Grupos',
    href: '/grupos',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Parcerias',
    href: '/parcerias',
    icon: <Handshake className="h-5 w-5" />,
  },
  {
    title: 'Biblioteca',
    href: '/biblioteca',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: 'Anunciantes',
    href: '/anunciantes',
    icon: <BadgeDollarSign className="h-5 w-5" />,
  },
  {
    title: 'Relatórios',
    href: '/relatorios',
    icon: <BarChart className="h-5 w-5" />,
  },
];

const MainNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Function to check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar/Nav for desktop & mobile */}
      <div
        className={cn(
          "bg-white/95 backdrop-blur-sm shadow-md fixed top-0 left-0 z-20 h-full w-64 transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary">DigiScreens</h2>
          <p className="text-xs text-muted-foreground">Sistema de Gerenciamento</p>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {isActive(item.href) && (
                    <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              AD
            </div>
            <div>
              <p className="text-sm font-medium">Admin Usuário</p>
              <p className="text-xs text-muted-foreground">admin@digiscreens.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-10"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default MainNav;
