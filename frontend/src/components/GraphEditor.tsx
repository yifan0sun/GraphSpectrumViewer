import React, { useState, useRef, useEffect } from 'react';
import InteractiveGraph from './InteractiveGraph';



export default function GraphEditor() {


  const [nodes, setNodes] = useState([
    { id: 0, x: 100, y: 100 },
    { id: 1, x: 250, y: 100 },
    { id: 2, x: 175, y: 200 },
  ]);

  const [edges, setEdges] = useState([
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 0 },
  ]);


    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const [edgeWarning, setEdgeWarning] = useState('');
    const [nodeWarning, setNodeWarning] = useState('');
    const [selectedEdgeIndex, setSelectedEdgeIndex] = useState<number | null>(null);


  const svgRef = useRef<SVGSVGElement | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Graph panel */}
    <InteractiveGraph
        ref={svgRef}
        nodes={nodes}
        edges={edges}
        selectedNodeId={selectedNodeId}
        onNodeClick={(id) => {
            setSelectedNodeId(id);
            setSelectedEdgeIndex(null); // deselect edge
        }}
        selectedEdgeIndex={selectedEdgeIndex}
        onEdgeClick={(idx) => {
            setSelectedEdgeIndex(idx);
            setSelectedNodeId(null); // deselect node
        }}
        onNodePositionChange={(id, x, y) => {
            setNodes(prev =>
            prev.map(n => (n.id === id ? { ...n, x, y } : n))
            );
        }}
        />



      {/* Controls row */}
      <div className="graph-controls">
        {/* First row of buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => {
                setNodes(prevNodes => {
                    const newId = prevNodes.length > 0 ? prevNodes[prevNodes.length - 1].id + 1 : 0;
                    const lastNode = prevNodes[prevNodes.length - 1];

                    let x = (lastNode?.x ?? 100) + 60;
                    let y = (lastNode?.y ?? 100) + 60;

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
                }}>Add Node</button>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => {
                if (selectedNodeId === null) {
                    setNodeWarning("Select node to delete");
                    return;
                }

                setNodeWarning('');
                setSelectedNodeId(null);

                setNodes(prevNodes => {
                    const filtered = prevNodes.filter(n => n.id !== selectedNodeId);
                    // Reassign IDs
                    return filtered.map((node, index) => ({
                    id: index,
                    x: node.x,
                    y: node.y
                    }));
                });

                setEdges(prevEdges => {
                    const updatedEdges = prevEdges
                    .filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId)
                    .map(({ source, target }) => ({
                        source: source > selectedNodeId ? source - 1 : source,
                        target: target > selectedNodeId ? target - 1 : target,
                    }));
                    return updatedEdges;
                });
                }}>Delete Node</button>

                {nodeWarning && (
                <div style={{ color: '#c00', fontSize: '0.85rem' }}>{nodeWarning}</div>
                )}
            </div>
            <button>Add Edge</button>

            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => {
                    if (selectedEdgeIndex === null) {
                    setEdgeWarning("Select edge to delete");
                    return;
                    }

                    setEdgeWarning('');
                    setSelectedEdgeIndex(null);

                    setEdges(prevEdges => {
                    return prevEdges.filter((_, i) => i !== selectedEdgeIndex);

                    });
                }}>
                    Delete Edge
                </button>

                {edgeWarning && (
                    <div style={{ color: '#c00', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {edgeWarning}
                    </div>
                )}
            </div>
        </div>

        {/* Spacing between rows */}
        <div style={{ height: '0.5rem' }} /> 
        {/* Second row of controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <label>
            Nodes:
            <input type="number" min="1" defaultValue="3" style={{ width: '4rem' }} />
            </label>
            <label>
            Type:
            <select>
                <option value="erdos-renyi">Erdős–Rényi</option>
                <option value="barabasi-albert">Barabási–Albert</option>
                <option value="barabasi-albert">Stochastic block model</option>
            </select>
            </label>
            <button>Regenerate</button>
        </div>
    </div>
    </div>


  );
}
