import { createClient } from './client';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'starter' | 'pro' | 'business';
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  is_super_admin: boolean | null;
  created_at: string;
  updated_at: string;
}

export async function createProfile(uid: string, fullName: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('profiles').upsert(
    { id: uid, full_name: fullName },
    { onConflict: 'id', ignoreDuplicates: true }
  );
  if (error) console.error('createProfile:', error.message);
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error){
    console.error('getProfile:', error.message);
  };
  return data as Profile;
}

export async function updateProfile(fields: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('profiles').update(fields).eq('id', user.id);
  if (error) console.error('updateProfile:', error.message);
}

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getAllProfiles:', error.message); return []; }
  return (data ?? []) as Profile[];
}

export async function updatePlan(plan: Profile['plan']): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('profiles').update({ plan }).eq('id', user.id);
  if (error) console.error('updatePlan:', error.message);
}
