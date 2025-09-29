// components/CategoryList.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./Context/DataContext.jsx"; // Adjust path if needed
import logo from "./logo2.png";

function getClientId() {
  let clientId = localStorage.getItem("clientId");
  if (!clientId) {
    clientId = "client-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("clientId", clientId);
  }
  return clientId;
}

export default function CategoryList() {
  const { categories, trackEvent, socket } = useContext(DataContext);
  const navigate = useNavigate();
  const [clientId] = useState(getClientId);

  useEffect(() => {
    if (socket && clientId) {
      socket.emit("identifyUser", clientId);
    }
  }, [socket, clientId]);

  const handleCategoryClick = (category) => {
    if (trackEvent) {
      trackEvent("Category Click", {
        categoryId: category.id,
        name: category.name,
        clientId,
      });
    }
    navigate(`/category/${category.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      {/* HEADER */}
      <header className="sticky top-0 z-10 w-full bg-gradient-to-r from-red-600 to-red-500 shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 md:py-4">
          <img src={logo} alt="Logo" className="h-12 md:h-16 object-contain" />
        </div>
        <div className="hidden md:flex justify-center items-center mb-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl typing-animation select-none text-center w-full max-w-4xl mx-auto">
            Zoom In 3D
          </h1>
        </div>
      </header>

      {/* CATEGORY GRID */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 md:px-8">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 sm:gap-14"
          role="list"
        >
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              role="listitem button"
              tabIndex={0}
              aria-label={`Explore ${cat.name}`}
              onClick={() => handleCategoryClick(cat)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCategoryClick(cat);
              }}
              className="category-card group rounded-3xl overflow-hidden shadow-lg cursor-pointer relative transform transition duration-500 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-400 flex flex-col items-center justify-center p-8"
              style={{ animationDelay: `${i * 150}ms`, height: "320px" }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-40 h-40 rounded-full object-cover ring-8 ring-red-400 shadow-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                  {cat.name}
                </h2>
                <p className="mt-3 text-gray-600 font-semibold tracking-wide uppercase text-base">
                  Découvrir
                </p>
              </div>
              <span className="arrow absolute top-8 right-8 text-5xl text-red-300 group-hover:text-red-500 select-none animate-bounce">
                &rsaquo;
              </span>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .typing-animation {
          overflow: hidden;
          white-space: nowrap;
          border-right: 0.15em solid rgba(255,255,255,0.8);
          animation:
            typing 3.5s steps(16, end) infinite,
            blink-caret 0.75s step-end infinite;
        }
        @keyframes typing {
          0%, 100% { width: 0; }
          50% { width: 16ch; }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: rgba(255,255,255,0.8); }
        }
        .category-card {
          background: white;
          user-select: none;
          will-change: transform;
          border: 2px solid transparent;
          box-sizing: border-box;
        }
        .category-card:focus-visible {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.5);
        }
        .arrow {
          animation: bounce 2s infinite;
          will-change: transform;
          
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @media (max-width: 640px) {
          .typing-animation {
            font-size: 2rem !important;
          }
          .category-card {
            height: auto !important;
            width: 90vw;
            margin-left: auto;
            margin-right: auto;
            padding: 2rem 1.5rem;
            flex-direction: row;
            align-items: center;
          }
          .category-card img {
            width: 7rem;
            height: 7rem;
            margin-right: 1.5rem;
          }
          .category-card h2 {
            font-size: 1.5rem;
            text-align: left;
          }
          .category-card p {
            font-size: 1rem;
            margin-top: 0.3rem;
            text-align: left;
            letter-spacing: 0.1em;
            
          }
          .arrow {
            font-size: 3rem;
            top: 50%;
            right: 1rem;
            transform: translateY(-50%);
            
          }
        }
      `}</style>
    </div>
  );
}
