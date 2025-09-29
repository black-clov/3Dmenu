import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "./Context/DataContext.jsx";
import arGif from "./animated2.gif";

export default function ItemList() {
  const { categoryId, businessId } = useParams();
  const navigate = useNavigate();
  const { items = [], businesses = [], trackEvent } = useData();

  // Persistent client ID helper
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
  const [activeTab, setActiveTab] = useState("Tous");

  // Find current business to get logo and categories
  const currentBusiness = businesses.find((b) => b.id === businessId);

  // Use business.categories or fallback to unique types found in its items
  const foodTabs = useMemo(() => {
    if (currentBusiness?.categories?.length) {
      return ["Tous", ...currentBusiness.categories];
    }
    // Fallback: build from items types for this business
    const typesSet = new Set();
    items.forEach((item) => {
      if (item.business === businessId && item.type) {
        if (Array.isArray(item.type)) {
          item.type.forEach((t) => typesSet.add(t));
        } else {
          typesSet.add(item.type);
        }
      }
    });
    return ["Tous", ...Array.from(typesSet).sort()];
  }, [businessId, currentBusiness, items]);

  // Filter items by categoryId, businessId & activeTab
  useEffect(() => {
    if (!Array.isArray(items)) {
      setFilteredItems([]);
      return;
    }
    let result = items.filter(
      (i) => i.category === categoryId && i.business === businessId
    );
    if (activeTab !== "Tous") {
      result = result.filter((i) =>
        Array.isArray(i.type) ? i.type.includes(activeTab) : i.type === activeTab
      );
    }
    setFilteredItems(result);
  }, [categoryId, businessId, items, activeTab]);

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
      });
    }
    navigate(`/category/${categoryId}/business/${businessId}/item/${item.id}`);
  };

  return (
    <div className="item-list-container">
      {/* Floating Back Button, absolute top-left */}
      <button
        onClick={handleBackToBusiness}
        className="item-back-btn-floating"
        aria-label="Retour"
      >
        <span className="arrow">←</span>
      </button>

      {/* Restaurant logo at top right */}
      {currentBusiness && currentBusiness.image && (
        <div
          className="business-logo-topright"
          aria-label={`${currentBusiness.name} logo`}
        >
          <img src={currentBusiness.image} alt={currentBusiness.name} loading="lazy" />
        </div>
      )}

      {/* Dynamic Food Tabs */}
      <div className="food-tabs-compact">
        {foodTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`food-tab-compact ${isActive ? "active-tab" : ""}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="items-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 relative justify-center">
        {filteredItems.length === 0 && (
          <div className="text-center text-gray-500 py-20 animate-fadein">
            Aucun item trouvé
          </div>
        )}
        {filteredItems.map((i, idx) => (
          <div
            key={i.id}
            onClick={() => handleView3D(i)}
            className="item-card animate-fadein bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-red-200 hover:scale-[1.035] transition-all duration-300 ease-out relative group"
            style={{ animationDelay: `${idx * 0.09}s`, minHeight: "245px" }}
            tabIndex={0}
            role="button"
            aria-label={`Voir détails de ${i.name}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleView3D(i);
            }}
          >
            {/* Floating Price Circle */}
            {i.price && (
              <div className="item-price-absolute">
                <span>{i.price} DH</span>
              </div>
            )}
            {/* Image and AR GIF, with overlay animation */}
            <div className="item-image-gif-container relative group">
              {i.image ? (
                <img
                  src={i.image}
                  alt={i.name}
                  className="item-image w-full object-cover scale-100 group-hover:scale-105 transition-all duration-500 rounded-t-2xl"
                  loading="lazy"
                  style={{ height: "150px" }}
                />
              ) : (
                <div
                  className="no-image w-full bg-gradient-to-br from-red-100 to-gray-200 flex items-center justify-center text-gray-400 rounded-t-2xl"
                  style={{ height: "150px" }}
                >
                  No Image
                </div>
              )}
              <img
                src={arGif}
                alt="AR animation"
                className="ar-gif absolute bottom-2 right-2 w-9 h-9 pointer-events-none rotate-bounce"
              />
              <div className="item-image-overlay group-hover:opacity-70 rounded-t-2xl"></div>
            </div>

            {/* Item Info */}
            <div className="p-5 pt-2 flex flex-col gap-2 items-center">
              <h2 className="item-name text-lg font-bold truncate w-full text-center text-gray-900 group-hover:text-red-600 transition-colors">
                {i.name}
              </h2>
              <div className="item-subinfo text-xs text-gray-500">
                {i.category} &bull; {i.business}
              </div>
            </div>
            <div className="arrow-icon absolute top-2 right-4 text-red-600 text-2xl select-none animate-arrowfloat">
              ›
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* Container and base styles */
        .item-list-container {
          max-width: 1150px;
          margin: 0 auto;
          background: #f9fafb;
          min-height: 100vh;
          padding: 0 14px 30px 14px;
          position: relative;
        }
        /* Back button */
        .item-back-btn-floating {
          position: fixed;
          left: 22px;
          top: 17px;
          z-index: 99;
          background: linear-gradient(90deg,#fc2947 40%,#fb7e4b 100%);
          border: none;
          color: #fff;
          width: 31px;
          height: 31px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 1.12rem;
          box-shadow: 0 2px 8px rgba(252,41,71,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s;
          cursor: pointer;
        }
        .item-back-btn-floating:hover {
          background: linear-gradient(70deg,#fb7e4b,#fc2947 95%);
        }
        .item-back-btn-floating .arrow {
          font-size: 17px;
        }
        /* Business logo circle top right */
        .business-logo-topright {
          position: fixed;
          top: 16px;
          right: 22px;
          width: 52px;
          height: 52px;
          border-radius: 9999px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0,0,0,0.12);
          z-index: 99;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .business-logo-topright img {
          width: 48px;
          height: 48px;
          border-radius: 9999px;
          object-fit: cover;
          user-select: none;
          pointer-events: none;
        }
        /* Tabs container */
        .food-tabs-compact {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: flex-start;
          padding-top: 60px;
          padding-bottom: 6px;
          margin-bottom: 12px;
          justify-content: flex-start;
        }
        /* Tab buttons base */
        .food-tab-compact {
          min-width: 90px;
          font-size: 0.94rem;
          padding: 6px 14px;
          border-radius: 12px;
          border: none;
          color: #fc2947;
          background: #fff;
          box-shadow: 0 2px 10px rgba(239, 68, 68, 0.12);
          transition:
            background-color 0.3s ease,
            color 0.3s ease,
            transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s ease;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Non-active tab hover */
        .food-tab-compact:not(.active-tab):hover {
          background-color: #fb7e4b;
          color: white;
          box-shadow: 0 6px 15px rgba(251, 126, 75, 0.75);
          transform: scale(1.08);
        }
        /* Active tab style */
        .food-tab-compact.active-tab {
          background-color: #fc2947;
          color: white;
          box-shadow: 0 8px 20px rgba(252, 41, 71, 0.85);
          animation: pulse-red 2.5s infinite alternate;
          transform: scale(1.1);
        }
        /* Pulse animation for active tab */
        @keyframes pulse-red {
          0% {
            box-shadow: 0 8px 20px rgba(252, 41, 71, 0.6);
            transform: scale(1.1);
          }
          100% {
            box-shadow: 0 12px 28px rgba(252, 41, 71, 0.9);
            transform: scale(1.15);
          }
        }
        /* Items grid */
        .items-grid {
          margin-top: 0;
        }
        /* Individual item card */
        .item-card {
          min-height: 245px;
          display: flex;
          flex-direction: column;
        }
        .item-image-gif-container {
          position: relative;
        }
        .item-image-overlay {
          position: absolute;
          inset: 0;
          border-radius: 1rem 1rem 0 0;
          pointer-events: none;
          transition: opacity .3s;
          background: linear-gradient(122deg, rgba(255,79,121,0.25) 0%,rgba(245,111,63,0.11) 77%,rgba(255,255,255,0.11) 100%);
          opacity: 0;
        }
        .item-price-absolute {
          position: absolute;
          top: 59%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          margin: 0 auto;
          padding: 0;
          width: fit-content;
          z-index: 8;
          display: flex;
          justify-content: center;
        }
        .item-price-absolute span {
          background: linear-gradient(98deg, #ff0000ff 18%, #059b3fff 82%);
          color: #fff;
          font-size: 1.11rem;
          font-weight: 900;
          border-radius: 9999px;
          padding: 7px 22px 7px 22px;
          box-shadow: 0 7px 24px rgba(246,42,56,0.12), 0 0 0 #fff7, 0 0 1px #f87171;
          border: 2px solid rgba(255,77,77,0.14);
          letter-spacing: 0.04em;
          text-shadow: 0 1px 8px rgba(253,164,175,.16), 0 4px 20px #fff2;
        }
        .ar-gif {
          pointer-events: none;
        }
        .item-name {
          margin: 0;
        }
        .item-subinfo {
          font-size: 0.8rem;
          color: #6b7280;
          text-align: center;
        }
        .arrow-icon {
          user-select: none;
        }
        @keyframes fadein {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fadein {
          animation: fadein 0.68s cubic-bezier(.24, .65, .41, 1) both;
        }
        @keyframes arrowfloat {
          0% {
            transform: translateY(0);
          }
          60% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-arrowfloat {
          animation: arrowfloat 1.8s infinite cubic-bezier(.63, 2.36, .44, 1.18);
        }
        @keyframes rotate-bounce {
          0% {
            transform: rotate(-6deg);
          }
          20% {
            transform: rotate(8deg);
          }
          40% {
            transform: rotate(-7deg);
          }
          70% {
            transform: rotate(5deg);
          }
          100% {
            transform: rotate(-6deg);
          }
        }
        .rotate-bounce {
          animation: rotate-bounce 2.3s infinite cubic-bezier(.4, 2, .6, 1);
        }
        @media (max-width: 700px) {
          .item-list-container {
            padding: 0 0 18px 0;
          }
          .item-back-btn-floating {
            left: 7px;
            top: 9px;
            width: 26px;
            height: 26px;
            font-size: 0.93rem;
          }
          .food-tabs-compact {
            padding-top: 41px;
            gap: 6px;
          }
          .item-price-absolute span {
            font-size: 0.93rem;
            padding: 5px 12px;
          }
          .item-card {
            min-height: 190px;
          }
          .item-image {
            height: 102px !important;
          }
          .items-grid {
            gap: 15px;
          }
          .business-logo-topright {
            width: 40px;
            height: 40px;
            top: 9px;
            right: 10px;
          }
          .business-logo-topright img {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
}
