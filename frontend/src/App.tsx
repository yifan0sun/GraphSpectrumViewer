import React, { useState } from 'react'; 
import './App.css';
import { AboutPage } from './components/about'; // Assuming you put it here
import GraphEditor from './components/GraphEditor';
import RightPanel from './components/RightPanel'; // ← new


const App = () => {
 const [showAbout, setShowAbout] = useState(false);
 const [nodes, setNodes] = useState([{ id: 0, x: 100, y: 100 }, { id: 1, x: 250, y: 100 }, { id: 2, x: 175, y: 200 }]);
const [edges, setEdges] = useState([{ source: 0, target: 1 }, { source: 1, target: 2 }, { source: 2, target: 0 }]);


type SpectrumResult = {
  eigenvalues: number[];
  eigenvectors: number[][];
  matrix?: number[][];  // Add this optional field
};

type SpectrumData = {
  adjacency: SpectrumResult;
  laplacian: SpectrumResult;
  normalized_laplacian: SpectrumResult;
};

const [spectrum, setSpectrum] = useState<SpectrumData | null>(null);
 

 if (showAbout) {
  return <AboutPage onBack={() => setShowAbout(false)} />;
}

  return (
  <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' ,width: '100vw'}}>
    {/* Description bar at top */}
    <div style={{ padding: '1.5rem', borderBottom: '1px solid #ccc', flexShrink: 0  }}>
      <h2>Graph Spectral Visualizer</h2>
<p>
  This interactive tool helps you explore the structure of graphs using their spectral properties. Add nodes and edges, compute eigenvalues and eigenvectors of the adjacency and Laplacian matrices, and visualize spectral embeddings.
  <br />
  - <strong>Spectrum</strong> shows the eigenvalues of the selected matrix type.
  <br />
  - <strong>Embedding</strong> plots nodes using selected eigenvector coordinates, revealing cluster and community structures.
  <br />
  Use the editor on the left to build or modify your graph, then click "Compute Spectrum" to begin.
</p>


      
        <p style={{ textAlign: "left" , marginBottom: "0px" }}><b>More.</b> 
        <button
  onClick={() => setShowAbout(true)}
  style={{
    fontSize: '12px',
    padding: '2px 6px',
    marginTop: '8px',
    cursor: 'pointer'
  }}
>
  About this tool
</button> Also, visit  <a href="https://github.com/yifan0sun/GraphSpectrumViewer/blob/main/README.md">the project README file</a>. Feedback and suggestions are welcome! Please visit <a href="https://sites.google.com/view/visualizerprojects/home">optimalvisualizer.com</a> to give feedback or visit more visually pleasing explainability apps.</p>
          
{/*<div>
  <pre>{JSON.stringify(spectrum, null, 2)}</pre>
</div>*/}

  </div>
 



      {/* Main Row: Left (GraphEditor) and Right (Tabs) */}
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <GraphEditor
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        setSpectrum={setSpectrum}
      />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <RightPanel
        nodes={nodes}
        edges={edges}
        spectrum={spectrum}
      />
      </div>
    </div>

 
  </div>
);



};

export default App;
