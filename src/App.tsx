import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import DonorDashboard from "./components/DonorDashboard";
import HospitalDashboard from "./components/HospitalDashboard";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type UserRole = 'donor' | 'hospital' | 'ngo' | 'admin';

const App = () => {
  const [currentUser, setCurrentUser] = useState<{role: UserRole} | null>(null);

  const handleAuth = (role: UserRole) => {
    setCurrentUser({ role });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {currentUser && <Navigation currentRole={currentUser.role} onLogout={handleLogout} />}
          <Routes>
            <Route 
              path="/" 
              element={
                currentUser ? (
                  currentUser.role === 'donor' ? <DonorDashboard /> :
                  currentUser.role === 'hospital' ? <HospitalDashboard /> :
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
                      <p className="text-muted-foreground">
                        {currentUser.role === 'ngo' ? 'NGO Dashboard' : 'Admin Dashboard'} is under development
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
              element={currentUser?.role === 'donor' ? <DonorDashboard /> : <AuthPage onAuth={handleAuth} />} 
            />
            <Route 
              path="/hospital" 
              element={currentUser?.role === 'hospital' ? <HospitalDashboard /> : <AuthPage onAuth={handleAuth} />} 
            />
            <Route 
              path="/ngo" 
              element={
                currentUser?.role === 'ngo' ? (
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
                currentUser?.role === 'admin' ? (
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
