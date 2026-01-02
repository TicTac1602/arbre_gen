import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useAuth } from '../contexts/AuthContext';
import ProjectForm from './ProjectSidebar/ProjectForm';
import ProjectItem from './ProjectSidebar/ProjectItem';

function ProjectSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const { user, logout } = useAuth();
  const {
    projects,
    currentProjectId,
    loadProjects,
    createProject,
    setCurrentProject,
    deleteProject,
    renameProject,
  } = useProjectStore();

  // Charger les projets au montage du composant
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      await createProject(newProjectName.trim());
      setNewProjectName('');
      setShowAddForm(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      await deleteProject(projectId);
      setOpenMenuId(null);
    }
  };

  const handleStartEdit = (project) => {
    setEditingId(project.id);
    setEditingName(project.name);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (e, projectId) => {
    e.preventDefault();
    if (editingName.trim() && editingName !== projects.find(p => p.id === projectId)?.name) {
      await renameProject(projectId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 ease-in-out relative h-screen flex flex-col ${
        isCollapsed ? 'w-[65px]' : 'w-[250px] lg:w-[350px]'
      }`}
    >
      {/* Sidebar Content */}
      <div className={`p-4 flex-1 overflow-y-auto ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Projets</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded transition-colors"
              title="Ajouter un projet"
            >
              +
            </button>
            <button
              onClick={() => {
                setIsCollapsed(!isCollapsed);
                if (!isCollapsed) {
                  setShowAddForm(false);
                  setNewProjectName('');
                  setOpenMenuId(null);
                  setEditingId(null);
                  setEditingName('');
                }
              }}
              className="w-9 h-9 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              title="Réduire"
            >
              ←
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout de projet */}
        {showAddForm && (
          <ProjectForm
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onSubmit={handleAddProject}
            onCancel={() => {
              setShowAddForm(false);
              setNewProjectName('');
            }}
            placeholder="Nom du projet"
            submitLabel="Créer"
          />
        )}

        {/* Liste des projets */}
        <div className="space-y-2">
          {projects.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              Aucun projet. Cliquez sur + pour en créer un.
            </p>
          ) : (
            projects.filter(p => p && p.id).map((project) => (
              <div key={project.id} className="relative">
                <ProjectItem
                  project={project}
                  isActive={currentProjectId === project.id}
                  isEditing={editingId === project.id}
                  editingName={editingName}
                  isMenuOpen={openMenuId === project.id}
                  onSelect={() => setCurrentProject(project.id)}
                  onEdit={() => handleStartEdit(project)}
                  onDelete={() => handleDeleteProject(project.id)}
                  onMenuToggle={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                  onEditChange={(e) => setEditingName(e.target.value)}
                  onSaveEdit={(e) => handleSaveEdit(e, project.id)}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Info & Logout - Expanded */}
      {!isCollapsed && (
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="ml-2 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
              title="Se déconnecter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* Collapsed State Icons */}
      {isCollapsed && (
        <div className="flex flex-col items-center pt-4 space-y-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-9 h-9 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            title="Étendre"
          >
            →
          </button>
          <button
            onClick={() => {
              setIsCollapsed(false);
              setShowAddForm(true);
            }}
            className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded transition-colors"
            title="Nouveau projet"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectSidebar;
