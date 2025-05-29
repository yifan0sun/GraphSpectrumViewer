# Graph Spectral Visualizer

A web-based interactive tool to explore graph structure through spectral embeddings and eigenvalue analysis.

**Live Demo**: [yifan0sun.github.io/GraphSpectrumViewer](https://yifan0sun.github.io/GraphSpectrumViewer)

---

## 🌟 Overview

**Graph Spectral Visualizer** helps users build graphs and analyze their structural properties using spectral graph theory. By computing the eigenvalues and eigenvectors of key matrices (adjacency, Laplacian, and normalized Laplacian), this tool reveals clusters, bottlenecks, and latent geometry.

---

## 🛠 Features

### 🎨 Graph Editor (left panel)

Use the buttons to construct your graph:

* **Add Node**: Creates a new node near the last node.
* **Delete Node**: Removes the selected node and all its edges.
* **Select Edge**: Click an edge to highlight it.
* **Delete Edge**: Removes the selected edge.
* **Recompute**: Computes spectrum and eigenvectors for all three matrices.

### 📈 Spectrum & Embedding (right panel)

Tabs allow you to:

* **View eigenvalue spectra** for the selected matrix.
* **Plot node embeddings** using selected eigenvectors (e.g. eigenvector 1 vs 2).
* **Switch matrix type** between adjacency, Laplacian, and normalized Laplacian.

Use the input boxes to select which eigenvectors to plot (1 = largest or smallest depending on matrix).

---

## ⚙️ Technical Stack

* **Frontend**: React + Plotly.js + TypeScript
* **Backend**: FastAPI (Python), NumPy for eigendecomposition
* **Hosting**: GitHub Pages (frontend), Render (backend)

---

## 🔬 Limitations

* Currently supports **unweighted** undirected graphs.
* No layout or clustering algorithms — embeddings rely solely on eigenvectors.

---

## 📬 Contact

Built by **Yifan Sun**
Email: `yifan dot sun at stonybrook dot edu`
Website: [optimalvisualizer.com](http://optimalvisualizer.com)

---

## 🚀 Feedback & Contributions

If you spot a bug or have ideas, submit an issue or suggestion at the repo.
This is an evolving research tool — feedback is always welcome!
