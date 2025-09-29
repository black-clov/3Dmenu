import React, { useEffect, useRef, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DataContext, useData } from "../Context/DataContext";
import showGif from "./rotate.gif";
import show2Gif from "./zoom.gif";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";

const getShareText = (business, item) =>
  `Découvrez ${business?.name} en 3D${item ? " : " + item.name : ""} - ${window.location.href}`;

const handleInstagramShare = () =>
  window.open("https://www.instagram.com/mr.unreal.things/", "_blank");

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

const handleTiktokShare = () =>
  window.open("https://www.tiktok.com/@mr.unreal.things", "_blank");

const LOCAL_STORAGE_KEY = "viewer3d_comments";

export default function Viewer3D() {
  const { categoryId, businessId, itemId } = useParams();
  const mountRef = useRef(null);
  const { items, businesses } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const business = businesses.find(b => b.id === businessId);
  const { trackEvent } = useData();
  const initialCamera = { x: 0, y: 1, z: 3 };

  useEffect(() => {
    if (!itemId) return;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const allComments = JSON.parse(stored);
        setComments(allComments[itemId] || []);
      } catch {
        setComments([]);
      }
    }
  }, [itemId]);

  const saveComments = newComments => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let allComments = {};
    if (stored) {
      try {
        allComments = JSON.parse(stored);
      } catch {
        allComments = {};
      }
    }
    allComments[itemId] = newComments;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allComments));
  };

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
      gltf => {
        modelRef.current = gltf.scene;
        scene.add(modelRef.current);
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        modelRef.current.position.sub(center);
        setLoading(false);
      },
      xhr => {
        const progressPercent = xhr.total
          ? Math.min(Math.round((xhr.loaded / xhr.total) * 100), 100)
          : 0;
        setProgress(progressPercent);
      },
      error => {
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

  // Save comment (text only)
const submitComment = () => {
  if (!comment.trim()) return;

  if (trackEvent && business && item) {
    trackEvent({
      eventName: "Comment Sent",
      platform: "Comment",
      clientId,
      businessId: business.id,
      businessName: business.name,
      itemId: item.id,
      itemName: item.name,
      commentText: comment.trim(),
    });
  }

  const newComments = [...comments, { text: comment.trim() }];
  setComments(newComments);
  saveComments(newComments);
  setComment("");
  setCommentOpen(false);
};

  return (
    <div className="viewer3d-pro">
      {/* Fixed header row */}
      <div className="viewer-header-row">
        <button
          onClick={() => {
            navigate(`/category/${categoryId}/business/${businessId}`);
            window.location.reload();
          }}
          className="viewer-btn-back"
          aria-label="Retour"
        >
          <span className="arrow">←</span>
        </button>
        <div className="viewer-header-spacer"></div>
        <div className="viewer-social-row">
          <button
            className="viewer-btn-social insta"
            title="Instagram"
            onClick={handleInstagramShare}
            aria-label="Partager sur Instagram"
          >
            <FaInstagram size={18} />
          </button>
          <button
            className="viewer-btn-social whatsapp"
            title="WhatsApp"
            onClick={() => handleWhatsAppShare(business, item, trackEvent)}
            aria-label="Partager sur WhatsApp"
          >
            <FaWhatsapp size={18} />
          </button>
          <button
            className="viewer-btn-social tiktok"
            title="TikTok"
            onClick={handleTiktokShare}
            aria-label="Partager sur TikTok"
          >
            <FaTiktok size={18} />
          </button>
        </div>
      </div>

      {/* Model viewer and overlays */}
      <div className="viewer-pro-main">
        <div className="viewer-pro-container">
          {loading && (
            <div className="viewer-loader-overlay" role="alert" aria-live="assertive">
              <div className="viewer-loader"></div>
              <div className="viewer-progress-text">{progress}%</div>
            </div>
          )}

          <div ref={mountRef} className="viewer-pro-mount" aria-label="3D model viewer" tabIndex={0} />

          {/* Dish name & description, left up INSIDE viewer */}
          {showInfo && item && (
            <div className="viewer-dish-info">
              <div className="viewer-dish-name">{item.name}</div>
              <div className="viewer-dish-desc">{item.description}</div>
            </div>
          )}

          {/* Ingredients/nutrition, right down inside viewer */}
          {item && (
            <div className="viewer-ingredient-nutrition">
              <div className="viewer-small-title">Ingrédients</div>
              <ul>
                {ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
              <div className="viewer-small-title">Nutrition</div>
              <ul>
                {nutrition.map((nut, idx) =>
                  nut.value ? (
                    <li key={idx}>
                      <span className="viewer-nut-key">{nut.key}:</span>
                      <span className="viewer-nut-val">{nut.value}</span>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          )}

          {/* Two gifs (left down in viewer, horizontally) */}
          <div className="viewer-gif-bloc">
            <img src={showGif} alt="animation rotation" className="viewer-gif-one" />
            <img src={show2Gif} alt="animation zoom" className="viewer-gif-two" />
          </div>

          {comments.length > 0 && (
            <div className="viewer-comments-list" aria-live="polite" aria-label="Commentaires des visiteurs">
              {comments.map((cmt, idx) => (
                <div key={idx} className="viewer-comment-box">
                  <div className="viewer-comment-text">{cmt.text}</div>
                </div>
              ))}
            </div>
          )}

          <button
            className="viewer-comment-btn"
            aria-label={commentOpen ? "Fermer commentaire" : "Ajouter un commentaire"}
            onClick={() => setCommentOpen(v => !v)}
            title="Ajouter un commentaire"
          >
            <FiMessageCircle size={22} />
          </button>

          {commentOpen && (
            <div className="viewer-comment-popup" role="dialog" aria-modal="true" aria-labelledby="comment-title">
              <h4 id="comment-title">Ajouter un commentaire</h4>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Écrire un commentaire..."
                rows={4}
                className="viewer-comment-textarea"
                aria-label="Champ de saisie pour commentaire"
                autoFocus
              />
              <div className="viewer-comment-actions">
                <button className="viewer-btn-submit" onClick={submitComment} aria-label="Envoyer commentaire">
                  Envoyer
                </button>
                <button className="viewer-btn-cancel" onClick={() => setCommentOpen(false)} aria-label="Annuler commentaire">
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Updated CSS for required UI */}
      <style>{`
        .viewer3d-pro {
          min-height: 100vh;
          background: #f9fafb;
          overflow: hidden;
          font-family: 'Segoe UI', 'Roboto', 'Tahoma', Geneva, Verdana, sans-serif;
        }
        .viewer-header-row {
          width: 100vw;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          border-bottom: 1.5px solid #f3f3f3;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 98;
          padding: 0 18px;
        }
        .viewer-btn-back {
          background: linear-gradient(90deg,#fc2947 40%,#fb7e4b 100%);
          color: #fff;
          border: none;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 8px;
          width: 34px;
          height: 34px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(252,41,71,0.13);
          transition: background 0.2s;
        }
        .viewer-btn-back:hover { background: linear-gradient(90deg,#fb7e4b 30%,#fc2947 80%); }
        .viewer-header-spacer { flex: 1; }
        .viewer-social-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .viewer-btn-social {
          background: #fff;
          border-radius: 50%;
          border: 2px solid #e0e0e0;
          width: 30px; height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #555;
          box-shadow: 0 2px 8px rgba(33,33,33,0.05);
          transition: box-shadow 0.16s, border 0.15s;
          cursor: pointer;
        }
        .viewer-btn-social.insta { border: 2px solid #e1306c; color: #e1306c; }
        .viewer-btn-social.whatsapp { border: 2px solid #25d366; color: #25d366;}
        .viewer-btn-social.tiktok { border: 2px solid #010101; color: #010101;}
        .viewer-btn-social:hover { box-shadow: 0 4px 14px rgba(50,50,50,0.08); border-color: #fb7e4b; }
        .viewer-pro-main {
          position: relative;
          width: 100vw;
          height: calc(100vh - 54px);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 54px;
          padding: 0;
        }
        .viewer-pro-container {
          position: relative;
          width: 95vw;
          max-width: 920px;
          height: 78vh;
          min-height: 360px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .viewer-pro-mount {
          width: 100%;
          height: 100%;
          background: #eaeaea;
          box-shadow: 0 7px 24px rgba(0,0,0,.14);
          border-radius: 18px;
          overflow: hidden;
          position: relative;
        }
        .viewer-loader-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.91);
          border-radius: 18px;
          z-index: 19;
        }
        .viewer-loader {
          border: 6px solid #fb7e4b;
          border-top: 6px solid #fc2947;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          animation: spin 1s linear infinite;
          margin-bottom: 9px;
        }
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
        .viewer-progress-text {
          font-weight: 700; color: #fc2947; font-size: 16px;
        }
        .viewer-dish-info {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 12px rgba(252,41,71,0.05);
          border-radius: 7px;
          padding: 8px 11px 8px 11px;
          font-size: 12px;
          color: #242424;
          max-width: 200px;
          z-index: 18;
        }
        .viewer-dish-name {
          font-weight: 800; font-size: 12px; color: #fb7e4b; margin-bottom: 3px;
        }
        .viewer-dish-desc {
          font-weight: 400; color: #999; font-size: 11px; margin-bottom: 0;
        }
        .viewer-ingredient-nutrition {
          position: absolute;
          bottom: 14px;
          right: 14px;
          width: 110px;
          background: rgba(255,255,255,0.94);
          box-shadow: 0 2px 6px rgba(0,0,0,0.10);
          border-radius: 9px;
          padding: 7px 8px 6px 8px;
          font-size: 9px;
          color: #222;
          z-index: 16;
        }
        .viewer-small-title {
          font-weight: 700;
          font-size: 9px;
          margin-top: 0;
          margin-bottom: 2px;
          color: #fb7e4b;
          letter-spacing: 0.01em;
        }
        .viewer-ingredient-nutrition ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .viewer-ingredient-nutrition li {
          margin-bottom: 1px;
          line-height: 13px;
        }
        .viewer-nut-key { font-weight: 600; color: #059669; }
        .viewer-nut-val { font-weight: 500; color: #242424;}
        .viewer-gif-bloc {
          position: absolute;
          left: 14px;
          bottom: 14px;
          display: flex;
          gap: 8px;
          z-index: 12;
        }
        .viewer-gif-one, .viewer-gif-two {
          width: 39px;
          height: 39px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(50,50,50,0.08);
          background: #fff;
        }
        .viewer-comment-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: #fb7e4b;
          border: none;
          border-radius: 50%;
          padding: 5px;
          color: white;
          cursor: pointer;
          box-shadow: 0 3px 9px rgba(251,126,75,0.12);
          transition: background-color 0.17s, transform 0.16s;
          z-index: 18;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .viewer-comment-btn:hover { background: #fc2947;}
        .viewer-comments-list {
          position: absolute;
          top: 78px;
          right: 24px;
          max-width: 210px;
          max-height: 90px;
          overflow-y: auto;
          background: rgba(255,255,255,0.93);
          box-shadow: 0 6px 14px rgba(0,0,0,0.13);
          border-radius: 10px;
          padding: 7px 7px 7px 7px;
          z-index: 30;
        }
        .viewer-comment-box {
          background: #f8f6f6;
          border-radius: 7px;
          padding: 5px 7px;
          margin-bottom: 6px;
        }
        .viewer-comment-text {
          font-size: 11px;
          color: #444;
          line-height: 1.35;
          white-space: pre-wrap;
        }
        .viewer-comment-popup {
          position: absolute;
          top: 75px;
          right: 24px;
          width: 215px;
          background: #fff;
          border-radius: 9px;
          box-shadow: 0 8px 22px rgba(0,0,0,0.16);
          padding: 13px 13px 9px 13px;
          z-index: 41;
        }
        .viewer-comment-popup h4 {
          margin: 0 0 7px 0;
          font-weight: 700;
          font-size: 1rem;
          color: #fc2947;
        }
        .viewer-comment-textarea {
          width: 100%;
          resize: none;
          padding: 6px;
          font-size: 0.95rem;
          border-radius: 6px;
          border: 1.2px solid #f3f3f3;
          box-sizing: border-box;
          margin-bottom: 6px;
        }
        .viewer-comment-textarea:focus {
          outline: none;
          border-color: #fc2947;
          box-shadow: 0 0 2px rgba(252,41,71,0.15);
        }
        .viewer-comment-actions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
        }
        .viewer-btn-submit, .viewer-btn-cancel {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.96rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }
        .viewer-btn-submit { background: #fb7e4b; color: white;}
        .viewer-btn-submit:hover { background: #fc2947;}
        .viewer-btn-cancel { background: #ededed; color: #333;}
        .viewer-btn-cancel:hover { background: #ffeafd;}
        @media (max-width: 850px) {
          .viewer-pro-container { width: 100vw; min-height: 180px;}
          .viewer-dish-info { top: 8px; left: 8px; max-width: 65vw;}
          .viewer-ingredient-nutrition { right: 8px; bottom: 7px; font-size: 8px; width: 80px;}
          .viewer-gif-bloc { left: 7px; bottom: 7px;}
          .viewer-gif-one, .viewer-gif-two { width: 27px; height: 27px;}
          .viewer-comment-btn,
          .viewer-comments-list,
          .viewer-comment-popup { right: 7px;}
        }
      `}</style>
    </div>
  );
}
