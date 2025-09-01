import { Heart, LogOut, User, Settings, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavigationProps {
  currentRole?: string;
  onLogout: () => void;
}

export default function Navigation({ currentRole, onLogout }: NavigationProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const getRoleTitle = (role?: string) => {
    switch (role) {
      case 'donor': return 'Donor Dashboard';
      case 'hospital': return 'Hospital Dashboard';
      case 'ngo': return 'NGO Dashboard';
      case 'admin': return 'Admin Dashboard';
      default: return 'LifeLink';
    }
  };

  const NavButtons = () => (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleTheme}
        className="hidden sm:flex"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
        <span className="hidden lg:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </Button>
      <Button variant="ghost" size="sm" className="hidden sm:flex">
        <Settings className="h-4 w-4 mr-2" />
        <span className="hidden lg:inline">Settings</span>
      </Button>
      <Button variant="ghost" size="sm" className="hidden sm:flex">
        <User className="h-4 w-4 mr-2" />
        <span className="hidden lg:inline">Profile</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
        <LogOut className="h-4 w-4 mr-2" />
        <span className="hidden lg:inline">Logout</span>
      </Button>
    </>
  );

  const MobileNavButtons = () => (
    <div className="flex flex-col space-y-2 p-4">
      <Button 
        variant="ghost" 
        onClick={toggleTheme}
        className="justify-start"
        size="lg"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Button>
      <Button variant="ghost" className="justify-start" size="lg">
        <Settings className="h-5 w-5 mr-3" />
        Settings
      </Button>
      <Button variant="ghost" className="justify-start" size="lg">
        <User className="h-5 w-5 mr-3" />
        Profile
      </Button>
      <Button variant="outline" onClick={handleLogout} className="justify-start" size="lg">
        <LogOut className="h-5 w-5 mr-3" />
        Logout
      </Button>
    </div>
  );

  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">LifeLink</span>
            </div>
            {currentRole && (
              <>
                <div className="w-px h-6 bg-border hidden lg:block"></div>
                <span className="text-muted-foreground hidden lg:block">{getRoleTitle(currentRole)}</span>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-2">
            <NavButtons />
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="sm:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-8 pt-2">
                    <Heart className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold text-foreground">LifeLink</span>
                  </div>
                  {currentRole && (
                    <div className="text-muted-foreground mb-6 pb-4 border-b">
                      {getRoleTitle(currentRole)}
                    </div>
                  )}
                  <MobileNavButtons />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}