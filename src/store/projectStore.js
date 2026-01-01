import { create } from 'zustand';
import { projectDB } from '../utils/db';

const LAST_PROJECT_KEY = 'lastSelectedProjectId';

export const useProjectStore = create((set, get) => ({
  // État
  projects: [],
  currentProjectId: null,
  currentProject: null,
  isLoading: false,

  // Charger tous les projets depuis IndexedDB
  loadProjects: async () => {
    set({ isLoading: true });

    try {
      const projects = await projectDB.getAllProjects();
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
      const newProject = await projectDB.createProject(name);
      set((state) => ({
        projects: [...state.projects, newProject],
      }));
      
      // Sélectionner automatiquement le nouveau projet
      get().setCurrentProject(newProject.id);
      
      return newProject;
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      throw error;
    }
  },

  // Définir le projet actif
  setCurrentProject: async (projectId) => {
    try {
      const project = await projectDB.getProject(projectId);
      set({
        currentProjectId: projectId,
        currentProject: project,
      });
      
      // Sauvegarder dans localStorage
      localStorage.setItem(LAST_PROJECT_KEY, projectId.toString());
    } catch (error) {
      console.error('Erreur lors de la sélection du projet:', error);
    }
  },

  // Mettre à jour le projet actuel avec les données React Flow
  updateCurrentProject: async (nodes, edges, viewport) => {
    const { currentProjectId } = get();
    if (!currentProjectId) return;

    try {
      // Sauvegarder dans la base de données sans recharger currentProject
      await projectDB.saveFlowState(currentProjectId, nodes, edges, viewport);
      
      // Mettre à jour seulement la liste des projets pour la sidebar
      const updatedProject = await projectDB.getProject(currentProjectId);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === currentProjectId ? updatedProject : p
        ),
        // Ne pas mettre à jour currentProject pour éviter le re-render
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
    }
  },

  // Supprimer un projet
  deleteProject: async (projectId) => {
    try {
      await projectDB.deleteProject(projectId);
      
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
      await projectDB.updateProject(projectId, { name: newName });
      const updatedProject = await projectDB.getProject(projectId);
      
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
