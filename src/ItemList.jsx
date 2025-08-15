import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "./Context/DataContext.jsx";

export default function ItemList() {
    const { categoryId, businessId } = useParams();
    const { items } = useContext(DataContext);
    const navigate = useNavigate();

    const [filteredItems, setFilteredItems] = useState([]);
    const [activeTab, setActiveTab] = useState("Tous");

    const foodTabs = ["Tous", "Petit Déjeuner", "Entrées", "Déjeuner & Dîner", "Desserts", "Boissons", "Nouveaux"];

    useEffect(() => {
        let result = items.filter(
            (i) => i.category === categoryId && i.business === businessId
        );

        if (activeTab !== "Tous") {
            result = result.filter((i) => {
                // Allow both string and array for i.type
                if (Array.isArray(i.type)) {
                    return i.type.includes(activeTab);
                }
                return i.type === activeTab;
            });
        }

        setFilteredItems(result);
    }, [categoryId, businessId, items, activeTab]);

    const handleBackToBusiness = () => {
        navigate(`/category/${categoryId}`, { replace: true });
    };

    const handleView3D = (itemId) => {
        navigate(`/category/${categoryId}/business/${businessId}/item/${itemId}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
        <div>
            <p></p>
        </div>
            {/* Back Button */}
            <div className="px-4 mt-4">
                <button
                    onClick={handleBackToBusiness}
                    className="w-full bg-green-500 text-white py-3 rounded-md shadow-md hover:bg-green-600 font-semibold transition duration-300"
                style={{
                    minHeight: "45px",
                    marginBottom: "28px",
                    width: "211px",
                    backgroundColor:"rgba(248, 121, 104, 1)"
                }}
                >
                    ← Retour aux Restaurants
                </button>
            </div>

            {/* Header */}
            <header className="w-full text-center py-6 bg-white shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">🍽 Explorer 🍽 <div><p></p></div>un Plat 3D</h1>
            </header>

            {/* Food Tabs */}
            <div className="flex px-4 mt-4 overflow-x-auto space-x-4">
                {foodTabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-offset-1
          ${isActive
                                    ? "bg-red-600 text-white border-red-700 shadow-lg scale-105"
                                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:text-gray-900"
                                }
        `}
                            style={{
                                minWidth: "120px",    // slightly wider
                                minHeight: "40px",    // taller buttons
                                marginBottom: "18px",
                            }}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            <div>
                <p></p>
            </div>

            {/* Items List */}
            <div className="flex flex-col w-full mt-4 space-y-4 px-4">
                {filteredItems.length === 0 && (
                    <div className="text-center text-gray-500 py-4">No items found</div>
                )}
                {filteredItems.map((i) => (
                    <button
                        key={i.id}
                        onClick={() => handleView3D(i.id)}
                        className="flex flex-col sm:flex-row items-center justify-between w-full bg-white shadow-md hover:shadow-lg border border-gray-200 rounded-lg overflow-hidden transition duration-300"
                        style={{ minHeight: "80px" }}
                    >
                        <div className="flex items-center pl-4 py-2 sm:py-0">
                            {i.image ? (
                                <img
                                    src={i.image}
                                    alt={i.name}
                                    className="object-cover rounded-md border border-gray-200"
                                    style={{ width: "410px", height: "150px" }}
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                    No Image
                                </div>
                            )}
                            <span className="ml-4 text-lg font-semibold text-gray-800">
                                {i.name}
                            </span>
                        </div>
                        <div className="pr-4 text-gray-400 text-xl">›</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
