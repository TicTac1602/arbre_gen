import { formatDate } from '../../utils/dateFormatter';

function PersonInfoDisplay({ formData }) {
  return (
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

      {!formData.notConcerned && formData.usufruitPart && (
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">Usufruit (U)</label>
          <p className="text-sm text-gray-800 mt-1">{formData.usufruitPart}</p>
        </div>
      )}

      {!formData.notConcerned && formData.nueProprietPart && (
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
  );
}

export default PersonInfoDisplay;
