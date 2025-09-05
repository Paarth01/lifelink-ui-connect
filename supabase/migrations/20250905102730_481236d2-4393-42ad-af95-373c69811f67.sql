-- Enable Row Level Security on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Enable RLS on other tables if not already enabled
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policies for donors table
CREATE POLICY "Donors can view their own profile" 
ON public.donors 
FOR SELECT 
USING (auth.uid() = donor_id);

CREATE POLICY "Donors can insert their own profile" 
ON public.donors 
FOR INSERT 
WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update their own profile" 
ON public.donors 
FOR UPDATE 
USING (auth.uid() = donor_id);

-- Create policies for hospitals table
CREATE POLICY "Hospitals can view their own profile" 
ON public.hospitals 
FOR SELECT 
USING (auth.uid() = hospital_id);

CREATE POLICY "Hospitals can insert their own profile" 
ON public.hospitals 
FOR INSERT 
WITH CHECK (auth.uid() = hospital_id);

CREATE POLICY "Hospitals can update their own profile" 
ON public.hospitals 
FOR UPDATE 
USING (auth.uid() = hospital_id);

-- Allow hospitals to view all donors (for matching)
CREATE POLICY "Hospitals can view all donors" 
ON public.donors 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'hospital'
  )
);

-- Allow donors to view all requests (to respond)
CREATE POLICY "Donors can view all requests" 
ON public.requests 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'donor'
  )
);

-- Create policies for requests table
CREATE POLICY "Hospitals can manage their own requests" 
ON public.requests 
FOR ALL 
USING (auth.uid() = hospital_id)
WITH CHECK (auth.uid() = hospital_id);

-- Create policies for donations table
CREATE POLICY "Users can view donations they're involved in" 
ON public.donations 
FOR SELECT 
USING (
  auth.uid() = donor_id OR 
  auth.uid() = hospital_id OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'ngo')
  )
);

CREATE POLICY "Donors can create donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Hospitals can update donations" 
ON public.donations 
FOR UPDATE 
USING (auth.uid() = hospital_id);