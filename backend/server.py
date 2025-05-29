
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
import uvicorn

app = FastAPI()

# Enable CORS so frontend can access this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GraphData(BaseModel):
    nodes: List[int]
    edges: List[List[int]]  # each edge is [source, target]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Graph Spectrum API"}

@app.post("/get_spectrum")
def get_spectrum(data: GraphData):
    n = len(data.nodes)
    A = np.zeros((n, n))

    for src, tgt in data.edges:
        A[src, tgt] = 1
        A[tgt, src] = 1  # undirected

    # Degree matrix
    D = np.diag(A.sum(axis=1))
    # Unnormalized Laplacian
    L = D - A

    # Normalized Laplacian
    with np.errstate(divide='ignore'):
        D_inv_sqrt = np.diag(1.0 / np.sqrt(np.diag(D)))
    D_inv_sqrt[np.isinf(D_inv_sqrt)] = 0  # handle divide-by-zero for isolated nodes
    L_norm = np.eye(n) - D_inv_sqrt @ A @ D_inv_sqrt

    # Eigendecompositions
    def compute_eigh(M, reverse = False):
        vals, vecs = np.linalg.eigh(M)
        if reverse:
            idx = np.argsort(vals)[::-1]  # Sort by descending eigenvalue        
            vals = vals[idx]
            vecs = vecs[:, idx]
        return vals.tolist(), vecs.tolist()  # Transpose to get rows = eigenvectors


    adj_vals, adj_vecs = compute_eigh(A, reverse=True)
    lap_vals, lap_vecs = compute_eigh(L)
    norm_vals, norm_vecs = compute_eigh(L_norm)

    output = {
            "adjacency": {
                "eigenvalues": adj_vals,
                "eigenvectors": adj_vecs,
                "matrix":A,
            },
            "laplacian": {
                "eigenvalues": lap_vals,
                "eigenvectors": lap_vecs,
            },
            "normalized_laplacian": {
                "eigenvalues": norm_vals,
                "eigenvectors": norm_vecs,
            },
        }
    print(output)
    return output


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
