import { useCallback } from 'react';
import { MiniMap, useReactFlow } from '@xyflow/react';

function FamilyTreeMinimap() {
  const { setCenter } = useReactFlow();

  const handleMinimapClick = useCallback((event, position) => {
    setCenter(position.x, position.y, { zoom: 1, duration: 1000 });
  }, [setCenter]);

  return (
    <MiniMap 
      pannable 
      zoomable
      bgColor='rgb(122,122,122)'
      onClick={handleMinimapClick}
    />
  );
}

export default FamilyTreeMinimap;
