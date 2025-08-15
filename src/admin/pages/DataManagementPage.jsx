import React, { useState, useContext } from "react";
import { DataContext } from "../../Context/DataContext";

export default function DataManagementPage() {
    const { categories, addCategory, editCategory } = useContext(DataContext);

    const [name, setName] = useState("");
    const [color, setColor] = useState("#f87171");

    const handleAddCategory = () => {
        if (!name) return alert("Entrez un nom pour la catégorie");
        addCategory({ name, color, image: "" }); // you can add image later
        setName("");
        setColor("#f87171");
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-4">Gestion des Catégories</h2>

            {/* Add New Category */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Nom de la catégorie"
                    className="p-2 border rounded-lg flex-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="color"
                    className="w-20 h-10 rounded-lg border"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <button
                    onClick={handleAddCategory}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    Ajouter
                </button>
            </div>

            {/* List Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                    <div
                        key={c.id}
                        className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md"
                    >
                        <div>
                            <p className="font-semibold">{c.name}</p>
                            <div className="w-10 h-5 rounded" style={{ backgroundColor: c.color }}></div>
                        </div>
                        {/* Edit button could open a modal */}
                        <button
                            onClick={() => {
                                const newName = prompt("Modifier le nom", c.name);
                                if (newName) editCategory(c.id, { name: newName });
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Modifier
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
