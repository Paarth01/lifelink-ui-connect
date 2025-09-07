import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HospitalProfile {
  id: string;
  hospital_name: string;
  location: string;
  email: string;
}

export interface ActiveRequest {
  request_id: string;
  required_blood_type: string | null;
  required_organ_type: string | null;
  status: string;
  created_at: string;
}

export interface AvailableDonor {
  donor_id: string;
  full_name: string;
  blood_type: string | null;
  location: string | null;
  availability: boolean;
  organ_type: string | null;
}

export const useHospitalData = () => {
  const [hospitalProfile, setHospitalProfile] = useState<HospitalProfile | null>(null);
  const [activeRequests, setActiveRequests] = useState<ActiveRequest[]>([]);
  const [availableDonors, setAvailableDonors] = useState<AvailableDonor[]>([]);
  const [stats, setStats] = useState({
    activeRequestsCount: 0,
    completedToday: 0,
    totalDonors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const fetchHospitalData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch hospital profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: hospitalData } = await supabase
        .from('hospitals')
        .select('*')
        .eq('hospital_id', user.id)
        .maybeSingle();

      if (userData && hospitalData) {
        setHospitalProfile({
          id: userData.id,
          hospital_name: hospitalData.hospital_name,
          location: hospitalData.location,
          email: userData.email,
        });
      }

      // Fetch active requests for this hospital
      const { data: requests } = await supabase
        .from('requests')
        .select('*')
        .eq('hospital_id', user.id)
        .order('created_at', { ascending: false });

      if (requests) {
        setActiveRequests(requests);
        
        // Calculate stats
        const activeCount = requests.filter(r => r.status === 'pending').length;
        const completedToday = requests.filter(r => {
          const today = new Date().toISOString().split('T')[0];
          return r.status === 'fulfilled' && r.created_at?.startsWith(today);
        }).length;

        setStats(prev => ({
          ...prev,
          activeRequestsCount: activeCount,
          completedToday: completedToday
        }));
      }

      // Fetch available donors
      const { data: donors } = await supabase
        .from('donors')
        .select(`
          *,
          users(full_name, email)
        `)
        .eq('availability', true)
        .limit(10);

      if (donors) {
        setAvailableDonors(donors.map(donor => ({
          donor_id: donor.donor_id,
          full_name: donor.users?.full_name || 'Anonymous',
          blood_type: donor.blood_type,
          location: donor.location,
          availability: donor.availability,
          organ_type: donor.organ_type
        })));
        
        setStats(prev => ({
          ...prev,
          totalDonors: donors.length
        }));
      }

    } catch (error) {
      console.error('Error fetching hospital data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: {
    required_blood_type?: string;
    required_organ_type?: string;
    urgency?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('requests')
        .insert({
          hospital_id: user.id,
          required_blood_type: requestData.required_blood_type || null,
          required_organ_type: requestData.required_organ_type || null,
          status: 'pending'
        });

      if (!error) {
        fetchHospitalData(); // Refresh data
      }
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  return {
    hospitalProfile,
    activeRequests,
    availableDonors,
    stats,
    loading,
    createRequest,
    refetch: fetchHospitalData
  };
};