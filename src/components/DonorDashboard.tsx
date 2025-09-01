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
  Clock
} from 'lucide-react';
import donorImage from '@/assets/donor-dashboard.jpg';

export default function DonorDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [hasUrgentRequests] = useState(true);

  const donorProfile = {
    name: 'Sarah Johnson',
    bloodType: 'O+',
    location: 'Downtown Medical District',
    donationsCount: 12,
    lastDonation: '2024-01-15',
    organsOffered: ['Kidney', 'Liver', 'Corneas']
  };

  const urgentRequests = [
    {
      id: 1,
      type: 'Blood',
      bloodType: 'O+',
      urgency: 'Critical',
      hospital: 'City General Hospital',
      distance: '2.3 km',
      timePosted: '15 min ago'
    },
    {
      id: 2,
      type: 'Platelets',
      bloodType: 'O+',
      urgency: 'High',
      hospital: 'St. Mary Medical Center',
      distance: '4.1 km',
      timePosted: '1 hour ago'
    }
  ];

  const donationHistory = [
    {
      date: '2024-01-15',
      type: 'Whole Blood',
      location: 'City General Hospital',
      status: 'Completed'
    },
    {
      date: '2023-11-20',
      type: 'Platelets',
      location: 'Red Cross Center',
      status: 'Completed'
    },
    {
      date: '2023-09-10',
      type: 'Whole Blood',
      location: 'Community Health Center',
      status: 'Completed'
    }
  ];

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
                <h1 className="text-3xl font-bold">Welcome back, {donorProfile.name}</h1>
                <p className="text-white/80">Ready to save lives today?</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{donorProfile.donationsCount}</div>
              <div className="text-white/80">Lives Saved</div>
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
                    <div className="text-2xl font-bold text-primary">{donorProfile.bloodType}</div>
                  </div>
                  <h3 className="font-semibold text-lg">{donorProfile.name}</h3>
                  <p className="text-muted-foreground flex items-center justify-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {donorProfile.location}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Type:</span>
                    <Badge variant="outline" className="font-semibold">
                      {donorProfile.bloodType}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Donation:</span>
                    <span className="font-medium">{donorProfile.lastDonation}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available to Donate:</span>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={isAvailable} 
                        onCheckedChange={setIsAvailable}
                      />
                      <span className={`text-sm font-medium ${isAvailable ? 'text-accent' : 'text-muted-foreground'}`}>
                        {isAvailable ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Organs Offered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {donorProfile.organsOffered.map((organ) => (
                      <Badge key={organ} variant="secondary" className="text-xs">
                        {organ}
                      </Badge>
                    ))}
                  </div>
                </div>
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
                    <div className="text-2xl font-bold text-accent">{donorProfile.donationsCount}</div>
                    <div className="text-xs text-muted-foreground">Total Donations</div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-xs text-muted-foreground">This Year</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Requests & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent Requests */}
            {hasUrgentRequests && (
              <Card className="shadow-lg border-l-4 border-l-emergency">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-emergency mr-2" />
                    Urgent Donation Requests
                    <Badge className="ml-2 bg-emergency text-emergency-foreground">
                      {urgentRequests.length} Active
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Immediate help needed in your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {urgentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency}
                            </Badge>
                            <span className="font-semibold">{request.type} - {request.bloodType}</span>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {request.hospital} • {request.distance}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Posted {request.timePosted}
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
                <div className="space-y-3">
                  {donationHistory.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="font-medium">{donation.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {donation.location} • {donation.date}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-accent mr-2" />
                        <Badge variant="outline" className="text-accent border-accent">
                          {donation.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}