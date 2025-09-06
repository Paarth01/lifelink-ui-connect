-- Create trigger to auto-provision public.users row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'donor')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();