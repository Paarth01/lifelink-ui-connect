import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  Bell,
  Activity,
  Heart,
  Hospital
} from 'lucide-react';
import Map from './Map';

export default function NGODashboard() {
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');

  const dashboardStats = {
    totalDonors: 1247,
    activeDonors: 523,
    pendingRequests: 17,
    monthlyDonations: 89,
    criticalShortages: 3,
    responseRate: '94%'
  };

  const activeRequests = [
    {
      id: 1,
      hospital: 'City General Hospital',
      type: 'Blood',
      bloodType: 'O-',
      urgency: 'Critical',
      timePosted: '23 min ago',
      location: 'Downtown District',
      estimatedDonors: 12
    },
    {
      id: 2,
      hospital: 'Children\'s Medical Center',
      type: 'Platelets',
      bloodType: 'AB+',
      urgency: 'High',
      timePosted: '1 hour ago',
      location: 'North Side',
      estimatedDonors: 8
    },
    {
      id: 3,
      hospital: 'St. Mary Medical',
      type: 'Plasma',
      bloodType: 'A+',
      urgency: 'Medium',
      timePosted: '3 hours ago',
      location: 'West End',
      estimatedDonors: 24
    }
  ];

  const regionalData = [
    { region: 'Downtown', donors: 342, requests: 7, shortage: 'Moderate' },
    { region: 'North Side', donors: 189, requests: 4, shortage: 'Low' },
    { region: 'West End', donors: 451, requests: 3, shortage: 'Low' },
    { region: 'East District', donors: 265, requests: 8, shortage: 'Critical' }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-emergency text-emergency-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-yellow-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getShortageColor = (shortage: string) => {
    switch (shortage) {
      case 'Critical': return 'text-emergency';
      case 'Moderate': return 'text-warning';
      default: return 'text-accent';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-warning to-orange-600 text-white">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">NGO Command Center</h1>
                <p className="text-white/80">Coordinating Life-Saving Operations</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({dashboardStats.criticalShortages})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Mobile Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6 lg:mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-3 lg:p-6 text-center">
              <div className="text-lg lg:text-3xl font-bold text-primary mb-1 lg:mb-2">{dashboardStats.totalDonors}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Total Donors</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-3 lg:p-6 text-center">
              <div className="text-lg lg:text-3xl font-bold text-accent mb-1 lg:mb-2">{dashboardStats.activeDonors}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Active Donors</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-3 lg:p-6 text-center">
              <div className="text-lg lg:text-3xl font-bold text-emergency mb-1 lg:mb-2">{dashboardStats.pendingRequests}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Pending Requests</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-3 lg:p-6 text-center">
              <div className="text-lg lg:text-3xl font-bold text-warning mb-1 lg:mb-2">{dashboardStats.monthlyDonations}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">This Month</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-3 lg:p-6 text-center">
              <div className="text-lg lg:text-3xl font-bold text-emergency mb-1 lg:mb-2">{dashboardStats.criticalShortages}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Critical Alerts</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-3 lg:p-6 text-center">
              <div className="text-lg lg:text-3xl font-bold text-accent mb-1 lg:mb-2">{dashboardStats.responseRate}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Response Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Layout - Mobile First */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Map Section - Full Width on Mobile */}
          <div className="w-full lg:flex-1">
            <Card className="shadow-lg h-96 lg:h-[600px]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg lg:text-xl">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  Live Donation Map
                </CardTitle>
                <CardDescription className="text-sm">
                  Real-time view of donors, hospitals, and active requests
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 lg:p-6 h-80 lg:h-[500px]">
                <Map className="w-full h-full" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Stacked on Mobile */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Filters */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Filter className="h-5 w-5 text-primary mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Blood Type</label>
                  <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Urgency</label>
                  <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Search Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input className="pl-10 h-12" placeholder="Enter area or hospital..." />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Requests */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="h-5 w-5 text-emergency mr-2" />
                  Active Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeRequests.map((request) => (
                    <div key={request.id} className="p-3 bg-muted/30 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{request.timePosted}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{request.hospital}</div>
                        <div className="text-xs text-muted-foreground">
                          {request.type} - {request.bloodType}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {request.location}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-accent font-medium">
                            {request.estimatedDonors} nearby donors
                          </span>
                          <Button size="sm" className="h-6 px-2 text-xs">
                            Coordinate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Overview */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 text-primary mr-2" />
                  Regional Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionalData.map((region, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{region.region}</span>
                        <span className={`text-xs font-medium ${getShortageColor(region.shortage)}`}>
                          {region.shortage}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{region.donors} donors</span>
                        <span>{region.requests} requests</span>
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