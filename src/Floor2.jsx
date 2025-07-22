// src/Floor1.jsx (for example, for /floor1)
import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { dijkstra } from "./Dijkstra";
import nodesData from "./nodes_connections_floor2.json"; // simpler JSON data for floor1
import "./styles.css";

const connections = nodesData.connections;

const getInitialNodes = () => {
    const nodes = {};
    for (const key in nodesData.nodes) {
        nodes[key] = {
            position: nodesData.nodes[key],
            rotation: [0, 0, 0],
        };
    }
    return nodes;
};

export default function Floor1() {
    const [nodesState] = useState(getInitialNodes);
    const [startNode, setStartNode] = useState("Acceuil");
    const [endNode, setEndNode] = useState("Hallway1");
    const [path, setPath] = useState([]);

    const nodesForDijkstra = useMemo(() => {
        const out = {};
        for (const key in nodesState) {
            out[key] = nodesState[key].position;
        }
        return out;
    }, [nodesState]);

    const findPath = () => {
        const computedPath = dijkstra(startNode, endNode, nodesForDijkstra, connections);
        setPath(computedPath);
    };

    function FloorModel() {
        const { scene } = useGLTF("/floor2.glb");
        return <primitive object={scene} />;
    }

    function NodeMarkers({ nodes }) {
        return (
            <>
                {Object.entries(nodes).map(([name, { position, rotation }]) => (
                    <mesh key={name} position={position} rotation={rotation}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color="orange" />
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
                <lineBasicMaterial color="hotpink" linewidth={3} />
            </line>
        );
    }

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            {/* Navigation UI Panel */}
            <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1, background: "#fff", padding: "10px", borderRadius: "4px" }}>
                <h3>Navigation 2er étage</h3>
                <div>
                    <label>Start Node: </label>
                    <select value={startNode} onChange={(e) => setStartNode(e.target.value)}>
                        {Object.keys(nodesState).map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>End Node: </label>
                    <select value={endNode} onChange={(e) => setEndNode(e.target.value)}>
                        {Object.keys(nodesState).map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <button onClick={findPath} style={{ marginTop: "10px" }}>Find Path</button>
            </div>
            <Canvas camera={{ position: [-7.16, 28.27, -0.02], fov: 70 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <OrbitControls />
                <group position={[0, 4, 0]}>
                    <FloorModel />
                    <NodeMarkers nodes={nodesState} />
                    {path.length >= 2 && <PathLine path={path} nodes={nodesForDijkstra} />}
                </group>
            </Canvas>
        </div>
    );
}
