import { create } from 'zustand';
import { 
  saveProjectToSupabase, 
  loadProjectsFromSupabase, 
  deleteProjectFromSupabase 
} from '../utils/supabase';

const LAST_PROJECT_KEY = 'lastSelectedProjectId';

export const useProjectStore = create((set, get) => ({
  // État
  projects: [],
  currentProjectId: null,
  currentProject: null,
  isLoading: false,
  userId: null,

  // Définir l'utilisateur connecté
  setUser: (userId) => {
    set({ userId });
  },

  // Charger tous les projets depuis Supabase
  loadProjects: async () => {
    set({ isLoading: true });

    try {
      const { userId } = get();
      
      if (!userId) {
        set({ projects: [], isLoading: false });
        return;
      }

      const projects = await loadProjectsFromSupabase(userId);
      set({ projects, isLoading: false });
      
      // Charger le dernier projet sélectionné depuis localStorage
      const lastProjectId = localStorage.getItem(LAST_PROJECT_KEY);
      if (lastProjectId && projects.length > 0) {
        const id = parseInt(lastProjectId);
        if (!isNaN(id) && projects.some(p => p.id === id)) {
          get().setCurrentProject(id);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      set({ isLoading: false });
    }
  },

  // Créer un nouveau projet
  createProject: async (name) => {
    try {
      const { userId } = get();
      
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      const newProject = {
        name,
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      };
      
      const createdProject = await saveProjectToSupabase(userId, newProject);
      
      // Ajouter le projet créé à la liste
      set((state) => ({
        projects: [createdProject, ...state.projects],
      }));
      
      // Sélectionner le nouveau projet
      if (createdProject) {
        get().setCurrentProject(createdProject.id);
      }
      
      return createdProject;
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      throw error;
    }
  },

  // Définir le projet actif
  setCurrentProject: async (projectId) => {
    try {
      const { projects } = get();
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        set({
          currentProjectId: projectId,
          currentProject: project,
        });
        
        // Sauvegarder dans localStorage
        localStorage.setItem(LAST_PROJECT_KEY, projectId.toString());
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du projet:', error);
    }
  },

  // Mettre à jour le projet actuel avec les données React Flow
  updateCurrentProject: async (nodes, edges, viewport) => {
    const { currentProjectId, currentProject, userId } = get();
    if (!currentProjectId || !userId || !currentProject) return;

    try {
      const updatedProject = {
        ...currentProject,
        id: currentProjectId, // S'assurer que l'ID est présent
        nodes,
        edges,
        viewport,
        updated_at: new Date().toISOString(),
      };
      
      await saveProjectToSupabase(userId, updatedProject);
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === currentProjectId ? updatedProject : p
        ),
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
    }
  },

  // Supprimer un projet
  deleteProject: async (projectId) => {
    try {
      await deleteProjectFromSupabase(projectId);
      
      set((state) => {
        const newProjects = state.projects.filter((p) => p.id !== projectId);
        const newState = {
          projects: newProjects,
        };

        // Si le projet supprimé était le projet actif, vider la sélection
        if (state.currentProjectId === projectId) {
          newState.currentProjectId = null;
          newState.currentProject = null;
          localStorage.removeItem(LAST_PROJECT_KEY);
        }

        return newState;
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
    }
  },

  // Renommer un projet
  renameProject: async (projectId, newName) => {
    try {
      const { userId, projects, currentProject } = get();
      
      if (!userId) return;
      
      const project = projects.find(p => p.id === projectId);
      if (!project) return;
      
      const updatedProject = {
        ...project,
        name: newName,
        updated_at: new Date().toISOString(),
      };
      
      await saveProjectToSupabase(userId, updatedProject);
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? updatedProject : p
        ),
        currentProject:
          state.currentProjectId === projectId ? updatedProject : state.currentProject,
      }));
    } catch (error) {
      console.error('Erreur lors du renommage du projet:', error);
    }
  },
}));
