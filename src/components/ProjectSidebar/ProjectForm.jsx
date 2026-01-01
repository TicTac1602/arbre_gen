function ProjectForm({ onSubmit, onCancel, value, onChange, placeholder, submitLabel }) {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-500 rounded px-3 py-1 text-sm transition-colors"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-500 rounded px-3 py-1 text-sm transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;
