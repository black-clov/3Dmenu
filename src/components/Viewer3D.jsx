
import React, { useEffect, useRef, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DataContext, useData } from "../Context/DataContext";
import showGif from "./rotate.gif";
import show2Gif from "./zoom.gif";
import show3Gif from "./share.gif";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import commentGif from "./comment.gif";
import cartPng from "./Panier.png";



const translations = {
  fr: {
    ingredients: "Ingrédients",
    nutrition: "Nutrition",
    calories: "Calories",
    protein: "Protéines",
    carbs: "Glucides",
    fat: "Lipides",
    addComment: "Ajouter un commentaire",
    writeComment: "Écrire un commentaire...",
    send: "Envoyer",
    cancel: "Annuler",
    thankYou: "Merci pour votre commentaire",
    loader: "Chargement du modèle 3D",
    animatedTexts: [
      "N’hésitez pas à partager directement vos impressions sur ce plat avec le restaurant après votre dégustation !",
      "Faites part de votre avis en toute confidentialité au restaurant concernant ce plat.",
      "Votre retour confidentiel est précieux pour enrichir et partager l’expérience unique du restaurant."
    ],
    back: "Retour",
    backArrow: "←",
    client: "Commentaire Client",
    addToOrder: "Commander Maintenant",
    confirm: "Confirmer",
    cancel: "Annuler",
  },
  en: {
    ingredients: "Ingredients",
    nutrition: "Nutrition",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    addComment: "Add a comment",
    writeComment: "Write a comment...",
    send: "Send",
    cancel: "Cancel",
    thankYou: "Thank you for your comment",
    loader: "Loading 3D model",
    animatedTexts: [
      "Feel free to share your impressions of this dish directly with the restaurant after tasting!",
      "Confidentially inform the restaurant about your opinion of this dish.",
      "Your confidential feedback is valuable to enrich and share the restaurant's unique experience."
    ],
    back: "Back",
    backArrow: "←",
    client: "Client Comment",
    addToOrder: "Order now",
    confirm: "Confirm",
    cancel: "Cancel",
  },
  ar: {
    ingredients: "المكونات",
    nutrition: "القيم الغذائية",
    calories: "سعرات حرارية",
    protein: "بروتين",
    carbs: "كربوهيدرات",
    fat: "دهون",
    addComment: "إضافة تعليق",
    writeComment: "أكتب تعليقًا...",
    send: "إرسال",
    cancel: "إلغاء",
    thankYou: "شكرًا لتعليقك",
    loader: "يتم تحميل نموذج ثلاثي الأبعاد",
    animatedTexts: [
      "لا تتردد في مشاركة انطباعاتك حول هذا الطبق مع المطعم بعد التذوق!",
      "أخبر المطعم برأيك حول هذا الطبق بشكل سري.",
      "ملاحظاتك السرية مهمة لتعزيز ونشر تجربة المطعم الفريدة."
    ],
    back: "عودة",
    backArrow: "→",
    client: "تعليق عميل",
    addToOrder: "اطلب الآن",
    confirm: "تأكيد",
    cancel: "إلغاء",
    cart:"عربة",
    total:"المجموع"

  },
  zh: {
  ingredients: "配料",
  nutrition: "营养",
  calories: "卡路里",
  protein: "蛋白质",
  carbs: "碳水化合物",
  fat: "脂肪",
  addComment: "添加评论",
  writeComment: "写评论...",
  send: "发送",
  cancel: "取消",
  thankYou: "谢谢您的评论",
  loader: "加载3D模型",
  animatedTexts: [
    "品尝后，欢迎您直接与餐厅分享对这道菜的印象！",
    "请您向餐厅保密地反馈这道菜的意见。",
    "您的保密反馈对丰富餐厅的独特体验非常宝贵。"
  ],
  back: "返回",
  backArrow: "←",
  client: "客户评论",
  addToOrder: "立即订购",
  confirm: "确认",
  cancel: "取消",
  cart:"购物车",
  total:"总计"
},
  ru: {
    ingredients: "Ингредиенты",
    nutrition: "Питание",
    calories: "Калории",
    protein: "Белки",
    carbs: "Углеводы",
    fat: "Жиры",
    addComment: "Добавить комментарий",
    writeComment: "Написать комментарий...",
    send: "Отправить",
    cancel: "Отмена",
    thankYou: "Спасибо за ваш комментарий",
    loader: "Загрузка 3D модели",
    animatedTexts: [
      "Не стесняйтесь делиться своими впечатлениями о блюде с рестораном после дегустации!",
      "Конфиденциально сообщите ресторану свое мнение об этом блюде.",
      "Ваши конфиденциальные отзывы ценны для улучшения и обмена уникальным опытом ресторана."
    ],
    back: "Назад",
    backArrow: "←",
    client: "Комментарий клиента",
    addToOrder: "Заказать сейчас",
    confirm: "Подтвердить",
    cancel: "Отмена",
    cart:"корзина",
    total:"итого"
  }
};

function getShareText(business, item, lang) {
  if (lang === "en") {
    return `Discover ${business?.name} in 3D${item ? ": " + item.name : ""} - ${window.location.href}`;
  }
  if (lang === "ar") {
    return `اكتشف ${business?.name}${item ? " : " + item.name : ""} ثلاثي الأبعاد - ${window.location.href}`;
  }
  if (lang === "zh") {
  return `发现 ${business?.name} 的3D模型${item ? "：" + item.name : ""} - ${window.location.href}`;
}
  if (lang === "ru") {
    return `Откройте] ${business?.name} :в 3D${item ? ": " + item.name : ""} -] ${window.location.href}`;
  }
  // French (default)
  return `Découvrez ${business?.name} en 3D${item ? " : " + item.name : ""} - ${window.location.href}`;
}

let sessionId = window.sessionStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = Math.random().toString(36).substr(2, 9);
  window.sessionStorage.setItem("sessionId", sessionId);
}

const handleInstagramShare = () =>
  window.open("https://www.instagram.com/mr.unreal.things/", "_blank");

const handleTiktokShare = () =>
  window.open("https://www.tiktok.com/@mr.unreal.things", "_blank");

function AnimatedReviewPanel({ reviews, clientTitle, language }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!reviews || reviews.length < 2) return;
    const interval = setInterval(() => {
      setCurrent(i => (i + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews]);

  if (!reviews || reviews.length === 0) return null;

  // Safely fallback if language not found
  const currentComment = reviews[current].comment[language] || reviews[current].comment.fr;

  return (
    <div className="animated-review-panel" aria-live="polite">
      <div className="review-client-title">
        {/* Animated gif before text */}
        <img src={commentGif} alt="Comment animation" className="comment-gif" aria-hidden="true" />
        <span className="client-title-text">{clientTitle}</span>
      </div>
      <div className="review-client-text">{currentComment}</div>
    </div>
  );
}


export default function Viewer3D() {
  const { categoryId, businessId, itemId } = useParams();
  const mountRef = useRef(null);
  const { items, businesses } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [showAnimatedText, setShowAnimatedText] = useState(true);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const [language, setLanguage] = useState(() => {
  return localStorage.getItem("appLanguage") || "fr";
});

  const navigate = useNavigate();
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const rendererRef = useRef(null);
  const business = businesses.find((b) => b.id === businessId);
  const { trackEvent } = useData();
  const isArabic = language === "ar";
  const t = translations[language];
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 850);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const STORAGE_CART_KEY = `cartItems-${sessionId}`;
  const [showCartList, setShowCartList] = useState(false);
  

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 850);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

function getClientId() {
  let clientId = localStorage.getItem("clientId");
  if (!clientId) {
    clientId = "client-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("clientId", clientId);
  }
  return clientId;
}

const descFontSize = isMobile ? "8px" : "10px";

useEffect(() => {
  localStorage.setItem("appLanguage", language);
}, [language]);

  useEffect(() => {
    const item = items.find((i) => i.id === itemId);
    if (!item || !mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
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
        if (xhr.lengthComputable) {
          const percentComplete = Math.min(100, Math.round((xhr.loaded / xhr.total) * 100));
          setProgress(percentComplete);
        }
      },
      (error) => {
        console.error(error);
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
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      controls.dispose();
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, [itemId, items]);

  const item = items.find((i) => i.id === itemId);

  const ingredients = [];
  for (let i = 1; i <= 10; i++) {
    if (
      item &&
      item[`ingredient${i}`] &&
      item[`ingredient${i}`][language]
    ) {
      ingredients.push(item[`ingredient${i}`][language]);
    }
  }

  const nutrition = [
    { key: t.calories, value: item?.nutrition_calories },
    { key: t.protein, value: item?.nutrition_protein },
    { key: t.carbs, value: item?.nutrition_carbs },
    { key: t.fat, value: item?.nutrition_fat }
  ];

  const handleWhatsAppShare = () => {
    if (!business || !item) return;
    trackEvent("Share Click", {
      platform: "WhatsApp",
      businessId: business.id,
      name: business.name,
      itemId: item.name,
    });
    const text = encodeURIComponent(getShareText(business, item, language));
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    if (trackEvent && business && item) {
      trackEvent({
        eventName: "Comment Sent",
        platform: "Comment",
        businessId: business.id,
        businessName: business.name,
        itemId: item.id,
        itemName: item.name,
        commentText: comment.trim(),
      });
    }
    setComment("");
    setCommentOpen(false);
    setThankYouVisible(true);
    setTimeout(() => setThankYouVisible(false), 3000);
  };

  const AnimatedText = () => {
    const texts = t.animatedTexts;
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((ci) => (ci + 1) % texts.length);
      }, 4000);
      return () => clearInterval(interval);
    }, [language]);
    return (
      <div className="animated-text" role="alert" aria-live="polite" aria-atomic="true" aria-relevant="all">
        {texts[currentIndex]}
      </div>
    );
  };



  useEffect(() => {
    let sid = window.sessionStorage.getItem("sessionId");
    if (!sid) {
      sid = Math.random().toString(36).substr(2, 9);
      window.sessionStorage.setItem("sessionId", sid);
    }
    setSessionId(sid);
  }, []);

// Outside component, get or initialize sessionId in sessionStorage
let initialSessionId = window.sessionStorage.getItem("sessionId");
if (!initialSessionId) {
  initialSessionId = Math.random().toString(36).substr(2, 9);
  window.sessionStorage.setItem("sessionId", initialSessionId);
}

  // Load cart items on mount or when sessionId changes
useEffect(() => {
  if (!sessionId) return;
  try {
    const saved = localStorage.getItem(`cartItems-${sessionId}`);
    if (saved) setCartItems(JSON.parse(saved));
  } catch {
    setCartItems([]);
  }
}, [sessionId]);

// Save cart on cart or sessionId change
useEffect(() => {
  if (!sessionId) return;
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
  } catch {}
}, [cartItems, sessionId]);

  // Add item to cart (allow duplicates)
const onConfirmAddToOrder = () => {
  try {
    if (!item) return;
    setCartItems(prev => [...prev, { id: item.id, name: item.name, price: item.price }]);
  } catch (err) {
    console.error(err);
  }
  setShowConfirm(false);
  
  // Redirect to previous page after adding
  navigate(-1);
};


// Calculate total price
const totalPrice = cartItems.reduce((sum, ci) => {
  // Try to parse price as float, default to 0 if invalid
  const price = parseFloat(ci.price);
  return sum + (isNaN(price) ? 0 : price);
}, 0);

// Submit order handler (implement your logic here)
// Submit order function
const submitOrder = () => {
  alert(`Order submitted! Total: ${totalPrice.toFixed(2)} `);
  setCartItems([]);
};
  


  
//-------------------------------------------------------------ORDER-----------------------------------

  // Confirm Add to Order
  const confirmAddToOrder = () => {
    setShowConfirm(false);
    // Here your logic to add item to the order (context or local storage)
    alert(`${item.name} ${language==='fr' ? 'ajouté à la commande!' : 'added to your order!'}`);
  };

  // Cancel Add to Order
  const cancelAddToOrder = () => {
    setShowConfirm(false);
  };

 const addToCart = (item) => {
  setCartItems(prev => {
    const updated = [...prev, item];
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(updated));
    return updated;
  });
};

useEffect(() => {
  const saved = localStorage.getItem('cartItems');
  if (saved) {
    setCartItems(JSON.parse(saved));
  }
}, []);

// Storage event for cross-tab (external) sync
useEffect(() => {
  const handleStorageChange = (event) => {
    if (event.key === STORAGE_CART_KEY) {
      setCartItems(event.newValue ? JSON.parse(event.newValue) : []);
    }
  };
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [STORAGE_CART_KEY]);
















 return (
  <div className="viewer3d-pro" dir={isArabic ? "rtl" : "ltr"}>
    
    <div className="viewer-header-row">
      <button
        onClick={() => {
          navigate(`/category/${categoryId}/business/${businessId}`);
          window.location.reload();
        }}
        className="viewer-btn-back"
        aria-label={t.back}
      >
        <span className="arrow">{t.backArrow}</span>
      </button>
      
      <div className="viewer-social-row">
        <div className="whatsapp-share-wrapper">
          <img
            src={show3Gif}
            alt="Animation de partage"
            className="whatsapp-share-gif"
            aria-hidden="true"
          />
          <button
            className="viewer-btn-social whatsapp"
            title="WhatsApp"
            onClick={handleWhatsAppShare}
            aria-label="Partager sur WhatsApp"
          >
            <FaWhatsapp size={48} />
          </button>
        </div>
       
        
      </div>
      
    </div>

    
    

    {/* Language selector moved below header */}
    <div className="viewer-lang-row" role="navigation" aria-label="Language selector">
      <button className={language === "fr" ? "lang-btn selected" : "lang-btn"} onClick={() => setLanguage("fr")}>FR</button>
      <button className={language === "en" ? "lang-btn selected" : "lang-btn"} onClick={() => setLanguage("en")}>EN</button>
      <button className={language === "ar" ? "lang-btn selected" : "lang-btn"} onClick={() => setLanguage("ar")}>العربية</button>
      <button className={language === "zh" ? "lang-btn selected" : "lang-btn"} onClick={() => setLanguage("zh")}>中文</button>
      <button className={language === "ru" ? "lang-btn selected" : "lang-btn"} onClick={() => setLanguage("ru")}>RU</button>
    </div>


    <div className="viewer-pro-main">
      <div className="viewer-pro-container">
        {loading && (
          <div className="viewer-loader-overlay" role="alert" aria-live="assertive" aria-label={t.loader}>
            <div className="viewer-loader"></div>
            <div className="viewer-progress-text">{progress}%</div>
          </div>
        )}


        <div ref={mountRef} className="viewer-pro-mount" aria-label="3D model viewer" tabIndex={0} style={{ width: "100%", height: "100%" }} />


        {showInfo && item && (
          <div className="viewer-dish-info">
            <div className="viewer-dish-name">{item.name}</div>
            <div className="viewer-dish-desc" style={{ fontSize: descFontSize }}>
              {item.description?.[language] || item.description?.fr || ""}
            </div>
          </div>
        )}


        {item && (
          <div className="viewer-ingredient-nutrition">
            <div className="viewer-small-title">{t.ingredients}</div>
            <ul>
              {ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
            <div className="viewer-small-title">{t.nutrition}</div>
            <ul>
              {nutrition.map(
                (nut, idx) =>
                  nut.value && (
                    <li key={idx}>
                      <span className="viewer-nut-key">{nut.key}:</span>{" "}
                      <span className="viewer-nut-val">{nut.value}</span>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}


        

        <div className="viewer-gif-bloc">
          <div className="viewer-gif-stack">
            <img src={show2Gif} alt="animation zoom" className="viewer-gif-two" />
            <img src={showGif} alt="animation rotation" className="viewer-gif-one" />
          </div>
          {item?.categoryReviews && (
            <AnimatedReviewPanel 
              reviews={item.categoryReviews} 
              clientTitle={t.client} 
              language={language} 
            />
          )}
        </div>

        <div className="comment-btn-container">
          <button
            className="viewer-comment-btn"
            aria-label={commentOpen ? t.cancel : t.addComment}
            onClick={() => setCommentOpen((v) => !v)}
            title={t.addComment}
          >
            <FiMessageCircle size={22} />
          </button>
          {showAnimatedText && <AnimatedText />}
        </div>

        {commentOpen && (
          <div
            className="viewer-comment-popup-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comment-title"
            tabIndex={-1}
            onClick={() => setCommentOpen(false)}
          >
            <div className="viewer-comment-popup" onClick={(e) => e.stopPropagation()}>
              <h4 id="comment-title">{t.addComment}</h4>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.writeComment}
                rows={5}
                className="viewer-comment-textarea"
                aria-label={t.writeComment}
                autoFocus
                dir={isArabic ? "rtl" : "ltr"}
              />
              <div className="viewer-comment-actions">
                <button className="viewer-btn-submit" onClick={submitComment} aria-label={t.send}>
                  {t.send}
                </button>
                <button className="viewer-btn-cancel" onClick={() => setCommentOpen(false)} aria-label={t.cancel}>
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
        

        {thankYouVisible && (
          <div className="thank-you-message" role="alert" aria-live="polite">
            {t.thankYou}
          </div>
        )}
      </div>
    </div>
  {/* Add to Order Button */}
{item && (
  <div style={{ position: "relative", marginTop: "-120px", marginBottom: "16px", textAlign: "center", zIndex: 50 }}>
    <button
      onClick={() => setShowConfirm(true)}
      style={{
        backgroundColor: "#28a745",
        border: "none",
        padding: "14px 28px",
        borderRadius: "10px",
        color: "white",
        fontWeight: "700",
        cursor: "pointer",
        fontSize: "1.2rem",
        minWidth: "180px",
        boxShadow: "0 0 15px 2px rgba(40, 167, 69, 0.8)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "pulseButton 2s infinite",
        transition: "background-color 0.3s",
      }}
      aria-label={translations[language]?.addToOrder || "Order now"}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#218838"}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "#28a745"}
    >
      {translations[language]?.addToOrder || "Order now"}
      <svg
        style={{ marginLeft: "10px", width: 20, height: 20, animation: "arrowMove 1.5s infinite", fill: "white", transform: "scaleX(-1)" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8z" />
      </svg>
      <style>{`
        @keyframes pulseButton {
          0%, 100% { box-shadow: 0 0 15px 2px rgba(40, 167, 69, 0.8); transform: scale(1); }
          50% { box-shadow: 0 0 25px 5px rgba(40, 167, 69, 1); transform: scale(1.05); }
        }
        @keyframes arrowMove {
          0%, 100% { transform: translateX(0) scaleX(-1); }
          50% { transform: translateX(6px) scaleX(-1); }
        }
      `}</style>
    </button>
  </div>
)}

{/* Confirmation Popup */}
{showConfirm && (
  <div
    className="viewer-comment-popup-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-add-title"
    tabIndex={-1}
    onClick={() => setShowConfirm(false)}
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: "#28a745",
        padding: 20,
        borderRadius: 12,
        width: 320,
        maxWidth: "90vw",
        textAlign: "center",
        color: "white",
        fontWeight: 600,
      }}
    >
      <h2 id="confirm-add-title" style={{ marginBottom: "1rem" }}>
        {language === "fr"
          ? `Confirmez-vous l’ajout de ${item.name} ?`
          : language === "ar"
          ? `هل تؤكد إضافة ${item.name}؟`
          : language === "zh"
          ? `确认添加${item.name}？`
          : language === "ru"
          ? `Подтвердите добавление ${item.name}?`
          : `Confirm adding ${item.name}?`}
      </h2>
      <button
        onClick={onConfirmAddToOrder}
        style={{
          backgroundColor: "#1e7e34",
          border: "none",
          padding: "12px 24px",
          borderRadius: 8,
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          marginRight: 12,
          boxShadow: "0 0 10px 2px rgba(30, 126, 52, 0.8)",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#155d27"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1e7e34"}
      >
        {translations[language]?.confirm || (language === "fr" ? "Confirmer" : "Confirm")}
      </button>
      <button
        onClick={cancelAddToOrder}
        style={{
          backgroundColor: "#c3e6cb",
          border: "none",
          padding: "12px 24px",
          borderRadius: 8,
          color: "#155d27",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b1dfbb"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#c3e6cb"}
      >
        {translations[language]?.cancel || (language === "fr" ? "Annuler" : "Cancel")}
      </button>
    </div>
  </div>
)}


<>
  {/* Cart PNG Button - fixed at top left, animates to attract */}
  <div
    role="button"
    tabIndex={0}
    aria-label={translations[language]?.cart || "Panier"}
    onClick={() => setShowCartList(v => !v)}  // Toggle cart list visibility
    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setShowCartList(v => !v); }}
    style={{
      position: "fixed",
      top: 100,
      left: 0,
      width: 48,
      height: 48,
      cursor: "pointer",
      zIndex: 1200,
      userSelect: "none",
      animation: "cartBounce 2s ease-in-out infinite",
    }}
  >
    <img
      src={cartPng}
      alt={translations[language]?.cart || "Panier"}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
    {cartItems.length > 0 && (
      <span
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          transform: "translate(25%, -25%)",
          backgroundColor: "#28a745",
          color: "white",
          borderRadius: "50%",
          width: 20,
          height: 20,
          fontWeight: "700",
          fontSize: "0.75rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 0 5px rgba(0,0,0,0.3)"
        }}
      >
        {cartItems.length}
      </span>
    )}
  </div>

  {/* Cart Sidebar - toggled by button */}
  {showCartList && (
    <div
      style={{
        position: "fixed",
        top: 150,
        left: 0,
        width: 180,
        maxHeight: 280,
        backgroundColor: "rgba(244, 244, 244, 0.8)",
        boxShadow: "3px 0 10px rgba(0,0,0,0.1)",
        overflowY: "auto",
        padding: 6,
        zIndex: 1100,
        fontSize: "0.85rem",
        borderRadius: 6,
      }}
      aria-label={translations[language]?.cart || "Panier"}
    >
      <h3
        style={{
          marginBottom: 8,
          fontWeight: 700,
          color: "#28a745",
          fontSize: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{translations[language]?.cart || "Panier"}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              backgroundColor: "#28a745",
              color: "white",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "0.85rem",
              fontWeight: "700",
            }}
            aria-label={`${cartItems.length} items in cart`}
          >
            {cartItems.length}
          </span>
          <span aria-label="Total price in cart" style={{ fontWeight: "bold" }}>
            {cartItems.length > 0
              ? `${cartItems.reduce((sum, ci) => {
                  const price = parseFloat(ci.price);
                  return sum + (isNaN(price) ? 0 : price);
                }, 0).toFixed(2)}`
              : ""}
          </span>
        </div>
      </h3>

      {cartItems.length === 0 ? (
        <p style={{ fontSize: "0.8rem" }}>
          {translations[language]?.emptyCart || (language === "fr" ? "Votre panier est vide" : "Your cart is empty")}
        </p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {cartItems.map((ci, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                  padding: "2px 6px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <span>{ci.name}</span>
                  <small style={{ fontSize: "0.75rem" }}>{ci.price ? `${ci.price} ` : "-"}</small>
                </div>
                <button
                  style={{
                    marginLeft: 6,
                    background: "#e74c3c",
                    border: "none",
                    borderRadius: 4,
                    padding: "1px 5px",
                    fontSize: "0.7rem",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => setCartItems(prev => prev.filter((_, i) => i !== idx))}
                  aria-label={`${translations[language]?.removeItem || "Remove"} ${ci.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <div
            style={{
              fontWeight: "700",
              marginTop: 6,
              borderTop: "1px solid #ddd",
              paddingTop: 6,
              fontSize: "0.85rem",
              textAlign: "right",
            }}
          >
            {translations[language]?.total || "Total"}:{" "}
            {cartItems.reduce((sum, ci) => {
              const price = parseFloat(ci.price);
              return sum + (isNaN(price) ? 0 : price);
            }, 0).toFixed(2)}
          </div>
        </>
      )}
    </div>
  )}

  {/* Add CSS keyframes animation */}
  <style>{`
    @keyframes cartBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `}</style>
</>




      <style>{`
        .viewer-gif-bloc {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 22px;
  z-index: 15;
}
.animated-review-panel {
  background: rgba(251, 126, 75, 0.94);
  color: #fff;
  min-width: 80px;
  max-width: 140px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 20px rgba(252, 41, 71, 0.13);
  padding: 6px 10px;
  margin: 0 5px;
  align-self: flex-end;
  animation: reviewPulse 2s infinite;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}
.review-client-title {
  font-size: 0.7rem;  /* smaller font size */
  color: black;       /* keep it black if needed */
  font-weight: 900;   /* keep bold or adjust as desired */
}
.review-client-text {
  font-weight: 500;
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.2;
}
@keyframes reviewPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
/* (your existing CSS remains unchanged, keep .viewer-ingredient-nutrition at right) */
.lang-btn {
  background: #ededed;
  border: 1.5px solid #f3f3f3;
  border-radius: 6px;
  margin: 0 6px;
  font-weight: 600;
  color: #343434;
  padding: 4px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.18s, color 0.18s;
  user-select: none;
}
.lang-btn.selected {
  background: #fb7e4b;
  color: #fff;
  border-color: #fc2947;
}
.viewer-lang-row {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  padding: 8px 0;
  position: fixed;
  top: 54px; /* below header */
  left: 0;
  z-index: 97;
}
.viewer3d-pro {
  min-height: 100vh;
  background: #f9fafb;
  overflow-x: hidden;
  font-family: 'Segoe UI', 'Roboto', 'Tahoma', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
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
.viewer-pro-main {
  position: relative;
  width: 100vw;
  height: calc(100vh - 150px); /* slightly increase bottom margin space */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* align top so there is room below */
  margin-top: 106px;
  padding: 10px 0 40px 0; /* add bottom padding for button */
  box-sizing: border-box;
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
  position: relative;
}
.viewer-btn-social {
  background: #fff;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  width: 30px; 
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  box-shadow: 0 2px 8px rgba(33,33,33,0.05);
  transition: box-shadow 0.16s, border 0.15s;
  cursor: pointer;
  position: relative;
  overflow: visible;
}
.viewer-btn-social.insta { border: 2px solid #e1306c; color: #e1306c; }
.viewer-btn-social.whatsapp { border: 2px solid #25d366; color: #25d366;}
.viewer-btn-social.tiktok { border: 2px solid #010101; color: #010101;}
.viewer-btn-social:hover { box-shadow: 0 4px 14px rgba(50,50,50,0.08); border-color: #fb7e4b; }

.whatsapp-share-wrapper {
  position: relative;
  display: flex;
  flex-direction: row; /* horizontal */
  align-items: center;
  gap: "px; /* space between gif and button */
}
.whatsapp-share-gif {
  width: 40px !important;
  height: 40px !important;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  animation: loopAnim 2.5s linear infinite;
}
@keyframes loopAnim {
  0% { transform: rotate(0deg);}
  50% { transform: rotate(10deg);}
  100% { transform: rotate(0deg);}
}

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
  height: 65vh; /* reduce height to make room for the button */
  min-height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px; /* space for the order button */
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
  top: 10px;
  left: 10px;
  background: rgba(255,255,255,0.94);
  box-shadow: 0 2px 8px rgba(252,41,71,0.03);
  border-radius: 5px;
  padding: 4px 7px 3.5px 7px;
  font-size: 10px;
  color: #242424;
  max-width: 120px;
  min-width: 80px;
  z-index: 18;
}
.viewer-dish-name {
  font-weight: 700;
  font-size: 10px;
  color: #fb7e4b;
  margin-bottom: 1.5px;
  line-height: 1.09;
}
.viewer-dish-desc {
  max-width: 100px; /* reduce width */
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.3em; /* increase line height */
  font-size: 10px;
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
  width: 60px;
  height: 60px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(50,50,50,0.08);
  background: #fff;
}

.comment-btn-container {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 40;
  pointer-events: auto;
  user-select: none;
  max-width: 260px;
  width: 100%;
}

.animated-text {
  background: rgba(251, 126, 75, 0.9);
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  animation: pulse 2s infinite;
  box-shadow: 0 2px 8px rgba(251,126,75,0.7);
  cursor: default;
  white-space: normal;
  text-align: center;
  overflow-wrap: break-word;
  pointer-events: none;
  user-select: none;
  word-break: break-word;
}

.viewer-comment-btn {
  background: #fb7e4b;
  border: none;
  border-radius: 50%;
  padding: 6px;
  color: white;
  cursor: pointer;
  box-shadow: 0 3px 9px rgba(251,126,75,0.12);
  transition: background-color 0.17s, transform 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2.5s infinite;
  width: 38px;
  height: 38px;
  font-size: 20px;
  flex-shrink: 0;
}

.viewer-comment-btn:hover {
  background: #fc2947;
  transform: scale(1.1);
  animation-play-state: paused;
}

.viewer-comment-btn:focus {
  outline: 2px solid #fc2947;
  outline-offset: 2px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
  60% {
    transform: translateY(-3px);
  }
}

.viewer-comment-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.viewer-comment-popup {
  background: #fff;
  width: 340px;
  max-width: 90vw;
  border-radius: 12px;
  padding: 24px 20px 20px 20px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.24);
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.viewer-comment-popup h4 {
  margin: 0;
  font-weight: 700;
  font-size: 1.2rem;
  color: #fc2947;
  text-align: center;
}

.viewer-comment-textarea {
  width: 100%;
  resize: vertical;
  min-height: 100px;
  max-height: 180px;
  padding: 10px 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1.5px solid #ddd;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.viewer-comment-textarea:focus {
  outline: none;
  border-color: #fc2947;
  box-shadow: 0 0 6px rgba(252,41,71,0.3);
}

.viewer-comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 6px;
}

.viewer-btn-submit,
.viewer-btn-cancel {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
  min-width: 80px;
  box-shadow: 0 2px 7px rgba(0,0,0,0.1);
}

.viewer-btn-submit {
  background: #fb7e4b;
  color: #fff;
}

.viewer-btn-submit:hover {
  background: #fc2947;
  box-shadow: 0 3px 10px rgba(252,41,71,0.45);
}

.viewer-btn-cancel {
  background: #ededed;
  color: #333;
}

.viewer-btn-cancel:hover {
  background: #ffeafd;
  box-shadow: 0 3px 10px rgba(251,126,75,0.35);
}

/* Centered thank you message */
.thank-you-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(251, 126, 75, 0.95);
  padding: 18px 30px;
  border-radius: 14px;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 6px 20px rgba(251,126,75,0.6);
  z-index: 10000;
  user-select: none;
  pointer-events: none;
  animation: fadeinout 3s forwards;
  text-align: center;
  min-width: 220px;
}

@keyframes fadeinout {
  0%, 20% { opacity: 0; transform: translate(-50%, -60%); }
  30%, 80% { opacity: 1; transform: translate(-50%, -50%); }
  90%, 100% { opacity: 0; transform: translate(-50%, -40%); }
}

@media (max-width: 850px) {
  .viewer-pro-container {
    width: 100vw;
    min-height: 180px;
    padding: 0 12px;
    box-sizing: border-box;
  }

  .viewer-dish-info {
    top: 5px;
    left: 5px;
    padding: 2px 4px 2.5px 4px;
    font-size: 9px;
    max-width: 80vw;
    min-width: 40px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    line-height: 1.4em;
    box-sizing: border-box;
  }
  .viewer-dish-desc {
    font-size: 7px !important;        /* Smaller font */
    max-width: 190px !important;      /* Narrower container */
    line-height: 1.3em !important;
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    word-break: break-word !important;
  }
}


  .viewer-ingredient-nutrition {
    right: 8px;
    bottom: 7px;
    font-size: 8px;
    width: 80px;
    max-width: 80px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    line-height: 1.3em;
    box-sizing: border-box;
  }

  .viewer-gif-bloc {
    left: 7px;
    bottom: 7px;
  }

  .viewer-gif-one, .viewer-gif-two {
    width: 50px;
    height: 50px;
  }

  .comment-btn-container {
    top: 24px;
    right: 24px;
    max-width: 180px;
  }

  .animated-text {
    font-size: 12px;
    padding: 4px 10px;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    box-sizing: border-box;
  }

  .viewer-comment-btn {
    padding: 4px;
    width: 30px;
    height: 30px;
    font-size: 18px;
  }

  .viewer-comment-popup {
    width: 95vw;
    padding: 16px 14px 14px 14px;
  }

  .viewer-comment-textarea {
    min-height: 80px;
    font-size: 0.9rem;
  }

  .viewer-btn-submit, .viewer-btn-cancel {
    font-size: 0.9rem;
    padding: 6px 14px;
  }

  .thank-you-message {
    min-width: 180px;
    padding: 14px 20px;
    font-size: 1.1rem;
  }

  .whatsapp-share-wrapper img.whatsapp-share-gif {
    width: 22px;
    height: 22px;
    animation: loopAnim 2.5s linear infinite;
  }

  @keyframes whatsappBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
}

.viewer-btn-social.whatsapp {
  animation: whatsappBounce 2s infinite;
}

.viewer-gif-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: absolute;
  left: 14px;
  bottom: 14px;
  z-index: 16;
}

.viewer-gif-one, .viewer-gif-two {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(50,50,50,0.08);
  background: #fff;
  cursor: pointer;
}

/* Responsive for phones */
@media (max-width: 700px) {
  .animated-review-panel {
    min-width: 60px;
    max-width: 110px;
    padding: 4px 7px;
    font-size: 10px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    line-height: 1.3em;
  }

  .review-client-title {
    font-size: 0.6rem;  /* even smaller on mobile */
  }

  .review-client-text {
    font-size: 0.8rem;
  }
}

.animated-review-panel .review-client-title {
  display: flex;
  align-items: center;
  color: black !important;  /* Make text black */
}

.comment-gif {
  width: 24px;           /* Adjust as needed */
  height: 24px;
  margin-right: 6px;     /* Spacing between gif and text */
}


      `
        }</style>
    </div>
  );
}





