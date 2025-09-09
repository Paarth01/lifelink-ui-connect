-- Fix the trigger to handle existing users gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  -- Insert into users table with ON CONFLICT handling
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'donor')
  )
  on conflict (email) do update set
    full_name = coalesce(excluded.full_name, public.users.full_name),
    role = coalesce(excluded.role, public.users.role),
    id = excluded.id;

  -- If user is a hospital, create hospital profile
  if coalesce(new.raw_user_meta_data ->> 'role', 'donor') = 'hospital' then
    insert into public.hospitals (hospital_id, hospital_name, location)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
      'Location not set'
    )
    on conflict (hospital_id) do update set
      hospital_name = coalesce(excluded.hospital_name, public.hospitals.hospital_name),
      location = coalesce(excluded.location, public.hospitals.location);
  end if;

  -- If user is a donor, create donor profile
  if coalesce(new.raw_user_meta_data ->> 'role', 'donor') = 'donor' then
    insert into public.donors (donor_id, availability)
    values (
      new.id,
      true
    )
    on conflict (donor_id) do nothing;
  end if;

  return new;
end;
$function$;