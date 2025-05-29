import React, { useRef, useState, forwardRef } from 'react';

type NodeType = { id: number; x: number; y: number };
type EdgeType = { source: number; target: number };

type Props = {
  nodes: NodeType[];
  edges: EdgeType[];
  onNodePositionChange?: (id: number, x: number, y: number) => void;
  onNodeClick?: (id: number) => void;
    selectedNodeIds?: number[];
    onEdgeClick?: (index: number) => void;
selectedEdgeIndex?: number;
};



const InteractiveGraph = forwardRef<SVGSVGElement, Props>(function InteractiveGraph(
{ nodes, edges, onNodePositionChange, onNodeClick, selectedNodeIds, onEdgeClick, selectedEdgeIndex },

  ref
) {
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const handleMouseDown = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId === null || !(ref && typeof ref !== 'function' && ref.current)) return;

    const svg = ref.current;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 20;
    const clampedX = Math.max(padding, Math.min(x, rect.width - padding));
    const clampedY = Math.max(padding, Math.min(y, rect.height - padding));

    onNodePositionChange?.(draggingId, clampedX, clampedY);
  };

  const handleMouseUp = () => setDraggingId(null);

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      style={{ background: '#f9f9f9' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* gradient and elements unchanged */}
      <defs>
        <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b4d4ff" />
          <stop offset="100%" stopColor="#1a3fa3" />
        </radialGradient>
      </defs>

      {edges.map((edge, idx) => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return null;
        return (
            <>
                {/* thicker transparent line for easier selection */}
                <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="transparent"
                    strokeWidth={12}
                    onClick={(e) => {
                    e.stopPropagation();
                    onEdgeClick?.(idx);
                    }}
                    style={{ cursor: 'pointer' }}
                />
                {/* visible line */}
                <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={idx === selectedEdgeIndex ? "#ff6b6b" : "#7baeff"}
                    strokeWidth={1.5}
                    opacity={0.8}
                    pointerEvents="none"
                />
            </>

        );
        })}


      {nodes.map(node => (
        <g
            key={node.id}
            onMouseDown={e => {
                handleMouseDown(node.id, e);
                onNodeClick?.(node.id);
            }}
            style={{ cursor: 'grab' }}
            >
          <circle
            cx={node.x}
            cy={node.y}
            r={12}
            fill={selectedNodeIds?.includes(node.id) ? '#ff6b6b' : 'url(#nodeGradient)'}
            stroke="#1a3fa3"
            strokeWidth={1}
          />
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fontSize="12px"
            fill="#ffffff"
            fontWeight="bold"
            pointerEvents="none"
          >
            {node.id}
          </text>
        </g>
      ))}
    </svg>
  );
});

export default InteractiveGraph;