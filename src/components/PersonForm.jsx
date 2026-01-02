import { useState } from 'react';

function PersonForm({ isOpen, onClose, onSubmit }) {
  const initialFormData = {
    firstName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
    profession: '',
    pleineProprietePart: '',
    usufruitPart: '',
    nueProprietPart: '',
    notConcerned: false,
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Ajouter une personne
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Section: Informations générales */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Informations générales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prénom */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jean"
                />
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dupont"
                />
              </div>

              {/* Date de naissance */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date de décès */}
              <div>
                <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de décès
                </label>
                <input
                  type="date"
                  id="deathDate"
                  name="deathDate"
                  value={formData.deathDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Profession */}
              <div className="md:col-span-2">
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                  Profession
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Médecin"
                />
              </div>
            </div>
          </div>

          {/* Section: Quotités */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Quotités
            </h3>
            <div className="space-y-4">
              {/* Checkbox Non concerné */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notConcerned"
                  name="notConcerned"
                  checked={formData.notConcerned}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="notConcerned" className="ml-2 text-sm font-medium text-gray-700">
                  Non concerné (masque les quotités)
                </label>
              </div>

              {/* Pleine Propriété */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pleine Propriété (PP)
                </label>
                <input
                  name="pleineProprietePart"
                  value={formData.pleineProprietePart}
                  onChange={handleChange}
                  disabled={formData.notConcerned}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Ex: 1/4, 25%, 0.25"
                />
              </div>

              {/* Usufruit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usufruit (U)
                </label>
                <input
                  name="usufruitPart"
                  value={formData.usufruitPart}
                  onChange={handleChange}
                  disabled={formData.notConcerned}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Ex: 1/4, 25%, 0.25"
                />
              </div>

              {/* Nue Propriété */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nue Propriété (NP)
                </label>
                <input
                  name="nueProprietPart"
                  value={formData.nueProprietPart}
                  onChange={handleChange}
                  disabled={formData.notConcerned}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Ex: 1/4, 25%, 0.25"
                />
              </div>
            </div>
          </div>

          {/* Section: Commentaires */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Commentaires
            </h3>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Informations supplémentaires..."
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PersonForm;
