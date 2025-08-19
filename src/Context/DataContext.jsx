// src/Context/DataContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SOCKET_URL = "https://threedmenu-server.onrender.com/"; // replace with your backend URL
export const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const categories = [
        { id: "coffee", name: "Coffee & Restaurants", image: "images/categories/cat_restaurant_coffee.jpg" },
        { id: "tourism", name: "Tourism & Handicrafts", image: "images/categories/cat_Tourism_Handicrafts.jpg" },
        { id: "furniture", name: "Furniture & Home Decoration", image: "images/categories/cat_Furniture_Home%20Decoration.jpg" },
        { id: "automotive", name: "Automotive & Scooters", image: "images/categories/cat_Automotive_Scooters.jpg" },
    ];

    const businesses = [
        { id: "Moods", name: "Moods Café & Restaurant", category: "coffee", image: "/3Dmenu/images/businesses/moods.jpeg" , city:"Casablanca" },
        { id: "coffee_shop_2", name: "Sushi Hiro Maroc", category: "coffee", image: "/3Dmenu/images/businesses/Sushi Hiro Maroc.png" , city:"Rabat"},
        { id: "coffee_shop_3", name: "Açai & You - Brunch & Coffee", category: "coffee", image: "/3Dmenu/images/businesses/Açaï & You - Brunch & Coffee.jpeg", city:"Tangier" },
        { id: "coffee_shop_5", name: "House 17", category: "coffee", image: "/3Dmenu/images/businesses/house 17.jpeg" },
        { id: "coffee_shop_6", name: "KOI cafe & restaurant", category: "coffee", image: "/3Dmenu/images/businesses/moods.jpeg" },
        { id: "coffee_shop_7", name: "Winos Cafe & Restaurant", category: "coffee", image: "/3Dmenu/images/businesses/moods.jpeg" },
        { id: "coffee_shop_8", name: "Green Black - Marina", category: "coffee", image: "/3Dmenu/images/businesses/" },
        { id: "coffee_shop_9", name: "Flox Burger CASA", category: "coffee", image: "/3Dmenu/images/businesses/" },
        { id: "coffee_shop_10", name: "Kamoun", category: "coffee", image: "/3Dmenu/images/businesses/" },
        { id: "coffee_shop_11", name: "La Burratina - Trattoria & Pizzeria", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_12", name: "Les Frères Gourmets", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_13", name: "Kookento", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_14", name: "Fast & Delicious", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_15", name: "Guacaté", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_16", name: "EATFIT", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_17", name: "Café Bisogno", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_18", name: "MAYLI", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_19", name: "NYC Cookies in Casablanca", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_20", name: "CTR Chicken Casablanca", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_21", name: "Pomodolce", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_22", name: "Restaurant Dar EL Kaid", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_23", name: "", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_24", name: "", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_25", name: "", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_26", name: "", category: "coffee", image: "/images/businesses/" },
        { id: "coffee_shop_", name: "", category: "coffee", image: "/images/businesses/" },
        { id: "furniture_shop_1", name: "Furniture Shop 1", category: "furniture" },
    ];

    const items = [
        { id: "dish_1", name: "Mezzé Marocain à partager", category: "coffee", business: "Moods", glb: "/3Dmenu/models/1_Mezzé Marocain à partager_shaded.glb", image: "/3Dmenu/images/items/moods/Mezzé Marocain à partager.png", type: "Lunch & Dinner", price: "60 DH", description: "Potatos" },
        { id: "dish_2", name: "Pizza végétarienne", category: "coffee", business: "Moods", glb: "/3Dmenu/models/2_Pizza végétarienne_shaded.glb", image: "/3Dmenu/images/items/moods/Pizza végétarienne.png" },
        { id: "dish_3", name: "Mixed grill", category: "coffee", business: "Moods", glb: "/3Dmenu/models/3_Mixed grill_shaded.glb", image: "/3Dmenu/images/items/moods/Mixed grill.png" },
        { id: "dish_4", name: "Loup entier grillé", category: "coffee", business: "Moods", glb: "/3Dmenu/models/4_Loup entier grillé_shaded.glb", image: "/3Dmenu/images/items/moods/Loup entier grillé.png" },
        { id: "dish_6", name: "🇱🇧 Hot Mezzé Libanais", category: "coffee", business: "Moods", glb: "/3Dmenu/models/6_Hot Mezzé Libanais_shaded.glb", image: "/3Dmenu/images/items/moods/Hot Mezzé Libanais.png" },
        { id: "dish_5", name: "Tea Time (plateau de 2 personnes )", category: "coffee", business: "Moods", glb: "/3Dmenu/models/5_Tea Time (plateau de 2 personnes )_shaded.glb", image: "/3Dmenu/images/items/moods/Tea Time (plateau de 2 personnes ).png" },
        { id: "dish_7", name: "Beignet de calamars", category: "coffee", business: "Moods", glb: "/3Dmenu/models/7_Beignet de calamars_shaded.glb", image: "/3Dmenu/images/items/moods/Beignet de calamars.png" },
        { id: "dish_8", name: "Paella aux fruits de mer", category: "coffee", business: "Moods", glb: "/3Dmenu/models/8_Paella aux fruits de mer_shaded.glb", image: "/3Dmenu/images/items/moods/Paella aux fruits de mer.png" },
        { id: "dish_9", name: "Tagine 1", category: "coffee", business: "Moods", glb: "/3Dmenu/models/9_tagine_shaded.glb", image: "/3Dmenu/images/items/moods/tajine1.png" },
        { id: "dish_10", name: "Tajine 2", category: "coffee", business: "Moods", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/tajine2.png" },

        //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //Petit Déjeune
        { id: "dish_11", name: "Petit déjeuner Made in France", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/1.png", type: "Petit Déjeuner" },
        { id: "dish_12", name: "Petit déjeuner Tangerois", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/2.png", type: "Petit Déjeuner" },
        { id: "dish_13", name: "Petit déjeuner Made in Italy", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/3.png", type: "Petit Déjeuner" },
        { id: "dish_14", name: "Petit déjeuner Made in USA", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/4.png", type: "Petit Déjeuner" },
        { id: "dish_15", name: "Petit déjeuner healthy", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/5.png", type: "Petit Déjeuner" },
        { id: "dish_16", name: "Petit déjeuner Libanais", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/6.png", type: "Petit Déjeuner" },
        { id: "dish_17", name: "Corbeille de pain, beurre portion, confiture", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/7.png", type: "Petit Déjeuner" },
        { id: "dish_18", name: "Panier de Viennoiserie", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/8.png", type: "Petit Déjeuner" },
        { id: "dish_19", name: "Assortiment Marocain", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/9.png", type: "Petit Déjeuner" },
        { id: "dish_20", name: "Tagine d'œuf au Khlii", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/10.png", type: "Petit Déjeuner" },

        //Entrées
        { id: "dish_21", name: "Salade Grecque au houmous", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/1.png", type: "Entrées" },
        { id: "dish_22", name: "Salade César au poulet", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/2.png", type: "Entrées" },
        { id: "dish_23", name: "Salade de fromage de chèvre", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/3.png", type: "Entrées" },
        { id: "dish_24", name: "Tartare de mangue et gambas cuites", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/4.png", type: "Entrées" },
        { id: "dish_25", name: "Salade de burratta", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/5.png", type: "Entrées" },
        { id: "dish_26", name: "🇱🇧 Cold Mezzé Libanais", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/6.png", type: "Entrées" },
        { id: "dish_27", name: "Mezzé Marocain à partager", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/7.png", type: "Entrées" },
        { id: "dish_28", name: "🇱🇧 Hot Mezzé Libanais", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/8.png", type: "Entrées" },
        { id: "dish_29", name: "Nems aux gambas", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/9.png", type: "Entrées" },
        { id: "dish_30", name: "Soupe de poissons", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/10.png", type: "Entrées" },

        //Déjeuner & Dîner
        { id: "dish_31", name: "🇱🇧 Cold Mezzé Libanais", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/1.png", type: "Déjeuner & Dîner" },
        { id: "dish_32", name: "🇱🇧 Samboussek au fromage", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/2.png", type: "Déjeuner & Dîner" },
        { id: "dish_33", name: "🇱🇧 falafel", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/3.png", type: "Déjeuner & Dîner" },
        { id: "dish_34", name: "🇱🇧 Samboussek à la viande", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/4.png", type: "Déjeuner & Dîner" },
        { id: "dish_35", name: "Mezzé Marocain à partager", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/5.png", type: "Déjeuner & Dîner" },
        { id: "dish_36", name: "🇱🇧 Warak Enab", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/6.png", type: "Déjeuner & Dîner" },
        { id: "dish_37", name: "🇱🇧 Fatayer aux épinards", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/7.png", type: "Déjeuner & Dîner" },
        { id: "dish_38", name: "🇱🇧 Hot Mezzé Libanais", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/8.png", type: "Déjeuner & Dîner" },
        { id: "dish_39", name: "🇱🇧 Lebanese Kibbeh", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/9.png", type: "Déjeuner & Dîner" },
        { id: "dish_40", name: "Pizza végétarienne", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/10.png", type: "Déjeuner & Dîner" },

        //Desserts
        { id: "dish_41", name: "Tea Time (plateau d’une personne)", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/1.png", type: "Desserts" },
        { id: "dish_42", name: "Tea Time (plateau de 2 personnes )", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/2.png", type: "Desserts" },
        { id: "dish_43", name: "Assiette De Fruits Découpés", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/3.png", type: "Desserts" },
        { id: "dish_44", name: "Tiramisu Au Citron-Gingembre", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/4.png", type: "Desserts" },
        { id: "dish_45", name: "Mille-Feuille Vanille Pistache", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/5.png", type: "Desserts" },
        { id: "dish_46", name: "Cheesecake Aux Fruits Rouge", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/6.png", type: "Desserts" },
        { id: "dish_47", name: "Fondant chocolat", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/7.png", type: "Desserts" },
        { id: "dish_48", name: "Pastilla au chocolat Blanc Et Fleur D’oranger", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/8.png", type: "Desserts" },
        { id: "dish_49", name: "Opéra chocolat Café", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/9.png", type: "Desserts" },
        { id: "dish_50", name: "Tiramisu", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/10.png", type: "Desserts" },

        //Boissons
        { id: "dish_51", name: "Espresso", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/1.png", type: "Boissons" },
        { id: "dish_52", name: "Americano", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/2.png", type: "Boissons" },
        { id: "dish_53", name: "Double espresso", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/3.png", type: "Boissons" },
        { id: "dish_54", name: "Nespresso", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/4.png", type: "Boissons" },
        { id: "dish_55", name: "Espresso Macchiato", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/5.png", type: "Boissons" },
        { id: "dish_56", name: "Café crème", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/6.png", type: "Boissons" },
        { id: "dish_57", name: "Cappuccino", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/7.png", type: "Boissons" },
        { id: "dish_58", name: "Café latté", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/8.png", type: "Boissons" },
        { id: "dish_59", name: "Latte caramel", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/9.png", type: "Boissons" },
        { id: "dish_60", name: "Mocca latte", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/10.png", type: "Boissons" },

        //Nouveaux
        { id: "dish_61", name: "🇱🇧 Cold Mezzé Libanais", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/1.png", type: "Nouveaux" },
        { id: "dish_62", name: "🇱🇧 Cold Mezzé Libanais", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/2.png", type: "Nouveaux" },
        { id: "dish_63", name: "🇱🇧 Cold Mezzé Libanais", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/3.png", type: "Nouveaux" },
        { id: "dish_64", name: "🇱🇧 Samboussek au fromage", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/4.png", type: "Nouveaux" },
        { id: "dish_65", name: "🇱🇧 Samboussek à la viande", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/5.png", type: "Nouveaux" },
        { id: "dish_66", name: "🇱🇧 falafel", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/6.png", type: "Nouveaux" },
        { id: "dish_67", name: "🇱🇧 Warak Enab", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/7.png", type: "Nouveaux" },
        { id: "dish_68", name: "🇱🇧 Fatayer aux épinards", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/8.png", type: "Nouveaux" },
        { id: "dish_69", name: "🇱🇧 Hot Mezzé Libanais", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/9.png", type: "Nouveaux" },
        { id: "dish_70", name: "🇱🇧 Lebanese Kibbeh", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/10.png", type: "Nouveaux" }
        //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    ];

    // --- Analytics state
    const [analytics, setAnalytics] = useState({
        totalVisitors: 0,
        totalOrders: 0,
        pageClicks: {},
        shares: {},
    });

    // --- Socket.IO connection (single instance)
    useEffect(() => {
        // Listen for real-time analytics updates from backend
        socket.on("updateDashboard", (data) => {
            setAnalytics(data);
        });

        return () => {
            socket.off("updateDashboard");
        };
    }, []);

    // --- Track Events
    const trackEvent = (eventName, payload) => {
        console.log("Tracked event:", eventName, payload);
        socket.emit("trackEvent", { eventName, ...payload });
    };

    return (
        <DataContext.Provider
            value={{
                categories,
                businesses,
                items,
                analytics,
                trackEvent,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

// --- Custom hook
export const useData = () => useContext(DataContext);