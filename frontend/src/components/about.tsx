export function AboutPage({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Graph Spectral Visualizer</h2>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Motivation</h3>
        <p style={paragraphStyle}>
          Spectral graph theory provides a powerful lens for understanding the structure of graphs. This tool offers an interactive way to explore how eigenvalues and eigenvectors of graph matrices reveal clustering, connectivity, and latent geometry.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>How this tool works</h3>
        <p style={paragraphStyle}>
          You can interactively build or modify a graph on the left using the following buttons:
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li><strong>Add Node</strong>: Adds a new node to the graph.</li>
            <li><strong>Delete Node</strong>: Deletes the selected node and its edges.</li>
            <li><strong>Select Edge</strong>: Click an edge to select it.</li>
            <li><strong>Delete Edge</strong>: Removes the selected edge.</li>
            <li><strong>Recompute</strong>: Computes the spectrum and eigenvectors of the adjacency, Laplacian, and normalized Laplacian matrices.</li>
          </ul>
        </p>
        <p style={paragraphStyle}>
          On the right panel, you can choose the matrix type (Adjacency, Laplacian, or Normalized Laplacian), and view either the spectrum (eigenvalues) or an embedding plot using selected eigenvectors.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Limitations</h3>
        <p style={paragraphStyle}>
          The current version only supports unweighted graphs. Support for weighted edges is a planned improvement.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>About me</h3>
        <p style={paragraphStyle}>
          I'm <a href="https://optimalyifansun.com/" target="_blank" rel="noopener noreferrer">Yifan Sun</a>, from Stony Brook University. My goal in creating this app — and other <a href="https://www.optimalvisualizer.com/" target="_blank" rel="noopener noreferrer">interactive visual tools</a> — is to help bridge the gap between abstract theory and intuitive understanding in machine learning. Tools like this one aim to make internal graph structure and spectral concepts more accessible to students, researchers, and practitioners.
        </p>
      </div>

      <button onClick={onBack} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>← Back to main</button>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 600,
  marginBottom: '0.5rem'
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.6
};