import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./Context/DataContext.jsx";

export default function CategoryList() {
  const { categories } = useContext(DataContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      {/* Page Header */}
      <header className="w-full text-center py-6 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-red-600 tracking-wide drop-shadow-sm">
          Choisir une Categorie
        </h1>
      </header>

      {/* Category Buttons */}
      <div className="flex flex-col w-full mt-4 px-4 space-y-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/category/${c.id}`)}
            className="flex items-center justify-between w-full rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition duration-300 border border-gray-100 overflow-hidden"
            style={{
              minHeight: "90px",
              backgroundColor: c.color || "white"
            }}
          >
            {/* Left side with image */}
            <div className="flex items-center pl-3 py-3">
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.name}
                  className="rounded-lg shadow-md object-cover"
                  style={{ width: "410px", height: "150px" }}
                />
              ) : (
                <div className="w-20 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                  No Image
                </div>
              )}

              {/* Category name */}
              <span className="ml-5 text-xl font-semibold text-gray-800">
                {c.name}
              </span>
            </div>

            {/* Arrow */}
            <div className="pr-5 text-gray-600 text-2xl font-light">›</div>
          </button>
        ))}
      </div>
    </div>
  );
}
