import React, { useEffect, useRef, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DataContext, useData } from "../Context/DataContext";
import gsap from "gsap";
import showGif from "./rotate.gif";
import show2Gif from "./zoom.gif";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { FiMaximize, FiMessageCircle } from "react-icons/fi";

const getShareText = (business, item) =>
  `Découvrez ${business?.name} en 3D${item ? " : " + item.name : ""} - ${window.location.href}`;

const handleInstagramShare = (business, item) => {
  window.open(`https://www.instagram.com/mr.unreal.things/`, "_blank");
};

const handleWhatsAppShare = (business, item, trackEvent) => {
  trackEvent("Share Click", {
    platform: "WhatsApp",
    businessId: business.id,
    name: business.name,
    itemId: item.name,
  });
  const text = encodeURIComponent(getShareText(business, item));
  window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
};

const handleTiktokShare = (business, item) => {
  window.open(`https://www.tiktok.com/@mr.unreal.things`, "_blank");
};

export default function Viewer3D() {
  const { categoryId, businessId, itemId } = useParams();
  const mountRef = useRef(null);
  const { items, businesses } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const business = businesses.find(b => b.id === businessId);
  const { trackEvent } = useData();

  const initialCamera = { x: 0, y: 1, z: 3 };
  const initialTarget = new THREE.Vector3(0, 0, 0);

  useEffect(() => {
    const item = items.find(i => i.id === itemId);
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
    controls.minDistance = 1.5;
    controls.maxDistance = 5;
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
        setProgress(xhr.total ? Math.round((xhr.loaded / xhr.total) * 100) : 0);
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

  const item = items.find(i => i.id === itemId);

  const ingredients = [];
  for (let i = 1; i <= 10; i++) {
    if (item && item[`ingredient${i}`]) ingredients.push(item[`ingredient${i}`]);
  }
  const nutrition = [
    { key: "Calories", value: item?.nutrition_calories },
    { key: "Protéines", value: item?.nutrition_protein },
    { key: "Glucides", value: item?.nutrition_carbs },
    { key: "Lipides", value: item?.nutrition_fat },
  ];

  // Handle comment submit (placeholder: logs & clears comment)
  const submitComment = () => {
    if (!comment.trim()) return;
    console.log(`Comment submitted: "${comment}" for item ${item?.name}`);
    setComment("");
    setCommentOpen(false);
  };

  return (
    <div className="viewer3d-container">
      {/* Retour Button */}
      <div className="back-btn-wrapper">
        <button
          onClick={() => {
            navigate(`/category/${categoryId}/business/${businessId}`);
            window.location.reload();
          }}
          className="btn-back"
          aria-label="Retour"
        >
          <span className="arrow">←</span>
          <span>Retour</span>
        </button>
      </div>

      {/* Fullscreen Button */}
      <div className="fullscreen-btn-wrapper">
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              if (mountRef.current.requestFullscreen) mountRef.current.requestFullscreen();
              else if (mountRef.current.webkitRequestFullscreen) mountRef.current.webkitRequestFullscreen();
              else if (mountRef.current.msRequestFullscreen) mountRef.current.msRequestFullscreen();
            } else {
              if (document.exitFullscreen) document.exitFullscreen();
              else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
              else if (document.msExitFullscreen) document.msExitFullscreen();
            }
          }}
          className="btn-control btn-fullscreen flex items-center gap-2"
          aria-label="Plein écran"
        >
          <FiMaximize size={18} /> Plein écran
        </button>
      </div>

      {/* Social Share Buttons */}
      <div className="social-share-row" role="group" aria-label="Social share buttons">
        <button
          className="btn-social insta"
          title="Partager sur Instagram"
          onClick={() => handleInstagramShare(business, item)}
          aria-label="Partager sur Instagram"
        >
          <FaInstagram size={24} />
        </button>
        <button
          className="btn-social whatsapp"
          title="Partager sur WhatsApp"
          onClick={() => handleWhatsAppShare(business, item, trackEvent)}
          aria-label="Partager sur WhatsApp"
        >
          <FaWhatsapp size={24} />
        </button>
        <button
          className="btn-social tiktok"
          title="Partager sur TikTok"
          onClick={() => handleTiktokShare(business, item)}
          aria-label="Partager sur TikTok"
        >
          <FaTiktok size={24} />
        </button>
      </div>

      {/* Viewer Container */}
      <div className="viewer-wrapper">
        {loading && (
          <div className="loader-overlay" role="alert" aria-live="assertive">
            <div className="loader"></div>
            <div className="progress-text">{progress}%</div>
          </div>
        )}

        <div ref={mountRef} className="viewer-mount" aria-label="3D model viewer" tabIndex={0} />

        {/* Info Overlay */}
        {showInfo && item && (
          <div className="info-overlay" role="region" aria-label="Item information">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
        )}

        {/* Ingredients & Nutrition Panel */}
        {item && (
          <div className="ingredient-nutrition-corner small-mode" aria-label="Ingredients and nutrition info">
            <div className="small-title">Ingrédients</div>
            <ul>
              {ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
            <div className="small-title">Nutrition</div>
            <ul>
              {nutrition.map((nut, idx) =>
                nut.value ? (
                  <li key={idx}>
                    <span className="nut-key">{nut.key}:</span> <span className="nut-val">{nut.value}</span>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}

        {/* Comment Button */}
        <button
          className="comment-button"
          aria-label={commentOpen ? "Fermer commentaire" : "Ajouter un commentaire"}
          onClick={() => setCommentOpen((v) => !v)}
          title="Ajouter un commentaire"
        >
          <FiMessageCircle size={28} />
        </button>

        {/* Comment Popup */}
        {commentOpen && (
          <div className="comment-popup" role="dialog" aria-modal="true" aria-labelledby="comment-title">
            <h4 id="comment-title">Ajouter un commentaire</h4>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Écrire un commentaire..."
              rows={4}
              className="comment-textarea"
              aria-label="Champ de saisie pour commentaire"
              autoFocus
            />
            <div className="comment-actions">
              <button className="btn-submit" onClick={submitComment} aria-label="Envoyer commentaire">
                Envoyer
              </button>
              <button className="btn-cancel" onClick={() => setCommentOpen(false)} aria-label="Annuler commentaire">
                Annuler
              </button>
            </div>
          </div>
        )}

        <img src={showGif} alt="animation rotation" className="gif-overlay-left" />
        <img src={show2Gif} alt="animation zoom" className="gif-overlay-right" />
      </div>

      <style>{`
        .comment-button {
          position: absolute;
          top: 18px;
          right: 18px;
          background: #ef4444;
          border: none;
          border-radius: 50%;
          padding: 6px;
          color: white;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(239, 68, 68, 0.7);
          transition: background-color 0.3s ease, transform 0.2s ease;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .comment-button:hover,
        .comment-button:focus {
          background: #dc2626;
          outline: none;
          transform: scale(1.1);
        }
        .comment-popup {
          position: absolute;
          top: 60px;
          right: 18px;
          width: 280px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          padding: 16px;
          z-index: 31;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #222;
          animation: popupFadeIn 0.3s ease forwards;
        }
        @keyframes popupFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .comment-popup h4 {
          margin: 0 0 10px 0;
          font-weight: 700;
          font-size: 1.1rem;
          color: #e11d48;
        }
        .comment-textarea {
          width: 100%;
          resize: none;
          padding: 8px;
          font-size: 0.9rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-family: inherit;
          box-sizing: border-box;
          margin-bottom: 12px;
          transition: border-color 0.2s ease;
        }
        .comment-textarea:focus {
          outline: none;
          border-color: #e11d48;
          box-shadow: 0 0 6px rgba(225,29,72,0.4);
        }
        .comment-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .btn-submit, .btn-cancel {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background-color 0.3s ease;
        }
        .btn-submit {
          background: #e11d48;
          color: white;
        }
        .btn-submit:hover,
        .btn-submit:focus {
          background: #be123c;
          outline: none;
        }
        .btn-cancel {
          background: #ddd;
          color: #333;
        }
        .btn-cancel:hover,
        .btn-cancel:focus {
          background: #bbb;
          outline: none;
        }

        /* Existing styles (unchanged) */
        .ingredient-nutrition-corner.small-mode {
          position: absolute;
          bottom: 16px;
          right: 7px;
          width: 115px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.09);
          border-radius: 10px;
          padding: 5px 7px 4px 7px;
          font-size: 10px;
          color: #222;
          z-index: 21;
          opacity: 0;
          animation: fadeInCornerSmall 0.65s cubic-bezier(0.27,0.81,0.41,1.18) forwards;
        }
        @keyframes fadeInCornerSmall {
          0% { opacity: 0; transform: scale(0.45) translate(28px,11px);}
          100% { opacity: 1; transform: scale(1) translate(0,0);}
        }
        .ingredient-nutrition-corner .small-title {
          font-weight: 700;
          font-size: 9px;
          margin-bottom: 2px;
          margin-top: 2px;
          letter-spacing: 0.01em;
          color: #e1306c;
          text-shadow: 0 2px 6px rgba(225,48,108,0.07);
        }
        .ingredient-nutrition-corner ul {
          list-style: none;
          margin: 0;
          padding: 0 0 1px 0;
        }
        .ingredient-nutrition-corner li {
          font-weight: 400;
          color: #444;
          margin-bottom: 1px;
          line-height: 13px;
          font-size: 9px;
        }
        .ingredient-nutrition-corner .nut-key {
          font-weight: 600;
          color: #059669;
          font-size: 9px;
        }
        .ingredient-nutrition-corner .nut-val {
          font-weight: 500;
          color: #111827;
          font-size: 9px;
        }

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
        .back-btn-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 12px;
        }
        .btn-back {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          width: 200px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #f87171, #ef4444);
          border-radius: 12px;
          box-shadow: 0px 6px 15px rgba(239, 68, 68, 0.3);
          transition: all 0.3s ease;
        }
        .btn-back:hover { background-color: #f65a48; }
        .fullscreen-btn-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 10px 0;
        }
        .btn-fullscreen {
          background: #c0c0c0ff;
          color: #222;
          font-size: 17px;
          border-radius: 9999px;
          font-weight: 600;
          padding: 11px 22px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.09);
        }
        .btn-fullscreen:hover { background: #d4d4d4; }
        .social-share-row {
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 26px;
          margin: 13px 0;
        }
        .btn-social {
          border: none;
          outline: none;
          cursor: pointer;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: white;
          transition: box-shadow 0.23s, transform 0.17s;
          box-shadow: 0 2px 7px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-social:active { transform: scale(1.07); }
        .btn-social.insta { color: #e1306c; border: 2px solid #e1306c;}
        .btn-social.insta:hover { background: #fdedf1; }
        .btn-social.whatsapp { color: #25d366; border: 2px solid #25d366;}
        .btn-social.whatsapp:hover { background: #e8f9ee; }
        .btn-social.tiktok { color: #010101; border: 2px solid #010101;}
        .btn-social.tiktok:hover { background: #e9e9e9; }
        @media (max-width: 800px) {
          .viewer3d-container { padding: 0; }
          .social-share-row { gap: 14px; }
        }
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
        .loader { border: 6px solid #f3f3f3; border-top: 6px solid #ebebebff; border-radius: 50%; width: 44px; height: 44px; animation: spin 1s linear infinite; margin-bottom: 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .progress-text { font-weight: 600; color: #111827; font-size: 14px; }
        .info-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255,255,255,0.95);
          padding: 11px;
          border-radius: 11px;
          max-width: 180px;
          font-size: 13px;
          color: #111827;
          box-shadow: 0 4px 11px rgba(0,0,0,0.09);
        }
        .info-overlay h3 { font-weight: 700; margin-bottom: 3px; font-size: 14px;}
        .info-overlay p { font-weight: 400; color: #4b5563; margin: 0; font-size: 13px;}
        .gif-overlay-left {
          position: absolute;
          bottom: 12px;
          left: 12px;
          width: 68px;
          height: 68px;
          z-index: 20;
          pointer-events: none;
        }
        .gif-overlay-right {
          position: absolute;
          bottom: 12px;
          left: 88px; /* 12px + 68px + 8px */
          width: 68px;
          height: 68px;
          z-index: 20;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
