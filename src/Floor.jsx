import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { dijkstra } from "./Dijkstra";
import nodesData from "./nodes_connections_floor0.json";
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

function FloorModel() {
    const { scene } = useGLTF("/floor0.glb");
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
    const curve = useMemo(() => {
        const points = path.map((node) => new THREE.Vector3(...nodes[node]));
        return new THREE.CatmullRomCurve3(points);
    }, [path, nodes]);

    const tubeRef = useRef();
    const markerRef = useRef();
    const startRef = useRef();
    const endRef = useRef();
    const [t, setT] = useState(0);

    useFrame(({ clock }) => {
        const nextT = (t + 0.005) % 1; // loop 0->1
        setT(nextT);

        // Move yellow marker along the path
        if (markerRef.current) {
            const point = curve.getPointAt(nextT);
            markerRef.current.position.copy(point);
        }

        // Pulsate scale animation for start and end spheres
        const scale = 1 + 0.3 * Math.sin(clock.getElapsedTime() * 3);
        if (startRef.current) startRef.current.scale.set(scale, scale, scale);
        if (endRef.current) endRef.current.scale.set(scale, scale, scale);
    });

    useEffect(() => {
        setT(0); // restart animation when path changes
    }, [path]);

    if (path.length < 2) return null;

    return (
        <>
            {/* Path Tube */}
            <mesh ref={tubeRef}>
                <tubeGeometry args={[curve, 100, 0.05, 8, false]} />
                <meshStandardMaterial color="green" />
            </mesh>

            {/* Moving Marker */}
            <mesh ref={markerRef}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={1} />
            </mesh>

            {/* Start Sign (green, pulsating) */}
            <mesh ref={startRef} position={nodes[path[0]]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="green" emissive="green" emissiveIntensity={0.8} />
            </mesh>

            {/* End Sign (red, pulsating) */}
            <mesh ref={endRef} position={nodes[path[path.length - 1]]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.8} />
            </mesh>
        </>
    );
}

export default function Floor0() {
    const [nodesState] = useState(getInitialNodes);
    const [startNode, setStartNode] = useState("Acceuil");
    const [endNode, setEndNode] = useState("Hallway1");
    const [path, setPath] = useState([]);

    // Ref for OrbitControls to reset camera
    const controlsRef = useRef();

    // Prepare nodes for Dijkstra
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

    // Read URL params on mount
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const start = searchParams.get("start");
        const end = searchParams.get("end");
        if (start && nodesData.nodes[start]) {
            setStartNode(start);
        }
        if (end && nodesData.nodes[end]) {
            setEndNode(end);
        }
    }, []);

    // Auto-find path when start or end changes
    useEffect(() => {
        findPath();
    }, [startNode, endNode]);

    // Reset camera and controls target
    const resetView = () => {
        if (controlsRef.current) {
            const cam = controlsRef.current.object;
            cam.position.set(-7.16, 28.27, -0.02);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    };

    return (
        <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
            {/* UI Controls */}
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    zIndex: 10,
                    background: "#ffffffee",
                    padding: "12px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    width: "260px",
                }}
            >
                <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>Navigation Rez de Chaussée</h3>

                <label style={{ fontSize: "14px" }}>Start Node:</label>
                <select
                    value={startNode}
                    onChange={(e) => setStartNode(e.target.value)}
                    style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
                >
                    {Object.keys(nodesState).map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>

                <label style={{ fontSize: "14px" }}>End Node:</label>
                <select
                    value={endNode}
                    onChange={(e) => setEndNode(e.target.value)}
                    style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
                >
                    {Object.keys(nodesState).map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={findPath}
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Find Path
                </button>
            </div>

            {/* 3D Canvas */}
            <Canvas camera={{ position: [-7.16, 28.27, -0.02], fov: 70 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <OrbitControls ref={controlsRef} />
                <group position={[0, 4, 0]}>
                    <FloorModel />
                    <NodeMarkers nodes={nodesState} />
                    {path.length >= 2 && <AnimatedTube path={path} nodes={nodesForDijkstra} />}
                </group>
            </Canvas>

            {/* Reset View Button */}
            <button
                onClick={resetView}
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    zIndex: 20,
                    padding: "10px 15px",
                    fontSize: "14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#28a745",
                    color: "white",
                    cursor: "pointer",
                    boxShadow: "0 3px 7px rgba(0,0,0,0.3)",
                    userSelect: "none",
                }}
            >
                🔄 Reset View
            </button>
        </div>
    );
}
