alter table public.cms_admins
  add column if not exists role text not null default 'editor',
  add column if not exists is_active boolean not null default true;

alter table public.cms_admins
  drop constraint if exists cms_admins_role_check;
alter table public.cms_admins
  add constraint cms_admins_role_check check (role in ('owner', 'editor'));

-- Existing installations keep one active owner. On a fresh installation, insert
-- the first Auth user's UUID with role = 'owner' as documented in README.
update public.cms_admins
set role = 'owner', is_active = true
where user_id = (
  select user_id from public.cms_admins
  order by created_at, user_id limit 1
)
and not exists (
  select 1 from public.cms_admins where role = 'owner' and is_active
);

create or replace function private.is_cms_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.cms_admins
    where user_id = check_user_id and is_active
  );
$$;

revoke all on function private.is_cms_admin(uuid) from public;
grant execute on function private.is_cms_admin(uuid) to authenticated;

create or replace function private.protect_last_cms_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.role = 'owner' and old.is_active then
      perform pg_catalog.pg_advisory_xact_lock(20260922);
      if (select count(*) from public.cms_admins where role = 'owner' and is_active) <= 1 then
        raise exception 'Keep at least one active CMS owner';
      end if;
    end if;
    return old;
  end if;

  if old.role = 'owner' and old.is_active and (new.role <> 'owner' or not new.is_active) then
    perform pg_catalog.pg_advisory_xact_lock(20260922);
    if (select count(*) from public.cms_admins where role = 'owner' and is_active) <= 1 then
      raise exception 'Keep at least one active CMS owner';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists cms_admins_protect_last_owner on public.cms_admins;
create trigger cms_admins_protect_last_owner
before update or delete on public.cms_admins
for each row execute function private.protect_last_cms_owner();
