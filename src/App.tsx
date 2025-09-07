import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import AuthPage from "./components/AuthPage";
import DonorDashboard from "./components/DonorDashboard";
import HospitalDashboard from "./components/HospitalDashboard";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type UserRole = 'donor' | 'hospital' | 'ngo' | 'admin';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role from database
          setTimeout(async () => {
            const { data: userData } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();
            
            setUserRole(userData?.role as UserRole || null);
            setLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user role from database
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data: userData }) => {
            setUserRole(userData?.role as UserRole || null);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (role: UserRole, userId: string) => {
    setUserRole(role);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {user && userRole && <Navigation currentRole={userRole} onLogout={handleLogout} />}
          <Routes>
            <Route 
              path="/" 
              element={
                user && userRole ? (
                  userRole === 'donor' ? <DonorDashboard /> :
                  userRole === 'hospital' ? <HospitalDashboard /> :
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
                      <p className="text-muted-foreground">
                        {userRole === 'ngo' ? 'NGO Dashboard' : 'Admin Dashboard'} is under development
                      </p>
                    </div>
                  </div>
                ) : (
                  <AuthPage onAuth={handleAuth} />
                )
              } 
            />
            <Route 
              path="/donor" 
              element={user && userRole === 'donor' ? <DonorDashboard /> : <AuthPage onAuth={handleAuth} />} 
            />
            <Route 
              path="/hospital" 
              element={user && userRole === 'hospital' ? <HospitalDashboard /> : <AuthPage onAuth={handleAuth} />} 
            />
            <Route 
              path="/ngo" 
              element={
                user && userRole === 'ngo' ? (
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">NGO Dashboard</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </div>
                ) : <AuthPage onAuth={handleAuth} />
              } 
            />
            <Route 
              path="/admin" 
              element={
                user && userRole === 'admin' ? (
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </div>
                ) : <AuthPage onAuth={handleAuth} />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
