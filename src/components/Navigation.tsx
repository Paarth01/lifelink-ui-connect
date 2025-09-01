import { Heart, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  currentRole?: string;
  onLogout: () => void;
}

export default function Navigation({ currentRole, onLogout }: NavigationProps) {
  const navigate = useNavigate();

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

  return (
    <nav className="bg-white border-b border-border shadow-sm">
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
                <div className="w-px h-6 bg-border"></div>
                <span className="text-muted-foreground">{getRoleTitle(currentRole)}</span>
              </>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}