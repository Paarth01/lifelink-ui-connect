import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Hospital, Users, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import medicalHero from '@/assets/medical-hero.jpg';

type UserRole = 'donor' | 'hospital' | 'ngo' | 'admin';

interface AuthPageProps {
  onAuth: (role: UserRole) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const navigate = useNavigate();

  const roles = [
    {
      id: 'donor' as UserRole,
      title: 'Blood & Organ Donor',
      description: 'Help save lives by donating blood and organs',
      icon: Heart,
      color: 'bg-gradient-to-br from-primary to-primary-hover'
    },
    {
      id: 'hospital' as UserRole,
      title: 'Hospital',
      description: 'Request blood and organs for patients',
      icon: Hospital,
      color: 'bg-gradient-to-br from-accent to-emerald-600'
    },
    {
      id: 'ngo' as UserRole,
      title: 'NGO/Organization',
      description: 'Coordinate donation campaigns and outreach',
      icon: Users,
      color: 'bg-gradient-to-br from-warning to-orange-600'
    },
    {
      id: 'admin' as UserRole,
      title: 'System Admin',
      description: 'Manage the platform and monitor activities',
      icon: Shield,
      color: 'bg-gradient-to-br from-muted-foreground to-slate-700'
    }
  ];

  const handleAuth = () => {
    onAuth(selectedRole);
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-background to-muted overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <img 
          src={medicalHero} 
          alt="Medical donation hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-5xl font-bold text-foreground">
                LifeLink
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Community Blood & Organ Donation Tracker
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connecting donors, hospitals, and organizations to save lives through 
              efficient blood and organ donation coordination.
            </p>
          </div>
        </div>
      </div>

      {/* Authentication Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Role Selection */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Role
            </h2>
            <p className="text-muted-foreground">
              Select how you'd like to contribute to saving lives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                    selectedRole === role.id 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : ''
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full ${role.color} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Auth Form */}
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </CardTitle>
                <CardDescription>
                  {isLogin 
                    ? 'Access your LifeLink dashboard' 
                    : 'Join the life-saving community'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter password"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Confirm password"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}

                <Button 
                  onClick={handleAuth}
                  className="w-full bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg transition-all duration-200"
                  size="lg"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center pt-4">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:text-primary-hover transition-colors duration-200"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}