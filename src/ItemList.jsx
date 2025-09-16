// components/ItemList.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "./Context/DataContext.jsx"; // ✅ use hook
import arGif from "./animated2.gif";

export default function ItemList() {
  const { categoryId, businessId } = useParams();
  const navigate = useNavigate();
  const { items = [], categories = [], trackEvent, socket } = useData(); // safe defaults

  // --- Generate or load persistent clientId ---
  function getClientId() {
    let clientId = localStorage.getItem("clientId");
    if (!clientId) {
      clientId = "client-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("clientId", clientId);
    }
    return clientId;
  }
  const [clientId] = useState(getClientId); // load once

  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState("Tous");

  const foodTabs = [
    "Tous",
    "Petit Déjeuner",
    "Entrées",
    "Déjeuner & Dîner",
    "Desserts",
    "Boissons",
    "Nouveaux",
  ];

  // --- Filter items by category, business, and active tab ---
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

  // --- Back navigation ---
  const handleBackToBusiness = () => {
    navigate(`/category/${categoryId}`, { replace: true });
  };

  // --- Navigate to 3D viewer & track event ---
  const handleView3D = (item) => {
    if (trackEvent) {
      trackEvent("Item Click", {
        itemId: item.id,
        name: item.name,
        businessId,
        categoryId,
        clientId, // ✅ include clientId
      });
    }
    navigate(`/category/${categoryId}/business/${businessId}/item/${item.id}`);
  };

  return (
    <div className="item-list-container p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="back-button-container mb-4">
        <button
          onClick={handleBackToBusiness}
          className="back-button bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-500 transition"
        >
          <span className="arrow">←</span> Retour
        </button>
      </div>

      {/* Food Tabs */}
      <div className="food-tabs flex flex-wrap gap-2 mb-6">
        {foodTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`food-tab px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 shadow"
              } hover:bg-red-500 hover:text-white transition`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="items-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {filteredItems.length === 0 && (
          <div className="text-center text-gray-500 py-20">Aucun item trouvé</div>
        )}
        {filteredItems.map((i) => (
          <div
            key={i.id}
            onClick={() => handleView3D(i)}
            className="item-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1 relative"
          >
            {/* Image + GIF container */}
            <div className="item-image-gif-container relative">
              {i.image ? (
                <img
                  src={i.image}
                  alt={i.name}
                  className="item-image w-full h-48 object-cover"
                />
              ) : (
                <div className="no-image w-full h-48 bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}
              <img
                src={arGif}
                alt="AR animation"
                className="ar-gif absolute bottom-2 right-2 w-12 h-12 pointer-events-none"
              />
            </div>

            {/* Item Info */}
            <div className="p-4 flex items-center justify-between gap-3">
              <h2 className="item-name text-lg font-semibold leading-tight truncate flex-1">
                {i.name}
              </h2>
              <div className="item-price ml-3 whitespace-nowrap font-extrabold text-red-600 text-xl drop-shadow-md">
                {i.price ? `${i.price} DH` : ""}
              </div>
            </div>

            <div className="item-subinfo px-4 pb-4 text-gray-500 text-sm">
              {i.category} • {i.business}
            </div>

            <div className="arrow-icon absolute top-2 right-4 text-red-600 text-2xl select-none">
              ›
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .item-list-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .back-button {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }
        .food-tab {
          min-width: 120px;
          text-align: center;
        }
        .item-card {
          display: flex;
          flex-direction: column;
        }
        .item-image-gif-container {
          position: relative;
        }
        .item-image {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .ar-gif {
          pointer-events: none;
        }
        .item-name {
          margin: 0;
        }
        .item-price {
          /* Styled to be visually attractive */
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-shadow: 0 2px 7px rgba(255, 69, 69, 0.8);
          letter-spacing: 0.06em;
        }
        .item-subinfo {
          font-size: 0.875rem;
          color: #6b7280; /* tailwind gray-500 */
        }
        .arrow-icon {
          user-select: none;
        }

        /* Additional hover effect for price */
        .item-card:hover .item-price {
          color: #ef4444;
          text-shadow: 0 2px 10px rgba(239, 68, 68, 0.9);
          transform: scale(1.1);
          transition: all 0.3s ease;
        }
        /* Truncate item name if too long */
        .item-name.truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
