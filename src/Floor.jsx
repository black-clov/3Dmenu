// src/Floor1.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { dijkstra } from "./Dijkstra";
import nodesData from "./nodes_connections_floor.json";
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
        const { scene } = useGLTF("/floor0_up7.glb");
        return <primitive object={scene} />;
    }

    function NodeMarkers({ nodes }) {
        return (
            <>
                {Object.entries(nodes).map(([name, { position, rotation }]) => (
                    <mesh key={name} position={position} rotation={rotation}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color="black" />
                    </mesh>
                ))}
            </>
        );
    }

    function AnimatedTube({ path, nodes }) {
        const ref = useRef();
        const [drawLength, setDrawLength] = useState(0);

        const curve = useMemo(() => {
            const points = path.map((node) => new THREE.Vector3(...nodes[node]));
            return new THREE.CatmullRomCurve3(points);
        }, [path, nodes]);

        const geometry = useMemo(() => {
            if (path.length < 2) return null;
            return new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
        }, [curve]);

        useFrame(() => {
            if (geometry && drawLength < 1) {
                setDrawLength((prev) => Math.min(prev + 0.005, 1)); // slower animation
            }
        });

        useEffect(() => {
            setDrawLength(0); // reset on new path
        }, [path]);

        if (!geometry) return null;

        const drawCount = Math.floor(geometry.attributes.position.count * drawLength);

        return (
            <line ref={ref}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={geometry.attributes.position.array}
                        count={drawCount}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="hotpink" linewidth={3} />
            </line>
        );
    }

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1, background: "#fff", padding: "10px", borderRadius: "4px" }}>
                <h3>Navigation Rez de Chaussée</h3>
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
                    {path.length >= 2 && <AnimatedTube path={path} nodes={nodesForDijkstra} />}
                </group>
            </Canvas>
        </div>
    );
}



