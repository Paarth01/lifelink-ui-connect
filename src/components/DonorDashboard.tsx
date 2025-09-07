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

export default function DonorDashboard() {
  const { donorProfile, urgentRequests, donationHistory, loading, updateAvailability } = useDonorData();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-hover text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {donorProfile.full_name}</h1>
                <p className="text-white/80">Ready to save lives today?</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{donationHistory.length}</div>
              <div className="text-white/80">Donations Made</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 text-primary mr-2" />
                  Donor Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl font-bold text-primary">{donorProfile.blood_type || 'N/A'}</div>
                  </div>
                  <h3 className="font-semibold text-lg">{donorProfile.full_name}</h3>
                  <p className="text-muted-foreground flex items-center justify-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {donorProfile.location || 'Location not set'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Type:</span>
                    <Badge variant="outline" className="font-semibold">
                      {donorProfile.blood_type || 'Not specified'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Donations Made:</span>
                    <span className="font-medium">{donationHistory.length}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available to Donate:</span>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={donorProfile.availability} 
                        onCheckedChange={updateAvailability}
                      />
                      <span className={`text-sm font-medium ${donorProfile.availability ? 'text-accent' : 'text-muted-foreground'}`}>
                        {donorProfile.availability ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {donorProfile.organ_type && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Organ Type:</h4>
                    <Badge variant="secondary" className="text-xs">
                      {donorProfile.organ_type}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 text-accent mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{donationHistory.length}</div>
                    <div className="text-xs text-muted-foreground">Total Donations</div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{urgentRequests.length}</div>
                    <div className="text-xs text-muted-foreground">Active Requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Requests & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent Requests */}
            {urgentRequests.length > 0 && (
              <Card className="shadow-lg border-l-4 border-l-emergency">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-emergency mr-2" />
                    Active Donation Requests
                    <Badge className="ml-2 bg-emergency text-emergency-foreground">
                      {urgentRequests.length} Available
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Current requests matching your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {urgentRequests.slice(0, 3).map((request) => (
                      <div key={request.request_id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge className="bg-warning text-warning-foreground">
                              {request.status}
                            </Badge>
                            <span className="font-semibold">
                              {request.required_blood_type ? `Blood - ${request.required_blood_type}` : ''}
                              {request.required_organ_type ? `Organ - ${request.required_organ_type}` : ''}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {request.hospital_name || 'Hospital'} 
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Posted {new Date(request.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-primary-hover">
                          Respond Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Action Card */}
            <Card className="shadow-lg bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="p-8 text-center">
                <img 
                  src={donorImage} 
                  alt="Donation process" 
                  className="w-full h-48 object-cover rounded-lg mb-6 opacity-80"
                />
                <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
                <p className="text-muted-foreground mb-6">
                  Your donation can save up to three lives. Find nearby donation centers and schedule your appointment.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary-hover">
                    <Heart className="h-5 w-5 mr-2" />
                    Donate Now
                  </Button>
                  <Button size="lg" variant="outline">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Later
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Donation History */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  Donation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {donationHistory.length > 0 ? (
                  <div className="space-y-3">
                    {donationHistory.map((donation) => (
                      <div key={donation.donation_id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <div className="font-medium">Donation</div>
                          <div className="text-sm text-muted-foreground">
                            {donation.hospital_name || 'Hospital'} • {new Date(donation.fulfilled_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-accent mr-2" />
                          <Badge variant="outline" className="text-accent border-accent">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No donations yet. Start making a difference today!</p>
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