-- handle_new_user is only meant to run as the auth.users trigger; don't expose
-- it as an RPC endpoint (/rest/v1/rpc/handle_new_user). Triggers still fire.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
