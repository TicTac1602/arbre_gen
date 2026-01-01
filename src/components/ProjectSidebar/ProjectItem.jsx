function ProjectItem({ project, isActive, isEditing, editingName, onSelect, onEdit, onDelete, onMenuToggle, onEditChange, onSaveEdit, onCancelEdit, isMenuOpen }) {
  if (isEditing) {
    return (
      <form onSubmit={onSaveEdit} className="p-2 bg-gray-700 rounded">
        <input
          type="text"
          value={editingName}
          onChange={onEditChange}
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
            onClick={onCancelEdit}
            className="flex-1 bg-gray-600 hover:bg-gray-500 rounded px-2 py-1 text-xs transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between ${
        isActive
          ? 'bg-blue-600 hover:bg-blue-500'
          : 'bg-gray-700 hover:bg-gray-600'
      }`}
    >
      <span className="flex-1 truncate">{project.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle();
        }}
        className="text-white hover:text-gray-300 ml-2 px-1"
        title="Actions"
      >
        ⋯
      </button>
      
      {/* Menu contextuel */}
      {isMenuOpen && (
        <div className="absolute right-0 top-10 bg-gray-900 border border-gray-700 rounded shadow-lg z-20 min-w-32">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            ✏️ Éditer
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
          >
            🗑️ Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectItem;
