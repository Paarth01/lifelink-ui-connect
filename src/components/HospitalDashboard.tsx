import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Hospital, 
  Plus, 
  Users, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Activity,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import hospitalImage from '@/assets/hospital-dashboard.jpg';

export default function HospitalDashboard() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [bloodType, setBloodType] = useState('');

  const hospitalInfo = {
    name: 'City General Hospital',
    location: 'Downtown Medical District',
    activeRequests: 3,
    completedToday: 7,
    avgResponseTime: '23 min'
  };

  const availableDonors = [
    {
      id: 1,
      name: 'Sarah J.',
      bloodType: 'O+',
      distance: '2.3 km',
      lastDonation: '3 months ago',
      availability: 'Available',
      compatibility: 100
    },
    {
      id: 2,
      name: 'Michael R.',
      bloodType: 'O+',
      distance: '4.1 km',
      lastDonation: '2 months ago',
      availability: 'Available',
      compatibility: 100
    },
    {
      id: 3,
      name: 'Emma L.',
      bloodType: 'O-',
      distance: '5.7 km',
      lastDonation: '4 months ago',
      availability: 'Available',
      compatibility: 95
    }
  ];

  const activeRequests = [
    {
      id: 1,
      type: 'Whole Blood',
      bloodType: 'O+',
      urgency: 'Critical',
      patient: 'Emergency Room Patient #47',
      timePosted: '45 min ago',
      responses: 3,
      status: 'In Progress'
    },
    {
      id: 2,
      type: 'Platelets',
      bloodType: 'AB+',
      urgency: 'High',
      patient: 'Cancer Ward - Room 205',
      timePosted: '2 hours ago',
      responses: 1,
      status: 'Pending'
    },
    {
      id: 3,
      type: 'Plasma',
      bloodType: 'A-',
      urgency: 'Medium',
      patient: 'Surgery Prep - OR 3',
      timePosted: '4 hours ago',
      responses: 5,
      status: 'Fulfilled'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fulfilled': return 'bg-accent text-accent-foreground';
      case 'In Progress': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleSubmitRequest = () => {
    setShowRequestForm(false);
    // Reset form
    setUrgencyLevel('');
    setBloodType('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-accent to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Hospital className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-3xl font-bold">{hospitalInfo.name}</h1>
                <p className="text-white/80 flex items-center text-sm lg:text-base">
                  <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                  {hospitalInfo.location}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowRequestForm(true)}
              className="bg-white text-accent hover:bg-white/90 w-full lg:w-auto"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{hospitalInfo.activeRequests}</div>
              <div className="text-muted-foreground">Active Requests</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">{hospitalInfo.completedToday}</div>
              <div className="text-muted-foreground">Completed Today</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-warning mb-2">{hospitalInfo.avgResponseTime}</div>
              <div className="text-muted-foreground">Avg Response Time</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Request Form & Actions */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            {/* New Request Form */}
            {showRequestForm ? (
              <Card className="shadow-lg border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 text-primary mr-2" />
                    New Donation Request
                  </CardTitle>
                  <CardDescription>
                    Submit urgent blood or organ request
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="requestType">Request Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whole-blood">Whole Blood</SelectItem>
                        <SelectItem value="platelets">Platelets</SelectItem>
                        <SelectItem value="plasma">Plasma</SelectItem>
                        <SelectItem value="kidney">Kidney</SelectItem>
                        <SelectItem value="liver">Liver</SelectItem>
                        <SelectItem value="heart">Heart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select value={bloodType} onValueChange={setBloodType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
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
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical (Life-threatening)</SelectItem>
                        <SelectItem value="high">High (Within 24 hours)</SelectItem>
                        <SelectItem value="medium">Medium (Within 48 hours)</SelectItem>
                        <SelectItem value="low">Low (Within week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="patientInfo">Patient Information</Label>
                    <Input placeholder="Room/Ward details (optional)" />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      placeholder="Special requirements or additional information..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSubmitRequest} className="flex-1">
                      Submit Request
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowRequestForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <img 
                    src={hospitalImage} 
                    alt="Hospital dashboard" 
                    className="w-full h-48 object-cover rounded-lg mb-6 opacity-80"
                  />
                  <h3 className="text-xl font-bold mb-4">Need Blood or Organs?</h3>
                  <p className="text-muted-foreground mb-6">
                    Create urgent requests and connect with compatible donors in your area.
                  </p>
                  <Button 
                    onClick={() => setShowRequestForm(true)}
                    className="bg-gradient-to-r from-accent to-emerald-600"
                    size="lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Request
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Donor Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Protocol
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Active Requests & Donors */}
          <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
            {/* Active Requests */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  Active Requests
                </CardTitle>
                <CardDescription>
                  Monitor your current donation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-muted/30 rounded-lg border">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3 space-y-2 lg:space-y-0">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 mb-1">
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency}
                            </Badge>
                            <span className="font-semibold text-sm lg:text-base">{request.type} - {request.bloodType}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.patient}
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-sm space-y-2 lg:space-y-0">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          Posted {request.timePosted}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                          <span className="text-muted-foreground">
                            {request.responses} responses
                          </span>
                          <Button size="sm" variant="outline" className="w-full sm:w-auto">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Donors */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 text-accent mr-2" />
                      Available Donors
                    </CardTitle>
                    <CardDescription>
                      Compatible donors in your area
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableDonors.map((donor) => (
                    <div key={donor.id} className="p-4 bg-muted/30 rounded-lg border">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-bold text-primary text-sm lg:text-base">{donor.bloodType}</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm lg:text-base">{donor.name}</div>
                            <div className="text-xs lg:text-sm text-muted-foreground space-y-1 lg:space-y-0 lg:flex lg:items-center lg:space-x-3">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {donor.distance}
                              </span>
                              <span>Last donation: {donor.lastDonation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                          <div className="text-center sm:text-right">
                            <Badge variant="outline" className="text-accent border-accent mb-1">
                              {donor.availability}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {donor.compatibility}% match
                            </div>
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-primary to-primary-hover w-full sm:w-auto">
                            Contact
                          </Button>
                        </div>
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