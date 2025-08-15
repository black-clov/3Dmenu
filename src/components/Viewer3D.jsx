import React, { useEffect, useRef, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DataContext } from "../Context/DataContext";

export default function Viewer3D() {
    const { categoryId, businessId, itemId } = useParams();
    const mountRef = useRef(null);
    const { items } = useContext(DataContext);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showInfo, setShowInfo] = useState(true);
    const navigate = useNavigate();
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const modelRef = useRef(null);
    const rendererRef = useRef(null);

    const manualCamera = { position: { x: 0, y: 1, z: 3 }, rotation: { x: 0, y: 0, z: 0 } };

    const presets = {
        front: { x: 0, y: 1, z: 3 },
        side: { x: 3, y: 1, z: 0 },
        top: { x: 0, y: 5, z: 0.01 }
    };

    const moveCameraToPreset = (preset) => {
        if (!cameraRef.current) return;
        cameraRef.current.position.set(preset.x, preset.y, preset.z);
        cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
        controlsRef.current.update();
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) mountRef.current.requestFullscreen();
        else document.exitFullscreen();
    };

    const shareWhatsApp = () => {
        const url = window.location.href;
        const text = `Check out this 3D model: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    const captureVideo = async () => {
        if (!rendererRef.current || !modelRef.current) return;

        const stream = rendererRef.current.domElement.captureStream(30); // 30 fps
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        const chunks = [];

        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "3d_rotation.webm";
            link.click();
        };

        recorder.start();

        // rotate model for 7 seconds
        const duration = 7000; // 7 sec
        const startTime = performance.now();

        const animateVideo = (time) => {
            const elapsed = time - startTime;
            if (elapsed < duration) {
                if (modelRef.current) modelRef.current.rotation.y += 0.01;
                requestAnimationFrame(animateVideo);
            } else {
                recorder.stop();
            }
        };
        requestAnimationFrame(animateVideo);
    };

    useEffect(() => {
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(manualCamera.position.x, manualCamera.position.y, manualCamera.position.z);
        camera.rotation.set(manualCamera.rotation.x, manualCamera.rotation.y, manualCamera.rotation.z);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 5, 5);
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 0.5;
        controls.panSpeed = 0.5;
        controls.enablePan = true;
        controlsRef.current = controls;

        const loader = new GLTFLoader();
        loader.load(
            item.glb,
            (gltf) => {
                modelRef.current = gltf.scene;
                scene.add(modelRef.current);

                const box = new THREE.Box3().setFromObject(modelRef.current);
                const center = box.getCenter(new THREE.Vector3());
                modelRef.current.position.sub(center);

                setLoading(false);
            },
            (xhr) => {
                const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
                setProgress(percentComplete);
            },
            (error) => {
                console.error("Failed to load model:", error);
                setLoading(false);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            if (modelRef.current) modelRef.current.rotation.y += 0.002;
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            controls.dispose();
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        };
    }, [itemId, items]);

    return (
        <div className="flex flex-col items-center p-4">
        <div><p></p></div>
            <div className="px-4 mt-6 mb-4">
                <button
                    onClick={() => { navigate(`/category/${categoryId}/business/${businessId}`); window.location.reload(); }}
                    className="btn-back"
                    style={{
                        minHeight: "45px",
                        marginBottom: "28px",
                        width: "211px",
                        backgroundColor: "rgba(248, 121, 104, 1)"
                    }}
                >
                    <span className="text-2xl">←</span>
                    <span>Back to Items</span>
                </button>
            </div>

            <div className="controls-container">
                <button onClick={() => moveCameraToPreset(presets.front)} className="btn-control">Front</button>
                <button onClick={() => moveCameraToPreset(presets.side)} className="btn-control">Side</button>
                <button onClick={() => moveCameraToPreset(presets.top)} className="btn-control">Top</button>
                <button onClick={toggleFullScreen} className="btn-control btn-fullscreen">Full Screen</button>
                <button onClick={() => setShowInfo(!showInfo)} className="btn-control btn-info">{showInfo ? "Hide Info" : "Show Info"}</button>
                <button onClick={captureVideo} className="btn-control btn-screenshot">Screenshot Video</button>
                <button onClick={shareWhatsApp} className="btn-control btn-share">Share</button>
            </div>

            <div style={{ position: "relative", width: "100%", maxWidth: "900px", height: "500px" }}>
                {loading && (
                    <div className="loader-overlay">
                        <div className="loader"></div>
                        <div className="mt-2 text-lg font-semibold">{progress}%</div>
                    </div>
                )}
                <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
                {showInfo && (
                    <div className="info-overlay">
                        <h3>{items.find(i => i.id === itemId)?.name}</h3>
                        <p>{items.find(i => i.id === itemId)?.description}</p>
                    </div>
                )}
            </div>

            <style>
                {`
                .loader-overlay {
                    position: absolute; inset: 0;
                    background: rgba(255,255,255,0.8);
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center; z-index: 10;
                }
                .loader { border: 6px solid #f3f3f3; border-top: 6px solid #3498db;
                    border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                .btn-back { width: 211px; min-height: 45px; margin-bottom: 28px; padding: 12px;
                    background-color: rgba(248,121,104,1); color: white; font-weight: bold; font-size: 18px;
                    border-radius: 12px; display: flex; justify-content: center; align-items: center; gap: 8px;
                    transition: all 0.3s; box-shadow: 0 6px 12px rgba(0,0,0,0.2); }
                .btn-back:hover { background-color: rgba(230,90,80,1); }

                .controls-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-top: 16px; margin-bottom: 16px; }
                .btn-control { padding: 10px 16px; background-color: #3b82f6; color: white; font-weight: 600; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s; }
                .btn-control:hover { background-color: #2563eb; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
                .btn-fullscreen { background-color: #10b981; } .btn-fullscreen:hover { background-color: #059669; }
                .btn-info { background-color: #6b7280; } .btn-info:hover { background-color: #4b5563; }
                .btn-screenshot { background-color: #f59e0b; } .btn-screenshot:hover { background-color: #d97706; }
                .btn-share { background-color: #8b5cf6; } .btn-share:hover { background-color: #7c3aed; }

                .info-overlay { position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); padding: 12px; border-radius: 12px; max-width: 250px; font-size: 14px; color: #111; }
                `}
            </style>
        </div>
    );
}
