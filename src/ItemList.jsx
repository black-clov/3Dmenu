import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "./Context/DataContext.jsx"; // updated to useData
import arGif from "./animated2.gif";

export default function ItemList() {
    const { categoryId, businessId } = useParams();
    const { items, trackEvent } = useData();
    const navigate = useNavigate();

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

    // Filter items by category, business, and active tab
    useEffect(() => {
        let result = items.filter(
            (i) => i.category === categoryId && i.business === businessId
        );

        if (activeTab !== "Tous") {
            result = result.filter((i) => {
                if (Array.isArray(i.type)) return i.type.includes(activeTab);
                return i.type === activeTab;
            });
        }

        setFilteredItems(result);
    }, [categoryId, businessId, items, activeTab]);

    const handleBackToBusiness = () => {
        navigate(`/category/${categoryId}`, { replace: true });
    };

    const handleView3D = (item) => {
        // Track analytics event
        trackEvent("Item Click", { itemId: item.id, name: item.name, businessId, categoryId });
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
                            className={`food-tab px-4 py-2 rounded-lg ${isActive ? "bg-red-600 text-white" : "bg-white text-gray-700 shadow"
                                } hover:bg-red-500 hover:text-white transition`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Items List */}
            <div className="items-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length === 0 && (
                    <div className="text-center text-gray-500 py-20">Aucun item trouvé</div>
                )}
                {filteredItems.map((i) => (
                    <div
                        key={i.id}
                        onClick={() => handleView3D(i)}
                        className="item-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1"
                    >
                        {/* Image + GIF container */}
                        <div className="item-image-gif-container relative">
                            {i.image ? (
                                <img src={i.image} alt={i.name} className="item-image w-full h-48 object-cover" />
                            ) : (
                                <div className="no-image w-full h-48 bg-gray-200 flex items-center justify-center">
                                    No Image
                                </div>
                            )}
                            <img src={arGif} alt="AR animation" className="ar-gif absolute bottom-2 right-2 w-12 h-12 pointer-events-none" />
                        </div>

                        {/* Item Name */}
                        <div className="p-4">
                            <h2 className="item-name text-lg font-semibold mb-1">{i.name}</h2>
                            <p className="item-meta text-gray-500">
                                {i.category} • {i.business}
                            </p>
                        </div>

                        <div className="arrow-icon absolute top-2 right-4 text-red-600 text-2xl">›</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
