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
    categories: [
    { fr: "Nouveaux", en: "New", ar: "جديد", zh: "新品" , ru: "Новые" },
    { fr: "Déjeuner & Dîner", en: "Lunch & Dinner", ar: "الغداء والعشاء",zh: "午餐和晚餐", ru: "Обед и ужин" },
    { fr: "Desserts", en: "Desserts", ar: "حلويات",zh: "甜点", ru: "Десерты" },
  ],
  tables: [1, 2, 3, 4, 5]
  },
  {
    id: "Y",
    name: "Restaurant Y",
    category: "restaurant",
    image: "/3Dmenu/images/businesses/rest_red.jpg",
    city: "Rabat",
    categories: [
  { fr: "Déjeuner & Dîner", en: "Lunch & Dinner", ar: "الغداء والعشاء",zh: "午餐和晚餐", ru: "Обед и ужин" },
  { fr: "Boissons", en: "Drinks", ar: "مشروبات", zh: "饮料", ru: "Напитки" },
  { fr: "Entrées", en: "Starters", ar: "المقبلات",zh: "前菜", ru: "Закуски" }
],
  },
  {
    id: "Z",
    name: "Restaurant Z",
    category: "restaurant",
    image: "/3Dmenu/images/businesses/rest_orange.jpg",
    city: "Marrakech",
    insta: "https://www.instagram.com/mr.unreal.things/",
    categories: [
  { fr: "Déjeuner & Dîner", en: "Lunch & Dinner", ar: "الغداء والعشاء", zh: "午餐和晚餐", ru: "Обед и ужин" },
  { fr: "Dessert", en: "Dessert", ar: "الحلوى",zh: "甜点", ru: "Десерт" }
],
  },
  {
    id: "B",
    name: "Restaurant B",
    category: "restaurant",
    image: "/3Dmenu/images/businesses/rest_blue.jpg",
    city: "Tanger",
    categories: [
  {
    fr: "Déjeuner & Dîner",
    en: "Lunch & Dinner",
    ar: "الغداء والعشاء",
    zh: "[translate:午餐和晚餐]",
    ru: "Обед и ужин"
  },
  {
    fr: "Dessert",
    en: "Dessert",
    ar: "الحلوى",
    zh: "[translate:甜点]",
    ru: "Десерт"
  }
],

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
    //---
        { 
  id: "dish_2", 
  name: "Pizza végétarienne", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/2_Pizza végétarienne_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Pizza végétarienne.png", 
  price: "50 DH",
  description: {
  fr: "La pizza végétarienne s’inspire de la culture italienne mais s’adapte en utilisant uniquement des ingrédients végétaux. Popularisée au XXe siècle, elle est devenue un emblème de la cuisine moderne saine et accessible partout dans le monde.",
  en: "Vegetarian pizza draws inspiration from Italian culture, adapted with entirely plant-based toppings. Popularized in the 20th century, it has become a symbol of modern, healthy cuisine, enjoyed worldwide.",
  ar: "البيتزا النباتية مستوحاة من الثقافة الإيطالية وتكيفت باستخدام مكونات نباتية فقط. انتشرت في القرن العشرين وأصبحت رمزًا للمطبخ العصري الصحي في جميع أنحاء العالم",
  zh: "素食披萨灵感来自意大利文化，但只使用植物性食材。20世纪普及后，已成为现代健康饮食的象征，全球皆可享用",
  ru: "Вегетарианская пицца возникла из итальянской традиции, но с овощной начинкой. В XX веке стала популярным символом здорового питания и любимым блюдом по всему миру."
}
, 
  type: "Déjeuner & Dîner",
  ingredient1: { fr: "Tomate", en: "Tomato", ar: "طماطم", zh: "番茄",ru: "Помидор" },
    ingredient2: { fr: "Mozzarella", en: "Mozzarella", ar: "موزاريلا", zh: "马苏里拉奶酪",ru: "Моцарелла" },
    ingredient3: { fr: "Poivrons", en: "Bell peppers", ar: "فلفل حلو", zh: "辣椒",ru: "Перец сладкий" },
    ingredient4: { fr: "Champignons", en: "Mushrooms", ar: "فطر",zh: "蘑菇", ru: "Грибы" },
    ingredient5: { fr: "Olives", en: "Olives", ar: "زيتون",zh: "橄榄", ru: "Оливки" },
    ingredient6: { fr: "Oignons", en: "Onions", ar: "بصل", zh: "洋葱", ru: "Лук" },

  nutrition_calories: "270 kcal",        
  nutrition_protein: "11 g", 
  nutrition_carbs: "34 g", 
  nutrition_fat: "10 g",
  categoryReviews: [
  {
    comment: {
      fr: "Une pizza savoureuse avec des ingrédients frais et colorés.",
      en: "A tasty pizza with fresh and colorful ingredients.",
      ar: "بيتزا لذيذة مع مكونات طازجة وملونة",
      zh: "一款美味的披萨，使用新鲜多彩的食材。",
      ru: "Вкусная пицца со свежими и яркими ингредиентами."
    }
  },
  {
    comment: {
      fr: "La mozzarella fond parfaitement, un vrai délice végétarien.",
      en: "The mozzarella melts perfectly, a true vegetarian delight.",
      ar: "الموزاريلا تذوب بشكل مثالي، متعة نباتية حقيقية",
      zh: "莫扎里拉奶酪完美融化，是纯素食的真正美味。",
      ru: "Моцарелла прекрасно плавится, настоящий вегетарианский деликатес."
    }
  },
  {
    comment: {
      fr: "Parfaite pour un déjeuner ou un dîner léger et savoureux.",
      en: "Perfect for a light and flavorful lunch or dinner.",
      ar: "مثالية لغداء أو عشاء خفيف ولذيذ",
      zh: "非常适合轻松美味的午餐或晚餐。",
      ru: "Отлично подходит для легкого и вкусного обеда или ужина."
    }
  }
]

},
{ 
        id: "dish_1", 
        name: "Mezzé Marocain à partager", 
        category: "restaurant", 
        business: "X", 
        glb: "/3Dmenu/models/1_Mezzé Marocain à partager_shaded.glb", 
        image: "/3Dmenu/images/items/moods/Mezzé Marocain à partager.png", 
        type: "Nouveaux",
        description: {
  fr: "Le mezzé marocain est une célébration du partage et de la convivialité, issu de la tradition des tables marocaines où chaque famille prépare de multiples entrées pour recevoir. Son origine remonte aux rituels culinaires du Maghreb, valorisant la diversité et la générosité.",
  en: "Moroccan mezzé is a celebration of sharing and togetherness, originating from the tradition of Moroccan tables where families prepare many appetizers to welcome guests. Its roots trace back to Maghreb culinary rituals, showcasing diversity and generosity.",
  ar: "المزة المغربي هو احتفال بالمشاركة والدفء، ينحدر من تقاليد الموائد المغربية حيث تعد العائلات العديد من المقبلات للضيافة. تعود أصوله إلى الطقوس المطبخية في المغرب العربي، ليرمز إلى التنوع والكرم",
  zh: "摩洛哥小吃是分享与友谊的庆典，源自摩洛哥家庭传统，每家准备多种开胃菜以招待宾客。其起源可追溯到马格里布地区的烹饪仪式，强调多样性和慷慨",
  ru: "Марокканский меззе — символ гостеприимства и совместного наслаждения едой, уходящий корнями в традиции, где семьи готовят множество закусок для гостей. Его истоки — в кулинарных ритуалах Магриба, олицетворяющих богатство и щедрость."
},

        price: "60 DH",
        ingredient1: {
      fr: "Pois chiches",
      en: "Chickpeas",
      ar: "حمص",
      zh: "鹰嘴豆",
      ru: "Нут"
    },
    ingredient2: {
      fr: "Aubergines grillées",
      en: "Grilled eggplants",
      ar: "باذنجان مشوي",
      zh: "烤茄子",
      ru: "Жареные баклажаны"
    },
    ingredient3: {
      fr: "Houmous",
      en: "Hummus",
      ar: "حمص",
      zh: "鹰嘴豆泥",
      ru: "Хумус"
    },
    ingredient4: {
      fr: "Olives",
      en: "Olives",
      ar: "زيتون",
      zh: "橄榄",
      ru: "Оливки"
    },
    ingredient5: {
      fr: "Zaalouk",
      en: "Zaalouk",
      ar: "زعلوك",
      zh: "扎鲁克 (摩洛哥茄子沙拉)",
      ru: "Залук"
    },
    ingredient6: {
      fr: "Salades fraîches",
      en: "Fresh salads",
      ar: "سلطات طازجة",
      zh: "新鲜沙拉",
      ru: "Свежие салаты"
    },

        nutrition_calories: "400 kcal",   
        nutrition_protein: "12.6 g", 
        nutrition_carbs: "31.5 g", 
        nutrition_fat: "23.7 g",

       categoryReviews: [
  {
    comment: {
      fr: "Délicieux assortiment, parfait pour partager.",
      en: "Delicious assortment, perfect for sharing.",
      ar: "تنويعة لذيذة، مثالية للمشاركة.",
      zh: "美味的拼盘，非常适合分享。",
      ru: "Вкусное ассорти, идеально для совместного употребления."
    }
  },
  {
  comment: {
    fr: "Très bon goût.",
    en: "Very good taste.",
    ar: "طعم جيد جدًا",
    zh: "味道非常好。",
    ru: "Очень хороший вкус."
  }
},
  {
    comment: {
      fr: "Fraîche et authentique. Je recommande vivement.",
      en: "Fresh and authentic. Highly recommend.",
      ar: "طازج وأصيل. أنصح به بشدة.",
      zh: "新鲜且地道。我强烈推荐。",
      ru: "Свежо и аутентично. Настоятельно рекомендую."
    }
  }
]
    },
//---
        { 
  id: "dish_4", 
  name: "Loup entier grillé", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/4_Loup entier grillé_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Loup entier grillé.png",
  price: "75 DH",
  type: "Déjeuner & Dîner",
  description: {
  fr: "Le loup entier grillé appartient à la gastronomie méditerranéenne, où le poisson frais est cuit simplement sur le grill avec des herbes et du citron. Tradition transmise depuis l’Antiquité, elle sublime la fraîcheur de la pêche côtière.",
  en: "Whole grilled sea bass is rooted in Mediterranean cuisine, where fresh fish is simply grilled with herbs and lemon. This tradition, passed down since Antiquity, celebrates the freshness of coastal catches.",
  ar: "اللّوب المشوي بالكامل هو جزء من المطبخ المتوسطي، حيث يُطهى السمك الطازج ببساطة على الشواية مع الأعشاب والليمون. تقليد متوارث من العصور القديمة، يبرز طزاجة الصيد البحري",
  zh: "整烤石斑鱼属于地中海美食，使用新鲜鱼及香草柠檬简易烧烤。该传统自古传承，突显海岸捕鱼的新鲜美味",
  ru: "Целый морской окунь на гриле — блюдо средиземноморской кухни, где рыбу готовят с травами и лимоном. Эта традиция, пришедшая из древности, прославляет свежесть морских уловов."
}
, 
  ingredient1: { fr: "Loup (poisson)", en: "Sea bass", ar: "سمك البحري", zh: "石斑鱼",ru: "Морской окунь" },
    ingredient2: { fr: "Herbes", en: "Herbs", ar: "أعشاب", zh: "香草",ru: "Травы" },
    ingredient3: { fr: "Citron", en: "Lemon", ar: "ليمون",zh: "柠檬", ru: "Лимон" },
    ingredient4: { fr: "Huile d'olive", en: "Olive oil", ar: "زيت الزيتون",zh: "橄榄油", ru: "Оливковое масло" },
    ingredient5: { fr: "Ail", en: "Garlic", ar: "ثوم", zh: "大蒜",ru: "Чеснок" },
    ingredient6: { fr: "Épices", en: "Spices", ar: "بهارات", zh: "香料",ru: "Специи" },

  nutrition_calories: "480 kcal",    // estimate
  nutrition_protein: "40 g", 
  nutrition_carbs: "2 g", 
  nutrition_fat: "30 g",
  categoryReviews: [
  {
    comment: {
      fr: "Poisson parfaitement grillé, frais et parfumé.",
      en: "Perfectly grilled fish, fresh and flavorful.",
      ar: "سمك مشوي بشكل مثالي، طازج ومعطر",
      zh: "鱼烤得恰到好处，新鲜多香。",
      ru: "Идеально приготовленная рыба, свежая и ароматная."
    }
  },
  {
    comment: {
      fr: "Les herbes et le citron relèvent merveilleusement le plat.",
      en: "The herbs and lemon wonderfully enhance the dish.",
      ar: "الأعشاب والليمون تعزز الطبق بشكل رائع",
      zh: "香草和柠檬极大地提升了这道菜的风味。",
      ru: "Травы и лимон превосходно дополняют блюдо."
    }
  },
  {
    comment: {
      fr: "Un plat léger mais riche en goût.",
      en: "A light yet flavorful dish.",
      ar: "طبق خفيف لكنه غني بالنكهة",
      zh: "一道清淡但味道丰富的菜肴。",
      ru: "Легкое, но насыщенное вкусом блюдо."
    }
  }
]

},
//---
        { 
  id: "dish_6", 
  name: "🇱🇧 Hot Mezzé Libanais", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/6_Hot Mezzé Libanais_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Hot Mezzé Libanais.png",
  type: "Nouveaux",
  price: "90 DH",
  description: {
  fr: "Le hot mezzé libanais s’ancre dans la culture levantine, où le partage et les grands plateaux d’entrées sont au cœur de l’hospitalité. Il puise ses racines dans les banquets du Liban, riches en saveurs et couleurs.",
  en: "Lebanese hot mezzé originates from Levantine culture, where sharing and generous platters of starters are central to hospitality. Its roots lie in Lebanon’s festive banquets, bursting with flavors and colors.",
  ar: "المزة اللبناني الساخن ينتمي إلى ثقافة بلاد الشام، حيث المشاركة والضيافة تعتمد على صحون المقبلات المتنوعة. ترجع أصوله إلى الولائم اللبنانية الزاخرة بالنكهات والألوان",
  zh: "黎巴嫩热小吃根植于黎凡特文化，共享和丰富的开胃菜是款待核心。其起源于黎巴嫩丰盛多彩的宴会",
  ru: "Горячий ливанский меззе — традиция Леванта, где угощение начинается с обильных закусок. Его истоки — в праздничных застольях Ливана, наполненных вкусами и яркими красками."
}
, 
  ingredient1: { fr: "Falafel", en: "Falafel", ar: "فلافل", zh: "炸豆丸" ,ru: "Фалафель" },
    ingredient2: { fr: "Houmous", en: "Hummus", ar: "حمص", zh: "鹰嘴豆泥" ,ru: "Хумус" },
    ingredient3: { fr: "Moutabal (aubergine)", en: "Mutabbal (eggplant)", ar: "متبل (باذنجان)", zh: "茄子泥",ru: "Мутаббал (баклажан)" },
    ingredient4: { fr: "Fatayer aux épinards", en: "Spinach fatayer", ar: "فطاير بالسبانخ", zh: "菠菜馅饼", ru: "Фатайер со шпинатом" },
    ingredient5: { fr: "Kebbé", en: "Kibbeh", ar: "كبة",zh: "凯贝(黎巴嫩肉饼)", ru: "Киббе" },
    ingredient6: { fr: "Pain pita", en: "Pita bread", ar: "خبز بيتا", zh: "皮塔饼",ru: "Пита" },

  nutrition_calories: "650 kcal", 
  nutrition_protein: "20 g", 
  nutrition_carbs: "55 g", 
  nutrition_fat: "35 g",
  categoryReviews: [
  {
    comment: {
      fr: "Un assortiment chaud et épicé, plein de saveurs libanaises.",
      en: "A warm and spicy assortment full of Lebanese flavors.",
      ar: "تشكيلة ساخنة ومتبلّة مليئة بنكهات لبنانية",
      zh: "一盘热辣拼盘，充满黎巴嫩风味。",
      ru: "Теплый и пряный набор, полный ливанских вкусов."
    }
  },
  {
    comment: {
      fr: "Les falafels sont croustillants et savoureux.",
      en: "The falafels are crispy and tasty.",
      ar: "الفلافل مقرمشة ولذيذة",
      zh: "炸豆丸酥脆美味。",
      ru: "Фалафель хрустящий и вкусный."
    }
  },
  {
    comment: {
      fr: "Le houmous et le moutabal apportent une belle texture.",
      en: "The hummus and mutabbal bring a lovely texture.",
      ar: "الحمص والمطبّل يضيفان قوامًا رائعًا",
      zh: "鹰嘴豆泥和茄子泥带来绝佳口感。",
      ru: "Хумус и муттабаль придают прекрасную текстуру."
    }
  }
]

},
        { 
  id: "dish_5", 
  name: "Tea Time (plateau de 2 personnes)", 
  category: "restaurant", 
  business: "X",
  price: "85 DH", 
  glb: "/3Dmenu/models/5_Tea Time (plateau de 2 personnes )_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Tea Time (plateau de 2 personnes ).png",
  type: "Déjeuner & Dîner",
  description: {
  fr: "Le Tea Time marocain puise son inspiration des salons de thé institutionnels de Fès et Marrakech. Les douceurs et le thé à la menthe sont des symboles ancestraux du raffinement et de la convivialité maghrébine.",
  en: "Moroccan Tea Time draws inspiration from the storied tea salons of Fez and Marrakech, where treats and mint tea are ancient symbols of hospitality and Maghreb refinement.",
  ar: "وقت الشاي المغربي مستوحى من صالونات الشاي التاريخية في فاس ومراكش. الحلويات والشاي بالنعناع رموزٌ عريقة للدفء والرقي المغاربي",
  zh: "摩洛哥下午茶灵感来自非斯和马拉喀什的茶馆。甜点与薄荷茶象征着马格里布地区的优雅与友谊",
  ru: "Марокканский чайный сет вдохновлён традиционными чайными салонами Феса и Марракеша, где сладости и мятный чай — это давние символы гостеприимства и утонченности."
}
,
  ingredient1: { fr: "Thé à la menthe", en: "Mint tea", ar: "شاي بالنعناع",zh: "薄荷茶", ru: "Мятный чай" },
    ingredient2: { fr: "Petits fours sucrés", en: "Sweet petits fours", ar: "صغيرات حلوى", zh: "甜点小吃" ,ru: "Маленькие пирожные" },
    ingredient3: { fr: "Biscuits marocains", en: "Moroccan cookies", ar: "بسكويت مغربي", zh: "摩洛哥饼干",ru: "Марокканское печенье" },
    ingredient4: { fr: "Cornes de gazelle", en: "Gazelle horns", ar: "قرون الغزال", zh: "羚羊角饼",ru: "Рога газели" },
    ingredient5: { fr: "Makrout", en: "Makrout", ar: "مقروط",zh: "玛克鲁特(椰枣甜点)", ru: "Макруть" },
    ingredient6: { fr: "Chebakia", en: "Chebakia", ar: "شبكية", zh: "巧巴基亚（蜜糖芝麻饼）",ru: "Шебакия" },

  nutrition_calories: "720 kcal",    // for 2 persons 
  nutrition_protein: "12 g", 
  nutrition_carbs: "120 g", 
  nutrition_fat: "22 g",
  categoryReviews: [
  {
    comment: {
      fr: "Un assortiment chaud et épicé, plein de saveurs libanaises.",
      en: "A warm and spicy assortment full of Lebanese flavors.",
      ar: "تشكيلة ساخنة ومتبلّة مليئة بنكهات لبنانية",
      zh: "一盘热辣拼盘，充满黎巴嫩风味。",
      ru: "Теплый и пряный набор, полный ливанских вкусов."
    }
  },
  {
    comment: {
      fr: "Les falafels sont croustillants et savoureux.",
      en: "The falafels are crispy and tasty.",
      ar: "الفلافل مقرمشة ولذيذة",
      zh: "炸豆丸酥脆美味。",
      ru: "Фалафель хрустящий и вкусный."
    }
  },
  {
    comment: {
      fr: "Le houmous et le moutabal apportent une belle texture.",
      en: "The hummus and mutabbal bring a lovely texture.",
      ar: "الحمص والمطبّل يضيفان قوامًا رائعًا",
      zh: "鹰嘴豆泥和茄子泥带来绝佳口感。",
      ru: "Хумус и муттабаль придают прекрасную текстуру."
    }
  }
]

  
},
//---
        { 
  id: "dish_8", 
  name: "Paella aux fruits de mer", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/8_Paella aux fruits de mer_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Paella aux fruits de mer.png",
  type: "Déjeuner & Dîner",
  price: "70 DH",
  description: {
  fr: "La paella aux fruits de mer est née dans la région de Valence en Espagne, autour des rizières et des ports de pêche. Plat populaire, elle unit riz safrané et trésors de la mer dans une grande poêle à partager.",
  en: "Seafood paella originated in the region of Valencia, Spain, among rice fields and fishing ports. This popular dish brings together saffron rice and seafood in a large pan for communal enjoyment.",
  ar: "بدا طبق الباييلا البحري في منطقة فالنسيا الإسبانية بين حقول الأرز وموانئ الصيد. طبق شعبي يجمع بين الأرز بالزعفران وكنوز البحر في مقلاة كبيرة للمشاركة",
  zh: "海鲜西班牙饭诞生于西班牙巴伦西亚地区稻田和渔港。作为流行菜肴，将藏红花米饭与海洋珍宝融合在一大锅中共享",
  ru: "Паэлья с морепродуктами появилась в Валенсии, Испании, среди рисовых полей и рыбацких портов. Это популярное блюдо объединяет шафрановый рис и дары моря в большой сковороде для совместной трапезы."
}
,
  ingredient1: { fr: "Riz", en: "Rice", ar: "أرز", zh: "米饭", ru: "Рис" },
    ingredient2: { fr: "Moules", en: "Mussels", ar: "بلح البحر",zh: "贻贝", ru: "Мидии" },
    ingredient3: { fr: "Crevettes", en: "Shrimps", ar: "روبيان", zh: "虾",ru: "Креветки" },
    ingredient4: { fr: "Calamars", en: "Squid", ar: "حبار", zh: "鱿鱼", ru: "Кальмары" },
    ingredient5: { fr: "Poivrons", en: "Bell peppers", ar: "فلفل حلو",zh: "辣椒", ru: "Перец сладкий" },
    ingredient6: { fr: "Safran", en: "Saffron", ar: "زعفران", zh: "藏红花",ru: "Шафран" },

  nutrition_calories: "560 kcal", 
  nutrition_protein: "35 g", 
  nutrition_carbs: "65 g", 
  nutrition_fat: "16 g",
  categoryReviews: [
  {
    comment: {
      fr: "Un riz savoureux avec des fruits de mer frais.",
      en: "Flavorful rice with fresh seafood.",
      ar: "أرز لذيذ مع مأكولات بحرية طازجة",
      zh: "一碗美味的米饭配新鲜海鲜。",
      ru: "Вкусный рис со свежими морепродуктами."
    }
  },
  {
    comment: {
      fr: "Le safran apporte une touche délicate et parfumée.",
      en: "The saffron adds a delicate and aromatic touch.",
      ar: "الزعفران يضيف لمسة عطرية دقيقة",
      zh: "藏红花带来细腻芳香。",
      ru: "Шафран добавляет нежный и ароматный оттенок."
    }
  },
  {
    comment: {
      fr: "Les crevettes et calamars sont parfaitement cuits.",
      en: "The shrimp and squid are perfectly cooked.",
      ar: "الجمبري والحبار مطهوان بشكل مثالي",
      zh: "虾和鱿鱼烹饪得恰到好处。",
      ru: "Креветки и кальмары приготовлены идеально."
    }
  }
]


},
//---
 { 
  id: "dish_3", 
  name: "Mixed grill", 
  category: "restaurant", 
  business: "X", 
  glb: "/3Dmenu/models/3_Mixed grill_shaded.glb", 
  image: "/3Dmenu/images/items/moods/Mixed grill.png",
  price: "70 DH",
  description: {
  fr: "Le mixed grill remonte aux traditions ancestrales du barbecue collectif, si cher dans de nombreuses cultures méditerranéennes et africaines. Chaque grillade réunit différentes viandes, illustrant le rôle central du feu dans le repas festif.",
  en: "Mixed grill has its origins in ancient communal barbecue traditions cherished in Mediterranean and African cultures. The variety of grilled meats highlights the importance of fire and collective feasting in celebratory meals.",
  ar: "المشويات المشكلة تعود إلى تقاليد الشواء الجماعي القديمة المحبوبة في ثقافات البحر المتوسط وأفريقيا. يبرز تنوع اللحوم المشوية أهمية النار والاحتفال الجماعي في المناسبات",
  zh: "混合烤肉源于多种地中海和非洲文化中的集体烧烤传统。多种肉类聚集，体现了火在庆典餐食中的核心作用",
  ru: "Микс из гриля восходит к традициям совместного барбекю, популярным в средиземноморских и африканских культурах. Разнообразие мяса подчеркивает роль огня и общих застолий в праздниках."
}
, 
  type: "Nouveaux",
  ingredient1: { fr: "Poulet", en: "Chicken", ar: "دجاج", zh: "鸡肉", ru: "Курица" },
    ingredient2: { fr: "Agneau", en: "Lamb", ar: "لحم ضأن", zh: "羊肉",ru: "Баранина" },
    ingredient3: { fr: "Poitrine de boeuf", en: "Beef brisket", ar: "صدر بقري",zh: "牛胸肉", ru: "Грудинка говядины" },
    ingredient4: { fr: "Légumes grillés", en: "Grilled vegetables", ar: "خضروات مشوية", zh: "烤蔬菜",ru: "Жареные овощи" },
    ingredient5: { fr: "Sauce à l'ail", en: "Garlic sauce", ar: "صلصة ثوم",zh: "蒜蓉酱", ru: "Чесночный соус" },
    ingredient6: { fr: "Herbes fraîches", en: "Fresh herbs", ar: "أعشاب طازجة", zh: "新鲜香草",ru: "Свежие травы" }, 

  nutrition_calories: "550 kcal",   // estimate, depends on portion
  nutrition_protein: "35 g", 
  nutrition_carbs: "20 g", 
  nutrition_fat: "35 g",
  categoryReviews: [
  {
    comment: {
      fr: "Un assortiment généreux de viandes grillées, très satisfaisant.",
      en: "A generous assortment of grilled meats, very satisfying.",
      ar: "تشكيلة سخية من اللحوم المشوية، مرضية جداً",
      zh: "丰盛的烤肉拼盘，非常令人满足。",
      ru: "Щедрый набор жареного мяса, очень сытный."
    }
  },
  {
    comment: {
      fr: "Les légumes grillés apportent un bel équilibre en saveurs.",
      en: "The grilled vegetables provide a nice balance of flavors.",
      ar: "الخضروات المشوية تضيف توازنًا رائعًا للنكهات",
      zh: "烤蔬菜带来美妙的味道平衡。",
      ru: "Жареные овощи прекрасно уравновешивают вкус."
    }
  },
  {
    comment: {
      fr: "La sauce à l'ail est un accompagnement parfait.",
      en: "The garlic sauce is a perfect accompaniment.",
      ar: "صلصة الثوم هي مرافقة مثالية",
      zh: "蒜蓉酱是完美的配料。",
      ru: "Чесночный соус — идеальное дополнение."
    }
  }
]
},
//-----------------------------------------------------------------------------------------------------

        { 
  id: "asian_dish1", 
  name: "Kimbap Dish", 
  category: "restaurant", 
  business: "Y", 
  glb: "/3Dmenu/models/asian_plat1_shaded.glb", 
  image: "/3Dmenu/images/items/asian_restaurant/Plat Ramen.png",
  type: "Nouveaux",
  price: "120 DH",
  description: {
  fr: "Le kimbap est un plat emblématique de la Corée, apparu au XXe siècle comme variante locale du sushi japonais. Populaire lors des pique-niques et fêtes, il symbolise la modernité et la nutrition équilibrée en Corée du Sud.",
  en: "Kimbap is a staple of Korean cuisine, emerging in the 20th century as a local adaptation of Japanese sushi. Popular at picnics and celebrations, it represents modernity and balanced nutrition in South Korea.",
  ar: "الكيمباب هو طبق أساسي في المطبخ الكوري، ظهر في القرن العشرين كنسخة محلية من السوشي الياباني. يحظى بشعبية في النزهات والمناسبات، ويرمز للحداثة والتغذية المتوازنة في كوريا الجنوبية",
  zh: "紫菜包饭是韩国标志性食品，20世纪作为日本寿司的本地变体出现。适合野餐和节日，象征韩国的现代性和均衡营养",
  ru: "Кимбап — классика корейской кухни, появившаяся в XX веке как местная версия японских суши. Популярен на пикниках и праздниках, символизирует современность и сбалансированное питание в Южной Корее."
}
,
  ingredient1: { fr: "Riz cuit", en: "Cooked rice", ar: "أرز مطبوخ",zh: "熟米饭", ru: "Варёный рис" },
    ingredient2: { fr: "Algues nori", en: "Nori seaweed", ar: "أعشاب البحر نوري", zh: "海苔",ru: "Водоросли нори" },
    ingredient3: { fr: "Carottes", en: "Carrots", ar: "جزر",zh: "胡萝卜", ru: "Морковь" },
    ingredient4: { fr: "Épinards", en: "Spinach", ar: "سبانخ", zh: "菠菜",ru: "Шпинат" },
    ingredient5: { fr: "Œufs", en: "Eggs", ar: "بيض",zh: "鸡蛋", ru: "Яйца" },
    ingredient6: { fr: "Viande ou thon", en: "Meat or tuna", ar: "لحم أو تونة",zh: "肉类或金枪鱼", ru: "Мясо или тунец" },

  nutrition_calories: "330 kcal", 
  nutrition_protein: "12 g", 
  nutrition_carbs: "55 g", 
  nutrition_fat: "7 g",
  categoryReviews: [
  {
    comment: {
      fr: "Un plat frais et savoureux, parfait pour les amateurs de cuisine asiatique.",
      en: "A fresh and flavorful dish, perfect for Asian cuisine lovers.",
      ar: "طبق طازج ولذيذ، مثالي لعشاق المطبخ الآسيوي",
      zh: "一道清新美味的菜肴，非常适合亚洲料理爱好者。",
      ru: "Свежее и ароматное блюдо, идеально для любителей азиатской кухни."
    }
  },
  {
    comment: {
      fr: "Les algues nori apportent une belle texture croquante.",
      en: "The nori seaweed brings a nice crunchy texture.",
      ar: "أعشاب النوري تضيف قوامًا مقرمشًا رائعًا",
      zh: "海苔带来美妙的酥脆口感。",
      ru: "Водоросли нори придают приятную хрустящую текстуру."
    }
  },
  {
    comment: {
      fr: "Un mélange parfait de riz et légumes frais.",
      en: "A perfect mix of rice and fresh vegetables.",
      ar: "مزيج مثالي من الأرز والخضروات الطازجة",
      zh: "完美融合的新鲜米饭和蔬菜。",
      ru: "Идеальное сочетание риса и свежих овощей."
    }
  }
]

},
//---
{ 
  id: "asian_dish2", 
  name: "Ramen", 
  category: "restaurant", 
  business: "Y", 
  glb: "/3Dmenu/models/asian_plat2_shaded.glb", 
  image: "/3Dmenu/images/items/asian_restaurant/kimbap.jpg",
  type: "Déjeuner & Dîner",
  price: "95 DH",
  description: {
  fr: "Le ramen a été introduit au Japon au début du XXe siècle, inspiré des soupes chinoises. Il est rapidement devenu un plat phare, apprécié par toutes les générations pour sa diversité de saveurs et sa convivialité.",
  en: "Ramen was introduced to Japan in the early 20th century, inspired by Chinese soups. It swiftly became a favorite dish, loved by all generations for its variety of flavors and social appeal.",
  ar: "تم تقديم الرامن في اليابان أوائل القرن العشرين مستوحى من الحساء الصيني. أصبح بسرعة طبقا رئيسيا، محبوبًا من جميع الأجيال لتعدد نكهاته ودفء هذه التجربة",
  zh: "拉面于20世纪初传入日本，受中国汤面启发。迅速成为招牌美食，因其多样口味和亲切感受各代喜爱",
  ru: "Рамен появился в Японии в начале XX века, вдохновлённый китайскими супами. Быстро стал одним из самых популярных блюд для всех поколений благодаря разнообразию вкусов и уюту совместной трапезы."
}
,
  ingredient1: { fr: "Nouilles ramen", en: "Ramen noodles", ar: "شعيرية رامن",zh: "拉面" , ru: "Лапша рамен" },
    ingredient2: { fr: "Bouillon (soja ou miso)", en: "Broth (soy or miso)", ar: "مرق (صويا أو ميسو)",zh: "汤底（酱油或味噌）", ru: "Бульон (соевый или мисо)" },
    ingredient3: { fr: "Œuf mollet", en: "Soft-boiled egg", ar: "بيض مسلوق نصف", zh: "溏心蛋",ru: "Мягко сваренное яйцо" },
    ingredient4: { fr: "Porc grillé (chashu)", en: "Grilled pork (chashu)", ar: "لحم الخنزير المشوي (تشاشو)",zh: "烤猪肉（叉烧）", ru: "Жареная свинина (чашу)" },
    ingredient5: { fr: "Algues nori", en: "Nori seaweed", ar: "أعشاب البحر نوري", zh: "海苔",ru: "Водоросли нори" },
    ingredient6: { fr: "Ciboulette", en: "Chives", ar: "ثوم معمر", zh: "葱花" ,ru: "Лук-резанец" },

  nutrition_calories: "450 kcal", 
  nutrition_protein: "18 g", 
  nutrition_carbs: "60 g", 
  nutrition_fat: "14 g",
  categoryReviews: [
  {
    comment: {
      fr: "Bouillon riche et savoureux avec des nouilles parfaitement cuites.",
      en: "Rich and flavorful broth with perfectly cooked noodles.",
      ar: "مرق غني ولذيذ مع نودلز مطبوخة بشكل مثالي",
      zh: "浓郁美味的汤底配上完美煮熟的面条。",
      ru: "Богатый и ароматный бульон с идеально приготовленной лапшой."
    }
  },
  {
    comment: {
      fr: "Le porc grillé apporte une touche fumée très agréable.",
      en: "The grilled pork adds a very pleasant smoky touch.",
      ar: "اللحم المشوي يضيف لمسة مدخنة رائعة",
      zh: "烤猪肉带来令人愉悦的烟熏味。",
      ru: "Жареная свинина добавляет очень приятный дымный вкус."
    }
  },
  {
    comment: {
      fr: "Œuf mollet parfaitement cuit, un délice dans chaque bouchée.",
      en: "Soft-boiled egg perfectly cooked, a delight in every bite.",
      ar: "البيضة نصف المسلوقة مطبوخة بشكل مثالي، لذة في كل قضمة",
      zh: "溏心蛋煮得恰到好处，每一口都是美味享受。",
      ru: "Мягко сваренное яйцо идеально приготовлено, наслаждение в каждом кусочке."
    }
  }
]

},
//---
{ 
  id: "moroccan_dish1", 
  name: "Tajine plat", 
  category: "restaurant", 
  business: "Z",
  glb: "/3Dmenu/models/tajine plat_shaded.glb", 
  image: "/3Dmenu/images/items/Moroccan Restaurant/Tajine plat.jpg",
  type: "Déjeuner & Dîner",
  price: "70 DH",
  description: {
  fr: "Le tajine est l'une des plus anciennes recettes du Maghreb, cuisiné à feu doux dans un plat en argile. Il exprime le lien entre terroir, convivialité et tradition familiale, transmis de génération en génération.",
  en: "The tajine is one of North Africa’s oldest recipes, slow-cooked in a clay pot. It expresses the connection between land, hospitality, and family tradition, passed down through generations.",
  ar: "الطاجين من أقدم وصفات المغرب، يطهى ببطء في وعاء فخاري. يجسد الصلة بالأرض والضيافة والتقاليد الأسرية التي تتوارثها الأجيال",
  zh: "塔吉锅是马格里布地区最古老的食谱之一，用陶土锅慢炖烹饪。体现地域、友谊和家庭传统的联系，代代相传",
  ru: "Тажин — одно из древнейших блюд Магриба, готовится медленно в глиняном горшке. Олицетворяет связь с землёй, гостеприимство и семейные традиции, передающиеся по поколениям."
}
,
  ingredient1: { fr: "Viande (agneau ou poulet)", en: "Meat (lamb or chicken)", ar: "لحم (ضأن أو دجاج)", zh: "肉类（羊肉或鸡肉）",ru: "Мясо (баранина или курица)" },
    ingredient2: { fr: "Pommes de terre", en: "Potatoes", ar: "بطاطس", zh: "土豆",ru: "Картофель" },
    ingredient3: { fr: "Carottes", en: "Carrots", ar: "جزر", zh: "胡萝卜",ru: "Морковь" },
    ingredient4: { fr: "Courgettes", en: "Zucchini", ar: "كوسة",zh: "西葫芦", ru: "Кабачки" },
    ingredient5: { fr: "Tomates", en: "Tomatoes", ar: "طماطم", zh: "番茄" ,ru: "Помидоры" },
    ingredient6: { fr: "Épices marocaines", en: "Moroccan spices", ar: "بهارات مغربية",  zh: "摩洛哥香料" ,ru: "Марокканские специи" },

  nutrition_calories: "520 kcal", 
  nutrition_protein: "36 g", 
  nutrition_carbs: "25 g", 
  nutrition_fat: "28 g",
  categoryReviews: [
  {
    comment: {
      fr: "Un tajine riche en saveurs avec une cuisson tendre.",
      en: "A tajine rich in flavors with tender cooking.",
      ar: "طاجين غني بالنكهات وناضج بشكل طري",
      zh: "味道浓郁且柔嫩的塔吉锅。",
      ru: "Тажин, богатый вкусом и с нежной готовкой."
    }
  },
  {
    comment: {
      fr: "Les épices marocaines parfument délicatement chaque bouchée.",
      en: "Moroccan spices delicately perfume every bite.",
      ar: "التوابل المغربية تعطر كل لقمة برقة",
      zh: "摩洛哥香料为每一口增添细腻香气。",
      ru: "Марокканские специи деликатно придают аромат каждому кусочку."
    }
  },
  {
    comment: {
      fr: "Un plat traditionnel à ne pas manquer.",
      en: "A traditional dish not to miss.",
      ar: "طبق تقليدي لا يجب تفويته",
      zh: "一道不可错过的传统佳肴。",
      ru: "Традиционное блюдо, которое нельзя пропустить."
    }
  }
]

},
//---
{
  id: "apple_cake",
  name: "Apple Cake",
  category: "restaurant",
  business: "Z",
  glb: "/3Dmenu/models/apple_cake.glb",
  image: "/3Dmenu/images/items/Z/Apple Cake.jpg",
  type:"Dessert",
  type: "Classique",
  price: "45 DH",
  description: {
  fr: "Le gâteau aux pommes est né dans les campagnes d’Europe, où chaque famille utilisait ses récoltes de pommes pour cuisiner des desserts rustiques. Ce classique maison est devenu un symbole de réconfort et de simplicité.",
  en: "Apple cake originated in European countryside homes, where families used fresh apple harvests to make rustic desserts. This homemade classic has become a symbol of comfort and simplicity.",
  ar: "نشأت كعكة التفاح في الأرياف الأوروبية، حيث استغلّت العائلات محصول التفاح لتحضير حلويات منزلية بسيطة. أصبحت رمزًا للدفء والبساطة",
  zh: "苹果蛋糕起源于欧洲乡村，每个家庭利用自家苹果收成制作朴实甜点。这个家常经典象征着安慰和简朴",
  ru: "Яблочный пирог появился в европейских деревнях, где семьи использовали урожай яблок для простых домашних десертов. Классика, ставшая символом уюта и простоты."
}
,
  ingredient1: { fr: "Pommes fraîches", en: "Fresh apples", ar: "تفاح طازج", zh: "新鲜苹果",ru: "Свежие яблоки" },
    ingredient2: { fr: "Farine de blé", en: "Wheat flour", ar: "دقيق قمح", zh: "小麦面粉",ru: "Пшеничная мука" },
    ingredient3: { fr: "Sucre", en: "Sugar", ar: "سكر", zh: "糖",ru: "Сахар" },
    ingredient4: { fr: "Œufs", en: "Eggs", ar: "بيض",zh: "鸡蛋", ru: "Яйца" },
    ingredient5: { fr: "Cannelle", en: "Cinnamon", ar: "قرفة",zh: "肉桂", ru: "Корица" },
    ingredient6: { fr: "Beurre", en: "Butter", ar: "زبدة", zh: "黄油",ru: "Масло" },
  
  nutrition_calories: "380 kcal",
  nutrition_protein: "6 g",
  nutrition_carbs: "55 g",
  nutrition_fat: "15 g",
  categoryReviews: [
  {
    comment: {
      fr: "Gâteau moelleux aux pommes fraîches, un vrai régal.",
      en: "Moist cake with fresh apples, a true delight.",
      ar: "كعكة ناعمة مع تفاح طازج، متعة حقيقية",
      zh: "松软的苹果蛋糕，真正的美味享受。",
      ru: "Влажный торт со свежими яблоками, настоящее удовольствие."
    }
  },
  {
    comment: {
      fr: "La cannelle apporte une touche chaleureuse très agréable.",
      en: "The cinnamon adds a warm and pleasant touch.",
      ar: "القرفة تضيف لمسة دافئة ولذيذة",
      zh: "肉桂带来温暖而宜人的风味。",
      ru: "Корица придаёт теплый и приятный оттенок."
    }
  },
  {
    comment: {
      fr: "Parfait pour accompagner un thé ou un café.",
      en: "Perfect accompaniment to tea or coffee.",
      ar: "مثالي مع الشاي أو القهوة",
      zh: "非常适合搭配茶或咖啡。",
      ru: "Идеальная пара для чая или кофе."
    }
  }
]

},
//---
{
  id: "sandwich",
  name: "Classic Sandwich",
  category: "restaurant",
  business: "Z",
  glb: "/3Dmenu/models/sandwich.glb",
  image: "/3Dmenu/images/items/Z/grilled_sandwich.jpg",
  type: "Déjeuner & Dîner",
  type: "Standard",
  price: "30 DH",
  description: {
  fr: "Le sandwich classique est un incontournable du déjeuner moderne, né au XVIIIe siècle en Angleterre avant de devenir populaire partout dans le monde. Sa simplicité et sa praticité reflètent l’évolution rapide du mode de vie urbain.",
  en: "The classic sandwich is a staple of the modern lunch, originating in 18th-century England and quickly becoming popular worldwide. Its simplicity and convenience mirror the fast-paced evolution of urban living.",
  ar: "السندويتش الكلاسيكي هو عنصر أساسي في وجبة الغداء العصرية، نشأ في إنجلترا في القرن الثامن عشر وأصبح سريعًا شهيرًا حول العالم. تعكس بساطته وسهولته وتيرة الحياة الحضرية المتسارعة",
  zh: "经典三明治是现代午餐必备，起源于18世纪英国，后风靡全球。其简单和便捷反映了都市生活的快速变迁",
  ru: "Классический сэндвич — основа современного обеда, появившийся в Англии XVIII века и быстро ставший популярным во всём мире. Простота и удобство сэндвича символизируют стремительный ритм городской жизни."
}
,
  ingredient1: { fr: "Pain complet", en: "Whole wheat bread", ar: "خبز كامل الحبة", zh: "全麦面包",ru: "Цельнозерновой хлеб" },
    ingredient2: { fr: "Jambon ou dinde", en: "Ham or turkey", ar: "لحم خنزير أو ديك رومي",zh: "火腿或火鸡肉", ru: "Ветчина или индейка" },
    ingredient3: { fr: "Fromage", en: "Cheese", ar: "جبن",zh: "奶酪", ru: "Сыр" },
    ingredient4: { fr: "Laitue", en: "Lettuce", ar: "خس", zh: "生菜",ru: "Салат" },
    ingredient5: { fr: "Tomates", en: "Tomatoes", ar: "طماطم", zh: "番茄",ru: "Помидоры" },
    ingredient6: { fr: "Mayonnaise", en: "Mayonnaise", ar: "مايونيز", zh: "蛋黄酱",ru: "Майонез" },
  
  nutrition_calories: "420 kcal",
  nutrition_protein: "22 g",
  nutrition_carbs: "45 g",
  nutrition_fat: "16 g",
  categoryReviews: [
  {
    comment: {
      fr: "Un sandwich simple et savoureux, idéal pour un déjeuner rapide.",
      en: "A simple and tasty sandwich, perfect for a quick lunch.",
      ar: "ساندويتش بسيط ولذيذ، مثالي للغداء السريع",
      zh: "简洁美味的三明治，非常适合快速午餐。",
      ru: "Простой и вкусный сэндвич, идеально подходит для быстрого обеда."
    }
  },
  {
    comment: {
      fr: "Le pain complet apporte une texture agréable.",
      en: "The whole wheat bread provides a pleasant texture.",
      ar: "الخبز الكامل يضيف ملمسًا لطيفًا",
      zh: "全麦面包带来宜人的口感。",
      ru: "Цельнозерновой хлеб придаёт приятную текстуру."
    }
  },
  {
    comment: {
      fr: "Une bonne combinaison de viande et légumes frais.",
      en: "A good combination of meat and fresh vegetables.",
      ar: "مزيج جيد من اللحم والخضروات الطازجة",
      zh: "肉类和新鲜蔬菜的完美结合。",
      ru: "Хорошее сочетание мяса и свежих овощей."
    }
  }
]

},
//---
{
  id: "mexican_food_taco_love",
  name: "Taco Love",
  category: "restaurant",
  business: "Z",
  glb: "/3Dmenu/models/mexican_food_taco_love.glb",
  image: "/3Dmenu/images/items/Z/Taco Love.jpg",
  type:"Déjeuner & Dîner",
  type: "Nouveaux",
  price: "55 DH",
  description: {
  fr: "Le taco est un pilier de la cuisine mexicaine, descend des traditions anciennes des civilisations précolombiennes. Adapté en mille variantes, il incarne la festivité et la créativité culinaire du Mexique.",
  en: "Tacos are a cornerstone of Mexican cuisine, descended from the ancient traditions of pre-Columbian civilizations. Adapted in countless variations, they embody the celebration and culinary creativity of Mexico.",
  ar: "التاكو هو عنصر أساسي في المطبخ المكسيكي، نشأ من تقاليد حضارات ما قبل كولومبوس القديمة. يُحضر بأشكال متعددة ويجسد الفرح والإبداع في فن الطهي المكسيك",
  zh: "玉米饼是墨西哥料理支柱，传承自前哥伦布时期的古老传统。经千变万化，象征墨西哥的节庆氛围和烹饪创意",
  ru: "Тако — основа мексиканской кухни, берущая начало в традициях доколумбовых цивилизаций. Множество вариантов приготовления делают тако символом праздника и кулинарной изобретательности Мексики."
}
,
  ingredient1: { fr: "Tortillas de maïs", en: "Corn tortillas", ar: "تورتيلا الذرة", zh: "玉米饼",ru: "Кукурузные тортильи" },
    ingredient2: { fr: "Bœuf épicé", en: "Spiced beef", ar: "لحم بقر متبل", zh: "香辣牛肉",ru: "Пряная говядина" },
    ingredient3: { fr: "Haricots rouges", en: "Red beans", ar: "فاصولياء حمراء",zh: "红豆" , ru: "Красная фасоль" },
    ingredient4: { fr: "Avocat", en: "Avocado", ar: "أفوكادو", zh: "牛油果",ru: "Авокадо" },
    ingredient5: { fr: "Laitue", en: "Lettuce", ar: "خس",  zh: "生菜",ru: "Салат" },
    ingredient6: { fr: "Sauce salsa", en: "Salsa sauce", ar: "صلصة سالسا", zh: "莎莎酱",ru: "Соус сальса" },
  
  nutrition_calories: "530 kcal",
  nutrition_protein: "28 g",
  nutrition_carbs: "48 g",
  nutrition_fat: "24 g",
  categoryReviews: [
  {
    comment: {
      fr: "Des tortillas savoureuses avec une viande épicée pleine de caractère.",
      en: "Tasty tortillas with flavorful spiced beef.",
      ar: "تورتيلا لذيذة مع لحم متبل غني بالنكهة",
      zh: "风味十足的玉米饼搭配香辣肉馅。",
      ru: "Вкусные тортильи с пряной и ароматной говядиной."
    }
  },
  {
    comment: {
      fr: "L'avocat apporte fraîcheur et douceur au plat.",
      en: "The avocado brings freshness and creaminess to the dish.",
      ar: "الأفوكادو يضيف نضارة ونعومة للطبق",
      zh: "牛油果为菜肴带来清新和柔滑。",
      ru: "Авокадо добавляет свежесть и мягкость блюду."
    }
  },
  {
    comment: {
      fr: "La sauce salsa relève parfaitement les saveurs.",
      en: "The salsa sauce perfectly complements the flavors.",
      ar: "صلصة السالسا تكمل النكهات بشكل مثالي",
      zh: "莎莎酱完美提升了所有味道。",
      ru: "Соус сальса прекрасно дополняет вкус."
    }
  }
]

},

/*
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
},*/



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
  price: "55 DH",
  description: {
  fr: "Le sushi burger est une création récente, fusionnant l’art traditionnel japonais du sushi avec la présentation contemporaine du burger. Cette innovation symbolise l’ouverture et la créativité de la cuisine mondiale.",
  en: "The sushi burger is a recent creation, blending the traditional Japanese art of sushi with the contemporary presentation of a burger. This innovation symbolizes the openness and creativity of global cuisine.",
  ar: "سوشي البرجر ابتكار حديث يدمج فن السوشي الياباني التقليدي مع تقديم البرجر العصري. يعبّر هذا الطبق عن الانفتاح والإبداع في المطابخ العالمية",
  zh: "寿司汉堡是近期创意，融合日本传统寿司与现代汉堡的呈现。此创新象征全球料理的开放与创造力",
  ru: "Суши-бургер — современное изобретение, объединяющее японское искусство суши с формой традиционного бургера. Эта инновация отражает открытость и креативность мировой кухни."
}
,
  ingredient1: { fr: "Riz à sushi", en: "Sushi rice", ar: "أرز السوشي",zh: "寿司饭", ru: "Рис для суши" },
    ingredient2: { fr: "Saumon cru", en: "Raw salmon", ar: "سلمون نيئ", zh: "生三文鱼",ru: "Сырой лосось" },
    ingredient3: { fr: "Avocat", en: "Avocado", ar: "أفوكادو", zh: "牛油果",ru: "Авокадо" },
    ingredient4: { fr: "Concombre", en: "Cucumber", ar: "خيار",zh: "黄瓜", ru: "Огурец" },
    ingredient5: { fr: "Nori (algue)", en: "Nori (seaweed)", ar: "نورى (طحالب)",zh: "海苔", ru: "Нори (водоросли)" },
    ingredient6: { fr: "Sauce soja", en: "Soy sauce", ar: "صلصة الصويا", zh: "酱油",ru: "Соевый соус" },

  nutrition_calories: "420 kcal",
  nutrition_protein: "25 g",
  nutrition_carbs: "40 g",
  nutrition_fat: "15 g",
  categoryReviews: [
  {
    comment: {
      fr: "Un burger original avec un délicieux riz à sushi.",
      en: "An original burger with delicious sushi rice.",
      ar: "برجر أصلي مع أرز السوشي اللذيذ",
      zh: "一款创意十足的汉堡，配以美味寿司饭。",
      ru: "Оригинальный бургер с вкусным рисом для суши."
    }
  },
  {
    comment: {
      fr: "Le saumon cru est frais et fond dans la bouche.",
      en: "The raw salmon is fresh and melts in your mouth.",
      ar: "السلمون النيئ طازج ويذوب في الفم",
      zh: "生三文鱼新鲜入口即化。",
      ru: "Сырой лосось свежий и тает во рту."
    }
  },
  {
    comment: {
      fr: "La sauce soja complète parfaitement ce plat unique.",
      en: "The soy sauce perfectly complements this unique dish.",
      ar: "صلصة الصويا تكمل هذا الطبق الفريد بشكل مثالي",
      zh: "酱油完美搭配这道独特的菜肴。",
      ru: "Соевый соус прекрасно дополняет это уникальное блюдо."
    }
  }
]

},
//---
{
  id: "wokupstreet2",
  name: "Temaki",
  category: "restaurant",
  business: "B",
  glb: "/3Dmenu/models/Temaki.glb",
  image: "/3Dmenu/images/items/wokupstreet/temaki_wokup.jpg",
  type: "Déjeuner & Dîner",
  price: "30 DH",
  description: {
  fr: "Le temaki est un rouleau de sushi japonais en forme de cône, apparu au Japon au XXe siècle. Facile à manger et à personnaliser, il représente l’évolution ludique de la tradition sushi.",
  en: "Temaki is a cone-shaped Japanese sushi roll, developed in Japan in the 20th century. Easy to eat and customizable, it represents the playful evolution of the sushi tradition.",
  ar: "التيماكي هو لفافة سوشي يابانية على شكل مخروط، ظهرت في اليابان في القرن العشرين. سهل الأكل وقابل للتعديل، ويجسد الجانب المرح من تطور السوشي",
  zh: "手卷寿司是20世纪日本出现的锥形寿司。方便食用和个性化，代表寿司传统的趣味发展",
  ru: "Темаки — суши-ролл в форме конуса, появившийся в Японии в XX веке. Прост в употреблении и вариациях, отражает игривую эволюцию традиции суши."
}
,
  ingredient1: { fr: "Riz à sushi", en: "Sushi rice", ar: "أرز السوشي", zh: "寿司饭" ,ru: "Рис для суши" },
    ingredient2: { fr: "Thon frais", en: "Fresh tuna", ar: "تونة طازجة", zh: "新鲜金枪鱼",ru: "Свежий тунец" },
    ingredient3: { fr: "Avocat", en: "Avocado", ar: "أفوكادو",zh: "牛油果", ru: "Авокадо" },
    ingredient4: { fr: "Concombre", en: "Cucumber", ar: "خيار", zh: "黄瓜",ru: "Огурец" },
    ingredient5: { fr: "Mayonnaise épicée", en: "Spicy mayonnaise", ar: "مايونيز حار", zh: "辣味蛋黄酱",ru: "Острая майонез" },
    ingredient6: { fr: "Nori (algue)", en: "Nori (seaweed)", ar: "نورى (طحالب)", zh: "海苔", ru: "Нори (водоросли)" },

  nutrition_calories: "350 kcal",
  nutrition_protein: "20 g",
  nutrition_carbs: "35 g",
  nutrition_fat: "8 g",
  categoryReviews: [
  {
    comment: {
      fr: "Un classique de la cuisine japonaise, toujours réussi.",
      en: "A classic Japanese dish, always a success.",
      ar: "طبق ياباني كلاسيكي، ناجح دائمًا",
      zh: "一款经典的日本料理，总是令人满意。",
      ru: "Классическое японское блюдо, всегда удачное."
    }
  },
  {
    comment: {
      fr: "Le thon frais apporte une belle saveur délicate.",
      en: "Fresh tuna brings a nice delicate flavor.",
      ar: "التونة الطازجة تضيف نكهة لطيفة ورقيقة",
      zh: "新鲜金枪鱼带来细腻的美味。" ,
      ru: "Свежий тунец придает приятный нежный вкус."
    }
  },
  {
    comment: {
      fr: "La mayonnaise épicée relève parfaitement les ingrédients.",
      en: "The spicy mayonnaise perfectly enhances the ingredients.",
      ar: "المايونيز الحار يبرز المكونات بشكل مثالي",
      zh: "辣味蛋黄酱完美提升了原料的味道。",
      ru: "Острая майонез отлично подчеркивает ингредиенты."
    }
  }
]

},
//---
{
  id: "wokupstreet4",
  name: "Maki Crok",
  category: "restaurant",
  business: "B",
  glb: "/3Dmenu/models/Maki Crok.glb",
  image: "/3Dmenu/images/items/wokupstreet/maki_wokup.jpg",
  type: "Nouveaux",
  price: "40 DH",
  description: {
  fr: "Le maki croquant revisite la recette japonaise classique du maki en ajoutant une texture dorée et croustillante, souvent obtenue par friture légère. Il illustre la tendance moderne de fusion dans la cuisine japonaise.",
  en: "Crunchy maki is a twist on the classic Japanese maki recipe, enhanced with a golden crispy texture, often through light frying. It highlights the modern trend of fusion in Japanese cuisine.",
  ar: "ماكي كروك هو تعديل حديث للوصفة اليابانية الكلاسيكية بإضافة قوام مقرمش ذهبي محصل عليه غالبًا بالقلي الخفيف. يعكس هذا الطبق توجهات المزج الحديثة في المطبخ الياباني",
  zh: "脆皮卷是日本经典卷寿司的创新，添加金黄酥脆的质感，通常通过轻炸获得。展现日本料理现代融合的趋势",
  ru: "Хрустящий маки — современная вариация классического японского ролла, дополненная золотистой корочкой, часто получаемой при лёгком обжаривании. Это отражает современную тенденцию фьюжн в японской кухне."
}
,
  ingredient1: { fr: "Riz à sushi", en: "Sushi rice", ar: "أرز السوشي",zh: "寿司饭", ru: "Рис для суши" },
    ingredient2: { fr: "Saumon frit", en: "Fried salmon", ar: "سلمون مقلي",zh: "炸三文鱼", ru: "Жареный лосось" },
    ingredient3: { fr: "Avocat", en: "Avocado", ar: "أفوكادو",  zh: "牛油果",ru: "Авокадо" },
    ingredient4: { fr: "Fromage à la crème", en: "Cream cheese", ar: "جبنة كريمية", zh: "奶油奶酪",ru: "Сливочный сыр" },
    ingredient5: { fr: "Nori (algue)", en: "Nori (seaweed)", ar: "نورى (طحالب)",zh: "海苔", ru: "Нори (водоросли)" },
    ingredient6: { fr: "Sauce teriyaki", en: "Teriyaki sauce", ar: "صلصة ترياكي", zh: "照烧酱",ru: "Соус терияки" },

  nutrition_calories: "450 kcal",
  nutrition_protein: "22 g",
  nutrition_carbs: "42 g",
  nutrition_fat: "18 g",
  categoryReviews: [
  {
    comment: {
      fr: "Délicieux maki croustillant avec saumon frit.",
      en: "Delicious crispy maki with fried salmon.",
      ar: "ماكي مقرمش لذيذ مع سلمون مقلي",
      zh: "美味的酥脆卷寿司配炸三文鱼。",
      ru: "Вкусный хрустящий маки с жареным лососем."
    }
  },
  {
    comment: {
      fr: "Le fromage à la crème apporte douceur et onctuosité.",
      en: "Cream cheese brings sweetness and creaminess.",
      ar: "الجبنة الكريمية تضيف حلاوة ونعومة",
      zh: "奶油奶酪带来柔滑顺口。",
      ru: "Сливочный сыр добавляет сладость и нежность."
    }
  },
  {
    comment: {
      fr: "La sauce teriyaki parfume agréablement ce plat.",
      en: "Teriyaki sauce flavors this dish pleasantly.",
      ar: "صلصة ترياكي تضفي نكهة لذيذة على الطبق",
      zh: "照烧酱为这道菜带来宜人香气。",
      ru: "Соус терияки приятно ароматизирует блюдо."
    }
  }
]

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