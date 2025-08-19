import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "./Context/DataContext.jsx"; // updated to useData
import foodGif from "./food.gif"; // make sure this path is correct

export default function BusinessList() {
    const { categoryId } = useParams();
    const { businesses, trackEvent } = useData();
    const navigate = useNavigate();

    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState("");
    const [cityFilter, setCityFilter] = useState("");

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchTerm), 250);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Filter businesses
    useEffect(() => {
        let newFiltered = businesses.filter((b) => b.category === categoryId);

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

    const cities = [...new Set(businesses.map((b) => b.city))];

    if (!businesses || businesses.length === 0)
        return <div className="loading-state">Chargement...</div>;

    const handleBusinessClick = (business) => {
        // Track analytics event
        trackEvent("Business Click", { businessId: business.id, name: business.name });

        // Navigate to item list for that business
        navigate(`/category/${categoryId}/business/${business.id}`);
    };

    return (
        <div
            key={categoryId}
            className="business-list-container p-4 md:p-8 bg-gray-50 min-h-screen"
        >
            {/* Back Button */}
            <div className="back-button-container mb-4">
                <button
                    onClick={() => navigate("/")}
                    className="back-button bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-500 transition"
                >
                    <span className="arrow">←</span> Retour
                </button>
            </div>

            {/* Search & Filter */}
            <div className="filter-bar flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="🔍 Rechercher un restaurant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input px-4 py-2 w-full md:w-1/2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />

                <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="city-filter px-4 py-2 w-full md:w-1/3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition"
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
                        >
                            {/* Image + GIF container */}
                            <div className="image-gif-container relative">
                                {b.image ? (
                                    <img
                                        src={b.image}
                                        alt={b.name}
                                        className="business-image w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="no-image w-full h-48 bg-gray-200 flex items-center justify-center">
                                        No Image
                                    </div>
                                )}
                                <img src={foodGif} alt="food" className="food-gif absolute bottom-2 right-2 w-12 h-12 pointer-events-none" />
                            </div>

                            <div className="business-info p-4">
                                <h2 className="business-name text-xl font-semibold mb-1">{b.name}</h2>
                                <p className="business-meta text-gray-500">
                                    {b.city} • → Voir les détails
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
