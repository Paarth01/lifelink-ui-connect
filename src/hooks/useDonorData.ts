import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DonorProfile {
  id: string;
  full_name: string;
  email: string;
  blood_type: string | null;
  location: string | null;
  availability: boolean;
  organ_type: string | null;
}

export interface DonationRequest {
  request_id: string;
  required_blood_type: string | null;
  required_organ_type: string | null;
  status: string;
  created_at: string;
  hospital_id: string;
  hospital_name?: string;
  hospital_location?: string;
}

export interface DonationHistory {
  donation_id: string;
  fulfilled_at: string;
  hospital_name?: string;
  request_id: string;
}

export const useDonorData = () => {
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [urgentRequests, setUrgentRequests] = useState<DonationRequest[]>([]);
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonorData();
  }, []);

  const fetchDonorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch donor profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: donorData } = await supabase
        .from('donors')
        .select('*')
        .eq('donor_id', user.id)
        .maybeSingle();

      if (userData) {
        setDonorProfile({
          id: userData.id,
          full_name: userData.full_name,
          email: userData.email,
          blood_type: donorData?.blood_type || null,
          location: donorData?.location || null,
          availability: donorData?.availability || true,
          organ_type: donorData?.organ_type || null,
        });
      }

      // Fetch urgent requests (pending requests) - filter by donor compatibility
      let requestsQuery = supabase
        .from('requests')
        .select(`
          *,
          hospitals(hospital_name, location)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      const { data: requests } = await requestsQuery.limit(10);

      if (requests && donorData) {
        // Filter requests that match donor's blood type or organ type
        const compatibleRequests = requests.filter(req => {
          const bloodMatch = !req.required_blood_type || req.required_blood_type === donorData.blood_type;
          const organMatch = !req.required_organ_type || req.required_organ_type === donorData.organ_type;
          return bloodMatch || organMatch;
        });

        setUrgentRequests(compatibleRequests.map(req => ({
          ...req,
          hospital_name: req.hospitals?.hospital_name,
          hospital_location: req.hospitals?.location
        })));
      }

      // Fetch donation history
      const { data: donations } = await supabase
        .from('donations')
        .select(`
          *,
          hospitals(hospital_name)
        `)
        .eq('donor_id', user.id)
        .order('fulfilled_at', { ascending: false })
        .limit(10);

      if (donations) {
        setDonationHistory(donations.map(donation => ({
          ...donation,
          hospital_name: donation.hospitals?.hospital_name
        })));
      }

    } catch (error) {
      console.error('Error fetching donor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (availability: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('donors')
        .upsert({
          donor_id: user.id,
          availability: availability
        });

      if (!error && donorProfile) {
        setDonorProfile({
          ...donorProfile,
          availability
        });
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const respondToRequest = async (requestId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'User not authenticated' };

      const request = urgentRequests.find(r => r.request_id === requestId);
      if (!request) return { success: false, error: 'Request not found' };

      // Create donation record
      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          donor_id: user.id,
          request_id: requestId,
          hospital_id: request.hospital_id
        });

      if (donationError) {
        console.error('Error creating donation:', donationError);
        return { success: false, error: 'Failed to respond to request' };
      }

      // Update request status to fulfilled
      const { error: updateError } = await supabase
        .from('requests')
        .update({ status: 'fulfilled' })
        .eq('request_id', requestId);

      if (updateError) {
        console.error('Error updating request status:', updateError);
      }

      // Refresh data
      await fetchDonorData();
      return { success: true };
    } catch (error) {
      console.error('Error responding to request:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  return {
    donorProfile,
    urgentRequests,
    donationHistory,
    loading,
    updateAvailability,
    respondToRequest,
    refetch: fetchDonorData
  };
};