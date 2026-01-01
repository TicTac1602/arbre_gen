import { useState, useEffect } from 'react';

// Fonction pour formater une date ISO en format français
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('fr-FR');
  } catch {
    return dateString;
  }
};

function NodeDetailsPanel({ selectedNode, onUpdate, onDelete, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
    age: '',
    gender: '',
    profession: '',
	pleineProprietePart: '',
    usufruitPart: '',
    nueProprietPart: '',
    notConcerned: false,
    notes: '',
  });

  // Charger les données de la node sélectionnée
  useEffect(() => {
    if (selectedNode?.data) {
      setFormData({
        firstName: selectedNode.data.firstName || '',
        lastName: selectedNode.data.lastName || '',
        birthDate: selectedNode.data.birthDate || '',
        deathDate: selectedNode.data.deathDate || '',
        age: selectedNode.data.age || '',
        gender: selectedNode.data.gender || '',
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
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 ${
                selectedNode.data.gender === 'male' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                selectedNode.data.gender === 'female' ? 'bg-gradient-to-br from-pink-400 to-pink-600' :
                'bg-gradient-to-br from-purple-400 to-purple-600'
              }`}>
                {selectedNode.data.label ? selectedNode.data.label.charAt(0).toUpperCase() : '?'}
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {selectedNode.data.label || 'Sans nom'}
              </h3>
            </div>

            {/* Informations */}
            <div className="space-y-3">
              {formData.gender && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Genre</label>
                  <p className="text-sm text-gray-800 mt-1">
                    {formData.gender === 'male' ? 'Homme' : formData.gender === 'female' ? 'Femme' : 'Autre'}
                  </p>
                </div>
              )}

              {formData.age && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Âge</label>
                  <p className="text-sm text-gray-800 mt-1">{formData.age} ans</p>
                </div>
              )}

              {formData.birthDate && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Date de naissance</label>
                  <p className="text-sm text-gray-800 mt-1">{formatDate(formData.birthDate)}</p>
                </div>
              )}

              {formData.deathDate && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Date de décès</label>
                  <p className="text-sm text-gray-800 mt-1">{formatDate(formData.deathDate)}</p>
                </div>
              )}

              {formData.profession && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Profession</label>
                  <p className="text-sm text-gray-800 mt-1">{formData.profession}</p>
                </div>
              )}

              {formData.notConcerned && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Statut</label>
                  <p className="text-sm text-orange-600 mt-1 font-semibold">⚠️ Non concerné</p>
                </div>
              )}

			  {!formData.notConcerned && formData.pleineProprietePart && (
				<div>
				  <label className="text-xs font-medium text-gray-500 uppercase">Pleine Propriété (PP)</label>
				  <p className="text-sm text-gray-800 mt-1">{formData.pleineProprietePart}</p>
				</div>
			  )}

              {!formData.notConcerned && (formData.usufruitPart) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Usufruit (U)</label>
                  <p className="text-sm text-gray-800 mt-1">{formData.usufruitPart}</p>
                </div>
              )}

              {!formData.notConcerned && (formData.nueProprietPart) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Nue Propriété (NP)</label>
                  <p className="text-sm text-gray-800 mt-1">{formData.nueProprietPart}</p>
                </div>
              )}

              {formData.notes && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Notes</label>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{formData.notes}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Mode édition
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Genre</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Non spécifié</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Âge</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date de décès</label>
              <input
                type="date"
                name="deathDate"
                value={formData.deathDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Profession</label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Checkbox Non concerné */}
            <div className="flex items-center py-2">
              <input
                type="checkbox"
                id="notConcerned"
                name="notConcerned"
                checked={formData.notConcerned}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="notConcerned" className="ml-2 text-xs font-medium text-gray-700">
                Non concerné (masque les quotités)
              </label>
            </div>

			<div>
			  <label className="block text-xs font-medium text-gray-700 mb-1">Pleine Propriété (PP)</label>
			  <div className="grid grid-cols-2 gap-2">
				<input
				  name="pleineProprietePart"
				  value={formData.pleineProprietePart}
				  onChange={handleChange}
				  disabled={formData.notConcerned}
				  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
				  placeholder="Part"
				  min="0"
				/>
			  </div>
			</div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Usufruit (U)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="usufruitPart"
                  value={formData.usufruitPart}
                  onChange={handleChange}
                  disabled={formData.notConcerned}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Part"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nue Propriété (NP)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="nueProprietPart"
                  value={formData.nueProprietPart}
                  onChange={handleChange}
                  disabled={formData.notConcerned}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Part"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
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
