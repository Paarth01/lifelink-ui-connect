-- Insert sample donor profiles for existing users
INSERT INTO donors (donor_id, blood_type, location, availability, organ_type) VALUES
  ('057fb5c9-4a26-4014-9c62-fdc09296ae5f', 'O+', 'New Delhi, India', true, 'Kidney'),
  ('5df6535f-5a82-4ac0-9b67-cfdcfbc85a57', 'A+', 'Mumbai, India', true, 'Heart');

-- Insert sample hospital users
INSERT INTO users (id, email, full_name, role) VALUES
  ('f1e2d3c4-b5a6-9788-1234-567890abcdef', 'contact@aiims.edu', 'AIIMS New Delhi', 'hospital'),
  ('a9b8c7d6-e5f4-3210-9876-fedcba098765', 'info@kgmu.ac.in', 'KGMU Lucknow', 'hospital'),
  ('1a2b3c4d-5e6f-7890-abcd-ef1234567890', 'admin@pgimer.edu.in', 'PGIMER Chandigarh', 'hospital');

-- Insert hospital profiles
INSERT INTO hospitals (hospital_id, hospital_name, location) VALUES
  ('f1e2d3c4-b5a6-9788-1234-567890abcdef', 'AIIMS New Delhi', 'New Delhi, India'),
  ('a9b8c7d6-e5f4-3210-9876-fedcba098765', 'KGMU Lucknow', 'Lucknow, India'),
  ('1a2b3c4d-5e6f-7890-abcd-ef1234567890', 'PGIMER Chandigarh', 'Chandigarh, India');

-- Insert sample donation requests (using valid status values: pending, matched, fulfilled)
INSERT INTO requests (hospital_id, required_blood_type, required_organ_type, status) VALUES
  ('f1e2d3c4-b5a6-9788-1234-567890abcdef', 'O+', null, 'pending'),
  ('f1e2d3c4-b5a6-9788-1234-567890abcdef', null, 'Kidney', 'pending'),
  ('a9b8c7d6-e5f4-3210-9876-fedcba098765', 'A+', null, 'pending'),
  ('a9b8c7d6-e5f4-3210-9876-fedcba098765', null, 'Heart', 'pending'),
  ('1a2b3c4d-5e6f-7890-abcd-ef1234567890', 'B+', null, 'matched'),
  ('1a2b3c4d-5e6f-7890-abcd-ef1234567890', null, 'Liver', 'pending');

-- Insert some sample donation records
INSERT INTO donations (donor_id, request_id, hospital_id) VALUES
  ('057fb5c9-4a26-4014-9c62-fdc09296ae5f', 
   (SELECT request_id FROM requests WHERE hospital_id = 'f1e2d3c4-b5a6-9788-1234-567890abcdef' AND required_blood_type = 'O+' LIMIT 1),
   'f1e2d3c4-b5a6-9788-1234-567890abcdef');