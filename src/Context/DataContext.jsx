// src/Context/DataContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SOCKET_URL = "https://threedmenu-server.onrender.com/";
export const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

export const DataContext = createContext();

export const DataProvider = ({ children }) => {


    const categories = [
        { id: "restaurant", name: "Restaurants", image: "images/categories/cat_restaurant_coffee.jpg" },
        //{ id: "tourism", name: "Tourism & Handicrafts", image: "images/categories/cat_Tourism_Handicrafts.jpg" },
        //{ id: "furniture", name: "Furniture & Home Decoration", image: "images/categories/cat_Furniture_Home%20Decoration.jpg" },
        //{ id: "automotive", name: "Accessoires", image: "images/categories/cat_Automotive_Scooters.jpg" },
    ];

    const businesses = [
  {
    id: "X",
    name: "Restaurant X",
    category: "restaurant",
    image: "/3Dmenu/images/businesses/rest_black.jpg",
    city: "Casablanca",
    categories: ["Nouveaux", "Déjeuner & Dîner", "Desserts"],
  },
  {
    id: "Y",
    name: "Restaurant Y",
    category: "restaurant",
    image: "/3Dmenu/images/businesses/rest_red.jpg",
    city: "Rabat",
    categories: ["Déjeuner & Dîner", "Boissons", "Entrées"],
  },
  {
    id: "Z",
    name: "Restaurant Z",
    category: "restaurant",
    image: "/3Dmenu/images/businesses/rest_orange.jpg",
    city: "Marrakech",
    insta: "https://www.instagram.com/mr.unreal.things/",
    categories: ["Nouveaux", "Entrées", "Déjeuner & Dîner", "Boissons"],
  },
  {
    id: "B",
    name: "Restaurant B",
    category: "restaurant",
    image: "/3Dmenu/images/businesses/rest_blue.jpg",
    city: "Tanger",
    categories: ["Nouveaux", "Déjeuner & Dîner"],
  },
        //{ id: "coffee_shop_2", name: "Sushi Hiro Maroc", category: "restaurant", image: "/3Dmenu/images/businesses/Sushi Hiro Maroc.png" , city:"Rabat"},
        //{ id: "coffee_shop_3", name: "Açai & You - Brunch & Coffee", category: "restaurant", image: "/3Dmenu/images/businesses/Açaï & You - Brunch & Coffee.jpeg", city:"Tangier" },
        
        //{ id: "coffee_shop_5", name: "House 17", category: "restaurant", image: "/3Dmenu/images/businesses/house 17.jpeg" },
        //{ id: "coffee_shop_6", name: "KOI cafe & restaurant", category: "restaurant", image: "/3Dmenu/images/businesses/moods.jpeg" },
        //{ id: "coffee_shop_7", name: "Winos Cafe & Restaurant", category: "restaurant", image: "/3Dmenu/images/businesses/moods.jpeg" },
        //{ id: "coffee_shop_8", name: "Green Black - Marina", category: "restaurant", image: "/3Dmenu/images/businesses/" },
        //{ id: "coffee_shop_9", name: "Flox Burger CASA", category: "restaurant", image: "/3Dmenu/images/businesses/" },
        //{ id: "coffee_shop_10", name: "Kamoun", category: "restaurant", image: "/3Dmenu/images/businesses/" },
        //{ id: "coffee_shop_11", name: "La Burratina - Trattoria & Pizzeria", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_12", name: "Les Frères Gourmets", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_13", name: "Kookento", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_14", name: "Fast & Delicious", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_15", name: "Guacaté", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_16", name: "EATFIT", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_17", name: "Café Bisogno", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_18", name: "MAYLI", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_19", name: "NYC Cookies in Casablanca", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_20", name: "CTR Chicken Casablanca", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_21", name: "Pomodolce", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_22", name: "Restaurant Dar EL Kaid", category: "restaurant", image: "/images/businesses/" },
        //{ id: "coffee_shop_23", name: "", category: "coffee", image: "/images/businesses/" },
        //{ id: "coffee_shop_24", name: "", category: "coffee", image: "/images/businesses/" },
        //{ id: "coffee_shop_25", name: "", category: "coffee", image: "/images/businesses/" },
        //{ id: "coffee_shop_26", name: "", category: "coffee", image: "/images/businesses/" },
        //{ id: "coffee_shop_", name: "", category: "coffee", image: "/images/businesses/" },
        //{ id: "furniture_shop_1", name: "Furniture Shop 1", category: "furniture" },
    ];

    const items = [
        { 
  id: "dish_1", 
  name: "Mezzé Marocain à partager", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/1_Mezzé Marocain à partager_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Mezzé Marocain à partager.png", 
  type: "Nouveaux",
  price: "60 DH", 
  description: "Assortiment marocain traditionnel", 
  price: "60",

  ingredient1: "Pois chiches", 
  ingredient2: "Aubergines grillées", 
  ingredient3: "Houmous", 
  ingredient4: "Olives", 
  ingredient5: "Zaalouk", 
  ingredient6: "Salades fraîches",

  nutrition_calories: "400 kcal",        // based on ~1 cup mezze bowl data :contentReference[oaicite:3]{index=3}
  nutrition_protein: "12.6 g", 
  nutrition_carbs: "31.5 g", 
  nutrition_fat: "23.7 g"
},
        { 
  id: "dish_2", 
  name: "Pizza végétarienne", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/2_Pizza végétarienne_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Pizza végétarienne.png", 
  price: "50",
  type: "Déjeuner & Dîner",
  ingredient1: "Tomate", 
  ingredient2: "Mozzarella", 
  ingredient3: "Poivrons", 
  ingredient4: "Champignons", 
  ingredient5: "Olives", 
  ingredient6: "Oignons",

  nutrition_calories: "270 kcal",        // from “Harvest Vegetable Pizza” example per ~1/3 pizza (146 g) :contentReference[oaicite:4]{index=4}
  nutrition_protein: "11 g", 
  nutrition_carbs: "34 g", 
  nutrition_fat: "10 g"
},
        { 
  id: "dish_3", 
  name: "Mixed grill", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/3_Mixed grill_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Mixed grill.png",
  price: "70",
  type: "Nouveaux",
  ingredient1: "Poulet", 
  ingredient2: "Agneau", 
  ingredient3: "Poitrine de boeuf", 
  ingredient4: "Légumes grillés", 
  ingredient5: "Sauce à l'ail", 
  ingredient6: "Herbes fraîches", 

  nutrition_calories: "550 kcal",   // estimate, depends on portion
  nutrition_protein: "35 g", 
  nutrition_carbs: "20 g", 
  nutrition_fat: "35 g"
},
        { 
  id: "dish_4", 
  name: "Loup entier grillé", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/4_Loup entier grillé_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Loup entier grillé.png",
  price: "75",
  type: "Déjeuner & Dîner",
  ingredient1: "Loup (poisson)", 
  ingredient2: "Herbes", 
  ingredient3: "Citron", 
  ingredient4: "Huile d'olive", 
  ingredient5: "Ail", 
  ingredient6: "Épices", 

  nutrition_calories: "480 kcal",    // estimate
  nutrition_protein: "40 g", 
  nutrition_carbs: "2 g", 
  nutrition_fat: "30 g"
},
        { 
  id: "dish_6", 
  name: "🇱🇧 Hot Mezzé Libanais", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/6_Hot Mezzé Libanais_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Hot Mezzé Libanais.png",
  type: "Nouveaux",
  price: "90",
  ingredient1: "Falafel", 
  ingredient2: "Houmous", 
  ingredient3: "Moutabal (aubergine)", 
  ingredient4: "Fatayer aux épinards", 
  ingredient5: "Kebbé", 
  ingredient6: "Pain pita", 

  nutrition_calories: "650 kcal", 
  nutrition_protein: "20 g", 
  nutrition_carbs: "55 g", 
  nutrition_fat: "35 g"
},
        { 
  id: "dish_5", 
  name: "Tea Time (plateau de 2 personnes)", 
  category: "restaurant", 
  business: "X",
  price: "85", 
  glb: "/3Dmenu/models/5_Tea Time (plateau de 2 personnes )_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Tea Time (plateau de 2 personnes ).png",
  type: "Déjeuner & Dîner",
  ingredient1: "Thé à la menthe", 
  ingredient2: "Petits fours sucrés", 
  ingredient3: "Biscuits marocains", 
  ingredient4: "Cornes de gazelle", 
  ingredient5: "Makrout", 
  ingredient6: "Chebakia", 

  nutrition_calories: "720 kcal",    // for 2 persons 
  nutrition_protein: "12 g", 
  nutrition_carbs: "120 g", 
  nutrition_fat: "22 g"
},
        { 
  id: "dish_7", 
  name: "Beignet de calamars", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/7_Beignet de calamars_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Beignet de calamars.png", 
  type: "Nouveaux",
  price: "45",
  ingredient1: "Calamars frais", 
  ingredient2: "Farine", 
  ingredient3: "Œufs", 
  ingredient4: "Huile de friture", 
  ingredient5: "Citron", 
  ingredient6: "Sel & poivre", 

  nutrition_calories: "420 kcal", 
  nutrition_protein: "25 g", 
  nutrition_carbs: "30 g", 
  nutrition_fat: "22 g"
},
        { 
  id: "dish_8", 
  name: "Paella aux fruits de mer", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/8_Paella aux fruits de mer_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Paella aux fruits de mer.png",
  type: "Déjeuner & Dîner",
  price: "70",
  ingredient1: "Riz", 
  ingredient2: "Moules", 
  ingredient3: "Crevettes", 
  ingredient4: "Calamars", 
  ingredient5: "Poivrons", 
  ingredient6: "Safran", 

  nutrition_calories: "560 kcal", 
  nutrition_protein: "35 g", 
  nutrition_carbs: "65 g", 
  nutrition_fat: "16 g"
},
        { 
  id: "dish_9", 
  name: "Tagine 1", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/9_tagine_shaded.glb", 
  image: "/3Dmenu/images/items/moods/tajine1.png",
  type: "Nouveaux",
  price: "95",
  ingredient1: "Agneau", 
  ingredient2: "Pruneaux", 
  ingredient3: "Amandes", 
  ingredient4: "Oignons", 
  ingredient5: "Épices marocaines", 
  ingredient6: "Huile d’olive", 

  nutrition_calories: "610 kcal", 
  nutrition_protein: "40 g", 
  nutrition_carbs: "30 g", 
  nutrition_fat: "35 g"
},
        { 
  id: "dish_10", 
  name: "Tajine 2", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/10_tajine_shaded.glb", 
  image: "/3Dmenu/images/items/moods/tajine2.png",
  type: "Déjeuner & Dîner",
  price: "90",
  ingredient1: "Poulet", 
  ingredient2: "Citron confit", 
  ingredient3: "Olives vertes", 
  ingredient4: "Ail", 
  ingredient5: "Coriandre", 
  ingredient6: "Épices marocaines", 

  nutrition_calories: "520 kcal", 
  nutrition_protein: "38 g", 
  nutrition_carbs: "15 g", 
  nutrition_fat: "28 g"
},

        { 
  id: "asian_dish1", 
  name: "Kimbap Dish", 
  category: "restaurant", 
  business: "Y", 
  glb: "/3Dmenu/models/asian_plat1_shaded.glb", 
  image: "/3Dmenu/images/items/asian_restaurant/Plat Ramen.png",
  type: "Nouveaux",
  price: "120",
  ingredient1: "Riz cuit", 
  ingredient2: "Algues nori", 
  ingredient3: "Carottes", 
  ingredient4: "Épinards", 
  ingredient5: "Œufs", 
  ingredient6: "Viande ou thon", 

  nutrition_calories: "330 kcal", 
  nutrition_protein: "12 g", 
  nutrition_carbs: "55 g", 
  nutrition_fat: "7 g"
},

{ 
  id: "asian_dish2", 
  name: "Plat 2 (Ramen)", 
  category: "restaurant", 
  business: "Y", 
  glb: "/3Dmenu/models/asian_plat2_shaded.glb", 
  image: "/3Dmenu/images/items/asian_restaurant/kimbap.jpg",
  type: "Déjeuner & Dîner",
  price: "95",
  ingredient1: "Nouilles ramen", 
  ingredient2: "Bouillon (soja ou miso)", 
  ingredient3: "Œuf mollet", 
  ingredient4: "Porc grillé (chashu)", 
  ingredient5: "Algues nori", 
  ingredient6: "Ciboulette", 

  nutrition_calories: "450 kcal", 
  nutrition_protein: "18 g", 
  nutrition_carbs: "60 g", 
  nutrition_fat: "14 g"
},

{ 
  id: "moroccan_dish1", 
  name: "Tajine plat", 
  category: "restaurant", 
  business: "Z",
  glb: "/3Dmenu/models/tajine plat_shaded.glb", 
  image: "/3Dmenu/images/items/Moroccan Restaurant/Tajine plat.jpg",
  type: "Nouveaux",
  price: "70",
  ingredient1: "Viande (agneau ou poulet)", 
  ingredient2: "Pommes de terre", 
  ingredient3: "Carottes", 
  ingredient4: "Courgettes", 
  ingredient5: "Tomates", 
  ingredient6: "Épices marocaines", 

  nutrition_calories: "520 kcal", 
  nutrition_protein: "36 g", 
  nutrition_carbs: "25 g", 
  nutrition_fat: "28 g"
},

{ 
  id: "moroccan_dish2", 
  name: "Tajine et Atay", 
  category: "restaurant", 
  business: "Z",
  price: "65",
  glb: "/3Dmenu/models/Tajine et Atay_shaded.glb", 
  image: "/3Dmenu/images/items/Moroccan Restaurant/moroccan tajine et atay.jpg", 
  type: "Déjeuner & Dîner",
  ingredient1: "Poulet ou agneau", 
  ingredient2: "Citron confit", 
  ingredient3: "Olives vertes", 
  ingredient4: "Herbes fraîches", 
  ingredient5: "Épices marocaines", 
  ingredient6: "Thé à la menthe (Atay)", 

  nutrition_calories: "600 kcal", 
  nutrition_protein: "38 g", 
  nutrition_carbs: "30 g", 
  nutrition_fat: "29 g"
},

{ 
  id: "moroccan_dish3", 
  name: "Panini plat", 
  category: "restaurant", 
  business: "Z", 
  glb: "/3Dmenu/models/panini plat.glb", 
  image: "/3Dmenu/images/items/Moroccan Restaurant/panini plat.jpg", 
  type: "Nouveaux",
  price: "45",
  ingredient1: "Pain panini", 
  ingredient2: "Fromage fondu", 
  ingredient3: "Jambon ou poulet", 
  ingredient4: "Tomates", 
  ingredient5: "Salade", 
  ingredient6: "Sauce maison", 

  nutrition_calories: "480 kcal", 
  nutrition_protein: "22 g", 
  nutrition_carbs: "45 g", 
  nutrition_fat: "20 g"
},



        //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //Petit Déjeune
        //{ id: "dish_11", name: "Petit déjeuner Made in France", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/1.png", type: "Petit Déjeuner" },
        //{ id: "dish_12", name: "Petit déjeuner Tangerois", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/2.png", type: "Petit Déjeuner" },
        //{ id: "dish_13", name: "Petit déjeuner Made in Italy", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/3.png", type: "Petit Déjeuner" },
        //{ id: "dish_14", name: "Petit déjeuner Made in USA", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/4.png", type: "Petit Déjeuner" },
        //{ id: "dish_15", name: "Petit déjeuner healthy", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/5.png", type: "Petit Déjeuner" },
        //{ id: "dish_16", name: "Petit déjeuner Libanais", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/6.png", type: "Petit Déjeuner" },
        //{ id: "dish_17", name: "Corbeille de pain, beurre portion, restaurant", category: "coffee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/7.png", type: "Petit Déjeuner" },
        //{ id: "dish_18", name: "Panier de Viennoiserie", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/8.png", type: "Petit Déjeuner" },
        //{ id: "dish_19", name: "Assortiment Marocain", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/9.png", type: "Petit Déjeuner" },
        //{ id: "dish_20", name: "Tagine d'œuf au Khlii", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Petit Dejeuner/10.png", type: "Petit Déjeuner" },

        //Entrées
        //{ id: "dish_21", name: "Salade Grecque au houmous", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/1.png", type: "Entrées" },
        //{ id: "dish_22", name: "Salade César au poulet", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/2.png", type: "Entrées" },
        //{ id: "dish_23", name: "Salade de fromage de chèvre", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/3.png", type: "Entrées" },
        //{ id: "dish_24", name: "Tartare de mangue et gambas cuites", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/4.png", type: "Entrées" },
        //{ id: "dish_25", name: "Salade de burratta", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/5.png", type: "Entrées" },
        //{ id: "dish_26", name: "🇱🇧 Cold Mezzé Libanais", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/6.png", type: "Entrées" },
        //{ id: "dish_27", name: "Mezzé Marocain à partager", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/7.png", type: "Entrées" },
        //{ id: "dish_28", name: "🇱🇧 Hot Mezzé Libanais", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/8.png", type: "Entrées" },
        //{ id: "dish_29", name: "Nems aux gambas", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/9.png", type: "Entrées" },
        //{ id: "dish_30", name: "Soupe de poissons", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Entrees/10.png", type: "Entrées" },

        //Déjeuner & Dîner
        //{ id: "dish_31", name: "🇱🇧 Cold Mezzé Libanais", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/1.png", type: "Déjeuner & Dîner" },
        //{ id: "dish_32", name: "🇱🇧 Samboussek au fromage", category: "v", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/2.png", type: "Déjeuner & Dîner" },
        //{ id: "dish_33", name: "🇱🇧 falafel", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/3.png", type: "Déjeuner & Dîner" },
        //{ id: "dish_34", name: "🇱🇧 Samboussek à la viande", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/4.png", type: "Déjeuner & Dîner" },
        //{ id: "dish_35", name: "Mezzé Marocain à partager", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/5.png", type: "Déjeuner & Dîner" },
        //{ id: "dish_36", name: "🇱🇧 Warak Enab", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/6.png", type: "Déjeuner & Dîner" },
        //{ id: "dish_37", name: "🇱🇧 Fatayer aux épinards", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/7.png", type: "Déjeuner & Dîner" },
        //{ id: "dish_38", name: "🇱🇧 Hot Mezzé Libanais", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/8.png", type: "Déjeuner & Dîner" },
        //{ id: "dish_39", name: "🇱🇧 Lebanese Kibbeh", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/9.png", type: "Déjeuner & Dîner" },
        //{ id: "dish_40", name: "Pizza végétarienne", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Dejeuner Diner/10.png", type: "Déjeuner & Dîner" },

        //Desserts
        //{ id: "dish_41", name: "Tea Time (plateau d’une personne)", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/1.png", type: "Desserts" },
        //{ id: "dish_42", name: "Tea Time (plateau de 2 personnes )", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/2.png", type: "Desserts" },
        //{ id: "dish_43", name: "Assiette De Fruits Découpés", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/3.png", type: "Desserts" },
        //{ id: "dish_44", name: "Tiramisu Au Citron-Gingembre", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/4.png", type: "Desserts" },
        //{ id: "dish_45", name: "Mille-Feuille Vanille Pistache", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/5.png", type: "Desserts" },
        //{ id: "dish_46", name: "Cheesecake Aux Fruits Rouge", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/6.png", type: "Desserts" },
        //{ id: "dish_47", name: "Fondant chocolat", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/7.png", type: "Desserts" },
        //{ id: "dish_48", name: "Pastilla au chocolat Blanc Et Fleur D’oranger", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/8.png", type: "Desserts" },
        //{ id: "dish_49", name: "Opéra chocolat Café", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/9.png", type: "Desserts" },
        //{ id: "dish_50", name: "Tiramisu", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Desserts/10.png", type: "Desserts" },

        //Boissons
        //{ id: "dish_51", name: "Espresso", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/1.png", type: "Boissons" },
        //{ id: "dish_52", name: "Americano", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/2.png", type: "Boissons" },
        //{ id: "dish_53", name: "Double espresso", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/3.png", type: "Boissons" },
        //{ id: "dish_54", name: "Nespresso", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/4.png", type: "Boissons" },
        //{ id: "dish_55", name: "Espresso Macchiato", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/5.png", type: "Boissons" },
        //{ id: "dish_56", name: "Café crème", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/6.png", type: "Boissons" },
        //{ id: "dish_57", name: "Cappuccino", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/7.png", type: "Boissons" },
        //{ id: "dish_58", name: "Café latté", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/8.png", type: "Boissons" },
        //{ id: "dish_59", name: "Latte caramel", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/9.png", type: "Boissons" },
        //{ id: "dish_60", name: "Mocca latte", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Boissons/10.png", type: "Boissons" },

        //Nouveaux
        //{ id: "dish_61", name: "🇱🇧 Cold Mezzé Libanais", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/1.png", type: "Nouveaux" },
        //{ id: "dish_62", name: "🇱🇧 Cold Mezzé Libanais", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/2.png", type: "Nouveaux" },
        //{ id: "dish_63", name: "🇱🇧 Cold Mezzé Libanais", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/3.png", type: "Nouveaux" },
        //{ id: "dish_64", name: "🇱🇧 Samboussek au fromage", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/4.png", type: "Nouveaux" },
        //{ id: "dish_65", name: "🇱🇧 Samboussek à la viande", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/5.png", type: "Nouveaux" },
        //{ id: "dish_66", name: "🇱🇧 falafel", category: "cofrestaurantfee", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/6.png", type: "Nouveaux" },
        //{ id: "dish_67", name: "🇱🇧 Warak Enab", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/7.png", type: "Nouveaux" },
        //{ id: "dish_68", name: "🇱🇧 Fatayer aux épinards", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/8.png", type: "Nouveaux" },
        //{ id: "dish_69", name: "🇱🇧 Hot Mezzé Libanais", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/9.png", type: "Nouveaux" },
        //{ id: "dish_70", name: "🇱🇧 Lebanese Kibbeh", category: "restaurant", business: "coffee_shop_1", glb: "/3Dmenu/models/10_tajine_shaded.glb", image: "/3Dmenu/images/items/moods/Nouveaux/10.png", type: "Nouveaux" },
        //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //{ id: "wokupstreet5", name: "Nouilles à Composer", category: "restaurant", business: "WokupStreet", glb: "/3Dmenu/models/Nouilles à Composer.glb", image: "/3Dmenu/images/items/wokupstreet/nouillet a compser_wokup.jpeg" },
       {
  id: "wokupstreet3",
  name: "Sushi Burger",
  category: "restaurant",
  business: "B",
  glb: "/3Dmenu/models/Sushi Burger.glb",
  image: "/3Dmenu/images/items/wokupstreet/sushi burger_wokup.jpg",
  type: "Nouveaux",
  price: "55",
  ingredient1: "Riz à sushi",
  ingredient2: "Saumon cru",
  ingredient3: "Avocat",
  ingredient4: "Concombre",
  ingredient5: "Nori (algue)",
  ingredient6: "Sauce soja",

  nutrition_calories: "420 kcal",
  nutrition_protein: "25 g",
  nutrition_carbs: "40 g",
  nutrition_fat: "15 g"
},
{
  id: "wokupstreet2",
  name: "Temaki",
  category: "restaurant",
  business: "B",
  glb: "/3Dmenu/models/Temaki.glb",
  image: "/3Dmenu/images/items/wokupstreet/temaki_wokup.jpg",
  type: "Déjeuner & Dîner",
  price: "30",
  ingredient1: "Riz à sushi",
  ingredient2: "Thon frais",
  ingredient3: "Avocat",
  ingredient4: "Concombre",
  ingredient5: "Mayonnaise épicée",
  ingredient6: "Nori (algue)",

  nutrition_calories: "350 kcal",
  nutrition_protein: "20 g",
  nutrition_carbs: "35 g",
  nutrition_fat: "8 g"
},
{
  id: "wokupstreet4",
  name: "Maki Crok",
  category: "restaurant",
  business: "B",
  glb: "/3Dmenu/models/Maki Crok.glb",
  image: "/3Dmenu/images/items/wokupstreet/maki_wokup.jpg",
  type: "Nouveaux",
  price: "40",
  ingredient1: "Riz à sushi",
  ingredient2: "Saumon frit",
  ingredient3: "Avocat",
  ingredient4: "Fromage à la crème",
  ingredient5: "Nori (algue)",
  ingredient6: "Sauce teriyaki",

  nutrition_calories: "450 kcal",
  nutrition_protein: "22 g",
  nutrition_carbs: "42 g",
  nutrition_fat: "18 g"
},

        //{ id: "wokupstreet6", name: "Kimbap Dish", category: "restaurant", business: "WokupStreet", glb: "/3Dmenu/models/asian_plat1_shaded.glb", image: "/3Dmenu/images/items/asian_restaurant/Plat Ramen.png" },
        //{ id: "wokupstreet7", name: "Plat X", category: "restaurant", business: "WokupStreet", glb: "/3Dmenu/models/asian_plat2_shaded.glb", image: "/3Dmenu/images/items/asian_restaurant/kimbap.jpg" },
        

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