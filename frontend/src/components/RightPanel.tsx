import React, { useState } from 'react';
import Plot from 'react-plotly.js';

const upperTabs = ["Adjacency", "Laplacian", "Normalized Laplacian"];
const lowerTabs = ["Spectrum", "Embedding"];

type Node = { id: number };
type Edge = { source: number; target: number };

type SpectrumResult = {
  eigenvalues: number[];
  eigenvectors: number[][];
};

type SpectrumData = {
  adjacency: SpectrumResult;
  laplacian: SpectrumResult;
  normalized_laplacian: SpectrumResult;
};

export default function RightPanel({
  nodes,
  edges,
  spectrum
}: {
  nodes: Node[];
  edges: Edge[];
  spectrum: SpectrumData | null;
}) {
  const [matrixTab, setMatrixTab] = useState("adjacency");
  const [viewTab, setViewTab] = useState("spectrum");
  const [xIndex, setXIndex] = useState(1);
  const [yIndex, setYIndex] = useState(2);

  const tabToKey = (tab: string) =>
    tab.toLowerCase().replace(/\s+/g, "_") as keyof SpectrumData;

  const matrixKey = tabToKey(matrixTab);
  const spectrumData = spectrum?.[matrixKey];
  const eigenvalues = spectrumData?.eigenvalues ?? [];
  const eigenvectors = spectrumData?.eigenvectors ?? [];

  const xCoords = eigenvectors.map(row => row[xIndex - 1] ?? 0);
  const yCoords = eigenvectors.map(row => row[yIndex - 1] ?? 0);

  return (
    <div style={{
      width: '40%',
      padding: '1rem',
      borderLeft: '1px solid #ccc',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Upper Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {upperTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setMatrixTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: matrixTab === tab ? '#1a3fa3' : '#eee',
              color: matrixTab === tab ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Display Area */}
      <div style={{
        flex: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #ccc',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        {viewTab === "spectrum" ? (
          eigenvalues.length > 0 ? (
            <Plot
              data={[{
                x: eigenvalues,
                type: 'scatter',
                mode: 'markers',
                marker: { size: 6 }
              }]}
              layout={{ title: `${matrixKey} Eigenvalues`, height: 400 }}
            />
          ) : (
            <p style={{ fontStyle: 'italic' }}>Click compute spectrum to start.</p>
          )
        ) : (
          <div style={{ width: '100%' }}>
            <Plot
              data={[{
                x: xCoords,
                y: yCoords,
                type: 'scatter',
                mode: 'markers',
                marker: { size: 10 }
              }]}
              layout={{
                title: "Embedding Plot",
                height: 400,
                yaxis: { scaleanchor: 'x', scaleratio: 1 },
                margin: { t: 40, l: 40, r: 20, b: 40 }
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem', gap: '0.5rem' }}>
              <label>
                x: {" "}
                <input
                  type="number"
                  min={1}
                  max={nodes.length}
                  value={xIndex}
                  onChange={(e) => setXIndex(Math.max(1, Math.min(nodes.length, parseInt(e.target.value) || 1)))}
                  style={{ width: '4rem' }}
                />
              </label>
              <label>
                y: {" "}
                <input
                  type="number"
                  min={1}
                  max={nodes.length}
                  value={yIndex}
                  onChange={(e) => setYIndex(Math.max(1, Math.min(nodes.length, parseInt(e.target.value) || 1)))}
                  style={{ width: '4rem' }}
                />
              </label>
              <span style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
                Select eigenvector (1 = max eigenvalue if adjacency, 1 = min eigenvalue if Laplacian)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lower Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {lowerTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setViewTab(tab.toLowerCase())}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: viewTab === tab.toLowerCase() ? '#1a3fa3' : '#eee',
              color: viewTab === tab.toLowerCase() ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
