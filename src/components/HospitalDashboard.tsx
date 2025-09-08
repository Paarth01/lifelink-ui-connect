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
  Filter,
  Loader2
} from 'lucide-react';
import hospitalImage from '@/assets/hospital-dashboard.jpg';
import { useHospitalData } from '@/hooks/useHospitalData';

export default function HospitalDashboard() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [bloodType, setBloodType] = useState('');
  
  const { hospitalProfile, activeRequests, availableDonors, stats, loading, createRequest } = useHospitalData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hospitalProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Complete Your Hospital Profile</h2>
          <p className="text-muted-foreground">Please update your hospital information to continue.</p>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fulfilled': return 'bg-accent text-accent-foreground';
      case 'In Progress': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleSubmitRequest = async () => {
    if (!requestType && !bloodType) return;
    
    await createRequest({
      required_blood_type: requestType.includes('blood') ? bloodType : undefined,
      required_organ_type: !requestType.includes('blood') ? requestType : undefined,
    });
    
    setShowRequestForm(false);
    // Reset form
    setRequestType('');
    setBloodType('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with medical green theme */}
      <div className="relative bg-gradient-accent text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-glow/20 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
                <Hospital className="h-10 w-10 text-white" />
              </div>
              <div className="animate-fade-in">
                <h1 className="text-4xl font-heading font-bold mb-2">{hospitalProfile.hospital_name}</h1>
                <p className="text-white/90 text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {hospitalProfile.location}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowRequestForm(true)}
              className="bg-white text-accent hover:bg-white/90 transition-all duration-300 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl animate-scale-in"
              size="lg"
            >
              <Plus className="h-6 w-6 mr-3" />
              New Request
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Quick Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="shadow-xl hover-lift card-gradient border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="text-4xl font-heading font-bold text-primary mb-2">{stats.activeRequestsCount}</div>
              <div className="text-muted-foreground font-medium">Active Requests</div>
            </CardContent>
          </Card>
          <Card className="shadow-xl hover-lift card-gradient border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-accent opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="text-4xl font-heading font-bold text-accent mb-2">{stats.completedToday}</div>
              <div className="text-muted-foreground font-medium">Completed Today</div>
            </CardContent>
          </Card>
          <Card className="shadow-xl hover-lift card-gradient border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-emergency opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="text-4xl font-heading font-bold text-warning mb-2">{stats.totalDonors}</div>
              <div className="text-muted-foreground font-medium">Available Donors</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Request Form & Actions */}
          <div className="lg:col-span-1 space-y-6">
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
                    <Select value={requestType} onValueChange={setRequestType}>
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
          <div className="lg:col-span-2 space-y-6">
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
                {activeRequests.length > 0 ? (
                  <div className="space-y-4">
                    {activeRequests.map((request) => (
                      <div key={request.request_id} className="p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                              <span className="font-semibold">
                                {request.required_blood_type ? `Blood - ${request.required_blood_type}` : ''}
                                {request.required_organ_type ? `Organ - ${request.required_organ_type}` : ''}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Request ID: {request.request_id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Posted {new Date(request.created_at).toLocaleDateString()}
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No active requests. Create your first request to get started.</p>
                  </div>
                )}
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
                {availableDonors.length > 0 ? (
                  <div className="space-y-4">
                    {availableDonors.slice(0, 5).map((donor) => (
                      <div key={donor.donor_id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-bold text-primary">{donor.blood_type || 'N/A'}</span>
                          </div>
                          <div>
                            <div className="font-medium">{donor.full_name}</div>
                            <div className="text-sm text-muted-foreground flex items-center space-x-3">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {donor.location || 'Location not set'}
                              </span>
                              {donor.organ_type && (
                                <span>Organ: {donor.organ_type}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge variant="outline" className="text-accent border-accent mb-1">
                              {donor.availability ? 'Available' : 'Unavailable'}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {donor.blood_type ? 'Blood donor' : ''}
                              {donor.organ_type ? 'Organ donor' : ''}
                            </div>
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-primary to-primary-hover">
                            Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No donors available at the moment.</p>
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