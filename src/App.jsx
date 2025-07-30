import React, { useState, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { dijkstra } from "./Dijkstra";
import initialNodesData from "./nodes_connections_floor1.json";
import "./styles.css";

const connections = initialNodesData.connections;

const getInitialNodes = () => {
  const nodes = {};
  for (const key in initialNodesData.nodes) {
    nodes[key] = {
      position: initialNodesData.nodes[key],
      rotation: [0, 0, 0],
      scale: [1, 1, 1], // ⬅️ Added scale
    };
  }
  return nodes;
};

export default function App() {
  const [nodesState, setNodesState] = useState(getInitialNodes);
  const [startNode, setStartNode] = useState("Entrée 1er étage_0");
  const [endNode, setEndNode] = useState("Entrée 1er étage_1");
  const [path, setPath] = useState([]);

  const [selectedEditNode, setSelectedEditNode] = useState(Object.keys(nodesState)[0] || "");
  const [editPos, setEditPos] = useState(nodesState[selectedEditNode].position);
  const [editRot, setEditRot] = useState(nodesState[selectedEditNode].rotation);
  const [editScale, setEditScale] = useState(nodesState[selectedEditNode].scale);

  const [clickedPos, setClickedPos] = useState(null);

  const nodesForDijkstra = useMemo(() => {
    const out = {};
    for (const key in nodesState) {
      out[key] = nodesState[key].position;
    }
    return out;
  }, [nodesState]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startParam = params.get("start");
    if (startParam && nodesState[startParam]) {
      setStartNode(startParam);
    }
  }, [nodesState]);

  const updateNodeFromInputs = (nodeName, newPos, newRot, newScale) => {
    setNodesState((prev) => ({
      ...prev,
      [nodeName]: {
        position: newPos,
        rotation: newRot,
        scale: newScale,
      },
    }));
  };

  const handleSelectEditNode = (e) => {
    const nodeName = e.target.value;
    setSelectedEditNode(nodeName);
    setEditPos(nodesState[nodeName].position);
    setEditRot(nodesState[nodeName].rotation);
    setEditScale(nodesState[nodeName].scale);
  };

  const handlePosChange = (axis, value) => {
    const newPos = editPos.map((val, idx) =>
      idx === axis ? parseFloat(value) || 0 : val
    );
    setEditPos(newPos);
    updateNodeFromInputs(selectedEditNode, newPos, editRot, editScale);
  };

  const handleRotChange = (axis, value) => {
    const newRot = editRot.map((val, idx) =>
      idx === axis ? parseFloat(value) || 0 : val
    );
    setEditRot(newRot);
    updateNodeFromInputs(selectedEditNode, editPos, newRot, editScale);
  };

  const adjustScale = (delta) => {
    const newScale = editScale.map((s) => Math.max(0.1, s + delta));
    setEditScale(newScale);
    updateNodeFromInputs(selectedEditNode, editPos, editRot, newScale);
  };

  const findPath = () => {
    setPath([]);
    const computedPath = dijkstra(startNode, endNode, nodesForDijkstra, connections);
    console.log("Computed Path:", computedPath);
    setPath(computedPath);
  };

  const saveToFile = () => {
    const exportData = {
      nodes: {},
      connections: connections,
    };
    for (const [name, { position }] of Object.entries(nodesState)) {
      exportData.nodes[name] = position;
    }
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nodes_connections_floor1.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function FloorModel() {
    const { scene } = useGLTF("/floor1.glb");
    return <primitive object={scene} />;
  }

  function NodeMarkers({ nodes, onNodeClick }) {
    return (
      <>
        {Object.entries(nodes).map(([name, { position, rotation, scale }]) => (
          <mesh
            key={name}
            position={position}
            rotation={rotation}
            scale={scale}
            onClick={(e) => {
              e.stopPropagation();
              onNodeClick(e.point);
            }}
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
        ))}
      </>
    );
  }

  function PathLine({ path, nodes }) {
    const positions = useMemo(() => {
      const pts = [];
      path.forEach((nodeName) => {
        const pos = nodes[nodeName];
        if (pos) pts.push(...pos);
      });
      return new Float32Array(pts);
    }, [path, nodes]);

    if (!positions || positions.length < 6) return null;

    return (
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="hotpink" />
      </line>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1,
          background: "#fff",
          padding: "10px",
          borderRadius: "4px",
          maxWidth: "300px",
        }}
      >
        <h3>Navigation for Floor0</h3>
        <div>
          <label>Start Node: </label>
          <select value={startNode} onChange={(e) => setStartNode(e.target.value)}>
            {Object.keys(nodesState).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>End Node: </label>
          <select value={endNode} onChange={(e) => setEndNode(e.target.value)}>
            {Object.keys(nodesState).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={findPath}>Find Path</button>

        <hr style={{ margin: "10px 0" }} />

        <h3>Edit Node</h3>
        <div>
          <label>Select Node: </label>
          <select value={selectedEditNode} onChange={handleSelectEditNode}>
            {Object.keys(nodesState).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: "5px" }}>
          <strong>Position:</strong>
          <div>
            <label>X: </label>
            <input
              type="number"
              value={editPos[0]}
              onChange={(e) => handlePosChange(0, e.target.value)}
              style={{ width: "60px" }}
            />
            <label> Y: </label>
            <input
              type="number"
              value={editPos[1]}
              onChange={(e) => handlePosChange(1, e.target.value)}
              style={{ width: "60px" }}
            />
            <label> Z: </label>
            <input
              type="number"
              value={editPos[2]}
              onChange={(e) => handlePosChange(2, e.target.value)}
              style={{ width: "60px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "5px" }}>
          <strong>Rotation:</strong>
          <div>
            <label>X: </label>
            <input
              type="number"
              value={editRot[0]}
              onChange={(e) => handleRotChange(0, e.target.value)}
              style={{ width: "60px" }}
            />
            <label> Y: </label>
            <input
              type="number"
              value={editRot[1]}
              onChange={(e) => handleRotChange(1, e.target.value)}
              style={{ width: "60px" }}
            />
            <label> Z: </label>
            <input
              type="number"
              value={editRot[2]}
              onChange={(e) => handleRotChange(2, e.target.value)}
              style={{ width: "60px" }}
            />
          </div>
        </div>

        {/* Scale Controls */}
        <div style={{ marginTop: "10px" }}>
          <strong>Scale:</strong>
          <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
            <button onClick={() => adjustScale(0.1)}>+ Increase Scale</button>
            <button onClick={() => adjustScale(-0.1)}>- Decrease Scale</button>
          </div>
        </div>

        <button onClick={saveToFile} style={{ marginTop: "10px" }}>
          Save changes
        </button>

        <hr style={{ margin: "10px 0" }} />
        <h3>Last Clicked Point</h3>
        {clickedPos ? (
          <div>
            X: {clickedPos.x.toFixed(2)}, Y: {clickedPos.y.toFixed(2)}, Z: {clickedPos.z.toFixed(2)}
          </div>
        ) : (
          <div>Click a node to see its coordinates</div>
        )}
      </div>

      {/* Canvas */}
      <Canvas camera={{ fov: 70, position: [0, 2, 8] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <OrbitControls />
        <FloorModel />
        <NodeMarkers
          nodes={nodesState}
          onNodeClick={(point) => setClickedPos(point)}
        />
        {path.length > 0 && <PathLine path={path} nodes={nodesForDijkstra} />}
      </Canvas>
    </div>
  );
}
