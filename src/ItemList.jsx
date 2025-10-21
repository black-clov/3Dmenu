import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "./Context/DataContext.jsx";
import arGif from "./animated2.gif";
import { io } from "socket.io-client";

import { useLocation} from "react-router-dom";
import stepsIphoneVideo from "./steps_iphone_activate_location.mp4";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}



const languageLabels = {
  fr: "FR",
  en: "EN",
  ar: "العربية",
  zh: "中文",
  ru: "RU",
};

const translations = {
fr: {
all: "Tous",
noItems: "Aucun item trouvé",
cart: "Panier",
emptyCart: "Votre panier est vide",
removeItem: "Supprimer l'article",
submitOrder: "Passer commande au restaurant",
confirmOrder: "Confirmez-vous votre commande ?",
orderSubmitted: "Commande envoyée !",
tokenExpiredMessage: "Vous devez être dans le restaurant pour passer commande. Veuillez scanner à nouveau le QR code de la table",
emptyCartMessage: "Votre panier est vide",
confirmOrderTitle: "Confirmez-vous votre commande ?",
confirmOrderDescription: "Cette action ne peut pas être annulée. Êtes-vous sûr de vouloir continuer ?",
confirmButton: "Confirmer",
cancelButton: "Annuler",
invalidRestaurant: "Restaurant invalide",
geolocationNotSupported: "La géolocalisation n'est pas prise en charge par votre navigateur",
notInRestaurant: "Veuillez être dans le restaurant pour passer commande",
locationAccessDenied: "Impossible d'accéder à votre position. Veuillez autoriser la géolocalisation",
scanQRCode: "Veuillez scanner le QR code de la table",
serverConnectionError: "Impossible de se connecter au serveur",
locationGuideTitle: "Activer la géolocalisation",
locationGuideExplanation:"Pour utiliser cette application, veuillez activer la géolocalisation dans les réglages de votre iPhone. Cela permet de vérifier que vous êtes bien dans le restaurant.",
locationGuideClose: "Fermer",

},
en: {
all: "All",
noItems: "No items found",
cart: "Cart",
emptyCart: "Your cart is empty",
removeItem: "Remove item",
submitOrder: "Submit Order",
confirmOrder: "Confirm your order?",
orderSubmitted: "Order submitted!",
tokenExpiredMessage: "You should be in the restaurant to order. Please scan your table QR code again.",
emptyCartMessage: "Your cart is empty",
confirmOrderTitle: "Confirm your order?",
confirmOrderDescription: "This action cannot be undone. Are you sure you want to proceed?",
confirmButton: "Confirm",
cancelButton: "Cancel",
confirmOrderTitle: "Confirm your order?",
confirmOrderDescription: "This action cannot be undone. Are you sure you want to proceed?",
confirmButton: "Confirm",
cancelButton: "Cancel",
invalidRestaurant: "Invalid restaurant",
geolocationNotSupported: "Geolocation is not supported by your browser",
notInRestaurant: "Please be in the restaurant to place an order.",
locationAccessDenied: "Unable to access your location. Please allow location access.",
scanQRCode: "Please scan your table QR code.",
serverConnectionError: "Unable to connect to server",
locationGuideTitle: "Enable Location Services",
locationGuideExplanation:"To use this app, please enable location services in your iPhone settings. This allows verification that you are physically in the restaurant.",
locationGuideClose: "Close",

},
ar: {
all: "الكل",
noItems: "لا توجد عناصر",
cart: "عربة التسوق",
emptyCart: "عربة التسوق فارغة",
removeItem: "إزالة العنصر",
submitOrder: "إرسال الطلب",
confirmOrder: "هل تؤكد طلبك؟",
orderSubmitted: "تم إرسال الطلب!",
tokenExpiredMessage: "يجب أن تكون في المطعم للطلب. يرجى مسح رمز الاستجابة السريعة للطاولة مرة أخرى",
emptyCartMessage: "عربة التسوق فارغة",
confirmOrderTitle: "هل تؤكد طلبك؟",
confirmOrderDescription: "هذه العملية لا يمكن التراجع عنها. هل أنت متأكد أنك تريد المتابعة؟",
confirmButton: "تأكيد",
cancelButton: "إلغاء",
invalidRestaurant: "مطعم غير صالح",
geolocationNotSupported: "لا يدعم متصفحك نظام تحديد المواقع",
notInRestaurant: "يرجى التواجد داخل المطعم لتقديم الطلب",
locationAccessDenied: "غير قادر على الوصول إلى موقعك. يرجى السماح بالوصول إلى الموقع",
scanQRCode: "يرجى مسح رمز الاستجابة السريعة للطاولة",
serverConnectionError: "غير قادر على الاتصال بالخادم",
locationGuideTitle: "تفعيل خدمات الموقع",
locationGuideExplanation:"لاستخدام هذا التطبيق، يرجى تفعيل خدمات الموقع في إعدادات جهاز iPhone الخاص بك. هذا يسمح بالتحقق من وجودك داخل المطعم.",
locationGuideClose: "إغلاق",

},
zh: {
all: "全部",
noItems: "未找到商品",
cart: "购物车",
emptyCart: "您的购物车为空",
removeItem: "移除商品",
submitOrder: "提交订单",
confirmOrder: "确认您的订单？",
orderSubmitted: "订单已提交!",
emptyCartMessage: "您的购物车为空",
confirmOrderTitle: "确认您的订单？",
confirmOrderDescription: "此操作无法撤销。您确定要继续吗？",
confirmButton: "确认",
cancelButton: "取消",
invalidRestaurant: "无效的餐厅",
geolocationNotSupported: "您的浏览器不支持地理位置",
notInRestaurant: "请在餐厅内下单",
locationAccessDenied: "无法访问您的位置。请允许位置访问",
scanQRCode: "请扫描您的餐桌二维码]",
serverConnectionError: "无法连接到服务器",
locationGuideTitle: "启用定位服务",
locationGuideExplanation:"要使用此应用程序，请在您的 iPhone 设置中启用定位服务。这有助于验证您是否在餐厅内。",
locationGuideClose: "关闭",

},
ru: {
all: "Все",
noItems: "Товары не найдены",
cart: "Корзина",
emptyCart: "Ваша корзина пуста",
removeItem: "Удалить товар",
submitOrder: "Отправить заказ",
confirmOrder: "Подтвердите ваш заказ?",
orderSubmitted: "Заказ отправлен!",
emptyCartMessage: "Ваша корзина пуста",
confirmOrderTitle: "Подтвердите ваш заказ?",
confirmOrderDescription: "Это действие нельзя отменить. Вы уверены, что хотите продолжить?",
confirmButton: "Подтвердить",
cancelButton: "Отмена",
invalidRestaurant: "Недопустимый ресторан",
geolocationNotSupported: "Геолокация не поддерживается вашим браузером",
notInRestaurant: "Пожалуйста, находиться в ресторане для оформления заказа",
locationAccessDenied: "Невозможно определить ваше местоположение. Пожалуйста, разрешите доступ к геолокации",
scanQRCode: "Пожалуйста, отсканируйте QR-код вашего стола",
serverConnectionError: "Невозможно подключиться к серверу",
locationGuideTitle: "Включите службы геолокации",
locationGuideExplanation:"Чтобы использовать это приложение, включите службы геолокации в настройках вашего iPhone. Это позволит проверить, что вы находитесь в ресторане.",
locationGuideClose: "Закрыть",
}
};

export default function ItemList() {
  const { categoryId, businessId, tableId } = useParams();
  const navigate = useNavigate();
  const { items = [], businesses = [], trackEvent } = useData();

  const [showOrderSentPopup, setShowOrderSentPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(() => () => {});
  const socketRef = useRef(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  
  

  const query = useQuery();

 const backendBaseURL = "https://threedmenu-server.onrender.com/";

async function fetchCurrentToken(tableId) {
  try {
    const response = await fetch(`${backendBaseURL}/api/tokens/current?tableId=${tableId}`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    if (data.token) {
      sessionStorage.setItem("tableToken", data.token);
      sessionStorage.setItem("tableId", tableId);
      console.log("Token stored in sessionStorage:", data.token);
      return data.token;
    }
    throw new Error(data.error || "No token returned");
  } catch (err) {
    console.error("Failed to fetch current token:", err);
    return null;
  }
}


  // Single useEffect to fetch and store token on tableId change
const urlToken = query.get("token");

useEffect(() => {
  async function updateToken() {
    if (!tableId) return;

    if (urlToken) {
      sessionStorage.setItem("tableToken", urlToken);
      sessionStorage.setItem("tableId", tableId);
      console.log("Token from URL used:", urlToken);
    }

    const savedToken = sessionStorage.getItem("tableToken");
    const savedTableId = sessionStorage.getItem("tableId");

    if (!savedToken || savedTableId !== tableId) {
      const freshToken = await fetchCurrentToken(tableId);
      if (freshToken) {
        const url = new URL(window.location);
        url.searchParams.set("token", freshToken);
        window.history.replaceState({}, "", url);
      }
    } else {
      console.log("Token already stored:", savedToken);
    }
  }
  updateToken();
}, [tableId, urlToken]);


  const openConfirmPopup = (onConfirm) => {
    setConfirmCallback(() => onConfirm);
    setShowConfirmPopup(true);
  };

  const [sessionId] = useState(() => {
    let sid = window.sessionStorage.getItem("sessionId");
    if (!sid) {
      sid = Math.random().toString(36).substr(2, 9);
      window.sessionStorage.setItem("sessionId", sid);
    }
    return sid;
  });

  const STORAGE_CART_KEY = `cartItems-${sessionId}`;

  const loadCart = () => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [cartItems, setCartItems] = useState(loadCart);

  useEffect(() => {
    if (!sessionId) return;
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems, STORAGE_CART_KEY]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function getClientId() {
    let clientId = localStorage.getItem("clientId");
    if (!clientId) {
      clientId = "client-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("clientId", clientId);
    }
    return clientId;
  }
  const [clientId] = useState(getClientId);

  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState(translations.fr.all);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("appLanguage") || "fr";
  });

  // Persist selected language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);


  const currentBusiness = businesses.find((b) => b.id === businessId);

  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [businessId]);

  const foodTabs = useMemo(() => {
    if (!currentBusiness?.categories?.length)
      return [translations[language]?.all || "Tous"];
    const categoryNames = currentBusiness.categories.map(
      (catObj) => catObj[language] || catObj.fr || ""
    );
    return [translations[language]?.all || "Tous", ...categoryNames];
  }, [currentBusiness, language]);

  const activeCategoryObj = useMemo(() => {
    if (activeTab === (translations[language]?.all || "Tous")) return null;
    if (!currentBusiness?.categories?.length) return null;
    return currentBusiness.categories.find(
      (catObj) => (catObj[language] || catObj.fr) === activeTab
    );
  }, [activeTab, currentBusiness, language]);

  useEffect(() => {
    if (!Array.isArray(items)) {
      setFilteredItems([]);
      return;
    }
    let result = items.filter(
      (i) => i.category === categoryId && i.business === businessId
    );
    if (activeCategoryObj) {
      const filterKey = activeCategoryObj.fr;
      result = result.filter((i) =>
        Array.isArray(i.type) ? i.type.includes(filterKey) : i.type === filterKey
      );
    }
    setFilteredItems(result);
  }, [categoryId, businessId, items, activeCategoryObj]);

  const handleBackToBusiness = () => {
    navigate(`/category/${categoryId}`, { replace: true });
  };

  const handleView3D = (item) => {
    if (trackEvent) {
      trackEvent("Item Click", {
        itemId: item.id,
        name: item.name,
        businessId,
        categoryId,
        clientId,
        tableId,
      });
    }
    if (tableId) {
      navigate(
        `/category/${categoryId}/business/${businessId}/table/${tableId}/item/${item.id}`
      );
    } else {
      navigate(`/category/${categoryId}/business/${businessId}/item/${item.id}`);
    }
  };

  const removeItemFromCart = (index) => {
    setCartItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(updated));
      return updated;
    });
  };

 useEffect(() => {
  socketRef.current = io("https://threedmenu-server.onrender.com/", {
  transports: ["websocket", "polling"],
});

  socketRef.current.on("connect", () => {
    console.log("Socket connected:", socketRef.current.id);
  });

  socketRef.current.on("orderReceived", async () => {
  sessionStorage.removeItem("tableToken");
  sessionStorage.removeItem("tableId");

  setShowOrderSentPopup(true);
  setTimeout(() => setShowOrderSentPopup(false), 60000);

  if (tableId) {
    const newToken = await fetchCurrentToken(tableId);
    if (newToken) {
      const url = new URL(window.location);
      url.searchParams.set("token", newToken);
      window.history.replaceState({}, "", url.toString());
    }
  }
});



  socketRef.current.on("orderError", (error) => {
  try {
    console.error("Order error:", error);
    if (
      error.error === "Session token has already been used" ||
      error.error === "Session token has expired"
    ) {
      setTokenExpired(true);
      setShowOrderSentPopup(false);  // Hides success panel if shown
      sessionStorage.removeItem("tableToken");
      sessionStorage.removeItem("tableId");
    } else {
      alert(language === "fr" ? "Erreur lors de l’envoi de la commande" : "Error submitting order");
    }
    setShowConfirmPopup(false);
  } catch (error) {
    console.error("Error handling orderError:", error);
  }
});



  return () => {
    if (socketRef.current) {
      socketRef.current.off("orderReceived");
      socketRef.current.off("orderError");
      socketRef.current.disconnect();
    }
  };
}, [language]);


// Helper: calculates distance between two lat/lng points in meters
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


const currentRestaurant = businesses.find((b) => b.id === businessId);
const [showLocationGuide, setShowLocationGuide] = useState(false);
const videoRef = useRef(null);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;


const [isFetchingLocation, setIsFetchingLocation] = useState(false);

const submitOrder = () => {
  if (cartItems.length === 0) {
    alert(translations[language]?.emptyCartMessage || translations.fr.emptyCartMessage);
    return;
  }

  if (!currentRestaurant) {
    alert(translations[language]?.invalidRestaurant || translations.fr.invalidRestaurant);
    return;
  }

  if (!navigator.geolocation) {
    alert(translations[language]?.geolocationNotSupported || translations.fr.geolocationNotSupported);
    openConfirmPopup(proceedWithOrder);
    return;
  }

  setIsFetchingLocation(true); // Show loading spinner

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setIsFetchingLocation(false); // Hide spinner on success

      const { latitude, longitude } = position.coords;
      const distance = getDistanceFromLatLonInMeters(
        latitude,
        longitude,
        currentRestaurant.latitude,
        currentRestaurant.longitude
      );

      if (distance <= currentRestaurant.radiusMeters) {
        openConfirmPopup(proceedWithOrder);
      } else {
        alert(translations[language]?.notInRestaurant || translations.fr.notInRestaurant);
      }
    },
    (error) => {
      setIsFetchingLocation(false); // Hide spinner on error

      const locationDenied =
        error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE;

      if (locationDenied && isIOS) {
        setShowLocationGuide(true);
      } else if (locationDenied) {
        alert(translations[language]?.locationAccessDenied || translations.fr.locationAccessDenied);
      } else {
        alert(translations[language]?.locationAccessDenied || translations.fr.locationAccessDenied);
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 10000,
    }
  );



  // The actual function to proceed with order submission after confirmation
  function proceedWithOrder() {
  const currentTableId = sessionStorage.getItem("tableId");
  const sessionToken = sessionStorage.getItem("tableToken");

  if (!sessionToken || !currentTableId) {
    alert(translations[language]?.scanQRCode || translations.fr.scanQRCode);
    setShowConfirmPopup(false);
    return;
  }

  const orderData = {
    userId: clientId,
    tableName: currentTableId,
    sessionToken,
    businessId,
    categoryId,
    items: cartItems.map(({ id, name, price }) => ({ id, name, price })),
  };

  setCartItems([]);

  if (!socketRef.current || !socketRef.current.connected) {
    alert(translations[language]?.serverConnectionError || translations.fr.serverConnectionError);
    return;
  }

  socketRef.current.emit("submitOrder", orderData);

  setShowConfirmPopup(false);
}

};













 return (
  <div className="item-list-container">
    {/* <button
      onClick={handleBackToBusiness}
      className="item-back-btn-floating"
      aria-label="Retour"
    >
      <span className="arrow">←</span>
    </button>*/}
    {currentBusiness && (
      <div
        className="business-header-row"
        key={`logowrap-${animKey}`}
        aria-hidden="true"
      >
        <div className="business-name-inline" aria-hidden="true">
          <span className="business-name-text">{currentBusiness.name}</span>
        </div>
        <div
          className="business-logo-topright"
          aria-label={`${currentBusiness.name} logo`}
        >
          <img
            src={currentBusiness.image}
            alt={currentBusiness.name}
            loading="lazy"
          />
        </div>
      </div>
    )}

    <div className="itemlist-category-bar-outer">
      <div className="itemlist-category-bar-inner">
        {foodTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`itemlist-category-btn${
                isActive ? " itemlist-category-btn-active" : ""
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>

    <nav
      className="language-vertical-nav"
      role="navigation"
      aria-label="Select language"
    >
      {Object.entries(languageLabels).map(([code, label]) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`lang-btn-vertical ${language === code ? "selected" : ""}`}
          aria-pressed={language === code}
          aria-label={`Switch language to ${label}`}
        >
          {label}
        </button>
      ))}
    </nav>

    <div className="content-main">
      <div className="itemlist-grid">
        {filteredItems.length === 0 && (
          <div className="no-items-msg">
            {translations[language]?.noItems || translations.fr.noItems}
          </div>
        )}
        <div className="itemlist-grid-structure">
          {filteredItems.map((i, idx) => (
            <div
              key={i.id}
              onClick={() => handleView3D(i)}
              className="item-card animate-fadein"
              style={{ animationDelay: `${idx * 0.09}s` }}
              tabIndex={0}
              role="button"
              aria-label={`${translations[language]?.all || "Voir"} ${i.name}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleView3D(i);
              }}
            >
              <div className="item-img-gif-row">
                <div className="item-image-gif-container">
                  {i.image ? (
                    <img
                      src={i.image}
                      alt={i.name}
                      className="item-image"
                      loading="lazy"
                      style={{ height: "90px" }}
                    />
                  ) : (
                    <div className="no-image" style={{ height: "90px" }}>
                      [translate:No Image]
                    </div>
                  )}
                </div>
                <img
                  src={arGif}
                  alt="[translate:AR animation]"
                  className="ar-gif-row"
                />
              </div>

              {i.price && (
                <div className="item-price-absolute">
                  <span>{i.price}</span>
                </div>
              )}

              <div className="p-5 pt-2 flex flex-col gap-2 items-center">
                <h2 className="item-name">{i.name}</h2>
              </div>

              <div className="arrow-icon">›</div>
            </div>
          ))}
        </div>
      </div>
      
{/* Cart page */}
<div
  style={{
    position: "fixed",
    top: 170,
    right: 0,
    width: 140,
    maxHeight: 220,
    backgroundColor: "rgba(244,244,244,0.8)",
    boxShadow: "3px 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    padding: 4,
    zIndex: 1100,
    fontSize: "0.75rem",
    borderRadius: 8,
    animation: "cartPanelWobble 1.5s ease-in-out infinite",
  }}
  aria-label={translations[language]?.cart || "Cart"}
>
  <style>{`
    @keyframes cartPanelWobble {
      0%, 100% { transform: translateY(0); }
      20% { transform: translateY(-4px); }
      60% { transform: translateY(4px); }
    }
  `}</style>

  <h3
    style={{
      marginBottom: 6,
      fontWeight: 600,
      color: "#28a745",
      fontSize: "0.85rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span>{translations[language]?.cart || "Cart"}</span>
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span
        style={{
          backgroundColor: "#28a745",
          color: "white",
          borderRadius: "50%",
          width: 20,
          height: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.75rem",
          fontWeight: 600,
        }}
        aria-label={`${cartItems.length} items in cart`}
      >
        {cartItems.length}
      </span>
      <span aria-label="Total price in cart">
        {cartItems.length > 0
          ? `${cartItems.reduce((sum, ci) => {
              const price = parseFloat(ci.price);
              return sum + (isNaN(price) ? 0 : price);
            }, 0).toFixed(2)} `
          : ""}
      </span>
    </div>
  </h3>

  {/* Scrollable list area */}
  <div style={{ flex: 1, overflowY: "auto" }}>
  {cartItems.length === 0 ? (
    <div
      role="alert"
      aria-live="polite"
      style={{
        padding: '20px',
        margin: '20px auto',
        maxWidth: '300px',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        color: '#6c757d',
        fontWeight: 600,
        fontSize: '1rem',
        textAlign: 'center',
      }}
    >
      {translations[language]?.emptyCartMessage || translations.fr.emptyCartMessage}
    </div>
  ) : (
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
            fontSize: "0.7rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <span>{ci.name}</span>
            <br />
            <small>{ci.price ? `${ci.price} ` : "-"}</small>
          </div>
          <button
            style={{
              background: "#e74c3c",
              border: "none",
              borderRadius: 4,
              padding: "1px 5px",
              fontSize: "0.7rem",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setCartItems((prev) => prev.filter((_, i) => i !== idx))}
            aria-label={`${translations[language]?.removeItem || "Remove"} ${ci.name}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )}
</div>

  {/* Submit order button always visible at bottom */}
  <button
    onClick={submitOrder}
    style={{
      marginTop: 6,
      width: "100%",
      padding: "6px 0",
      borderRadius: 6,
      backgroundColor: "#28a745",
      border: "none",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "0.85rem",
      flexShrink: 0,
    }}
    aria-label={translations[language]?.submitOrder || "Submit order to restaurant"}
  >
    {translations[language]?.submitOrder || "Submit Order"}
  </button>
</div>

{/* Confirm popup rendered separately */}
{showConfirmPopup && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: "100vw",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 3000,
    }}
    aria-modal="true"
    role="dialog"
    aria-labelledby="confirm-popup-title"
    aria-describedby="confirm-popup-desc"
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "24px 32px",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        maxWidth: 350,
        width: "90%",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 id="confirm-popup-title" style={{ marginBottom: 12, fontWeight: 700 }}>
  {translations[language]?.confirmOrderTitle || translations.fr.confirmOrderTitle}
</h2>
<p id="confirm-popup-desc" style={{ marginBottom: 24, fontSize: "1rem", color: "#333" }}>
  {translations[language]?.confirmOrderDescription || translations.fr.confirmOrderDescription}
</p>
<div style={{ display: "flex", justifyContent: "space-around" }}>
  <button
    onClick={() => confirmCallback()}
    style={{
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "1rem",
      boxShadow: "0 4px 10px rgba(40,167,69,0.6)",
      transition: "background-color 0.2s ease",
    }}
    onMouseOver={e => (e.currentTarget.style.backgroundColor = "#218838")}
    onMouseOut={e => (e.currentTarget.style.backgroundColor = "#28a745")}
    aria-label={translations[language]?.confirmOrderTitle || "Confirm order"}
  >
    {translations[language]?.confirmButton || translations.fr.confirmButton}
  </button>
  <button
    onClick={() => setShowConfirmPopup(false)}
    style={{
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "1rem",
      boxShadow: "0 4px 10px rgba(220,53,69,0.6)",
      transition: "background-color 0.2s ease",
    }}
    onMouseOver={e => (e.currentTarget.style.backgroundColor = "#c82333")}
    onMouseOut={e => (e.currentTarget.style.backgroundColor = "#dc3545")}
    aria-label={translations[language]?.cancelButton || "Cancel"}
  >
    {translations[language]?.cancelButton || translations.fr.cancelButton}
  </button>
</div>

    </div>
  </div>
)}

{/* Animated Order Sent Popup */}
{showOrderSentPopup && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    }}
    aria-live="polite"
    aria-modal="true"
    role="alertdialog"
  >
    <div
      style={{
        backgroundColor: "#28a745",
        color: "white",
        padding: 30,
        borderRadius: 12,
        maxWidth: 320,
        width: "90vw",
        height: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 20px 5px rgba(40,167,69,0.9)",
        animation: "popupBounce 1s ease forwards",
        fontWeight: "700",
        fontSize: "1.1rem",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <img
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXFvcDFwY2ZxbW9jb2tyYnE4NDdsN243YWhqaW8yeW4wbThyM2M3byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VSwEwYy5mrKwINV1NE/giphy.gif"
          alt="Order sent animation"
          style={{ maxWidth: "100%", height: 130 }}
        />
      </div>
      <p style={{ color: "white" }}>
        {language === "fr"
          ? "Votre commande a été envoyée à la cuisine et sera traitée sous peu."
          : "Your order has been sent to the kitchen and will be processed shortly."}
      </p>
    </div>

    <style>{`
      @keyframes popupBounce {
        0% { transform: scale(0.5); opacity: 0; }
        60% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
)}
{tokenExpired && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#8B0000",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 3100,
      color: "white",
      fontWeight: "700",
      fontSize: "1.2rem",
      textAlign: "center",
      padding: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}
    role="alertdialog"
    aria-live="assertive"
  >
    {translations[language]?.tokenExpiredMessage ?? translations.fr.tokenExpiredMessage}
  </div>
)}

{showLocationGuide && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      zIndex: 5000,
      overflowY: "auto",
    }}
    role="dialog"
    aria-modal="true"
    aria-label={translations[language]?.locationGuideTitle || translations.fr.locationGuideTitle}
  >
    <p
      style={{
        color: "white",
        fontSize: "1rem",
        fontWeight: 600,
        maxWidth: 360,
        textAlign: "center",
        marginBottom: 20,
      }}
    >
      {translations[language]?.locationGuideExplanation || translations.fr.locationGuideExplanation}
    </p>
    <video
      ref={videoRef}
      src={stepsIphoneVideo}
      style={{
        width: "320px",
        maxWidth: "90vw",
        aspectRatio: "9 / 16",
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
        backgroundColor: "#000",
      }}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
    />
    <button
      onClick={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        setShowLocationGuide(false);
      }}
      style={{
        marginTop: 30,
        padding: "12px 36px",
        fontSize: "1.1rem",
        fontWeight: "700",
        color: "#fff",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        boxShadow: "0 6px 15px rgba(40,167,69,0.7)",
      }}
      aria-label={translations[language]?.locationGuideClose || translations.fr.locationGuideClose}
    >
      {translations[language]?.locationGuideClose || translations.fr.locationGuideClose}
    </button>
  </div>
)}

{isFetchingLocation && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 6000,
    }}
    aria-live="polite"
    aria-label="Loading location permission"
  >
    <div className="spinner" />
  </div>
)}


 </div>
 
      <style>{`
        .item-list-container {
          max-width: 1160px;
          margin: 0 auto;
          background: #f9fafb;
          min-height: 100vh;
          padding: 0 14px 44px 14px;
          position: relative;
          font-family: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          display: flex;
        }
        .item-back-btn-floating {
          position: fixed;
          left: 22px;
          top: 17px;
          z-index: 110;
          background: linear-gradient(90deg,#fc2947 40%,#fb7e4b 100%);
          border: none;
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 1.05rem;
          box-shadow: 0 4px 14px rgba(252,41,71,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 180ms ease, background 180ms ease;
          cursor: pointer;
        }
        .item-back-btn-floating:hover { transform: translateY(-2px); }
        .item-back-btn-floating .arrow { font-size:18px; }
        .business-header-row {
  position: fixed;
  top: 12px;
  right: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: none;
  z-index: 120;
  background: white;
  padding: 4px 10px;
  border-radius: 12px;
  box-shadow: 0 2px 14px rgba(252,41,71,0.12);
}
        .business-logo-topright {
          width: 52px;
          height: 52px;
          border-radius: 9999px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .business-logo-topright img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 9999px;
        }
        .business-name-inline {
          height: 52px;
          display: flex;
          align-items: center;
        }
        .business-name-text {
          color: #fc2947;
          font-weight: 700;
          font-size: 1.3rem;
          letter-spacing: 0.01em;
          text-shadow: 0 4px 18px rgba(252,41,71,0.12);
        }

        .itemlist-category-bar-outer {
  position: fixed;
  top: 82px; /* below restaurant header */
  right: 18px;
  width: fit-content;
  max-width: 80vw;
  background-color: white;
  border-radius: 14px;
  box-shadow: 0 2px 14px rgba(252,41,71,0.07);
  padding: 8px 15px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px 16px;
  z-index: 119;
}

        .itemlist-category-btn {
          padding: 6px 14px;
          border-radius: 10px;
          border: none;
          color: #fc2947;
          background: #fff;
          box-shadow: 0 1.5px 8px rgba(239,68,68,0.07);
          cursor: pointer;
          transition: background-color 0.18s, color 0.18s, transform 0.12s;
          font-weight: 600;
          font-size: 0.85rem;
          white-space: nowrap;
        }
        .itemlist-category-btn:hover:not(.itemlist-category-btn-active) {
          background: #fb7e4b;
          color: #fff;
          transform: translateY(-2px) scale(1.02);
        }
        .itemlist-category-btn-active {
          background: linear-gradient(90deg, #fc2947 40%, #fb7e4b 100%);
          color: #fff;
          box-shadow: 0 2px 32px rgba(252,41,71,0.16);
        }

        /* Vertical language nav */
        .language-vertical-nav {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fff;
  padding: 8px 12px;
  border-radius: 0 12px 12px 0;
  box-shadow: 0 2px 12px rgba(252,41,71,0.1);
  z-index: 130;
  width: 56px;
}
.lang-btn-vertical {
  border: 1.5px solid #f3f3f3;
  background: #ededed;
  color: #343434;
  font-weight: 600;
  padding: 6px 0;
  width: 38px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  text-align: center;
  transition: background 0.2s, color 0.2s;
  user-select: none;
}
.language-vertical-nav .lang-btn-vertical.selected {
  background: #fb7e4b;
  color: #fff;
  border-color: #fc2947;
}

.content-main {
  margin-left: 90px; /* space for vertical language nav */
  padding-top: 130px; /* space for header + categories */
  width: calc(100% - 90px);
  box-sizing: border-box;
}

@media (max-width: 600px) {
 .language-vertical-nav {
    top: 160px;  /* adjust as needed */
    left: 10px;
    transform: none;
    padding: 6px 10px;
    width: 48px;
  }
  .lang-btn-vertical {
    width: 32px;
    padding: 4px 0;
    font-size: 10px;
  }
  .content-main {
    margin-left: 60px;
    padding-top: 210px;
    width: calc(100% - 60px);
  }
  .itemback-btn-floating {
    top: 10px;
    left: 12px;
  }
}


        .itemlist-grid { width: 100%; }
        .itemlist-grid-structure {
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          row-gap: 32px;
          column-gap: 44px;
          max-width: 1040px;
        }
        .item-card {
          background: #fff;
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          box-shadow: 0 8px 26px rgba(0,0,0,0.04);
          transition: transform 220ms ease, box-shadow 220ms ease;
          min-height: 200px;
          position: relative;
        }
        .item-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .item-img-gif-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding-top: 12px;
        }
        .item-image {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 9999px;
          border: 4px solid #f87171;
          box-shadow: 0 6px 20px rgba(248,113,113,0.12);
          transition: transform 260ms;
        }
        .item-card:hover .item-image {
          transform: scale(1.06);
        }
        .ar-gif-row {
          width: 42px;
          height: 42px;
          margin-left: 12px;
        }
        .item-price-absolute {
          position: absolute;
          left: 0;
          right: 0;
          top: 110px;
          display: flex;
          justify-content: center;
          z-index: 8;
        }
        .item-price-absolute span {
          background: linear-gradient(98deg,#ff0000ff 21%,#059b3fff 90%);
          color: #fff;
          padding: 9px 18px;
          border-radius: 9999px;
          font-weight: 900;
          box-shadow: 0 8px 24px rgba(246,42,56,0.09);
        }
        .item-name {
          text-align: center;
          font-size: 0.85rem;       /* smaller font size */
          font-weight: 600;         /* slightly lighter weight */
          margin-top: 8px;          /* reduced margin */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 12px;
        }

        .arrow-icon {
          position: absolute;
          top: 10px;
          right: 14px;
          color: #fc2947;
          font-size: 1.6rem;
          opacity: 0.14;
          pointer-events: none;
        }
        .no-items-msg {
          text-align: center;
          color: #888;
          font-size: 1.16rem;
          padding: 44px 0 24px;
        }

        @media (max-width: 600px) {
          .language-vertical-nav {
    top: 160px;  /* adjust as needed */
    left: 10px;
    transform: none;
    padding: 6px 10px;
    width: 48px;
  }
  .lang-btn-vertical {
    width: 32px;
    padding: 4px 0;
    font-size: 10px;
  }
  .content-main {
    margin-left: 60px;
    padding-top: 210px;
    width: calc(100% - 60px);
  }
  .itemback-btn-floating {
    top: 10px;
    left: 12px;
  }
          .itemlist-category-bar-outer {
    position: fixed;
    top: 120px;               /* positioned below header */
    left: 50%;                /* center horizontally */
    right: auto;              /* cancel desktop right pos */
    transform: translateX(-50%);
    margin: 0 auto;
    max-width: 90vw;
    padding: 6px 12px;
    box-shadow: 0 2px 14px rgba(252,41,71,0.07);
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    overflow-x: auto;         /* horizontal scroll if needed */
    white-space: nowrap;      /* prevent wrap */
    z-index: 119;
  }
  .itemlist-category-bar-inner {
    display: inline-flex;     /* keep items in a row */
    gap: 8px 12px;
    padding: 0;
  }
  .itemlist-category-btn {
    font-size: 0.8rem;
    padding: 6px 10px;
    white-space: nowrap;
  }
  .content-main {
    margin-left: 20px;
    padding-top: 210px;       /* space for fixed header + categories */
    width: calc(100% - 20px);
  }
  .spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #28a745;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

        }
      `}</style>
    </div>
  );
}
