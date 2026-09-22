import { createClient } from "@supabase/supabase-js";
import { isSafeSupabaseBrowserKey } from "@/lib/cms/browser-key";

export async function verifyCmsAdmin(token: string | undefined) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !isSafeSupabaseBrowserKey(key) || !token) return null;

  const supabase = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error } = await supabase.auth.getUser(token);
  if (error || !userData.user) return null;

  const { data: admin } = await supabase
    .from("cms_admins")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  return admin && admin.is_active !== false ? userData.user : null;
}
