import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useProjectStore } from '../store/projectStore';
import FamilyTreeNode from './FamilyTreeNode';
import Toolbar from './Toolbar';
import PersonForm from './PersonForm';
import NodeDetailsPanel from './NodeDetailsPanel';
import FamilyTreeMinimap from './FamilyTreeMinimap';
import ExportButtons from './ExportButtons';
import { calculateAge } from '../utils/date';

// Fonction pour calculer les index de décès
const calculateDeathIndices = (nodes) => {
  if (!nodes || nodes.length === 0) return nodes;

  // Filtrer les personnes décédées et trier par date de décès
  const deceasedNodes = nodes
    .filter(node => node.data?.deathDate)
    .map(node => ({
      ...node,
      deathDateParsed: new Date(node.data.deathDate)
    }))
    .filter(node => !isNaN(node.deathDateParsed.getTime()))
    .sort((a, b) => a.deathDateParsed - b.deathDateParsed);

  // Créer une map des deathIndex
  const deathIndexMap = new Map();
  deceasedNodes.forEach((node, index) => {
    deathIndexMap.set(node.id, index + 1);
  });

  // Appliquer les index aux nodes
  return nodes.map(node => {
    if (deathIndexMap.has(node.id)) {
      return {
        ...node,
        data: {
          ...node.data,
          deathIndex: deathIndexMap.get(node.id)
        }
      };
    }
    // Retirer deathIndex si la personne n'est plus décédée
    const { deathIndex: _deathIndex, ...dataWithoutIndex } = node.data || {};
    return {
      ...node,
      data: dataWithoutIndex
    };
  });
};

// Fonction pour calculer les âges automatiquement
const calculateAges = (nodes) => {
  if (!nodes || nodes.length === 0) return nodes;
  
  return nodes.map(node => {
    const age = calculateAge(node.data?.birthDate, node.data?.deathDate);
    
    if (age !== null) {
      return {
        ...node,
        data: {
          ...node.data,
          age
        }
      };
    }
    
    // Retirer age si pas de date de naissance
    const { age: _age, ...dataWithoutAge } = node.data || {};
    return {
      ...node,
      data: dataWithoutAge
    };
  });
};

// Fonction pour styliser les edges selon le type de relation
const styleEdges = (edges, nodes) => {
  if (!edges || edges.length === 0) return edges;
  
  return edges.map(edge => {
    // Déterminer si l'edge est horizontal (mariage) ou vertical (filiation)
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return edge;
    
    // Vérifier si c'est un lien de mariage (handles gauche/droite)
    const isMarriage = edge.sourceHandle === 'spouse-left' || 
                       edge.sourceHandle === 'spouse-right' ||
                       edge.targetHandle === 'spouse-left' || 
                       edge.targetHandle === 'spouse-right';
    
    if (isMarriage) {
      // Style pour les mariages (horizontal)
	return {
	  ...edge,
	  type: 'smoothstep',
	  animated: false,
	  style: {
		stroke: '#fbbf24', // Jaune/or
		strokeWidth: 2.5,
	  },
	  label: '💍',
	  labelStyle: {
		fontSize: 16,
	  },
	  labelBgStyle: {
		fill: 'transparent',
		fillOpacity: 0.8,
	  },
	};
    } else {
      // Style pour les filiations (vertical)
      return {
        ...edge,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: '#3b82f6',
          strokeWidth: 2.5,
        },
      };
    }
  });
};

function MainContent() {
  const { currentProject, updateCurrentProject } = useProjectStore();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const saveTimeoutRef = useRef(null);
  const projectIdRef = useRef(null);

  // Définir les types de nœuds personnalisés
  const nodeTypes = useMemo(() => ({ familyTreeNode: FamilyTreeNode }), []);

  // Calculer les âges et deathIndex dynamiquement
  const nodesWithComputedData = useMemo(() => {
    const nodesWithAges = calculateAges(nodes);
    return calculateDeathIndices(nodesWithAges);
  }, [nodes]);

  // Styliser les edges selon le type de relation
  const styledEdges = useMemo(() => {
    return styleEdges(edges, nodes);
  }, [edges, nodes]);

  // Synchroniser avec le projet courant (setState dans useEffect est correct ici)
  useEffect(() => {
    if (currentProject?.id === projectIdRef.current) return;
    
    projectIdRef.current = currentProject?.id;
    
    if (!currentProject) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNodes([]);
      setEdges([]);
      return;
    }

    const loadedNodes = (currentProject.nodes || []).map(node => ({
      ...node,
      type: node.type || 'familyTreeNode',
    }));
    setNodes(loadedNodes);
    setEdges(currentProject.edges || []);
  }, [currentProject]);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Sauvegarder automatiquement après chaque modification de nodes/edges
  useEffect(() => {
    if (!currentProject) return;
    
    // Annuler la sauvegarde précédente si elle existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Planifier une nouvelle sauvegarde
    saveTimeoutRef.current = setTimeout(() => {
      updateCurrentProject(nodes, edges);
    }, 500);
  }, [nodes, edges, currentProject, updateCurrentProject]);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    []
  );

  // Gestionnaire de clic sur une node
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Mettre à jour une node
  const handleUpdateNode = useCallback((nodeId, updatedData) => {
    setNodes(nds => nds.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updatedData,
          }
        };
      }
      return node;
    }));
    // Mettre à jour selectedNode pour refléter les changements
    setSelectedNode(prev => prev ? {
      ...prev,
      data: { ...prev.data, ...updatedData }
    } : null);
  }, []);

  // Supprimer une node
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  }, []);

  // Fonction pour ajouter une personne sans lien
  const handleAddPerson = useCallback((formData) => {
    const newNodeId = `node-${Date.now()}`;
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    
    const newNode = {
      id: newNodeId,
      type: 'familyTreeNode',
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 400 + 200
      },
      data: {
        label: fullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        deathDate: formData.deathDate,
        profession: formData.profession,
		pleineProprietePart: formData.pleineProprietePart,
        usufruitPart: formData.usufruitPart,
        nueProprietPart: formData.nueProprietPart,
        notConcerned: formData.notConcerned,
        notes: formData.notes,
      }
    };

    setNodes(nds => [...nds, newNode]);
    // La sauvegarde se fait automatiquement via useEffect
  }, []);

  if (!currentProject) {
    return (
      <div className="flex-1 h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p className="text-xl mb-2">Aucun projet sélectionné</p>
          <p className="text-sm">Créez ou sélectionnez un projet dans la barre latérale</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-gray-100 flex">
      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-white border-b border-gray-300 px-4 flex items-center">
          <h1 className="text-lg font-semibold text-gray-800">{currentProject.name}</h1>
        </div>
        <PersonForm 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddPerson}
        />
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodesWithComputedData}
            edges={styledEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
			<FamilyTreeMinimap />
            <Controls />
            <Toolbar 
              onAddPerson={() => setIsFormOpen(true)}
              exportButtonsSlot={<ExportButtons />}
            />
          </ReactFlow>
        </div>
      </div>
      <NodeDetailsPanel
        selectedNode={selectedNode}
        onUpdate={handleUpdateNode}
        onDelete={handleDeleteNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}

export default MainContent;
