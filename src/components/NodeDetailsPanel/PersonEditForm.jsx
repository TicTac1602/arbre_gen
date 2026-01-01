function PersonEditForm({ formData, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Prénom *</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Nom *</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Genre</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Date de décès</label>
        <input
          type="date"
          name="deathDate"
          value={formData.deathDate}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Profession</label>
        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center py-2">
        <input
          type="checkbox"
          id="notConcerned"
          name="notConcerned"
          checked={formData.notConcerned}
          onChange={onChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="notConcerned" className="ml-2 text-xs font-medium text-gray-700">
          Non concerné (masque les quotités)
        </label>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Pleine Propriété (PP)</label>
        <input
          name="pleineProprietePart"
          value={formData.pleineProprietePart}
          onChange={onChange}
          disabled={formData.notConcerned}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Part"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Usufruit (U)</label>
        <input
          name="usufruitPart"
          value={formData.usufruitPart}
          onChange={onChange}
          disabled={formData.notConcerned}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Part"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Nue Propriété (NP)</label>
        <input
          name="nueProprietPart"
          value={formData.nueProprietPart}
          onChange={onChange}
          disabled={formData.notConcerned}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Part"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onChange}
          rows="3"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

export default PersonEditForm;
