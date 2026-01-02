import { useState, useEffect } from 'react';
import PersonAvatar from './NodeDetailsPanel/PersonAvatar';
import PersonInfoDisplay from './NodeDetailsPanel/PersonInfoDisplay';
import PersonEditForm from './NodeDetailsPanel/PersonEditForm';

function NodeDetailsPanel({ selectedNode, onUpdate, onDelete, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: selectedNode?.data.firstName || '',
    lastName: selectedNode?.data.lastName || '',
    birthDate: selectedNode?.data.birthDate || '',
    deathDate: selectedNode?.data.deathDate || '',
    age: selectedNode?.data.age || '',
    profession: selectedNode?.data.profession || '',
    pleineProprietePart: selectedNode?.data.pleineProprietePart || '',
    usufruitPart: selectedNode?.data.usufruitPart || '',
    nueProprietPart: selectedNode?.data.nueProprietPart || '',
    notConcerned: selectedNode?.data.notConcerned || false,
    notes: selectedNode?.data.notes || '',
  });

  // Charger les données de la node sélectionnée
  useEffect(() => {
    if (selectedNode?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        firstName: selectedNode.data.firstName || '',
        lastName: selectedNode.data.lastName || '',
        birthDate: selectedNode.data.birthDate || '',
        deathDate: selectedNode.data.deathDate || '',
        age: selectedNode.data.age || '',
        profession: selectedNode.data.profession || '',
        pleineProprietePart: selectedNode.data.pleineProprietePart || '',
        usufruitPart: selectedNode.data.usufruitPart || '',
        nueProprietPart: selectedNode.data.nueProprietPart || '',
        notConcerned: selectedNode.data.notConcerned || false,
        notes: selectedNode.data.notes || '',
      });
      setIsEditing(false);
    }
  }, [selectedNode]); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    onUpdate(selectedNode.id, {
      ...formData,
      label: fullName,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedNode.data.label || 'cette personne'} ?`)) {
      onDelete(selectedNode.id);
    }
  };

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="w-80 bg-white border-l border-gray-300 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Détails</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!isEditing ? (
          // Mode lecture
          <div className="space-y-4">
            {/* Avatar et nom */}
            <div className="text-center pb-4 border-b border-gray-200">
              <PersonAvatar name={selectedNode.data.label} />
              <h3 className="text-xl font-bold text-gray-800">
                {selectedNode.data.label || 'Sans nom'}
              </h3>
            </div>

            {/* Informations */}
            <PersonInfoDisplay formData={formData} />
          </div>
        ) : (
          // Mode édition
          <PersonEditForm formData={formData} onChange={handleChange} />
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors text-sm"
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors text-sm"
            >
              Supprimer
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors text-sm"
            >
              Enregistrer
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="w-full py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md font-medium transition-colors text-sm"
            >
              Annuler
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default NodeDetailsPanel;
