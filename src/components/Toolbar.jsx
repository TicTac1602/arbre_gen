function Toolbar({ onAddPerson, exportButtonsSlot }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-12 bg-white border-b border-gray-300 px-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onAddPerson}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
            />
          </svg>
          <span>Ajouter une personne</span>
        </button>

        <div className="h-6 w-px bg-gray-300"></div>

        {exportButtonsSlot}

        <div className="h-6 w-px bg-gray-300"></div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">Astuce :</span> Créez des liens en connectant les nœuds
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
