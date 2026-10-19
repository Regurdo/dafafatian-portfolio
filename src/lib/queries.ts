import { supabase, isSupabaseConfigured, Profile, Project, Skill, Experience, Message } from './supabase';
import { fallbackProfile, fallbackProjects, fallbackSkills, fallbackExperiences } from './data';

// ========================================================
// CONNECTION CHECK
// ========================================================
export async function checkSupabaseConnection(): Promise<{
  isConfigured: boolean;
  isConnected: boolean;
  latencyMs?: number;
  message: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      isConfigured: false,
      isConnected: false,
      message: 'Supabase URL atau Anon Key belum dikonfigurasi di .env.local',
    };
  }

  const start = Date.now();
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    const latencyMs = Date.now() - start;

    if (error) {
      return {
        isConfigured: true,
        isConnected: false,
        latencyMs,
        message: `Terhubung ke URL Supabase, namun query gagal: ${error.message}. Pastikan schema SQL telah dijalankan.`,
      };
    }

    return {
      isConfigured: true,
      isConnected: true,
      latencyMs,
      message: `Berhasil terhubung ke Supabase (${latencyMs}ms)`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      isConfigured: true,
      isConnected: false,
      message: `Gagal menghubungi server Supabase: ${msg}`,
    };
  }
}

// ========================================================
// PROFILES
// ========================================================
export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured() || !supabase) return fallbackProfile;
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
    if (error || !data) return fallbackProfile;
    return data as Profile;
  } catch {
    return fallbackProfile;
  }
}

export async function updateProfile(profileData: Partial<Profile>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    // Cari id profile yang ada
    const { data: existing } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
    if (existing?.id) {
      const { error } = await supabase.from('profiles').update(profileData).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('profiles').insert([{ ...fallbackProfile, ...profileData }]);
      if (error) throw error;
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil';
    return { success: false, error: msg };
  }
}

// ========================================================
// PROJECTS
// ========================================================
export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured() || !supabase) return fallbackProjects;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });
    if (error || !data || data.length === 0) return fallbackProjects;
    return data as Project[];
  } catch {
    return fallbackProjects;
  }
}

export async function createProject(
  project: Omit<Project, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: Project; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { data, error } = await supabase.from('projects').insert([project]).select().single();
    if (error) throw error;
    return { success: true, data: data as Project };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menambahkan proyek';
    return { success: false, error: msg };
  }
}

export async function updateProject(
  id: string,
  project: Partial<Project>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { error } = await supabase.from('projects').update(project).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui proyek';
    return { success: false, error: msg };
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus proyek';
    return { success: false, error: msg };
  }
}

// ========================================================
// SKILLS
// ========================================================
export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured() || !supabase) return fallbackSkills;
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });
    if (error || !data || data.length === 0) return fallbackSkills;
    return data as Skill[];
  } catch {
    return fallbackSkills;
  }
}

export async function createSkill(
  skill: Omit<Skill, 'id'>
): Promise<{ success: boolean; data?: Skill; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { data, error } = await supabase.from('skills').insert([skill]).select().single();
    if (error) throw error;
    return { success: true, data: data as Skill };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menambahkan skill';
    return { success: false, error: msg };
  }
}

export async function updateSkill(
  id: string,
  skill: Partial<Skill>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { error } = await supabase.from('skills').update(skill).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui skill';
    return { success: false, error: msg };
  }
}

export async function deleteSkill(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus skill';
    return { success: false, error: msg };
  }
}

// ========================================================
// EXPERIENCES
// ========================================================
export async function getExperiences(): Promise<Experience[]> {
  if (!isSupabaseConfigured() || !supabase) return fallbackExperiences;
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true });
    if (error || !data || data.length === 0) return fallbackExperiences;
    return data as Experience[];
  } catch {
    return fallbackExperiences;
  }
}

export async function createExperience(
  exp: Omit<Experience, 'id'>
): Promise<{ success: boolean; data?: Experience; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { data, error } = await supabase.from('experiences').insert([exp]).select().single();
    if (error) throw error;
    return { success: true, data: data as Experience };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menambahkan pengalaman';
    return { success: false, error: msg };
  }
}

export async function updateExperience(
  id: string,
  exp: Partial<Experience>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { error } = await supabase.from('experiences').update(exp).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui pengalaman';
    return { success: false, error: msg };
  }
}

export async function deleteExperience(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus pengalaman';
    return { success: false, error: msg };
  }
}

// ========================================================
// MESSAGES (CONTACT INBOX)
// ========================================================
export async function getMessages(): Promise<Message[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as Message[];
  } catch {
    return [];
  }
}

export async function sendMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    console.log('Message received (Supabase not configured):', data);
    return true;
  }
  try {
    const { error } = await supabase.from('messages').insert([{ ...data, is_read: false }]);
    return !error;
  } catch {
    return false;
  }
}

export async function markMessageRead(
  id: string,
  is_read: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { error } = await supabase.from('messages').update({ is_read }).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui status pesan';
    return { success: false, error: msg };
  }
}

export async function deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi.' };
  }
  try {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus pesan';
    return { success: false, error: msg };
  }
}

// ========================================================
// SEED INITIAL DATA (1-CLICK SYNC)
// ========================================================
export async function seedInitialDataToSupabase(): Promise<{
  success: boolean;
  inserted: {
    profile: boolean;
    projects: number;
    skills: number;
    experiences: number;
  };
  error?: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      inserted: { profile: false, projects: 0, skills: 0, experiences: 0 },
      error: 'Supabase URL & Anon Key belum terpasang di .env.local.',
    };
  }

  const result = {
    profile: false,
    projects: 0,
    skills: 0,
    experiences: 0,
  };

  try {
    // 1. Profile
    const { data: existingProfile } = await supabase.from('profiles').select('id').limit(1);
    if (!existingProfile || existingProfile.length === 0) {
      const { error: profErr } = await supabase.from('profiles').insert([fallbackProfile]);
      if (!profErr) result.profile = true;
    }

    // 2. Projects
    const { data: existingProjects } = await supabase.from('projects').select('id').limit(1);
    if (!existingProjects || existingProjects.length === 0) {
      const projectsToInsert = fallbackProjects.map(({ id: _, created_at: __, ...rest }) => rest);
      const { data: inserted, error: projErr } = await supabase.from('projects').insert(projectsToInsert).select();
      if (!projErr && inserted) result.projects = inserted.length;
    }

    // 3. Skills
    const { data: existingSkills } = await supabase.from('skills').select('id').limit(1);
    if (!existingSkills || existingSkills.length === 0) {
      const skillsToInsert = fallbackSkills.map(({ id: _, ...rest }) => rest);
      const { data: inserted, error: skillErr } = await supabase.from('skills').insert(skillsToInsert).select();
      if (!skillErr && inserted) result.skills = inserted.length;
    }

    // 4. Experiences
    const { data: existingExp } = await supabase.from('experiences').select('id').limit(1);
    if (!existingExp || existingExp.length === 0) {
      const expToInsert = fallbackExperiences.map(({ id: _, ...rest }) => rest);
      const { data: inserted, error: expErr } = await supabase.from('experiences').insert(expToInsert).select();
      if (!expErr && inserted) result.experiences = inserted.length;
    }

    return { success: true, inserted: result };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal melakukan seed data';
    return { success: false, inserted: result, error: msg };
  }
}
