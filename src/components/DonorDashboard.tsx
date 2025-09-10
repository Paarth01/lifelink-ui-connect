import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Bell, 
  User, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import donorImage from '@/assets/donor-dashboard.jpg';
import { useDonorData } from '@/hooks/useDonorData';
import { useToast } from '@/hooks/use-toast';

export default function DonorDashboard() {
  const { donorProfile, urgentRequests, donationHistory, loading, updateAvailability, respondToRequest } = useDonorData();
  const { toast } = useToast();
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!donorProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Complete Your Donor Profile</h2>
          <p className="text-muted-foreground">Please update your donor information to continue.</p>
        </Card>
      </div>
    );
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-emergency text-emergency-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-yellow-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleRespondToRequest = async (requestId: string) => {
    setRespondingTo(requestId);
    try {
      const result = await respondToRequest(requestId);
      if (result.success) {
        toast({
          title: "Response sent successfully!",
          description: "The hospital has been notified of your willingness to donate.",
        });
      } else {
        toast({
          title: "Failed to respond",
          description: result.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRespondingTo(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with enhanced gradient and glass effect */}
      <div className="relative bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="animate-fade-in">
                <h1 className="text-4xl font-heading font-bold mb-2">Welcome back, {donorProfile.full_name}</h1>
                <p className="text-white/90 text-lg">Ready to save lives today?</p>
              </div>
            </div>
            <div className="text-right animate-scale-in">
              <div className="text-4xl font-heading font-bold">{donationHistory.length}</div>
              <div className="text-white/90 text-lg">Donations Made</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Status */}
          <div className="lg:col-span-1 space-y-8">
            {/* Enhanced Profile Card */}
            <Card className="shadow-xl hover-lift card-gradient border-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center font-heading text-xl">
                  <Heart className="h-6 w-6 text-primary mr-3" />
                  Donor Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="text-center">
                  <div className="w-28 h-28 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse-glow">
                    <div className="text-3xl font-heading font-bold text-white">{donorProfile.blood_type || 'N/A'}</div>
                  </div>
                  <h3 className="font-heading font-semibold text-2xl mb-2">{donorProfile.full_name}</h3>
                  <p className="text-muted-foreground flex items-center justify-center mt-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    {donorProfile.location || 'Location not set'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary-light/50 rounded-xl">
                    <span className="text-muted-foreground font-medium">Blood Type:</span>
                    <Badge variant="outline" className="font-semibold border-primary text-primary">
                      {donorProfile.blood_type || 'Not specified'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-accent-light/50 rounded-xl">
                    <span className="text-muted-foreground font-medium">Donations Made:</span>
                    <span className="font-bold text-accent text-lg">{donationHistory.length}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
                    <span className="text-muted-foreground font-medium">Available to Donate:</span>
                    <div className="flex items-center space-x-3">
                      <Switch 
                        checked={donorProfile.availability} 
                        onCheckedChange={updateAvailability}
                        className="transition-all duration-300"
                      />
                      <span className={`text-sm font-semibold transition-colors ${donorProfile.availability ? 'text-accent' : 'text-muted-foreground'}`}>
                        {donorProfile.availability ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {donorProfile.organ_type && (
                  <div className="pt-6 border-t border-border">
                    <h4 className="font-heading font-semibold mb-3">Organ Type:</h4>
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                      {donorProfile.organ_type}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Quick Stats */}
            <Card className="shadow-xl hover-lift card-gradient border-0">
              <CardHeader>
                <CardTitle className="flex items-center font-heading text-xl">
                  <Activity className="h-6 w-6 text-accent mr-3" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-gradient-accent rounded-2xl text-white shadow-glow-accent hover-lift">
                    <div className="text-3xl font-heading font-bold">{donationHistory.length}</div>
                    <div className="text-white/90 text-sm font-medium">Total Donations</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-primary rounded-2xl text-white shadow-glow hover-lift">
                    <div className="text-3xl font-heading font-bold">{urgentRequests.length}</div>
                    <div className="text-white/90 text-sm font-medium">Active Requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Requests & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Urgent Requests */}
            {urgentRequests.length > 0 && (
              <Card className="shadow-2xl border-l-4 border-l-emergency glass animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center font-heading text-xl">
                    <AlertCircle className="h-6 w-6 text-emergency mr-3 animate-pulse" />
                    Active Donation Requests
                    <Badge className="ml-3 bg-gradient-emergency text-emergency-foreground shadow-glow-emergency">
                      {urgentRequests.length} Available
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Current requests matching your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {urgentRequests.slice(0, 3).map((request, index) => (
                      <div key={request.request_id} className="p-6 bg-gradient-card rounded-2xl border border-border/50 hover-lift transition-smooth">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <Badge className="bg-gradient-emergency text-emergency-foreground px-4 py-2 text-sm font-semibold shadow-glow-emergency">
                                {request.status}
                              </Badge>
                              <span className="font-heading font-semibold text-lg">
                                {request.required_blood_type ? `Blood - ${request.required_blood_type}` : ''}
                                {request.required_organ_type ? `Organ - ${request.required_organ_type}` : ''}
                              </span>
                            </div>
                            <div className="text-muted-foreground space-y-2">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {request.hospital_name || 'Hospital'} 
                                {request.hospital_location && ` • ${request.hospital_location}`}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Posted {new Date(request.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button 
                            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-3 text-base font-semibold"
                            onClick={() => handleRespondToRequest(request.request_id)}
                            disabled={respondingTo === request.request_id}
                          >
                            {respondingTo === request.request_id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Responding...
                              </>
                            ) : (
                              'Respond Now'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Main Action Card */}
            <Card className="shadow-2xl bg-gradient-card border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-5 rounded-full -translate-y-20 translate-x-20"></div>
              <CardContent className="p-12 text-center relative z-10">
                <img 
                  src={donorImage} 
                  alt="Donation process" 
                  className="w-full h-64 object-cover rounded-2xl mb-8 shadow-xl hover-lift transition-smooth"
                />
                <h3 className="text-3xl font-heading font-bold mb-6">Ready to Make a Difference?</h3>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Your donation can save up to three lives. Find nearby donation centers and schedule your appointment.
                </p>
                <div className="flex gap-6 justify-center">
                  <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-4 text-lg font-semibold">
                    <Heart className="h-6 w-6 mr-3" />
                    Donate Now
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-primary/20 hover:bg-primary/5 transition-all duration-300 px-8 py-4 text-lg">
                    <Calendar className="h-6 w-6 mr-3" />
                    Schedule Later
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Donation History */}
            <Card className="shadow-xl card-gradient border-0">
              <CardHeader>
                <CardTitle className="flex items-center font-heading text-xl">
                  <Calendar className="h-6 w-6 text-primary mr-3" />
                  Donation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {donationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {donationHistory.map((donation, index) => (
                      <div key={donation.donation_id} className="flex items-center justify-between p-6 bg-gradient-card rounded-2xl border border-border/50 hover-lift transition-smooth">
                        <div>
                          <div className="font-heading font-semibold text-lg">Donation</div>
                          <div className="text-muted-foreground mt-1">
                            {donation.hospital_name || 'Hospital'} • {new Date(donation.fulfilled_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-accent mr-3" />
                          <Badge variant="outline" className="text-accent border-accent px-4 py-2">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No donations yet. Start making a difference today!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}