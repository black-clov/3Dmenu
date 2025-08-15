import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "./Context/DataContext.jsx";

export default function BusinessList() {
    const { categoryId } = useParams();
    const { businesses } = useContext(DataContext);
    const navigate = useNavigate();

    const [filteredBusinesses, setFilteredBusinesses] = useState([]);

    // Refilter whenever categoryId changes
    useEffect(() => {
        const newFiltered = businesses.filter(b => b.category === categoryId);
        setFilteredBusinesses(newFiltered);
    }, [categoryId, businesses]);

    if (!businesses || businesses.length === 0) return <div>Loading...</div>;
    if (filteredBusinesses.length === 0) return <div>No businesses found</div>;

    return (
        <div
            key={categoryId} // Force remount if category changes
            className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50"
        >
        <div>
            <p></p>
        </div>
            {/* Back Button */}
            <div className="px-4 mt-6 mb-4">
                <button
                    onClick={() => navigate("/")}
                    className="w-full bg-red-500 text-white py-4 rounded-xl shadow-lg hover:shadow-2xl hover:bg-red-600 transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-2"
                    style={{
                        minHeight: "45px",
                        marginBottom: "28px",
                        width:"211px",
                        backgroundColor: "rgba(248, 121, 104, 1)"
                    }}
                >
                    <span className="text-2xl">←</span>
                    <span>Retour aux Categories</span>
                </button>
            </div>

            {/* Header */}
            <header className="w-full text-center py-6 bg-white shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Choisir <div><p></p></div>Un Restaurant</h1>
            </header>

            
            {/* Business List */}
            <div className="flex flex-col w-full mt-4 space-y-4 px-4">
                {filteredBusinesses.map((b) => (
                    <button
                        key={b.id}
                        onClick={() => navigate(`/category/${categoryId}/business/${b.id}`)}
                        className="flex items-center justify-between w-full bg-white shadow-md hover:shadow-lg border border-gray-200 rounded-lg overflow-hidden transition duration-300"
                        style={{ minHeight: "70px" }}
                    >
                        {/* Image + Name */}
                        <div className="flex items-center pl-4">
                            {b.image ? (
                                <img
                                    src={b.image}
                                    alt={b.name}
                                    className="object-cover rounded-md border border-gray-200"
                                    style={{ width: "410px", height: "150px" }}
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                    No Image
                                </div>
                            )}
                            <span className="ml-4 text-lg font-semibold text-gray-800">{b.name}</span>
                        </div>

                        <div className="pr-4 text-gray-400 text-xl">›</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
