import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

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

function FamilyTreeNode({ data}) {
  return (
    <div className="relative">
      {/* Handle en haut pour les parents */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />

      {/* Carte de la personne */}
      <div className={`border-2 rounded-lg shadow-lg min-w-[200px] hover:shadow-xl transition-shadow ${
        data.notConcerned 
          ? 'bg-gray-200 border-gray-400 opacity-70' 
          : 'bg-white border-gray-300'
      }`}>
        <div className="p-3">
		  {/* Indicateur de décès */}
          

          {/* Nom */}
          <div className="text-center">
			<div className='flex items-center justify-center'>
				{data.deathDate && (
					<div className="relative mr-2 w-5 h-5 bg-black rounded-full flex items-center justify-center" title="Décédé(e)">
						{data.deathIndex && (
							<span className="text-white text-[9px] font-bold">{data.deathIndex}</span>
						)}
					</div>
				)}
				<h3 className={`font-semibold text-lg ${data.notConcerned ? 'text-gray-600' : 'text-gray-800'}`}>
				{data.label || 'Sans nom'}
				</h3>
			</div>
            
            {/* Âge */}
            {data.age && (
              <p className={`text-xs mt-1 ${data.notConcerned ? 'text-gray-500' : 'text-gray-600'}`}>
                {data.age} ans
              </p>
            )}
            
            {/* Dates */}
            {data.birthDate && (
              <p className={`text-xs mt-1 ${data.notConcerned ? 'text-gray-500' : 'text-gray-500'}`}>
                Né(e) : {formatDate(data.birthDate)}
              </p>
            )}
            {data.deathDate && (
              <p className={`text-xs ${data.notConcerned ? 'text-gray-500' : 'text-gray-500'}`}>
                Décédé(e) : {formatDate(data.deathDate)}
              </p>
            )}
            
            {/* Profession */}
            {data.profession && (
              <p className={`text-xs mt-1 font-medium ${data.notConcerned ? 'text-gray-500' : 'text-indigo-600'}`}>
                {data.profession}
              </p>
            )}
            
            {/* Pleine Propriété, Usufruit et Nue Propriété - Masqués si non concerné */}
            {!data.notConcerned && (
              <div className="mt-1 flex flex-row justify-evenly items-center">
                {(data.pleineProprietePart) && (
                  <p className="text-xs text-purple-700 font-semibold">
                    PP: {data.pleineProprietePart}
                  </p>
                )}
                {(data.usufruitPart) && (
                  <p className="text-xs text-green-700 font-semibold">
                    U: {data.usufruitPart}
                  </p>
                )}
                {(data.nueProprietPart) && (
                  <p className="text-xs text-orange-700 font-semibold">
                    NP: {data.nueProprietPart}
                  </p>
                )}
              </div>
            )}
            
            {data.relation && (
              <p className="text-xs text-blue-600 mt-1 font-medium">
                {data.relation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Handle en bas pour les enfants */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />

      {/* Handle à gauche pour les conjoints */}
      <Handle
        type="source"
        position={Position.Left}
        id="spouse-left"
        className="w-3 h-3 bg-pink-500 border-2 border-white"
      />

      {/* Handle à droite pour les conjoints */}
      <Handle
        type="target"
        position={Position.Right}
        id="spouse-right"
        className="w-3 h-3 bg-pink-500 border-2 border-white"
      />
    </div>
  );
}

export default memo(FamilyTreeNode);
