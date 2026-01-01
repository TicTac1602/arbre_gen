import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';

function ProjectSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

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
      className={`bg-gray-800 text-white transition-all duration-300 ease-in-out relative h-screen ${
        isCollapsed ? 'w-[65px]' : 'w-[350px]'
      }`}
    >
      {/* Sidebar Content */}
      <div className={`p-4 ${isCollapsed ? 'hidden' : 'block'}`}>
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
          <form onSubmit={handleAddProject} className="mb-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nom du projet"
              className="w-full px-3 py-2 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-500 rounded px-3 py-1 text-sm transition-colors"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewProjectName('');
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-500 rounded px-3 py-1 text-sm transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Liste des projets */}
        <div className="space-y-2">
          {projects.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              Aucun projet. Cliquez sur + pour en créer un.
            </p>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="relative">
                {editingId === project.id ? (
                  <form onSubmit={(e) => handleSaveEdit(e, project.id)} className="p-2 bg-gray-700 rounded">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full px-2 py-1 bg-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-500 rounded px-2 py-1 text-xs transition-colors"
                      >
                        Sauver
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 rounded px-2 py-1 text-xs transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <div
                    onClick={() => setCurrentProject(project.id)}
                    className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between ${
                      currentProjectId === project.id
                        ? 'bg-blue-600 hover:bg-blue-500'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <span className="flex-1 truncate">{project.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === project.id ? null : project.id);
                      }}
                      className="text-white hover:text-gray-300 ml-2 px-1"
                      title="Actions"
                    >
                      ⋯
                    </button>
                    
                    {/* Menu contextuel */}
                    {openMenuId === project.id && (
                      <div className="absolute right-0 top-10 bg-gray-900 border border-gray-700 rounded shadow-lg z-20 min-w-32">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(project);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          ✏️ Éditer
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

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
