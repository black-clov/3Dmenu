// components/BusinessList.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "./Context/DataContext.jsx";
import foodGif from "./food.gif";

function getClientId() {
  let clientId = localStorage.getItem("clientId");
  if (!clientId) {
    clientId = "client-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("clientId", clientId);
  }
  return clientId;
}

export default function BusinessList() {
  const { categoryId } = useParams();
  const { businesses, trackEvent, socket } = useData();
  const navigate = useNavigate();

  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [clientId] = useState(getClientId);

  useEffect(() => {
    if (socket && clientId) {
      socket.emit("identifyUser", clientId);
    }
  }, [socket, clientId]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchTerm), 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let newFiltered = (businesses || []).filter((b) => b.category === categoryId);

    if (search.trim() !== "") {
      newFiltered = newFiltered.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (cityFilter !== "") {
      newFiltered = newFiltered.filter((b) => b.city === cityFilter);
    }
    setFilteredBusinesses(newFiltered);
  }, [categoryId, businesses, search, cityFilter]);

  const cities = [...new Set((businesses || []).map((b) => b.city))];

  if (!businesses || businesses.length === 0)
    return <div className="loading-state">Chargement...</div>;

  const handleBusinessClick = (business) => {
    trackEvent?.("Business Click", {
      businessId: business.id,
      name: business.name,
      clientId,
    });
    navigate(`/category/${categoryId}/business/${business.id}`);
  };

  return (
    <div className="business-list-container">
      {/* Floating Back Button, absolute top-left */}
      <button
        onClick={() => navigate("/")}
        className="back-btn-floating"
        aria-label="Retour"
      >
        <span className="arrow">←</span>
      </button>

      {/* Filter/Search compact */}
      <div className="filter-bar-compact">
        <input
          type="text"
          placeholder="🔍 Rechercher un restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-compact"
          aria-label="Rechercher un restaurant"
        />
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="city-filter-compact"
          aria-label="Filtrer par ville"
        >
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Business Cards */}
      <div className="business-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.length === 0 ? (
          <div className="empty-state text-gray-500 text-center py-20">
            Aucune entreprise trouvée
          </div>
        ) : (
          filteredBusinesses.map((b) => (
            <div
              key={b.id}
              onClick={() => handleBusinessClick(b)}
              className="business-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleBusinessClick(b);
              }}
              aria-label={`Voir les détails de ${b.name}`}
            >
              {/* Image + GIF container */}
              <div className="image-gif-container relative flex items-center justify-center p-4">
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.name}
                    className="business-image w-28 h-28 object-cover rounded-full shadow-lg border-4 border-red-300 transition-transform duration-500 ease-in-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="no-image w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center">
                    No Image
                  </div>
                )}
                <img
                  src={foodGif}
                  alt="food"
                  className="food-gif absolute bottom-3 right-3 w-12 h-12 pointer-events-none animate-pulse"
                />
              </div>
              <div className="business-info p-4 text-center">
                <h2 className="business-name text-xl font-semibold mb-1 text-gray-900 truncate">
                  {b.name}
                </h2>
                <p className="business-meta text-gray-500 font-medium">
                  {b.city} &bull; <span className="text-red-600">Voir les détails →</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom styles */}
      <style>{`
        .business-list-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f9fafb;
          min-height: 100vh;
          width: 100vw;
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 16px 32px 16px;
        }
        .back-btn-floating {
          position: fixed;
          left: 24px;
          top: 18px;
          z-index: 99;
          background: linear-gradient(90deg,#fc2947 40%,#fb7e4b 100%);
          border: none;
          color: #fff;
          width: 33px;
          height: 33px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 1.2rem;
          box-shadow: 0 2px 8px rgba(252,41,71,0.11);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s;
          cursor: pointer;
        }
        .back-btn-floating:hover{background:linear-gradient(70deg,#fb7e4b,#fc2947 95%)}
        .back-btn-floating .arrow{font-size:19px;}

        .filter-bar-compact {
          display: flex;
          gap: 12px;
          padding-top: 70px;
          padding-bottom: 9px;
          justify-content: flex-start;
          align-items: flex-start;
        }
        .search-input-compact,
        .city-filter-compact {
          border-radius: 8px;
          font-size: 0.98rem;
          padding: 5px 10px;
          box-shadow: 0 1.5px 8px rgba(239,68,68,0.06);
          border: 1.7px solid #f3f3f3;
          outline: none;
          transition: border 0.18s, box-shadow 0.19s;
          background: #fff;
          height: 31px;
        }
        .search-input-compact:focus,
        .city-filter-compact:focus {
          border: 1.7px solid #fc2947;
          box-shadow: 0 1.5px 12px rgba(251,126,75,0.10);
        }
        .search-input-compact {
          width: 50%;
          min-width: 170px;
        }
        .city-filter-compact {
          min-width: 110px;
          width: 170px;
        }

        .business-card {
          outline: none;
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .business-card:hover,
        .business-card:focus {
          box-shadow: 0 12px 30px rgba(239,68,68,0.25);
          transform: translateY(-6px);
          cursor: pointer;
          outline: none;
        }
        .business-image {
          object-fit: cover;
          border-radius: 9999px;
          box-shadow: 0 4px 15px rgba(239,68,68,0.15);
          transition: transform 0.4s ease;
          border: 4px solid #f87171;
        }
        .business-card:hover .business-image {
          transform: scale(1.05);
        }
        .food-gif {
          filter: drop-shadow(0 0 1.5px rgba(255,69,69,0.85));
        }
        .business-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .business-meta {
          font-size: 0.93rem;
          color: #6b7280;
        }
        @media (max-width: 640px) {
          .business-list-container { padding: 0 0 18px 0 }
          .filter-bar-compact { flex-direction:column; gap:8px; padding-top: 60px;}
          .search-input-compact, .city-filter-compact { width: 100%; min-width: 0; }
          .back-btn-floating {left: 7px; top: 9px; width: 30px; height: 30px; font-size:1.03rem;}
        }
      `}</style>
    </div>
  );
}
