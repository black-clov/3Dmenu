// components/CategoryList.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./Context/DataContext.jsx";
import logo from "./logo2.png"; // make sure logo2.png is in the same folder

export default function CategoryList() {
  const { categories, trackEvent } = useContext(DataContext); // get trackEvent
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Track the click event for analytics
    if (trackEvent) {
      trackEvent("Category Click", {
        categoryId: category.id,
        name: category.name,
      });
    }

    // Navigate to business list for the selected category
    navigate(`/category/${category.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      {/* HEADER */}
      <header className="sticky top-0 z-10 w-full bg-gradient-to-r from-red-600 to-red-500 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          {/* LOGO */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-12 md:h-16 object-contain" />
          </div>
        </div>
        <div className="hidden md:flex justify-center items-center">
          <p className="text-white font-extrabold text-4xl md:text-5xl lg:text-6xl typing-animation">
            3D Presentation
          </p>
        </div>
      </header>

      {/* CATEGORY GRID */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <div
              key={c.id}
              onClick={() => handleCategoryClick(c)}
              className={`cursor-pointer category-card fade-in-up gradient-${i % 6}`}
            >
              <img src={c.image} alt={c.name} className="w-full h-48 object-cover rounded-lg" />
              <div className="flex-1 flex flex-col justify-center ml-4 mt-2">
                <h2 className="category-name font-bold text-lg">{c.name}</h2>
                <p className="text-gray-500 text-sm mt-1">Explore {c.name}</p>
              </div>
              <div className="card-arrow text-2xl font-bold text-gray-400">›</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
