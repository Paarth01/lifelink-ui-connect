-- Safe upsert in public.users without changing primary keys and ensure trigger exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  -- Upsert by unique email; never change id
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'donor')
  )
  on conflict (email) do update set
    full_name = coalesce(excluded.full_name, public.users.full_name),
    role = coalesce(excluded.role, public.users.role);

  -- Hospital profile
  if coalesce(new.raw_user_meta_data ->> 'role', 'donor') = 'hospital' then
    insert into public.hospitals (hospital_id, hospital_name, location)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
      'Location not set'
    )
    on conflict (hospital_id) do update set
      hospital_name = coalesce(excluded.hospital_name, public.hospitals.hospital_name);
  end if;

  -- Donor profile
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

-- Ensure trigger exists on auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;