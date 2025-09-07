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
  hospital_name?: string;
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

      // Fetch urgent requests (pending requests)
      const { data: requests } = await supabase
        .from('requests')
        .select(`
          *,
          hospitals(hospital_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      if (requests) {
        setUrgentRequests(requests.map(req => ({
          ...req,
          hospital_name: req.hospitals?.hospital_name
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

  return {
    donorProfile,
    urgentRequests,
    donationHistory,
    loading,
    updateAvailability,
    refetch: fetchDonorData
  };
};