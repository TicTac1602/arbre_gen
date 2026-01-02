import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const saveProjectToSupabase = async (userId, project) => {
  const projectData = {
    user_id: userId,
    name: project.name,
    nodes: project.nodes || [],
    edges: project.edges || [],
    viewport: project.viewport || { x: 0, y: 0, zoom: 1 },
  };

  // Si le projet a un ID, on fait un update, sinon un insert
  if (project.id) {
    projectData.id = project.id;
    projectData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('projects')
      .upsert(projectData, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    // Nouveau projet : ne pas inclure l'ID, laisser Supabase le générer
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    if (error) {
      console.error('Erreur insertion Supabase:', error);
      throw error;
    }
    return data;
  }
};

export const loadProjectsFromSupabase = async (userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteProjectFromSupabase = async (projectId) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
