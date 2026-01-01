import Dexie from 'dexie';

// Initialisation de la base de données IndexedDB
export const db = new Dexie('ArbreGenDB');

// Définition du schéma de la base de données
db.version(1).stores({
  projects: '++id, name, createdAt, updatedAt',
});

// Classe pour représenter un projet
export class Project {
  constructor(name) {
    this.name = name;
    this.nodes = [];
    this.edges = [];
    this.viewport = { x: 0, y: 0, zoom: 1 };
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

// Fonctions utilitaires pour gérer les projets
export const projectDB = {
  // Créer un nouveau projet
  async createProject(name) {
    const project = new Project(name);
    const id = await db.projects.add(project);
    return { id, ...project };
  },

  // Récupérer tous les projets
  async getAllProjects() {
    return await db.projects.toArray();
  },

  // Récupérer un projet par son ID
  async getProject(id) {
    return await db.projects.get(id);
  },

  // Mettre à jour un projet
  async updateProject(id, updates) {
    updates.updatedAt = new Date().toISOString();
    await db.projects.update(id, updates);
    return await db.projects.get(id);
  },

  // Supprimer un projet
  async deleteProject(id) {
    await db.projects.delete(id);
  },

  // Sauvegarder l'état React Flow
  async saveFlowState(id, nodes, edges, viewport = null) {
    const updates = {
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };
    if (viewport) {
      updates.viewport = viewport;
    }
    await db.projects.update(id, updates);
  },
};
