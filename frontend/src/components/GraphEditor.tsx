import React, { useState, useRef, useEffect } from 'react';
import InteractiveGraph from './InteractiveGraph';

const SERVER_ADDRESS = 'http://localhost:8000';


export default function GraphEditor({
  nodes, setNodes, edges, setEdges, setSpectrum
}: {
  nodes: any[], setNodes: Function,
  edges: any[], setEdges: Function
  setSpectrum: (data: {
    adjacency: { eigenvalues: number[]; eigenvectors: number[][] };
    laplacian: { eigenvalues: number[]; eigenvectors: number[][] };
    normalized_laplacian: { eigenvalues: number[]; eigenvectors: number[][] };
    }) => void
}) {





    const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);
    const [delEdgeWarning, setDelEdgeWarning] = useState('');
    const [nodeWarning, setNodeWarning] = useState('');
    const [selectedEdgeIndex, setSelectedEdgeIndex] = useState<number | null>(null);
    const [addEdgeWarning, setAddEdgeWarning] = useState('');


    const svgRef = useRef<SVGSVGElement | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });


    const [numNewNodes, setNumNewNodes] = useState(3);
    const [edgeProb, setEdgeProb] = useState(0.5);



useEffect(() => {
  const updateSize = () => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    }
  };

  updateSize();
  window.addEventListener('resize', updateSize);
  return () => window.removeEventListener('resize', updateSize);
}, []);


 


  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1  }}>
      {/* Graph panel */}
    <InteractiveGraph
        ref={svgRef}
        nodes={nodes}
        edges={edges}
        selectedNodeIds={selectedNodeIds}
        onNodeClick={(id) => {
            setSelectedEdgeIndex(null);
            setSelectedNodeIds(prev => 
                prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
            );
        }}
        selectedEdgeIndex={selectedEdgeIndex}
        onEdgeClick={(idx) => {
            setSelectedEdgeIndex(idx);
            setSelectedNodeIds([]); 
        }}
        onNodePositionChange={(id, x, y) => {
            setNodes(prev =>
            prev.map(n => (n.id === id ? { ...n, x, y } : n))
            );
        }}
        />



      {/* Controls row */}
    <div
    className="graph-controls"
    style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexDirection:'row'
    }}
    >
        {/* First row of buttons */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Left panel with 2 button rows */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>

                    <button onClick={() => {
                        setNodes(prevNodes => {
                            const newId = prevNodes.length > 0 ? prevNodes[prevNodes.length - 1].id + 1 : 0;
                            const lastNode = prevNodes[prevNodes.length - 1];

                            
                            const jitter = () => Math.floor(Math.random() * 101) - 50 ;
                            let x = (lastNode?.x ?? 100)  + jitter();
                            let y = (lastNode?.y ?? 100)  + jitter();

                            const padding = 20;
                            x = Math.min(Math.max(x, padding), canvasSize.width - padding);
                            y = Math.min(Math.max(y, padding), canvasSize.height - padding);

                            const newNode = { id: newId, x, y };

                            setEdges(prevEdges => [
                            ...prevEdges,
                            ...(lastNode ? [{ source: lastNode.id, target: newId }] : []),
                            ]);

                            return [...prevNodes, newNode];
                        });
                        }}>Add Node
                    </button>
                <div style={{ height: '1rem' }} />  {/* Keeps height consistent */}
                </div>
            
                <div style={{ display: 'flex'}}>
                <button onClick={() => {
                    if (selectedNodeIds.length === 0) {
                        setNodeWarning("Select node(s) to delete");
                        return;
                    }

                    setNodeWarning('');
                    setSelectedNodeIds([]);

                    setNodes(prevNodes => {
                        const kept = prevNodes.filter(n => !selectedNodeIds.includes(n.id));
                        return kept.map((node, index) => ({ id: index, x: node.x, y: node.y }));
                    });

                    setEdges(prevEdges => {
                        const toDelete = new Set(selectedNodeIds);
                        const filtered = prevEdges
                            .filter(e => !toDelete.has(e.source) && !toDelete.has(e.target))
                            .map(e => ({
                                source: selectedNodeIds.filter(n => n < e.source).length ? e.source - 1 : e.source,
                                target: selectedNodeIds.filter(n => n < e.target).length ? e.target - 1 : e.target
                            }));
                        return filtered;
                    });
                    }}>Delete Node</button>

                    {nodeWarning && (
                    <div style={{ color: '#c00', fontSize: '0.85rem' }}>{nodeWarning}</div>
                    )}
                </div>

                
                <div style={{ display: 'flex', width: '8rem', alignItems: 'center' }}>
                    <button onClick={() => {
                        if (selectedNodeIds.length < 2) {
                            setAddEdgeWarning("Select two nodes");
                            return;
                        }

                        const newEdges: { source: number, target: number }[] = [];
                        for (let i = 0; i < selectedNodeIds.length; i++) {
                            for (let j = i + 1; j < selectedNodeIds.length; j++) {
                                const a = selectedNodeIds[i];
                                const b = selectedNodeIds[j];
                                const exists = edges.some(e =>
                                    (e.source === a && e.target === b) || (e.source === b && e.target === a)
                                );
                                if (!exists) {
                                    newEdges.push({ source: a, target: b });
                                }
                            }
                        }

                        if (newEdges.length === 0) {
                            setAddEdgeWarning("All selected pairs already connected");
                        } else {
                            setAddEdgeWarning('');
                            setEdges(prev => [...prev, ...newEdges]);
                        }
                    }}>Add Edge</button>

                {addEdgeWarning && (
                    <div style={{ color: '#c00', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {addEdgeWarning}
                    </div>
                )}
                </div>

                
                <div style={{ display: 'flex' }}>
                    <button onClick={() => {
                        if (selectedEdgeIndex === null) {
                        setDelEdgeWarning("Select edge to delete");
                        return;
                        }

                        setDelEdgeWarning('');
                        setSelectedEdgeIndex(null);

                        setEdges(prevEdges => {
                            const selected = prevEdges[selectedEdgeIndex!]; // `!` asserts it's not null
                            return prevEdges.filter(
                                e =>
                                    !(
                                    (e.source === selected.source && e.target === selected.target) ||
                                    (e.source === selected.target && e.target === selected.source)
                                    )
                                );
                            });
                    }}>
                        Delete Edge
                    </button>

                    {delEdgeWarning && (
                        <div style={{ color: '#c00', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        {delEdgeWarning}
                        </div>
                    )}
                </div>


                <div style={{ display: 'flex' }}>
                    <button
                    onClick={() => {
                        setNodes([]);
                        setEdges([]);
                        setSelectedNodeIds([]);
                        setSelectedEdgeIndex(null);
                        setNodeWarning('');
                        setAddEdgeWarning('');
                        setDelEdgeWarning('');
                        setSpectrum({
                        adjacency: { eigenvalues: [], eigenvectors: [] },
                        laplacian: { eigenvalues: [], eigenvectors: [] },
                        normalized_laplacian: { eigenvalues: [], eigenvectors: [] }
                        });
                    }}
                    >
                    Clear Nodes
                    </button>

                </div>
            </div>

            {/* Spacing between rows */}
            <div style={{ height: '0.5rem' }} /> 
                {/* Second row of controls */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <label>
                    # new nodes (integer):
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={numNewNodes}
                        onChange={(e) => setNumNewNodes(parseInt(e.target.value) || 1)}
                        style={{ width: '4rem' }}
                    />
                    </label>
                    <label>
                    Edge prob. (0 to 1):
                    <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={edgeProb}
                        onChange={(e) => setEdgeProb(Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))}
                        style={{ width: '4rem' }}
                    />
                    </label>
                    
                    <button onClick={() => {
                    setNodes(prevNodes => {
                        const padding = 20;
                        const lastNode = prevNodes[prevNodes.length - 1];
                        let baseX = lastNode?.x ?? 100;
                        let baseY = lastNode?.y ?? 100;

                        const scale = Math.min(Math.sqrt(numNewNodes*1000), Math.min(canvasSize.width, canvasSize.height) / 2);
                        const jitter = () => (Math.random() - 0.5) * 2 * scale;  // range: [-scale, scale]


                        const newNodes = Array.from({ length: numNewNodes }, (_, i) => {
                        let x = baseX + jitter();
                        let y = baseY + jitter();
                        x = Math.min(Math.max(x, padding), canvasSize.width - padding);
                        y = Math.min(Math.max(y, padding), canvasSize.height - padding);
                        return { id: prevNodes.length + i, x, y };
                        });



                        

                        // Generate new edges probabilistically between new nodes
                        setEdges(prevEdges => {
                        const newEdges: { source: number, target: number }[] = [];

                        if (prevNodes.length > 0 && newNodes.length > 0) {
                            newEdges.push({ source: prevNodes[prevNodes.length - 1].id, target: newNodes[0].id });
                        }



                        for (let i = 0; i < newNodes.length; i++) {
                            for (let j = i + 1; j < newNodes.length; j++) {
                            if (Math.random() < edgeProb) {
                                newEdges.push({ source: newNodes[i].id, target: newNodes[j].id });
                            }
                            }
                        }

                        return [...prevEdges, ...newEdges];
                        });
                        setSelectedNodeIds([prevNodes.length + numNewNodes - 1]);
                        return [...prevNodes, ...newNodes];
                    });
                    }}>
                    Add nodes
                    </button>


                </div>
            </div>
        

        {/* Right panel with Recompute button */}
         <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
            onClick={() => {
                fetch(`${SERVER_ADDRESS}/get_spectrum`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nodes: nodes.map(n => n.id),
                    edges: edges.map(e => [e.source, e.target])
                })
                })
                .then(res => res.json())
                .then(data => setSpectrum(data))
                .catch(err => console.error("Error fetching spectrum:", err));
            }}
            style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#3366cc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
            }}
            >
            Recompute
            </button>

    
        </div>
        
    </div>
    
    </div>


  );
}
