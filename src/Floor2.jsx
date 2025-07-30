import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { dijkstra } from "./Dijkstra";
import nodesData from "./nodes_connections_floor0.json";
import "./styles.css";
import { useNavigate, useLocation } from "react-router-dom";

const connections = nodesData.connections;

const hiddenNodes = new Set([
    "Hallway1", "Hallway2", "parent_s1", "parent_ss1", "unkown_floor0_1", "parent_s2", "unkown_floor0_2",
    "Hallway3", "Hallway4", "Hallway5", "Hallway6", "Hallway7", "parent_s3", "unkown_floor0_3",
    "Hallway8", "parent_s4", "Hallway9", "parent_s5", "parent_ss5", ""
]);

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

function FloorModel({ onLoaded }) {
    const { scene } = useGLTF("/floor0.glb");

    // Notify parent when model is loaded
    useEffect(() => {
        if (onLoaded) onLoaded();
    }, [onLoaded]);

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
        const nextT = (t + 0.005) % 1;
        setT(nextT);

        if (markerRef.current) {
            const point = curve.getPointAt(nextT);
            markerRef.current.position.copy(point);
        }

        const scale = 1 + 0.3 * Math.sin(clock.getElapsedTime() * 3);
        if (startRef.current) startRef.current.scale.set(scale, scale, scale);
        if (endRef.current) endRef.current.scale.set(scale, scale, scale);
    });

    useEffect(() => {
        setT(0);
    }, [path]);

    if (path.length < 2) return null;

    return (
        <>
            <mesh ref={tubeRef}>
                <tubeGeometry args={[curve, 100, 0.05, 8, false]} />
                <meshStandardMaterial color="white" />
            </mesh>

            <mesh ref={markerRef}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="red" emissive="red" emissiveIntensity={1} />
            </mesh>

            <mesh ref={startRef} position={nodes[path[0]]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.8} />
            </mesh>

            <mesh ref={endRef} position={nodes[path[path.length - 1]]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="green" emissive="green" emissiveIntensity={0.8} />
            </mesh>
        </>
    );
}

export default function Floor0() {
    const [nodesState] = useState(getInitialNodes);
    const [startNode, setStartNode] = useState("Escalier1 1er & 2éme étage");
    const [endNode, setEndNode] = useState("Acceuil");
    const [path, setPath] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Using useProgress to detect loading
    const { active, progress } = useProgress();

    // Show loading spinner while active and progress < 100
    const loading = active && progress < 100;

    // Multi-floor continuation
    const [continueTo, setContinueTo] = useState(null);
    const [finalEnd, setFinalEnd] = useState(null);

    const controlsRef = useRef();

    const nodesForDijkstra = useMemo(() => {
        const out = {};
        for (const key in nodesState) {
            out[key] = nodesState[key].position;
        }
        return out;
    }, [nodesState]);

    const findPath = () => {
        if (!startNode || !endNode) {
            setPath([]);
            return;
        }
        const computedPath = dijkstra(startNode, endNode, nodesForDijkstra, connections);
        setPath(computedPath);
    };

    // Parse URL parameters on mount and location change
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const start = searchParams.get("start");
        const end = searchParams.get("end");
        const continueToParam = searchParams.get("continueTo");
        const finalEndParam = searchParams.get("finalEnd");

        if (start && nodesData.nodes[start]) setStartNode(start);
        if (end && nodesData.nodes[end]) setEndNode(end);
        if (continueToParam) setContinueTo(continueToParam);
        if (finalEndParam) setFinalEnd(finalEndParam);
    }, [location.search]);

    // Recalculate path when start or end nodes change
    useEffect(() => {
        findPath();
    }, [startNode, endNode]);

    const resetView = () => {
        if (controlsRef.current) {
            const cam = controlsRef.current.object;
            cam.position.set(-7.16, 28.27, -0.02);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    };

    const handleContinueNavigation = () => {
        if (!continueTo || !finalEnd) return;

        try {
            const url = new URL(continueTo, window.location.origin);
            url.searchParams.set("end", finalEnd);
            navigate(url.pathname + url.search);
        } catch (error) {
            console.error("Invalid continueTo URL:", continueTo);
        }
    };

    return (
        <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
            {/* Loading spinner overlay */}
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(255,255,255,0.85)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 100,
                    }}
                >
                    <div className="spinner" />
                </div>
            )}

            {/* Header displaying start → end nodes */}
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    background: "#ffffffee",
                    padding: "14px 24px",
                    borderRadius: "10px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontWeight: "600",
                    color: "#333",
                    maxWidth: "90%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "10px",
                }}
            >
                <span style={{ color: "#1976d2" }}>{startNode || "Start"}</span>
                <span style={{ fontSize: "20px" }}>➡️</span>
                <span
                    style={{
                        color: "#d32f2f",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    {endNode || "End"}

                    {/* Animated Stairs Arrow Icon (only if going to next floor) */}
                    {continueTo && finalEnd && (
                        <span
                            style={{
                                display: "inline-block",
                                animation: "bounce 1s infinite",
                                fontSize: "20px",
                                color: "#ff5722",
                            }}
                            title="Go Upstairs"
                        >
                            ⬆️
                        </span>
                    )}
                </span>
            </div>

            {/* Continue Navigation Button */}
            {continueTo && finalEnd && (
                <button
                    onClick={handleContinueNavigation}
                    style={{
                        position: "absolute",
                        bottom: 80,
                        right: 20,
                        zIndex: 20,
                        padding: "12px 20px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#ff9800",
                        color: "white",
                        cursor: "pointer",
                        boxShadow: "0 3px 7px rgba(0,0,0,0.3)",
                        userSelect: "none",
                    }}
                >
                    ➡️ Continue Navigation
                </button>
            )}

            {/* 3D Canvas */}
            <Canvas camera={{ position: [-7.16, 28.27, -0.02], fov: 70 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <OrbitControls ref={controlsRef} />
                <group position={[0, 4, 0]}>
                    <FloorModel onLoaded={() => { }} />
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

            {/* Styles */}
            <style>{`
        .spinner {
          border: 6px solid #eee;
          border-top: 6px solid #1976d2;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
        </div>
    );
}
