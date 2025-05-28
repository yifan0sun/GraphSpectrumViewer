import React, { useState } from 'react'; 
import './App.css';
import { AboutPage } from './components/about'; // Assuming you put it here
import GraphEditor from './components/GraphEditor';


const App = () => {
 const [showAbout, setShowAbout] = useState(false);
 
 

 if (showAbout) {
  return <AboutPage onBack={() => setShowAbout(false)} />;
}

  return (
  <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
    {/* Description bar at top */}
    <div style={{ padding: '1.5rem', borderBottom: '1px solid #ccc', flexShrink: 0 }}>
      <h2>Attention and Gradient Matrix Viewer for BERT family transformers</h2>
      <p>
        Interpretability is key to trust in AI. This tool turns hidden weights into intuitive graphs — helping you explore how models reason through language.
        This tool lets you visualize how transformer models distribute attention and how sensitive their outputs are to each input token.
        <br />
        - <strong>Attention</strong> shows how much each token attends to others across a given layer.
        <br />
        - <strong>Gradient Norm</strong> captures how much a small change to each input token affects the model’s attention pattern at that specific layer — indicating influence.
        <br />
        To use: select a model and task, optionally mask a word (for MLM), and click "Load Model Info" to visualize attention or gradient patterns by layer.
        (We truncate inputs to 200 words to avoid glitches when the input is too long.)
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
</button> Also, visit  <a href="https://github.com/yifan0sun/BertGradGraph/blob/main/README.md">the project README file</a>. Feedback and suggestions are welcome! Please visit <a href="https://sites.google.com/view/visualizerprojects/home">optimalvisualizer.com</a> to give feedback or visit more visually pleasing explainability apps.</p>
          

  </div>
 




<GraphEditor />


 
  </div>
);



};

export default App;
