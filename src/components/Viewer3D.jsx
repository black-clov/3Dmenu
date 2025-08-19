import React, { useEffect, useRef, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DataContext, useData } from "../Context/DataContext";
import gsap from "gsap";
import showGif from "./rotate.gif";
import show2Gif from "./zoom.gif";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUp, FiArrowLeft, FiArrowRight, FiMaximize } from "react-icons/fi";

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
    const { businesses } = useContext(DataContext);
    const business = businesses.find(b => b.id === businessId);
    const { trackEvent } = useData();



    const initialCamera = { x: 0, y: 1, z: 3 };
    const initialTarget = new THREE.Vector3(0, 0, 0);

    const presets = {
        front: { x: 0, y: 1, z: 3 },
        side: { x: 3, y: 1, z: 0 },
        top: { x: 0, y: 5, z: 0.01 },
    };

    // Simple analytics logger
    const logEvent = (action, label) => {
        console.log(`[Analytics] Action: ${action}, Label: ${label}`);
        // TODO: Replace console.log with your analytics provider call, e.g., Google Analytics, Mixpanel, etc.
        // Example GA4:
        // gtag('event', action, { event_label: label });
    };

    const animateCameraTo = (targetPos, extraForwardDistance = 0) => {
        if (!cameraRef.current || !controlsRef.current) return;
        const timeline = gsap.timeline();
        timeline.to(cameraRef.current.position, {
            x: initialCamera.x,
            y: initialCamera.y,
            z: initialCamera.z,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => controlsRef.current.update(),
        });
        timeline.to(
            controlsRef.current.target,
            {
                x: initialTarget.x,
                y: initialTarget.y,
                z: initialTarget.z,
                duration: 0.8,
                ease: "power2.inOut",
                onUpdate: () => controlsRef.current.update(),
            },
            "<"
        );
        timeline.to(cameraRef.current.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => controlsRef.current.update(),
        });
        timeline.to(
            controlsRef.current.target,
            {
                x: initialTarget.x,
                y: initialTarget.y,
                z: initialTarget.z,
                duration: 1.2,
                ease: "power2.inOut",
                onUpdate: () => controlsRef.current.update(),
            },
            "<"
        );

        if (extraForwardDistance > 0) {
            const direction = new THREE.Vector3();
            direction.subVectors(initialTarget, targetPos).normalize();
            timeline.to(cameraRef.current.position, {
                x: cameraRef.current.position.x + direction.x * extraForwardDistance,
                y: cameraRef.current.position.y + direction.y * extraForwardDistance,
                z: cameraRef.current.position.z + direction.z * extraForwardDistance,
                duration: 0.8,
                ease: "power2.inOut",
                onUpdate: () => controlsRef.current.update(),
            });
        }
    };

    const moveCameraToPreset = (preset) => {
        logEvent("camera_move", `to ${JSON.stringify(preset)}`);
        animateCameraTo(preset);
    };

    const toggleFullScreen = () => {
        logEvent("fullscreen_toggle", document.fullscreenElement ? "exit" : "enter");
        if (!document.fullscreenElement) {
            if (mountRef.current.requestFullscreen) {
                mountRef.current.requestFullscreen();
            } else if (mountRef.current.webkitRequestFullscreen) { // Safari
                mountRef.current.webkitRequestFullscreen();
            } else if (mountRef.current.msRequestFullscreen) { // IE11
                mountRef.current.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { // Safari
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE11
                document.msExitFullscreen();
            }
        }
    };

    const shareWhatsApp = () => {
        if (!business) return;

        // Track the share event
        trackEvent("Share Click", {
            platform: "WhatsApp",
            businessId: business.id,
            name: business.name,
            itemId: item.name

        });

        // Prepare WhatsApp URL
        const url = window.location.href;
        const text = `Découvrez ${business.name} en 3D : ${url}`;
        const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

        // Open WhatsApp share
        window.open(whatsappURL, "_blank");
    };

    const captureVideo = async () => {
        if (!rendererRef.current || !modelRef.current) return;
        const stream = rendererRef.current.domElement.captureStream(30);
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "3d_rotation.webm";
            link.click();
        };
        recorder.start();

        const duration = 7000;
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
        const item = items.find((i) => i.id === itemId);
        if (!item) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);

        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(initialCamera.x, initialCamera.y, initialCamera.z);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 0.6;
        controls.panSpeed = 0.5;

        // <-- Add these lines to limit zoom in/out -->
        controls.minDistance = 1.5;   // Minimum distance to the target (can't zoom closer than this)
        controls.maxDistance = 5;     // Maximum distance from the target (can't zoom farther than this)

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
                if (xhr.total) {
                    setProgress(Math.min(Math.round((xhr.loaded / xhr.total) * 100), 100));
                } else {
                    setProgress(0); // or keep spinning loader
                }
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

        const handleResize = () => {
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            controls.dispose();
            window.removeEventListener("resize", handleResize);
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        };
    }, [itemId, items]);

    const item = items.find((i) => i.id === itemId);

    return (
        <div className="viewer3d-container">
            <div className="back-button-container">
                <button onClick={() => {
                    navigate(`/category/${categoryId}/business/${businessId}`);
                    window.location.reload();
                }} className="back-button">
                    <span className="arrow">←</span>
                    <span>Retour</span>
                </button>
            </div>

            <div className="controls-container">
                {/* First row of buttons */}
                <div className="button-row">
                    <button onClick={() => moveCameraToPreset(presets.front)} className="btn-control">Face</button>
                    <button onClick={() => moveCameraToPreset(presets.side)} className="btn-control">Côté</button>
                    <button onClick={() => moveCameraToPreset(presets.top)} className="btn-control">Dessus</button>
                </div>

                {/* Single centered button */}
                <div className="button-row centered-button">
                    <button onClick={toggleFullScreen} className="btn-control btn-fullscreen flex items-center gap-2">
                        <FiMaximize size={18} /> Plein écran
                    </button>
                </div>
                {/* Other buttons centered */}
                <div className="button-row centered-button">
                    <button onClick={shareWhatsApp} className="btn-control btn-share flex items-center gap-2">
                        <FaWhatsapp size={18} /> 
                        Partager
                    </button>
                </div>
            </div>

            <div className="viewer-wrapper">
                {loading && (
                    <div className="loader-overlay">
                        <div className="loader"></div>
                        <div className="progress-text">{progress}%</div>
                    </div>
                )}
                <div ref={mountRef} className="viewer-mount" />
                {showInfo && item && (
                    <div className="info-overlay">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                    </div>
                )}
                <img src={showGif} alt="animation" className="gif-overlay-left" />
                <img src={show2Gif} alt="animation" className="gif-overlay-right" />
            </div>

            <style>{`
        html, body, #root { height: 100%; margin: 0; }
        *, *::before, *::after { box-sizing: border-box; }

        .viewer3d-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          background: #f9fafb;
          height: 100vh;
          overflow: hidden;
        }

        .back-btn-wrapper { margin: 0; width: 100%; display: flex; justify-content: center; }
        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background-color: #f87968;
          color: white;
          font-weight: 600;
          font-size: 18px;
          border-radius: 12px;
          transition: all 0.3s;
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        .btn-back:hover { background-color: #f65a48; transform: translateY(-2px); }

        .controls-container {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin: 4px 0;
        }

        .btn-control {
          padding: 10px 18px;
          background: #000000ff;
          color: white;
          font-weight: 600;
          border-radius: 9999px;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .btn-control:hover { background: black; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.25); }
        .btn-fullscreen { background: #c0c0c0ff; } .btn-fullscreen:hover { background: #c0c0c0ff; }
        .btn-info { background: #6b7280; } .btn-info:hover { background: #4b5563; }
        .btn-screenshot { background: #f59e0b; } .btn-screenshot:hover { background: #d97706; }
        .btn-share { background: #059669; } .btn-share:hover { background: #059669; }

        .viewer-wrapper {
          position: relative;
          width: 100%;
          flex-grow: 1;
          border-radius: 16px;
          overflow: hidden;
          background: #e5e7eb;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }

        .viewer-mount { width: 100%; height: 100%; }

        .loader-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 16px;
        }
        .loader { border: 6px solid #f3f3f3; border-top: 6px solid #ebebebff; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin-bottom: 12px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .progress-text { font-weight: 600; color: #111827; font-size: 16px; }

        .info-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255,255,255,0.95);
          padding: 12px;
          border-radius: 12px;
          max-width: 280px;
          font-size: 14px;
          color: #111827;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .info-overlay h3 { font-weight: 700; margin-bottom: 4px; }
        .info-overlay p { font-weight: 400; color: #4b5563; margin: 0; }

        .gif-overlay-left { position: absolute; bottom: 12px; left: 12px; width: 80px; height: 80px; z-index: 20; pointer-events: none; }
        .gif-overlay-right { position: absolute; bottom: 12px; right: 12px; width: 80px; height: 80px; z-index: 20; pointer-events: none; }
      `}</style>
        </div>
    );
}
