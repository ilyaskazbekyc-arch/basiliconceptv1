import React, { useState, useMemo, useRef, useEffect } from "react";

/* ============================================================
   BASILIC.KZ — редизайн прототипа
   Токены дизайна:
   --bg: #FAF8F2 (молочно-белый)
   --surface: #F1EBDC (тёплый бежевый)
   --surface-2: #E9E2CF
   --olive: #5B6B34 (основной акцент)
   --olive-dark: #47531F
   --olive-light: #7E9450
   --ink: #262420
   --ink-muted: #726C5E
   --amber: #C98A3B (метка "Хит")
   --spice: #B04A2E (метка "Острое")
   --line: #E4DCC8
   Шрифты: Manrope (display/UI), Inter (текст)
   ============================================================ */

const PLACE = (seed, w = 480, h = 360) =>
  "https://content.cdn.starterapp.ru/images/basilic/2764a2f9c3f31d0e551a18cbdded5700e2f3e131-1774x887.png";

/* ---------------- MOCK DATA ---------------- */

const CATEGORIES = [
  "Закуски",
  "Салаты",
  "Супы",
  "Горячее",
  "Выпечка",
  "Десерты",
  "Напитки",
  "Соусы",
];

const CUISINES = [
  { id: "kazakh", label: "Казахская" },
  { id: "oriental", label: "Восточная" },
  { id: "european", label: "Европейская" },
  { id: "panasian", label: "Паназиатская" },
  { id: "home", label: "Домашняя кухня" },
];

const SCENARIOS = [
  {
    id: "budget-lunch",
    title: "Обед до 2 500 ₸",
    caption: "Вкусно и выгодно",
    seed: "basilic-lunch",
  },
  {
    id: "for-two",
    title: "На двоих",
    caption: "Идеально для совместного ужина",
    seed: "basilic-fortwo",
  },
  {
    id: "office",
    title: "Для офиса",
    caption: "Быстро и удобно",
    seed: "basilic-office",
  },
  {
    id: "for-company",
    title: "Блюда на компанию",
    caption: "Большие порции и готовые решения",
    seed: "basilic-company",
  },
  {
    id: "quick-pick",
    title: "Быстрый выбор",
    caption: "Когда не хочется долго выбирать",
    seed: "basilic-quick",
  },
  {
    id: "hearty-cheap",
    title: "Сытно и недорого",
    caption: "Большие порции по доступной цене",
    seed: "basilic-hearty",
  },
];

const P = (o) => ({
  fullDescription: o.description,
  ingredients: o.ingredients || "Уточняется у оператора",
  allergens: o.allergens || "Глютен, молоко",
  satiety: o.satiety || "Средняя",
  isSpicy: o.isSpicy || false,
  isNew: o.isNew || false,
  isPopular: o.isPopular || false,
  modifiers: o.modifiers || [],
  scenarioTags: o.scenarioTags || [],
  relatedProductIds: o.relatedProductIds || [],
  ...o,
});

const RAW_PRODUCTS = [
  P({
    id: 1,
    name: "Плов с говядиной",
    description: "Рассыпчатый рис с говядиной, морковью и зирой",
    category: "Горячее",
    cuisine: "kazakh",
    scenarioTags: ["budget-lunch", "quick-pick", "hearty-cheap"],
    weight: "300 г",
    price: 1590,
    image: PLACE("plov-govyadina"),
    isPopular: true,
    satiety: "Высокая",
    ingredients: "Рис, говядина, морковь, лук, зира, растительное масло",
    modifiers: [
      { name: "Дополнительное мясо", price: 590 },
      { name: "Острый соус", price: 150 },
    ],
    relatedProductIds: [2, 5, 9],
  }),
  P({
    id: 2,
    name: "Лагман по-уйгурски",
    description: "Тянутая лапша с говядиной и овощами в остром соусе",
    category: "Горячее",
    cuisine: "oriental",
    scenarioTags: ["budget-lunch", "hearty-cheap"],
    weight: "350 г",
    price: 1490,
    image: PLACE("lagman-uygur"),
    isPopular: true,
    isSpicy: true,
    satiety: "Высокая",
    ingredients: "Лапша, говядина, перец, редька, чеснок, соевый соус",
    relatedProductIds: [1, 6, 10],
  }),
  P({
    id: 3,
    name: "Цезарь с курицей",
    description: "Курица гриль, романо, пармезан, соус цезарь, сухарики",
    category: "Салаты",
    cuisine: "european",
    scenarioTags: ["office", "for-two"],
    weight: "250 г",
    price: 1390,
    image: PLACE("caesar-chicken"),
    isPopular: true,
    ingredients: "Курица, салат романо, пармезан, сухарики, соус цезарь",
    allergens: "Глютен, молоко, яйцо",
    relatedProductIds: [4, 8, 12],
  }),
  P({
    id: 4,
    name: "Самса с говядиной",
    description: "Слоёное тесто, говядина, лук, специи",
    category: "Выпечка",
    cuisine: "kazakh",
    scenarioTags: ["quick-pick", "office", "for-company"],
    weight: "120 г",
    price: 690,
    image: PLACE("samsa-beef"),
    isPopular: true,
    ingredients: "Слоёное тесто, говядина, лук, чёрный тмин",
    relatedProductIds: [16, 17, 5],
  }),
  P({
    id: 5,
    name: "Боул с лососем",
    description: "Рис, лосось, авокадо, огурец, соус унаги",
    category: "Горячее",
    cuisine: "panasian",
    scenarioTags: ["for-two", "office"],
    weight: "280 г",
    price: 2190,
    image: PLACE("bowl-salmon"),
    isPopular: true,
    ingredients: "Рис, лосось, авокадо, огурец, кунжут, соус унаги",
    allergens: "Рыба, кунжут, соя",
    relatedProductIds: [3, 20, 9],
  }),
  P({
    id: 6,
    name: "Чебупели со сметаной",
    description: "Треугольнички из теста с говяжьим фаршем, обжаренные во фритюре",
    category: "Закуски",
    cuisine: "home",
    scenarioTags: ["quick-pick", "for-company"],
    weight: "100 г",
    price: 775,
    image: PLACE("chebupeli"),
    isPopular: true,
    ingredients: "Тесто, говяжий фарш, лук, кинза, сметана",
    relatedProductIds: [7, 4, 16],
  }),
  P({
    id: 7,
    name: "Чебупели с сыром",
    description: "Треугольнички из теста, адыгейского сыра и укропа, обжаренные во фритюре",
    category: "Закуски",
    cuisine: "home",
    scenarioTags: ["quick-pick"],
    weight: "100 г",
    price: 775,
    image: PLACE("chebupeli-cheese"),
    ingredients: "Тесто, адыгейский сыр, укроп",
    allergens: "Глютен, молоко",
    relatedProductIds: [6, 16],
  }),
  P({
    id: 8,
    name: "Чебурек",
    description: "Обжаренный в большом количестве масла, с хрустящей корочкой",
    category: "Закуски",
    cuisine: "home",
    scenarioTags: ["quick-pick", "hearty-cheap"],
    weight: "170 г",
    price: 585,
    image: PLACE("cheburek"),
    ingredients: "Тесто, говядина, лук, специи",
    relatedProductIds: [6, 7],
  }),
  P({
    id: 9,
    name: "Плов праздничный",
    description: "Плов с бараниной, айвой, изюмом и нутом",
    category: "Горячее",
    cuisine: "kazakh",
    scenarioTags: ["for-company", "for-two"],
    weight: "400 г",
    price: 2745,
    image: PLACE("plov-prazd"),
    satiety: "Высокая",
    ingredients: "Рис, баранина, айва, изюм, нут, морковь",
    relatedProductIds: [1, 2],
  }),
  P({
    id: 10,
    name: "Окрошка",
    description: "Классическая окрошка на квасе с говядиной",
    category: "Супы",
    cuisine: "home",
    scenarioTags: ["hearty-cheap", "office"],
    weight: "350 г",
    price: 1145,
    image: PLACE("okroshka"),
    ingredients: "Квас, говядина, картофель, огурец, яйцо, редис",
    relatedProductIds: [11, 2],
  }),
  P({
    id: 11,
    name: "Крем-суп из чечевицы",
    description: "Нежный крем-суп с чечевицей, сливками и специями",
    category: "Супы",
    cuisine: "european",
    scenarioTags: ["office", "budget-lunch"],
    weight: "300 г",
    price: 1290,
    image: PLACE("lentil-soup"),
    ingredients: "Чечевица, сливки, лук, морковь, специи",
    allergens: "Молоко",
    relatedProductIds: [10, 3],
  }),
  P({
    id: 12,
    name: "Салат Греческий",
    description: "Свежие овощи, фета, маслины, оливковое масло",
    category: "Салаты",
    cuisine: "european",
    scenarioTags: ["for-two", "budget-lunch"],
    weight: "200 г",
    price: 1190,
    image: PLACE("greek-salad"),
    ingredients: "Огурцы, томаты, перец, фета, маслины",
    allergens: "Молоко",
    relatedProductIds: [3, 13],
  }),
  P({
    id: 13,
    name: "Салат Чукка",
    description: "Салат чука с нежным ореховым соусом и семенами кунжута",
    category: "Салаты",
    cuisine: "panasian",
    scenarioTags: ["quick-pick"],
    weight: "130 г",
    price: 995,
    image: PLACE("chuka-salad"),
    ingredients: "Водоросли чука, ореховый соус, кунжут",
    allergens: "Кунжут, орехи",
    relatedProductIds: [14, 5],
  }),
  P({
    id: 14,
    name: "Салат Чимчи",
    description: "Традиционное блюдо корейской кухни из ферментированной капусты",
    category: "Салаты",
    cuisine: "panasian",
    scenarioTags: ["quick-pick"],
    weight: "120 г",
    price: 895,
    image: PLACE("kimchi"),
    isSpicy: true,
    ingredients: "Пекинская капуста, чеснок, перец чили, имбирь",
    relatedProductIds: [13, 20],
  }),
  P({
    id: 15,
    name: "Бефстроганов с грибами",
    description: "Говядина в сливочном соусе с шампиньонами",
    category: "Горячее",
    cuisine: "european",
    scenarioTags: ["for-two", "hearty-cheap"],
    weight: "280 г",
    price: 2495,
    image: PLACE("beef-stroganoff"),
    satiety: "Высокая",
    ingredients: "Говядина, шампиньоны, сливки, лук",
    allergens: "Молоко",
    relatedProductIds: [9, 1],
  }),
  P({
    id: 16,
    name: "Хот-дог в тесте",
    description: "Говяжья сосиска, запечённая в тесте",
    category: "Выпечка",
    cuisine: "home",
    scenarioTags: ["quick-pick", "office"],
    weight: "110 г",
    price: 495,
    image: PLACE("hotdog-dough"),
    ingredients: "Тесто, говяжья сосиска",
    relatedProductIds: [4, 17],
  }),
  P({
    id: 17,
    name: "Пирог с курицей",
    description: "Курица с луком, запечённые в тесте",
    category: "Выпечка",
    cuisine: "home",
    scenarioTags: ["office", "budget-lunch"],
    weight: "130 г",
    price: 615,
    image: PLACE("chicken-pie"),
    ingredients: "Тесто, курица, лук",
    relatedProductIds: [4, 16],
  }),
  P({
    id: 18,
    name: "Фри с мясом",
    description: "Картофель фри с говядиной в соусе",
    category: "Горячее",
    cuisine: "home",
    scenarioTags: ["quick-pick", "hearty-cheap"],
    weight: "320 г",
    price: 2355,
    image: PLACE("fries-meat"),
    satiety: "Высокая",
    ingredients: "Картофель фри, говядина, соус",
    relatedProductIds: [1, 15],
  }),
  P({
    id: 19,
    name: "Курица в кисло-сладком соусе",
    description: "Кусочки курицы, овощи, кисло-сладкий соус",
    category: "Горячее",
    cuisine: "panasian",
    scenarioTags: ["office", "for-two"],
    weight: "280 г",
    price: 2355,
    image: PLACE("sweet-sour-chicken"),
    ingredients: "Курица, перец, ананас, кисло-сладкий соус",
    relatedProductIds: [5, 20],
  }),
  P({
    id: 20,
    name: "Гуйру лагман",
    description: "Обжаренная лапша с мясом и овощами по-уйгурски",
    category: "Горячее",
    cuisine: "oriental",
    scenarioTags: ["hearty-cheap", "for-company"],
    weight: "от 350 г",
    price: 2355,
    image: PLACE("guiru-lagman"),
    isSpicy: true,
    satiety: "Высокая",
    ingredients: "Лапша, говядина, перец, лук, чеснок",
    relatedProductIds: [2, 19],
  }),
  P({
    id: 21,
    name: "Сельдь под шубой",
    description: "Слоёный салат с сельдью, свёклой и картофелем",
    category: "Салаты",
    cuisine: "home",
    scenarioTags: ["for-company", "hearty-cheap"],
    weight: "220 г",
    price: 1195,
    image: PLACE("herring-fur"),
    ingredients: "Сельдь, свёкла, картофель, морковь, майонез",
    allergens: "Рыба, яйцо",
    relatedProductIds: [10, 12],
  }),
  P({
    id: 22,
    name: "Том-ям",
    description: "Острый тайский суп с креветками и грибами",
    category: "Супы",
    cuisine: "panasian",
    scenarioTags: ["for-two", "budget-lunch"],
    weight: "320 г",
    price: 1690,
    image: PLACE("tom-yam"),
    isSpicy: true,
    isNew: true,
    ingredients: "Креветки, грибы, лемонграсс, кокосовое молоко, чили",
    allergens: "Морепродукты",
    relatedProductIds: [11, 5],
  }),
  P({
    id: 23,
    name: "Тирамису",
    description: "Классический итальянский десерт с маскарпоне и кофе",
    category: "Десерты",
    cuisine: "european",
    scenarioTags: ["for-two"],
    weight: "150 г",
    price: 1290,
    image: PLACE("tiramisu"),
    isNew: true,
    ingredients: "Маскарпоне, савоярди, кофе, какао",
    allergens: "Глютен, молоко, яйцо",
    relatedProductIds: [24, 3],
  }),
  P({
    id: 24,
    name: "Чизкейк Нью-Йорк",
    description: "Классический сливочный чизкейк на песочной основе",
    category: "Десерты",
    cuisine: "european",
    scenarioTags: ["for-two", "office"],
    weight: "140 г",
    price: 1190,
    image: PLACE("cheesecake"),
    ingredients: "Сливочный сыр, песочное тесто, сливки",
    allergens: "Глютен, молоко, яйцо",
    relatedProductIds: [23],
  }),
  P({
    id: 25,
    name: "Компот из сухофруктов",
    description: "Домашний компот из кураги, изюма и яблок",
    category: "Напитки",
    cuisine: "home",
    scenarioTags: ["budget-lunch", "office"],
    weight: "300 мл",
    price: 590,
    image: PLACE("compote"),
    ingredients: "Курага, изюм, яблоки, вода, сахар",
    relatedProductIds: [26],
  }),
  P({
    id: 26,
    name: "Морс клюквенный",
    description: "Освежающий морс из клюквы",
    category: "Напитки",
    cuisine: "home",
    scenarioTags: ["quick-pick"],
    weight: "300 мл",
    price: 590,
    image: PLACE("mors"),
    ingredients: "Клюква, вода, сахар",
    relatedProductIds: [25],
  }),
  P({
    id: 27,
    name: "Соус чесночный",
    description: "Домашний соус на основе чеснока и сметаны",
    category: "Соусы",
    cuisine: "home",
    scenarioTags: [],
    weight: "50 г",
    price: 250,
    image: PLACE("garlic-sauce"),
    ingredients: "Сметана, чеснок, зелень",
    allergens: "Молоко",
    relatedProductIds: [28],
  }),
  P({
    id: 28,
    name: "Соус кисло-сладкий",
    description: "Соус на основе томатов, ананаса и специй",
    category: "Соусы",
    cuisine: "panasian",
    scenarioTags: [],
    weight: "50 г",
    price: 250,
    image: PLACE("sweet-sour-sauce"),
    ingredients: "Томаты, ананас, специи",
    relatedProductIds: [27],
  }),
];

const BASILIC_HERO_IMAGE =
  "https://content.cdn.starterapp.ru/images/basilic/2764a2f9c3f31d0e551a18cbdded5700e2f3e131-1774x887.png";

const BASILIC_PRODUCT_IMAGES = {
  1: "https://content.cdn.starterapp.ru/images/basilic/206ad89e9c3c05d922712828fc4050b83a1dfaae-1400x1000.jpg",
  2: "https://content.cdn.starterapp.ru/images/basilic/11dd4db73208e90c894a90e58852fbb6cf2e103c-864x703.png",
  3: "https://content.cdn.starterapp.ru/images/basilic/6de3370db429acac938378ee9946916f30d6fbc9-1400x1000.jpg",
  4: "https://content.cdn.starterapp.ru/images/basilic/a17fddc9adb8c22b7f66a58f678191767c55975e-1400x1000.jpg",
  5: "https://content.cdn.starterapp.ru/images/basilic/9b6ba0df6c08cecb433fe00b27e72a6bcd1aa51c-881x705.png",
  6: "https://content.cdn.starterapp.ru/images/basilic/4c9b5d3bdafdc6895def5b18d5ff96211642b03f-1400x1000.jpg",
  7: "https://content.cdn.starterapp.ru/images/basilic/cf62725f7845e4a19ab423d2b395fad35e9d0c7f-1400x1000.jpg",
  8: "https://content.cdn.starterapp.ru/images/basilic/9ba0c3b4f1379092311bd725649d978200c18871-1400x1000.jpg",
  9: "https://content.cdn.starterapp.ru/images/basilic/6103528916e64d9ca1b4d7079bcfbf5b9d1a0406-1400x1000.jpg",
  10: "https://content.cdn.starterapp.ru/images/basilic/13a50f99b46110f5501d81217e19c024e8111481-1400x1000.jpg",
  11: "https://content.cdn.starterapp.ru/images/basilic/2a2db2b2263cdab305f407e93570fbb8423692df-1400x1000.jpg",
  12: "https://content.cdn.starterapp.ru/images/basilic/e9b94ff2a001beac12cbbe03e2d2130ab50aa312-1400x1000.jpg",
  13: "https://content.cdn.starterapp.ru/images/basilic/dd7d1cf0350d5bb7a16094acb7be180b979c21d3-894x695.png",
  14: "https://content.cdn.starterapp.ru/images/basilic/2a3fbb67a6c97dab9af92cfcd8285d132f5b0cfe-1400x1000.jpg",
  15: "https://content.cdn.starterapp.ru/images/basilic/8cf85b5e744acaa0f21e2e7d77bee7f8276286c8-1400x1000.jpg",
  16: "https://content.cdn.starterapp.ru/images/basilic/9e969033bf1db4eea3452be92a192743fd174387-1400x1000.jpg",
  17: "https://content.cdn.starterapp.ru/images/basilic/b4fc05047048fbd6e33273fb106a760bef98411f-1400x1000.jpg",
  18: "https://content.cdn.starterapp.ru/images/basilic/afd64eee7cc02d5cd30c76d306d61f6203987870-884x632.png",
  19: "https://content.cdn.starterapp.ru/images/basilic/fc08b5822b01bc89e71f92a94f1438508b9abc1a-1400x1000.jpg",
  20: "https://content.cdn.starterapp.ru/images/basilic/d2c20aa72b9829475c26443a049fe077b71573df-1400x1000.jpg",
  21: "https://content.cdn.starterapp.ru/images/basilic/d449530644b3a4bf7db242fb7125e58eca07a527-1400x1000.jpg",
  22: "https://content.cdn.starterapp.ru/images/basilic/63e9bba4af5a515c2d0ad95e8702841173e152f6-1400x1000.jpg",
  23: "https://content.cdn.starterapp.ru/images/basilic/acd3584a8adc982f819b2b6cf7bb60a482d3c746-1000x1000.jpg",
  24: "https://content.cdn.starterapp.ru/images/basilic/471012d82fede005927dc44a3a5ef1541609c2ff-1000x1000.jpg",
  25: "https://content.cdn.starterapp.ru/images/basilic/ed502661c48f0278faeb7902d4e915f7a0ba9e82-1152x1220.png",
  26: "https://content.cdn.starterapp.ru/images/basilic/a4f5eb32c0ce5ed86b8c59e0dacc81d92543a2c6-1000x1000.jpg",
  27: "https://content.cdn.starterapp.ru/images/basilic/d23befaee8812b21c4ffd9d954bf50594f47570f-1000x1000.jpg",
  28: "https://content.cdn.starterapp.ru/images/basilic/e31c2626171b494e31cd7b399e6b52b83551327d-1000x1000.jpg",
};

const SCENARIO_IMAGES = {
  "budget-lunch": BASILIC_PRODUCT_IMAGES[1],
  "for-two": BASILIC_PRODUCT_IMAGES[22],
  office: BASILIC_PRODUCT_IMAGES[3],
  "for-company": "https://content.cdn.starterapp.ru/images/basilic/46fc0049efd87465b97b7e7952da28861d5dcd3b-1000x1000.jpg",
  "quick-pick": BASILIC_PRODUCT_IMAGES[6],
  "hearty-cheap": BASILIC_PRODUCT_IMAGES[18],
};

const CUISINE_IMAGES = {
  kazakh: BASILIC_PRODUCT_IMAGES[9],
  oriental: BASILIC_PRODUCT_IMAGES[20],
  european: BASILIC_PRODUCT_IMAGES[3],
  panasian: BASILIC_PRODUCT_IMAGES[22],
  home: BASILIC_PRODUCT_IMAGES[16],
};

const PRODUCT_FULL_DESCRIPTIONS = {
  1: "Рассыпчатый плов с говядиной пахнет зирой и тёплой морковью, как большой семейный обед. Он сытный, понятный и сразу собирает за столом даже тех, кто собирался перекусить на бегу. Хороший выбор для буднего дня, когда хочется не экспериментов, а уверенного вкуса. Берите к нему салат или соус — получится полноценный обед без лишних решений.",
  2: "Лагман по-уйгурски даёт тот самый эффект горячей, насыщенной еды после длинного дня. Лапша, говядина и овощи держат вкус плотным, пряным и живым. Это блюдо удобно брать в офис или домой, когда хочется согреться и поесть по-настоящему. Острота мягко подталкивает аппетит, но не забивает основной вкус.",
  3: "Цезарь с курицей остаётся надёжной классикой для лёгкого, но сытного выбора. Хрустящий салат, курица гриль, сыр и соус дают знакомый баланс свежести и комфорта. Его удобно взять на обед, когда не хочется тяжёлого горячего, но нужен нормальный приём пищи. Хорошо работает и как самостоятельное блюдо, и как часть заказа на двоих.",
  4: "Самса с говядиной — быстрый горячий перекус с ароматной мясной начинкой. Слоёное тесто приятно хрустит, а специи делают вкус теплее и глубже. Её удобно добавить к супу, салату или взять в дорогу. Это маленькое блюдо часто спасает, когда до полноценного ужина ещё далеко.",
  5: "Боул с лососем выглядит лёгким, но ощущается как полноценный аккуратный обед. Рис, рыба, овощи и соус собираются в свежий, спокойный вкус без перегруза. Такое блюдо приятно заказать для себя, когда хочется чего-то современного и не слишком тяжёлого. Оно хорошо подходит для офисного дня или тихого ужина дома.",
  6: "Чебупели со сметаной — это маленькая радость для заказа на компанию или быстрого перекуса. Румяное тесто, мясная начинка и прохладная сметана дают понятный домашний вкус. Их удобно делить, добавлять к основному блюду или брать как самостоятельную закуску. Формат простой, но настроение у него очень дружелюбное.",
  7: "Чебупели с сыром мягче и сливочнее мясной версии, но остаются такими же хрустящими снаружи. Сыр и укроп дают тёплый домашний аромат, который хорошо заходит к чаю, супу или салату. Это блюдо легко добавить в корзину, когда хочется чего-то небольшого и приятного. Особенно хорошо работает как закуска на общий стол.",
  8: "Чебурек — честный выбор для тех, кто хочет горячее, хрустящее и сытное прямо сейчас. Тонкое тесто держит сочную начинку, а золотистая корочка добавляет тот самый звук первого укуса. Его удобно взять к обеду или как быстрый самостоятельный перекус. Вкус простой, но очень эмоциональный.",
  9: "Праздничный плов делает обычный заказ чуть более особенным. В нём больше глубины, сладости сухофруктов и восточного аромата, поэтому блюдо хорошо смотрится на столе для двоих или компании. Это вариант, когда хочется не просто поесть, а устроить небольшой общий ужин. Он сытный, щедрый и визуально сразу создаёт ощущение праздника.",
  10: "Окрошка освежает и возвращает ощущение лёгкого летнего обеда. Холодная основа, овощи и мясо дают баланс свежести и сытости без тяжести. Её удобно брать в тёплый день или когда хочется суп, но не горячий. Блюдо простое, знакомое и очень спокойное по настроению.",
  11: "Крем-суп из чечевицы — мягкий и тёплый вариант для аккуратного обеда. Пряности делают вкус выразительным, а чечевица даёт приятную сытность. Его хорошо брать вместе с выпечкой или салатом, чтобы собрать комфортный набор без перегруза. Это блюдо особенно уместно, когда хочется чего-то домашнего и ровного.",
  12: "Греческий салат даёт свежесть, цвет и лёгкое средиземноморское настроение. Овощи, сыр и маслины делают вкус ярким, но не тяжёлым. Он хорошо подходит к горячему блюду или становится самостоятельным выбором для лёгкого обеда. В заказе на двоих такой салат быстро освежает весь стол.",
  13: "Салат Чукка — маленький паназиатский акцент с ореховым соусом и кунжутом. Он лёгкий, свежий и хорошо раскрывается рядом с горячими блюдами. Его приятно добавить, когда хочется разнообразить заказ без лишней тяжести. Это спокойный выбор для тех, кто любит чистый вкус и чуть необычную текстуру.",
  14: "Салат Чимчи добавляет заказу яркость, остроту и корейский характер. Ферментированная капуста бодрит вкус и хорошо работает как контраст к мясу, лапше или рису. Небольшая порция помогает сделать обед живее и интереснее. Это блюдо для тех моментов, когда хочется чуть больше энергии в привычном заказе.",
  15: "Бефстроганов с грибами — тёплое сливочное блюдо для спокойного сытного обеда. Говядина, грибы и соус дают мягкий, почти домашний вкус. Его хорошо заказывать, когда нужен надёжный горячий вариант без лишней остроты. Блюдо создаёт ощущение нормального полноценного ужина даже в середине рабочего дня.",
  16: "Хот-дог в тесте — простой и быстрый перекус, который удобно взять к кофе, супу или в дорогу. Запечённое тесто и говяжья сосиска дают знакомый вкус без сложностей. Он хорошо подходит для офисного заказа, когда нужно добавить что-то небольшое и понятное. Формат компактный, но вполне сытный.",
  17: "Пирог с курицей — тёплая выпечка с мягкой начинкой и домашним настроением. Курица с луком внутри теста делает вкус простым и уютным. Его удобно брать к супу или как быстрый обеденный перекус. Это блюдо не спорит с остальным заказом, а аккуратно дополняет его.",
  18: "Фри с мясом — плотное горячее блюдо для тех, кто хочет поесть основательно. Картофель, говядина, лук и специи дают насыщенный вкус с лёгким восточным акцентом. Оно хорошо подходит для голодного обеда или позднего ужина после насыщенного дня. В нём есть тот самый комфорт еды, которую не хочется усложнять.",
  19: "Курица в кисло-сладком соусе приносит в заказ яркий паназиатский вкус. Нежное филе, овощи и соус дают баланс сладости, кислоты и лёгкой пряности. Блюдо удобно брать с рисом или салатом, чтобы собрать понятный ужин дома. Оно выглядит живо и ощущается чуть праздничнее обычного горячего.",
  20: "Гуйру лагман — насыщенная лапша с мясом, овощами и огненным вок-ароматом. Это блюдо про движение, тепло и большой аппетит. Оно хорошо подходит для компании или для дня, когда нужен действительно сытный выбор. Пряности делают вкус выразительным, но всё ещё понятным и повседневным.",
  21: "Сельдь под шубой — знакомый слоёный салат, который сразу добавляет столу домашнее настроение. Свёкла, картофель, морковь, яйцо и сельдь собираются в мягкий насыщенный вкус. Его удобно брать к общему заказу, особенно если хочется чего-то классического. Это блюдо работает как маленькая ностальгия в современной доставке.",
  22: "Том-ям даёт заказу аромат тайских специй и сливочно-кокосовую глубину. Он согревает, бодрит и делает обед более ярким без тяжёлого ощущения. Хорошо подходит для ужина на двоих или для дня, когда хочется суп с характером. Рис и грибы помогают сделать вкус сбалансированным и сытным.",
  23: "Тирамису мягко завершает заказ и добавляет к нему настроение маленькой паузы. Нежный сливочный мусс, кофе и печенье дают знакомый итальянский вкус. Это десерт, который приятно делить после ужина или оставить себе к чаю. Он не кричит сладостью, а аккуратно ставит красивую точку.",
  24: "Чизкейк Нью-Йорк в прототипе представлен фотографией десерта Basilic с похожим сливочным настроением. Он нужен для спокойного сладкого финала после обеда или ужина. Кремовая текстура и мягкая сладость делают его понятным выбором для офиса и дома. Такой десерт легко добавить в корзину, когда хочется чуть больше удовольствия.",
  25: "Компот из сухофруктов — домашний напиток, который делает заказ теплее и спокойнее. Вкус кураги, изюма и яблок хорошо сочетается с пловом, выпечкой и горячими блюдами. Его удобно брать на обед в офис или к семейному ужину. Это простое дополнение, которое быстро создаёт ощущение заботы.",
  26: "Морс клюквенный в прототипе заменён реальным холодным напитком Basilic, чтобы сохранить живую фотографию из источника. Он нужен как освежающая пара к сытным блюдам и закускам. Кисло-сладкий вкус помогает сбалансировать плотный заказ. Такой напиток особенно хорошо работает в быстрых офисных наборах.",
  27: "Соус чесночный добавляет блюдам сливочную остринку и делает вкус собраннее. Его приятно брать к выпечке, картофелю, мясу или закускам. Небольшая порция легко меняет настроение всего заказа. Это тот самый маленький элемент, из-за которого простое блюдо становится заметно вкуснее.",
  28: "Соус кисло-сладкий добавляет заказу яркий паназиатский акцент. Он хорошо подходит к курице, закускам и горячим блюдам, когда хочется чуть больше контраста. Сладость и лёгкая кислинка делают вкус живее и дружелюбнее. Небольшой соус помогает собрать блюдо под себя без сложных настроек.",
};

const PRODUCT_COMPOSITIONS = {
  1: "Рис, говядина, морковь, лук, зира, растительное масло.",
  2: "Лапша, говядина, пекинская капуста, перец, кабачок, сельдерей, чеснок, имбирь, специи.",
  3: "Куриная грудка гриль, салат айсберг, соус цезарь, помидоры черри, сыр, сухарики.",
  4: "Слоёное тесто, говядина, лук, полугорький перец, помидоры, восточные специи.",
  5: "Лосось, рис, овощи, авокадо, огурец, кунжут, соус унаги.",
  6: "Тесто, говяжий фарш, кинза, зелёный лук, сметана.",
  7: "Тесто, адыгейский сыр, укроп, сметана.",
  8: "Тесто, мясо, лук, джусай, специи.",
  9: "Рис, баранина, говядина, жёлтая и красная морковь, казы, перепелиное яйцо, нут, изюм.",
  10: "Овощи, отварная телятина, куриная грудка, минеральная вода, кефир.",
  11: "Красная чечевица, лук, морковь, пряные специи, сумах.",
  12: "Свежие овощи, сыр, маслины, зелень, оливковая заправка.",
  13: "Водоросли чука, ореховый соус, кунжут.",
  14: "Ферментированная капуста, чеснок, перец чили, имбирь, специи.",
  15: "Говядина, шампиньоны, сливочный соус, лук, специи.",
  16: "Тесто, говяжья сосиска.",
  17: "Тесто, курица, лук, специи.",
  18: "Картофель, говядина, репчатый лук, полугорький перец, восточные специи.",
  19: "Куриное филе, полугорький перец, кисло-сладкий соус, специи.",
  20: "Лапша ручного приготовления, говядина, пекинская капуста, полугорький перец, кабачок, сельдерей, чеснок, имбирь, специи.",
  21: "Сельдь, лук, картофель, морковь, свёкла, яйцо, майонез.",
  22: "Кокосовое молоко, тайские специи, шампиньоны, рис, пряная основа.",
  23: "Печенье савоярди, сливочно-сырный мусс, кофе, какао.",
  24: "Сливочный сыр, песочная основа, сливки, сахар, ваниль.",
  25: "Сухофрукты, вода, сахар.",
  26: "Клюква, вода, сахар.",
  27: "Майонезная основа, чеснок, зелень, специи.",
  28: "Томатная основа, ананас, сахар, специи.",
};

const formatSentence = (value) => {
  const text = String(value || "").trim().replace(/\s+/g, " ").replace(/[.。]+$/g, "");
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
};

const shortDescription = (text) => {
  const first = String(text || "").split(".")[0]?.trim() || "";
  return first.length > 120 ? first.slice(0, 117).trim() + "..." : first;
};

const PRODUCTS = RAW_PRODUCTS.map((product) => {
  const fullDescription = PRODUCT_FULL_DESCRIPTIONS[product.id] || formatSentence(product.fullDescription);
  return {
    ...product,
    image: BASILIC_PRODUCT_IMAGES[product.id] || product.image,
    description: shortDescription(fullDescription),
    fullDescription,
    ingredients: PRODUCT_COMPOSITIONS[product.id] || formatSentence(product.ingredients),
    allergens: formatSentence(product.allergens),
  };
});

const POPULAR = PRODUCTS.filter((p) => p.isPopular);

const CROSS_SELL = PRODUCTS.filter((p) =>
  ["Напитки", "Соусы", "Выпечка", "Салаты"].includes(p.category)
).slice(0, 8);

const money = (n) => n.toLocaleString("ru-RU") + " ₸";

/* ---------------- ICONS (inline, no deps) ---------------- */

const Icon = {
  search: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  user: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  bag: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  menu: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  minus: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  chevronRight: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
  truck: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="7" width="14" height="10" rx="1"/><path d="M15 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/></svg>
  ),
  leaf: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-4 3-9 11-11 2 8-1 13-4 18z"/><path d="M4 13c4 0 8-2 11-5"/></svg>
  ),
  home: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
  ),
  flame: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="currentColor" stroke="none"><path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-0.5-2-1-3 2 1 4 4 4 7a7 7 0 0 1-14 0c0-4 2-6 5-11z"/></svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  trash: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
  ),
  back: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
};

/* ---------------- CSS ---------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');

.bs {
  --bg:#FAF8F2; --surface:#F1EBDC; --surface-2:#E9E2CF;
  --olive:#5B6B34; --olive-dark:#47531F; --olive-light:#7E9450;
  --ink:#262420; --ink-muted:#726C5E; --ink-soft:#96907F;
  --amber:#C98A3B; --spice:#B04A2E; --line:#E4DCC8;
  --radius:18px; --radius-sm:12px;
  font-family:'Inter',system-ui,sans-serif;
  background:var(--bg); color:var(--ink);
  min-height:100vh; position:relative;
  -webkit-font-smoothing:antialiased;
}
.bs *{box-sizing:border-box;}
.bs h1,.bs h2,.bs h3,.bs h4,.bs .disp{font-family:'Manrope',sans-serif;}
.bs button{font-family:inherit; cursor:pointer;}
.bs input{font-family:inherit;}
.bs a{color:inherit; text-decoration:none;}
.bs img{display:block;}
.bs ::selection{background:var(--olive-light); color:#fff;}

.wrap{max-width:1320px; margin:0 auto; padding:0 28px;}
@media (max-width:640px){ .wrap{padding:0 16px;} }

/* ---------- HEADER ---------- */
.header{position:sticky; top:0; z-index:60; background:rgba(250,248,242,0.92); backdrop-filter:blur(10px); border-bottom:1px solid var(--line);}
.header-inner{display:flex; align-items:center; gap:24px; padding:14px 0;}
.logo{font-weight:800; font-size:22px; letter-spacing:-0.02em; color:var(--olive-dark); display:flex; align-items:center; gap:6px; white-space:nowrap;}
.logo-dot{width:8px; height:8px; border-radius:50%; background:var(--amber);}
.city-pill{display:flex; align-items:center; gap:6px; padding:9px 12px; border-radius:999px; background:var(--surface); font-size:14px; font-weight:600; color:var(--ink); white-space:nowrap; border:1px solid transparent;}
.city-pill:hover{border-color:var(--line);}
.search-bar{flex:1; display:flex; align-items:center; gap:8px; background:var(--surface); border-radius:999px; padding:10px 16px; color:var(--ink-muted); min-width:0;}
.search-bar input{border:none; background:transparent; outline:none; width:100%; font-size:14px; color:var(--ink);}
.header-actions{display:flex; align-items:center; gap:8px;}
.icon-btn{display:flex; align-items:center; gap:8px; padding:9px 14px; border-radius:999px; border:1px solid var(--line); background:#fff; font-size:13px; font-weight:600; color:var(--ink);}
.icon-btn:hover{background:var(--surface);}
.cart-btn{background:var(--olive); color:#fff; border:none; position:relative;}
.cart-btn:hover{background:var(--olive-dark);}
.cart-badge{background:#fff; color:var(--olive-dark); font-size:11px; font-weight:800; border-radius:999px; padding:1px 7px; margin-left:2px;}
.burger{display:none; border:1px solid var(--line); background:#fff; border-radius:10px; padding:8px;}
.nav-row{display:flex; gap:26px; padding:11px 0; font-size:14px; font-weight:600; color:var(--ink-muted); border-top:1px solid var(--line); overflow-x:auto; scrollbar-width:none;}
.nav-row::-webkit-scrollbar{display:none;}
.nav-row a{white-space:nowrap; padding-bottom:2px; border-bottom:2px solid transparent;}
.nav-row a:hover, .nav-row a.active{color:var(--ink); border-color:var(--amber);}
@media (max-width:900px){
  .search-bar{order:3; flex-basis:100%;}
  .nav-row{display:none;}
  .city-pill span.city-label{display:none;}
}
@media (max-width:640px){
  .header-inner{flex-wrap:wrap;}
  .icon-btn.user-btn{display:none;}
}

/* ---------- HERO ---------- */
.hero{padding:44px 0 8px;}
.hero-card{background:linear-gradient(120deg,var(--surface) 0%, var(--surface-2) 100%); border-radius:28px; padding:56px 48px; display:flex; align-items:center; gap:40px; position:relative; overflow:hidden; min-height:340px;}
.hero-copy{flex:1; min-width:280px; position:relative; z-index:2;}
.eyebrow{display:inline-flex; align-items:center; gap:6px; background:#fff; border-radius:999px; padding:6px 12px; font-size:12px; font-weight:700; color:var(--olive-dark); letter-spacing:0.02em; text-transform:uppercase; margin-bottom:18px;}
.hero h1{font-size:44px; line-height:1.06; font-weight:800; letter-spacing:-0.02em; margin:0 0 16px; color:var(--ink);}
.hero p{font-size:16px; line-height:1.55; color:var(--ink-muted); max-width:440px; margin:0 0 28px;}
.hero-actions{display:flex; gap:12px; flex-wrap:wrap;}
.btn-primary{background:var(--olive); color:#fff; border:none; border-radius:999px; padding:14px 26px; font-weight:700; font-size:14px; display:inline-flex; align-items:center; gap:8px;}
.btn-primary:hover{background:var(--olive-dark);}
.btn-secondary{background:#fff; color:var(--ink); border:1px solid var(--line); border-radius:999px; padding:14px 26px; font-weight:700; font-size:14px;}
.btn-secondary:hover{border-color:var(--olive);}
.hero-visual{flex:1; min-width:260px; position:relative; z-index:1; display:flex; justify-content:center;}
.hero-visual img{width:100%; max-width:420px; height:300px; object-fit:cover; border-radius:22px; box-shadow:0 30px 60px -20px rgba(38,36,32,0.35); transform:rotate(1.5deg);}
.hero-tag{position:absolute; background:#fff; border-radius:14px; padding:10px 14px; font-size:12px; font-weight:700; box-shadow:0 12px 24px -8px rgba(38,36,32,0.25); display:flex; align-items:center; gap:6px;}
.hero-tag.t1{top:18px; left:-8px; color:var(--olive-dark);}
.hero-tag.t2{bottom:14px; right:-10px; color:var(--spice);}
@media (max-width:760px){
  .hero-card{padding:32px 22px; flex-direction:column; text-align:left;}
  .hero h1{font-size:32px;}
  .hero-visual img{height:220px;}
}

/* ---------- SECTION HEADINGS ---------- */
.section{padding:46px 0;}
.section-head{display:flex; align-items:baseline; justify-content:space-between; margin-bottom:20px; gap:12px;}
.section-head h2{font-size:24px; font-weight:800; letter-spacing:-0.01em; margin:0; display:flex; align-items:center; gap:8px;}
.section-link{font-size:13px; font-weight:700; color:var(--olive-dark); display:flex; align-items:center; gap:2px; white-space:nowrap;}
.section-link:hover{color:var(--olive);}

/* ---------- SCENARIOS ---------- */
.scenario-grid{display:grid; grid-template-columns:repeat(6,1fr); gap:14px;}
@media (max-width:1100px){ .scenario-grid{grid-template-columns:repeat(3,1fr);} }
@media (max-width:640px){ .scenario-grid{grid-template-columns:repeat(2,1fr); gap:10px;} }
.scenario-card{position:relative; border-radius:18px; overflow:hidden; aspect-ratio:3/3.6; background:var(--surface); border:1px solid transparent; transition:transform .18s ease, box-shadow .18s ease;}
.scenario-card:hover{transform:translateY(-3px); box-shadow:0 16px 30px -14px rgba(38,36,32,0.35);}
.scenario-card.active{outline:2px solid var(--olive); outline-offset:2px;}
.scenario-card img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover;}
.scenario-card::after{content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(38,36,32,0) 35%, rgba(30,28,22,0.86) 100%);}
.scenario-body{position:absolute; left:0; right:0; bottom:0; padding:14px; z-index:2; color:#fff;}
.scenario-body .cnt{font-size:11px; opacity:0.82; margin-bottom:4px; font-weight:600;}
.scenario-body .ttl{font-size:15px; font-weight:800; line-height:1.2; margin-bottom:2px;}
.scenario-body .cap{font-size:12px; opacity:0.88; font-weight:500;}

/* ---------- POPULAR (horizontal) ---------- */
.hscroll{display:flex; gap:16px; overflow-x:auto; padding-bottom:6px; scroll-snap-type:x proximity;}
.hscroll::-webkit-scrollbar{height:6px;}
.hscroll::-webkit-scrollbar-thumb{background:var(--line); border-radius:99px;}
.pop-card{flex:0 0 190px; scroll-snap-align:start; cursor:pointer;}
.pop-card .imgwrap{position:relative; border-radius:16px; overflow:hidden; aspect-ratio:1/1; background:var(--surface); margin-bottom:10px;}
.pop-card img{width:100%; height:100%; object-fit:cover; transition:transform .3s ease;}
.pop-card:hover img{transform:scale(1.06);}
.badge{position:absolute; top:8px; left:8px; display:flex; align-items:center; gap:3px; background:var(--amber); color:#fff; font-size:10.5px; font-weight:800; padding:4px 8px; border-radius:999px; letter-spacing:0.01em;}
.badge.new{background:var(--olive);}
.badge.spice{background:var(--spice);}
.pop-name{font-size:14px; font-weight:700; line-height:1.25; margin-bottom:2px;}
.pop-meta{font-size:12px; color:var(--ink-soft); margin-bottom:4px;}
.pop-price{font-size:14px; font-weight:800; color:var(--olive-dark);}

/* ---------- CUISINES ---------- */
.cuisine-grid{display:grid; grid-template-columns:repeat(5,1fr); gap:14px;}
@media (max-width:900px){ .cuisine-grid{grid-template-columns:repeat(3,1fr);} }
@media (max-width:560px){ .cuisine-grid{grid-template-columns:repeat(2,1fr);} }
.cuisine-card{position:relative; border-radius:16px; overflow:hidden; aspect-ratio:16/11; display:flex; align-items:flex-end; padding:14px; color:#fff; font-weight:700; font-size:15px; border:2px solid transparent;}
.cuisine-card.active{border-color:var(--amber);}
.cuisine-card img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover;}
.cuisine-card::after{content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(38,36,32,0.05) 30%, rgba(24,22,17,0.82) 100%);}
.cuisine-body{position:relative; z-index:2;}
.cuisine-count{display:block; font-size:11.5px; font-weight:600; opacity:0.85; margin-top:2px;}

/* ---------- ADVANTAGES ---------- */
.adv-strip{display:grid; grid-template-columns:repeat(3,1fr); gap:14px; background:var(--surface); border-radius:20px; padding:22px 26px;}
@media (max-width:760px){ .adv-strip{grid-template-columns:1fr; gap:16px;} }
.adv-item{display:flex; align-items:flex-start; gap:12px;}
.adv-icon{width:38px; height:38px; border-radius:10px; background:#fff; color:var(--olive-dark); display:flex; align-items:center; justify-content:center; flex:none;}
.adv-item h4{font-size:14.5px; font-weight:800; margin:0 0 2px;}
.adv-item p{font-size:12.5px; color:var(--ink-muted); margin:0; line-height:1.4;}

/* ---------- CATALOG ---------- */
.catalog-nav{position:sticky; top:118px; z-index:40; background:var(--bg); padding:14px 0; border-bottom:1px solid var(--line);}
@media (max-width:900px){ .catalog-nav{top:64px;} }
.cat-pills{display:flex; gap:8px; overflow-x:auto; scrollbar-width:none;}
.cat-pills::-webkit-scrollbar{display:none;}
.cat-pill{flex:none; padding:9px 16px; border-radius:999px; background:#fff; border:1px solid var(--line); font-size:13.5px; font-weight:700; color:var(--ink-muted); white-space:nowrap;}
.cat-pill.active{background:var(--olive); border-color:var(--olive); color:#fff;}
.cat-pill:hover:not(.active){border-color:var(--olive-light); color:var(--ink);}

.catalog-toolbar{display:grid; grid-template-columns:minmax(260px,1fr) repeat(3, minmax(170px, auto)); align-items:center; gap:10px; padding:16px 0 4px;}
.mini-search{display:flex; align-items:center; gap:8px; background:#fff; border:1px solid var(--line); border-radius:999px; padding:9px 14px; min-width:0; color:var(--ink-muted);}
.mini-search input{border:none; outline:none; background:transparent; width:100%; font-size:13.5px; color:var(--ink);}
.sort-select{border:1px solid var(--line); background:#fff; border-radius:999px; padding:9px 36px 9px 14px; min-height:42px; font-size:13px; font-weight:600; color:var(--ink); outline:none; max-width:100%;}
.chip-clear{font-size:12.5px; font-weight:700; color:var(--olive-dark); background:var(--surface); border-radius:999px; padding:8px 14px; display:flex; align-items:center; gap:6px; border:none;}
.active-filter-row{display:flex; align-items:center; gap:8px; padding:8px 0 4px; flex-wrap:wrap;}
@media (max-width:980px){.catalog-toolbar{grid-template-columns:1fr 1fr;}.mini-search{grid-column:1/-1;}}
@media (max-width:620px){.catalog-toolbar{grid-template-columns:1fr;}.sort-select{width:100%;}}

.catalog-group{margin-top:30px; scroll-margin-top:180px;}
.catalog-group h3{font-size:19px; font-weight:800; margin:0 0 14px;}
.product-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:18px;}
@media (max-width:1100px){ .product-grid{grid-template-columns:repeat(3,1fr);} }
@media (max-width:760px){ .product-grid{grid-template-columns:repeat(2,1fr); gap:12px;} }
@media (max-width:420px){ .product-grid{grid-template-columns:1fr;} }

.pcard{background:#fff; border:1px solid var(--line); border-radius:var(--radius); overflow:hidden; display:flex; flex-direction:column; height:100%; transition:box-shadow .18s ease, transform .18s ease; cursor:pointer;}
.pcard:hover{box-shadow:0 18px 30px -18px rgba(38,36,32,0.35); transform:translateY(-2px);}
.pcard .imgwrap{position:relative; aspect-ratio:4/3; background:var(--surface); overflow:hidden;}
.pcard .imgwrap img{width:100%; height:100%; object-fit:cover; transition:transform .3s ease;}
.pcard:hover .imgwrap img{transform:scale(1.05);}
.pcard-body{padding:13px 14px 14px; display:flex; flex-direction:column; flex:1;}
.pcard-name{font-size:14.5px; font-weight:700; line-height:1.28; margin-bottom:4px; min-height:37px;}
.pcard-desc{font-size:12px; color:var(--ink-soft); line-height:1.4; margin-bottom:8px; min-height:34px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;}
.pcard-weight{font-size:11.5px; color:var(--ink-soft); margin-bottom:10px;}
.pcard-foot{margin-top:auto; display:flex; align-items:center; justify-content:space-between; gap:8px;}
.pcard-price{font-size:15px; font-weight:800; color:var(--ink);}
.add-btn{background:var(--olive); color:#fff; border:none; border-radius:999px; width:34px; height:34px; display:flex; align-items:center; justify-content:center; flex:none;}
.add-btn:hover{background:var(--olive-dark);}
.qty-stepper{display:flex; align-items:center; gap:8px; background:var(--olive); border-radius:999px; padding:4px 6px;}
.qty-stepper button{width:26px; height:26px; border-radius:999px; border:none; background:rgba(255,255,255,0.16); color:#fff; display:flex; align-items:center; justify-content:center;}
.qty-stepper button:hover{background:rgba(255,255,255,0.3);}
.qty-stepper span{color:#fff; font-weight:800; font-size:13px; min-width:14px; text-align:center;}
.no-results{padding:60px 0; text-align:center; color:var(--ink-muted);}
.no-results strong{display:block; font-size:17px; color:var(--ink); margin-bottom:6px;}

/* ---------- OVERLAY / DRAWERS ---------- */
.overlay{position:fixed; inset:0; background:rgba(24,22,17,0.5); z-index:100; animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0} to{opacity:1}}
.drawer{position:fixed; top:0; right:0; height:100%; width:440px; max-width:92vw; background:#fff; z-index:101; box-shadow:-20px 0 50px rgba(0,0,0,0.2); display:flex; flex-direction:column; animation:slideIn .25s ease;}
@keyframes slideIn{from{transform:translateX(100%)} to{transform:translateX(0)}}
.drawer-head{display:flex; align-items:center; justify-content:space-between; padding:18px 20px; border-bottom:1px solid var(--line); flex:none;}
.drawer-head h3{font-size:18px; font-weight:800; margin:0;}
.close-btn{width:34px; height:34px; border-radius:999px; border:1px solid var(--line); background:#fff; display:flex; align-items:center; justify-content:center;}
.close-btn:hover{background:var(--surface);}
.drawer-body{flex:1; overflow-y:auto; padding:16px 20px;}
.drawer-foot{padding:16px 20px; border-top:1px solid var(--line); flex:none; background:#fff;}

.pdp-modal{position:fixed; inset:0; z-index:101; display:flex; align-items:flex-end; justify-content:center;}
@media (min-width:760px){ .pdp-modal{align-items:center;} }
.pdp-card{background:#fff; width:100%; max-width:920px; max-height:92vh; border-radius:24px 24px 0 0; overflow-y:auto; animation:slideUp .25s ease; position:relative;}
@media (min-width:760px){ .pdp-card{border-radius:24px; max-height:88vh;} }
@keyframes slideUp{from{transform:translateY(40px); opacity:0} to{transform:translateY(0); opacity:1}}
.pdp-grid{display:flex; flex-direction:column;}
@media (min-width:760px){ .pdp-grid{flex-direction:row;} }
.pdp-img{position:relative; flex:none; width:100%; height:280px;}
@media (min-width:760px){ .pdp-img{width:42%; height:auto;} }
.pdp-img img{width:100%; height:100%; object-fit:cover;}
.pdp-close{position:absolute; top:14px; right:14px; width:36px; height:36px; border-radius:999px; background:rgba(255,255,255,0.92); border:none; display:flex; align-items:center; justify-content:center; z-index:5;}
.pdp-info{padding:24px 26px 26px; flex:1; min-width:0;}
.pdp-badges{display:flex; gap:6px; margin-bottom:10px;}
.pdp-info h2{font-size:23px; font-weight:800; margin:0 0 6px; line-height:1.2;}
.pdp-meta-row{font-size:13px; color:var(--ink-soft); margin-bottom:14px;}
.pdp-desc{font-size:14px; color:var(--ink-muted); line-height:1.55; margin-bottom:18px;}
.pdp-section{margin-bottom:16px;}
.pdp-section h4{font-size:12.5px; text-transform:uppercase; letter-spacing:0.04em; color:var(--ink-soft); font-weight:700; margin:0 0 8px;}
.pdp-facts{display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; font-size:13px;}
.pdp-facts div span{color:var(--ink-soft); display:block; font-size:11.5px; margin-bottom:1px;}
.mod-row{display:flex; align-items:center; justify-content:between; gap:10px; padding:10px 0; border-bottom:1px solid var(--line); font-size:13.5px;}
.mod-row:last-child{border-bottom:none;}
.mod-name{flex:1;}
.mod-price{color:var(--ink-soft); font-size:12.5px; margin-right:10px;}
.mod-check{width:22px; height:22px; border-radius:6px; border:1.6px solid var(--line); display:flex; align-items:center; justify-content:center; flex:none;}
.mod-check.on{background:var(--olive); border-color:var(--olive); color:#fff;}
.related-row{display:flex; gap:12px; overflow-x:auto; padding-bottom:4px;}
.related-item{flex:0 0 120px; cursor:pointer;}
.related-item img{width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:12px; margin-bottom:6px;}
.related-item .rname{font-size:12.5px; font-weight:700; line-height:1.25;}
.related-item .rprice{font-size:12px; color:var(--olive-dark); font-weight:800;}
.pdp-footbar{position:sticky; bottom:0; background:#fff; border-top:1px solid var(--line); padding:14px 26px; display:flex; align-items:center; gap:14px;}
.pdp-total{font-size:17px; font-weight:800; margin-right:auto;}

/* ---------- CART ITEMS ---------- */
.cart-item{display:flex; gap:12px; padding:14px 0; border-bottom:1px solid var(--line);}
.cart-item img{width:64px; height:64px; border-radius:12px; object-fit:cover; flex:none;}
.cart-item-info{flex:1; min-width:0;}
.cart-item-info .nm{font-size:13.5px; font-weight:700; margin-bottom:2px;}
.cart-item-info .wt{font-size:11.5px; color:var(--ink-soft); margin-bottom:8px;}
.cart-item-foot{display:flex; align-items:center; justify-content:space-between;}
.remove-btn{color:var(--ink-soft); background:none; border:none; display:flex; align-items:center;}
.remove-btn:hover{color:var(--spice);}
.empty-cart{text-align:center; padding:60px 20px; color:var(--ink-muted);}
.empty-cart .bag-wrap{width:64px; height:64px; border-radius:50%; background:var(--surface); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; color:var(--olive-dark);}

.promo-row{display:flex; gap:8px; margin:14px 0;}
.promo-row input{flex:1; border:1px solid var(--line); border-radius:999px; padding:10px 14px; font-size:13px; outline:none;}
.promo-row button{border:1px solid var(--ink); background:var(--ink); color:#fff; border-radius:999px; padding:10px 16px; font-size:13px; font-weight:700;}
.promo-applied{font-size:12.5px; color:var(--olive-dark); font-weight:700; margin:-6px 0 12px;}
.note-field{width:100%; border:1px solid var(--line); border-radius:12px; padding:10px 12px; font-size:13px; resize:none; outline:none; font-family:inherit;}
.fulfil-toggle{display:flex; gap:8px; margin-bottom:12px;}
.fulfil-toggle button{flex:1; padding:10px; border-radius:12px; border:1px solid var(--line); background:#fff; font-size:13px; font-weight:700; color:var(--ink-muted);}
.fulfil-toggle button.active{background:var(--olive); border-color:var(--olive); color:#fff;}
.cross-sell-title{font-size:13px; font-weight:800; margin:18px 0 10px;}
.cross-row{display:flex; gap:10px; overflow-x:auto; padding-bottom:4px;}
.cross-card{flex:0 0 110px; border:1px solid var(--line); border-radius:14px; padding:8px; text-align:left; background:#fff;}
.cross-card img{width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:8px; margin-bottom:6px;}
.cross-card .cn{font-size:11.5px; font-weight:700; line-height:1.25; margin-bottom:2px; min-height:28px;}
.cross-card .cp{font-size:11.5px; color:var(--olive-dark); font-weight:800;}
.summary-row{display:flex; justify-content:space-between; font-size:13.5px; color:var(--ink-muted); margin-bottom:8px;}
.summary-row.total{font-size:16px; font-weight:800; color:var(--ink); margin-top:10px; padding-top:12px; border-top:1px solid var(--line);}
.full-btn{width:100%; background:var(--olive); color:#fff; border:none; border-radius:999px; padding:15px; font-weight:800; font-size:14.5px;}
.full-btn:hover{background:var(--olive-dark);}
.full-btn:disabled{background:var(--ink-soft); cursor:not-allowed;}

/* ---------- CHECKOUT ---------- */
.checkout-modal{position:fixed; inset:0; z-index:102; display:flex; align-items:center; justify-content:center; padding:20px;}
.checkout-card{background:#fff; width:100%; max-width:480px; max-height:90vh; overflow-y:auto; border-radius:24px; animation:slideUp .25s ease;}
.field{margin-bottom:14px;}
.field label{display:block; font-size:12.5px; font-weight:700; color:var(--ink-muted); margin-bottom:6px;}
.field input, .field textarea{width:100%; border:1px solid var(--line); border-radius:12px; padding:11px 13px; font-size:13.5px; outline:none; font-family:inherit;}
.field input:focus, .field textarea:focus{border-color:var(--olive);}
.field.error input{border-color:var(--spice);}
.field-error{font-size:11.5px; color:var(--spice); margin-top:4px;}
.field-row{display:flex; gap:10px;}
.field-row .field{flex:1;}
.pay-options{display:flex; gap:8px;}
.pay-options button{flex:1; border:1px solid var(--line); border-radius:12px; padding:11px; font-size:13px; font-weight:700; background:#fff; color:var(--ink-muted);}
.pay-options button.active{border-color:var(--olive); background:var(--surface); color:var(--ink);}
.success-view{text-align:center; padding:50px 30px;}
.success-icon{width:72px; height:72px; border-radius:50%; background:var(--olive); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;}
.success-view h3{font-size:20px; font-weight:800; margin:0 0 8px;}
.success-view p{font-size:14px; color:var(--ink-muted); margin:0 0 24px; line-height:1.5;}

/* ---------- FOOTER ---------- */
.footer{border-top:1px solid var(--line); padding:34px 0 60px; margin-top:30px; color:var(--ink-soft); font-size:13px;}
.footer-top{display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:16px;}
.footer-logo{font-weight:800; font-size:18px; color:var(--olive-dark); font-family:'Manrope',sans-serif;}

/* ---------- MOBILE BOTTOM BAR ---------- */
.mobile-cart-bar{display:none; position:fixed; left:14px; right:14px; bottom:14px; z-index:55; background:var(--olive); color:#fff; border-radius:999px; padding:14px 18px; align-items:center; justify-content:space-between; box-shadow:0 16px 30px -10px rgba(38,36,32,0.5); font-weight:700; font-size:14px;}
@media (max-width:640px){ .mobile-cart-bar.show{display:flex;} }

/* Toast */
.toast{position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--ink); color:#fff; padding:12px 20px; border-radius:999px; font-size:13.5px; font-weight:600; z-index:200; display:flex; align-items:center; gap:8px; box-shadow:0 12px 24px rgba(0,0,0,0.25); animation:fadeIn .2s ease;}

.sr-only{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0);}
`;

/* ---------------- HELPERS ---------------- */

function useCart() {
  const [items, setItems] = useState({}); // id -> qty
  const add = (id, qty = 1) =>
    setItems((s) => ({ ...s, [id]: (s[id] || 0) + qty }));
  const setQty = (id, qty) =>
    setItems((s) => {
      const next = { ...s };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  const remove = (id) =>
    setItems((s) => {
      const next = { ...s };
      delete next[id];
      return next;
    });
  const clear = () => setItems({});
  const count = Object.values(items).reduce((a, b) => a + b, 0);
  const lines = Object.entries(items)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === Number(id)), qty }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  return { items, add, setQty, remove, clear, count, lines, subtotal };
}

/* ---------------- COMPONENTS ---------------- */

function Header({ onOpenCart, cartCount, search, setSearch, activeNav }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navItems = ["Меню", "Акции", "Новинки", "Популярное", "Для офиса", "Доставка и оплата", "О нас"];
  return (
    <header className="header">
      <div className="wrap header-inner">
        <div className="logo"><span className="logo-dot" />basilic</div>
        <button className="city-pill" type="button">
          <Icon.pin size={14} /> <span className="city-label">Алматы</span>
        </button>
        <div className="search-bar">
          <Icon.search size={16} />
          <input
            placeholder="Поиск по блюдам и кухням"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="header-actions">
          <button className="icon-btn"><Icon.truck size={15} /> 30–45 мин</button>
          <button className="icon-btn user-btn"><Icon.user size={15} /> Войти</button>
          <button className="icon-btn cart-btn" onClick={onOpenCart}>
            <Icon.bag size={16} /> Корзина
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
      <div className="wrap nav-row">
        {navItems.map((n, i) => (
          <a key={n} href="#" className={i === 0 ? "active" : ""} onClick={(e) => e.preventDefault()}>
            {n}
          </a>
        ))}
      </div>
    </header>
  );
}

function Hero({ onScrollTo }) {
  return (
    <section className="hero wrap">
      <div className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow"><Icon.leaf size={13} /> Доставка по Алматы</span>
          <h1>Территория вкусной еды</h1>
          <p>Ежедневная еда из разных кухонь мира для дома и офиса. Быстро, вкусно и по понятной цене.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onScrollTo("catalog")}>
              Смотреть меню <Icon.chevronRight size={15} />
            </button>
            <button className="btn-secondary" onClick={() => onScrollTo("popular")}>
              Популярное
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <img src={BASILIC_HERO_IMAGE} alt="Блюда Basilic" />
          <div className="hero-tag t1"><Icon.flame size={13} /> Хиты Basilic</div>
          <div className="hero-tag t2">5 кухонь мира</div>
        </div>
      </div>
    </section>
  );
}

function ScenarioCollections({ active, onSelect }) {
  return (
    <section className="section wrap" id="scenarios">
      <div className="section-head">
        <h2>Что хотите сегодня?</h2>
        {active && (
          <button className="section-link" onClick={() => onSelect(null)}>
            Сбросить фильтр
          </button>
        )}
      </div>
      <div className="scenario-grid">
        {SCENARIOS.map((s) => {
          const cnt = PRODUCTS.filter((p) => p.scenarioTags.includes(s.id)).length;
          return (
            <button
              key={s.id}
              className={"scenario-card" + (active === s.id ? " active" : "")}
              onClick={() => onSelect(active === s.id ? null : s.id)}
              type="button"
            >
              <img src={SCENARIO_IMAGES[s.id]} alt={s.title} />
              <div className="scenario-body">
                <div className="cnt">{cnt} блюд</div>
                <div className="ttl">{s.title}</div>
                <div className="cap">{s.caption}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PopularSection({ onOpenPdp, cart }) {
  return (
    <section className="section wrap" id="popular">
      <div className="section-head">
        <h2><Icon.flame size={18} /> Хиты Basilic</h2>
      </div>
      <div className="hscroll">
        {POPULAR.map((p) => (
          <div className="pop-card" key={p.id} onClick={() => onOpenPdp(p)}>
            <div className="imgwrap">
              <img src={p.image} alt={p.name} />
              <span className="badge"><Icon.flame size={10} /> Хит</span>
            </div>
            <div className="pop-name">{p.name}</div>
            <div className="pop-meta">{p.weight}</div>
            <div className="pop-price">{money(p.price)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CuisinesSection({ active, onSelect }) {
  return (
    <section className="section wrap" id="cuisines">
      <div className="section-head">
        <h2>Кухни мира</h2>
      </div>
      <div className="cuisine-grid">
        {CUISINES.map((c) => {
          const cnt = PRODUCTS.filter((p) => p.cuisine === c.id).length;
          return (
            <button
              key={c.id}
              className={"cuisine-card" + (active === c.id ? " active" : "")}
              onClick={() => onSelect(active === c.id ? null : c.id)}
              type="button"
            >
              <img src={CUISINE_IMAGES[c.id]} alt={c.label} />
              <div className="cuisine-body">
                {c.label}
                <span className="cuisine-count">{cnt} блюд</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AdvantagesSection() {
  const items = [
    { icon: Icon.truck, title: "Доставка и самовывоз", text: "Выберите удобный способ получения заказа" },
    { icon: Icon.leaf, title: "Любимые блюда на каждый день", text: "Свежие продукты и понятный состав" },
    { icon: Icon.home, title: "Удобно для дома и офиса", text: "Соберите заказ под обычный день или встречу" },
  ];
  return (
    <section className="section wrap">
      <div className="adv-strip">
        {items.map((it) => (
          <div className="adv-item" key={it.title}>
            <div className="adv-icon"><it.icon size={18} /></div>
            <div>
              <h4>{it.title}</h4>
              <p>{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ p, qty, onAdd, onInc, onDec, onOpen }) {
  return (
    <div className="pcard" onClick={() => onOpen(p)}>
      <div className="imgwrap">
        <img src={p.image} alt={p.name} loading="lazy" />
        {p.isPopular && <span className="badge"><Icon.flame size={10} /> Хит</span>}
        {!p.isPopular && p.isNew && <span className="badge new">Новинка</span>}
        {!p.isPopular && !p.isNew && p.isSpicy && <span className="badge spice">Острое</span>}
      </div>
      <div className="pcard-body">
        <div className="pcard-name">{p.name}</div>
        <div className="pcard-desc">{p.description}</div>
        <div className="pcard-weight">{p.weight}</div>
        <div className="pcard-foot" onClick={(e) => e.stopPropagation()}>
          <span className="pcard-price">{money(p.price)}</span>
          {qty > 0 ? (
            <div className="qty-stepper">
              <button onClick={() => onDec(p.id)} type="button"><Icon.minus size={13} /></button>
              <span>{qty}</span>
              <button onClick={() => onInc(p.id)} type="button"><Icon.plus size={13} /></button>
            </div>
          ) : (
            <button className="add-btn" onClick={() => onAdd(p.id)} type="button" aria-label="Добавить">
              <Icon.plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogSection({
  activeCategory,
  setActiveCategory,
  activeCuisine,
  setActiveCuisine,
  activeScenario,
  setActiveScenario,
  search,
  setSearch,
  sort,
  setSort,
  cartItems,
  onAdd,
  onInc,
  onDec,
  onOpenPdp,
}) {
  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeCuisine) list = list.filter((p) => p.cuisine === activeCuisine);
    if (activeScenario) list = list.filter((p) => p.scenarioTags.includes(activeScenario));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== "Все") list = list.filter((p) => p.category === activeCategory);
    let sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "popular") sorted.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    return sorted;
  }, [activeCategory, activeCuisine, activeScenario, search, sort]);

  const grouped = useMemo(() => {
    if (activeCategory !== "Все") return { [activeCategory]: filtered };
    const g = {};
    CATEGORIES.forEach((c) => {
      const items = filtered.filter((p) => p.category === c);
      if (items.length) g[c] = items;
    });
    return g;
  }, [filtered, activeCategory]);

  const activeFilters = [
    activeCuisine && CUISINES.find((c) => c.id === activeCuisine)?.label,
    activeScenario && SCENARIOS.find((s) => s.id === activeScenario)?.title,
  ].filter(Boolean);

  return (
    <section className="wrap" id="catalog">
      <div className="section-head" style={{ marginBottom: 0 }}>
        <h2>Каталог</h2>
      </div>
      <div className="catalog-nav">
        <div className="cat-pills">
          {["Все", ...CATEGORIES].map((c) => (
            <button
              key={c}
              className={"cat-pill" + (activeCategory === c ? " active" : "")}
              onClick={() => setActiveCategory(c)}
              type="button"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="catalog-toolbar">
        <div className="mini-search">
          <Icon.search size={15} />
          <input
            placeholder="Найти блюдо в каталоге"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="sort-select"
          value={activeCuisine || ""}
          onChange={(e) => setActiveCuisine(e.target.value || null)}
          aria-label="Фильтр по кухне"
        >
          <option value="">Все кухни</option>
          {CUISINES.map((c) => (
            <option value={c.id} key={c.id}>{c.label}</option>
          ))}
        </select>
        <select
          className="sort-select"
          value={activeScenario || ""}
          onChange={(e) => setActiveScenario(e.target.value || null)}
          aria-label="Фильтр по сценарию"
        >
          <option value="">Любой сценарий</option>
          {SCENARIOS.map((s) => (
            <option value={s.id} key={s.id}>{s.title}</option>
          ))}
        </select>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">По умолчанию</option>
          <option value="popular">Сначала популярные</option>
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
        </select>
      </div>
      <div className="active-filter-row">
        {activeFilters.map((f) => (
          <span key={f} className="chip-clear">
            {f}
          </span>
        ))}
        {(activeCuisine || activeScenario || search || sort !== "default") && (
          <button
            className="chip-clear"
            onClick={() => {
              setActiveCuisine(null);
              setActiveScenario(null);
              setSearch("");
              setSort("default");
            }}
          >
            <Icon.close size={12} /> Сбросить
          </button>
        )}
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="no-results">
          <strong>Ничего не найдено</strong>
          По вашему запросу блюд нет — попробуйте изменить фильтры или поиск.
        </div>
      )}

      {Object.entries(grouped).map(([cat, items]) => (
        <div className="catalog-group" id={"cat-" + cat} key={cat}>
          <h3>{cat}</h3>
          <div className="product-grid">
            {items.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                qty={cartItems[p.id] || 0}
                onAdd={onAdd}
                onInc={onInc}
                onDec={onDec}
                onOpen={onOpenPdp}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function PdpModal({ product, onClose, cartQty, onAdd, onInc, onDec, onOpenProduct }) {
  const [mods, setMods] = useState({});
  useEffect(() => setMods({}), [product]);
  if (!product) return null;

  const toggleMod = (name) => setMods((m) => ({ ...m, [name]: !m[name] }));
  const modsTotal = product.modifiers
    .filter((m) => mods[m.name])
    .reduce((s, m) => s + m.price, 0);
  const unitPrice = product.price + modsTotal;

  const related = product.relatedProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="pdp-modal" onClick={onClose}>
      <div className="pdp-card" onClick={(e) => e.stopPropagation()}>
        <div className="pdp-grid">
          <div className="pdp-img">
            <img src={product.image} alt={product.name} />
            <button className="pdp-close" onClick={onClose} aria-label="Закрыть"><Icon.close size={18} /></button>
          </div>
          <div className="pdp-info">
            <div className="pdp-badges">
              {product.isPopular && <span className="badge" style={{ position: "static" }}><Icon.flame size={10} /> Хит</span>}
              {product.isNew && <span className="badge new" style={{ position: "static" }}>Новинка</span>}
              {product.isSpicy && <span className="badge spice" style={{ position: "static" }}>Острое</span>}
            </div>
            <h2>{product.name}</h2>
            <div className="pdp-meta-row">
              {product.weight} · {CUISINES.find((c) => c.id === product.cuisine)?.label}
            </div>
            <p className="pdp-desc">{product.fullDescription}</p>

            <div className="pdp-section">
              <h4>Характеристики</h4>
              <div className="pdp-facts">
                <div><span>Состав</span>{product.ingredients}</div>
                <div><span>Аллергены</span>{product.allergens}</div>
                <div><span>Сытность</span>{product.satiety}</div>
                <div><span>Острота</span>{product.isSpicy ? "Острое" : "Не острое"}</div>
              </div>
            </div>

            {product.modifiers.length > 0 && (
              <div className="pdp-section">
                <h4>Дополните блюдо</h4>
                {product.modifiers.map((m) => (
                  <div className="mod-row" key={m.name} onClick={() => toggleMod(m.name)} style={{ cursor: "pointer" }}>
                    <span className="mod-name">{m.name}</span>
                    <span className="mod-price">+{money(m.price)}</span>
                    <span className={"mod-check" + (mods[m.name] ? " on" : "")}>
                      {mods[m.name] && <Icon.check size={13} />}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {related.length > 0 && (
              <div className="pdp-section">
                <h4>Похожие блюда</h4>
                <div className="related-row">
                  {related.map((r) => (
                    <div className="related-item" key={r.id} onClick={() => onOpenProduct(r)}>
                      <img src={r.image} alt={r.name} />
                      <div className="rname">{r.name}</div>
                      <div className="rprice">{money(r.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="pdp-footbar">
          <span className="pdp-total">{money(unitPrice)}</span>
          {cartQty > 0 ? (
            <div className="qty-stepper">
              <button onClick={() => onDec(product.id)} type="button"><Icon.minus size={14} /></button>
              <span>{cartQty}</span>
              <button onClick={() => onInc(product.id)} type="button"><Icon.plus size={14} /></button>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => onAdd(product.id)} type="button">
              <Icon.plus size={15} /> В корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, cart, onOpenCheckout }) {
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [note, setNote] = useState("");
  const [fulfil, setFulfil] = useState("delivery");

  if (!open) return null;

  const deliveryFee = fulfil === "delivery" && cart.subtotal > 0 ? (cart.subtotal >= 8000 ? 0 : 990) : 0;
  const discount = promoApplied ? Math.round(cart.subtotal * 0.1) : 0;
  const total = cart.subtotal - discount + deliveryFee;

  const applyPromo = () => {
    if (promo.trim().toLowerCase() === "basilic10") setPromoApplied(true);
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-head">
          <h3>Корзина {cart.count > 0 && `· ${cart.count}`}</h3>
          <button className="close-btn" onClick={onClose}><Icon.close size={17} /></button>
        </div>
        <div className="drawer-body">
          {cart.lines.length === 0 ? (
            <div className="empty-cart">
              <div className="bag-wrap"><Icon.bag size={26} /></div>
              <strong style={{ display: "block", marginBottom: 6, color: "#262420" }}>Корзина пуста</strong>
              Добавьте блюда из каталога — они появятся здесь.
            </div>
          ) : (
            <>
              {cart.lines.map(({ product, qty }) => (
                <div className="cart-item" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div className="cart-item-info">
                    <div className="nm">{product.name}</div>
                    <div className="wt">{product.weight}</div>
                    <div className="cart-item-foot">
                      <div className="qty-stepper">
                        <button onClick={() => cart.setQty(product.id, qty - 1)} type="button"><Icon.minus size={13} /></button>
                        <span>{qty}</span>
                        <button onClick={() => cart.setQty(product.id, qty + 1)} type="button"><Icon.plus size={13} /></button>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 13.5 }}>{money(product.price * qty)}</span>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => cart.remove(product.id)} aria-label="Удалить">
                    <Icon.trash size={16} />
                  </button>
                </div>
              ))}

              <div className="cross-sell-title">Добавить к заказу</div>
              <div className="cross-row">
                {CROSS_SELL.map((p) => (
                  <button className="cross-card" key={p.id} onClick={() => cart.add(p.id)} type="button">
                    <img src={p.image} alt={p.name} />
                    <div className="cn">{p.name}</div>
                    <div className="cp">{money(p.price)}</div>
                  </button>
                ))}
              </div>

              <div className="fulfil-toggle" style={{ marginTop: 20 }}>
                <button className={fulfil === "delivery" ? "active" : ""} onClick={() => setFulfil("delivery")} type="button">
                  Доставка
                </button>
                <button className={fulfil === "pickup" ? "active" : ""} onClick={() => setFulfil("pickup")} type="button">
                  Самовывоз
                </button>
              </div>

              <textarea
                className="note-field"
                placeholder="Комментарий к заказу (например, код домофона)"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="promo-row">
                <input
                  placeholder="Промокод (пример: BASILIC10)"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                />
                <button onClick={applyPromo} type="button">Применить</button>
              </div>
              {promoApplied && <div className="promo-applied">Промокод применён: −10% на заказ</div>}
            </>
          )}
        </div>
        {cart.lines.length > 0 && (
          <div className="drawer-foot">
            <div className="summary-row">
              <span>Сумма</span>
              <span>{money(cart.subtotal)}</span>
            </div>
            {promoApplied && (
              <div className="summary-row">
                <span>Скидка по промокоду</span>
                <span>−{money(discount)}</span>
              </div>
            )}
            {fulfil === "delivery" && (
              <div className="summary-row">
                <span>Доставка</span>
                <span>{deliveryFee === 0 ? "Бесплатно" : money(deliveryFee)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Итого</span>
              <span>{money(total)}</span>
            </div>
            <button className="full-btn" onClick={() => onOpenCheckout({ fulfil, total, note })}>
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function CheckoutModal({ open, onClose, orderInfo, cart, onSuccess }) {
  const [step, setStep] = useState("form"); // form | success
  const [form, setForm] = useState({ name: "", phone: "", address: "", flat: "", time: "asap", pay: "card" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setStep("form");
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Укажите имя";
    if (!/^[+0-9\s()-]{7,}$/.test(form.phone.trim())) e.phone = "Проверьте номер телефона";
    if (orderInfo?.fulfil === "delivery" && !form.address.trim()) e.address = "Укажите адрес доставки";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setStep("success");
    cart.clear();
  };

  return (
    <div className="checkout-modal" onClick={onClose}>
      <div className="checkout-card" onClick={(e) => e.stopPropagation()}>
        {step === "form" ? (
          <>
            <div className="drawer-head">
              <h3>Оформление заказа</h3>
              <button className="close-btn" onClick={onClose}><Icon.close size={17} /></button>
            </div>
            <div className="drawer-body">
              <div className="field-row">
                <div className={"field" + (errors.name ? " error" : "")}>
                  <label>Имя</label>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Как к вам обращаться" />
                  {errors.name && <div className="field-error">{errors.name}</div>}
                </div>
                <div className={"field" + (errors.phone ? " error" : "")}>
                  <label>Телефон</label>
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+7 (___) ___-__-__" />
                  {errors.phone && <div className="field-error">{errors.phone}</div>}
                </div>
              </div>

              {orderInfo?.fulfil === "delivery" && (
                <div className="field-row">
                  <div className={"field" + (errors.address ? " error" : "")} style={{ flex: 2 }}>
                    <label>Адрес доставки</label>
                    <input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Улица, дом" />
                    {errors.address && <div className="field-error">{errors.address}</div>}
                  </div>
                  <div className="field">
                    <label>Кв. / офис</label>
                    <input value={form.flat} onChange={(e) => update("flat", e.target.value)} placeholder="№" />
                  </div>
                </div>
              )}

              <div className="field">
                <label>Время получения</label>
                <div className="pay-options">
                  <button className={form.time === "asap" ? "active" : ""} onClick={() => update("time", "asap")} type="button">Как можно скорее</button>
                  <button className={form.time === "scheduled" ? "active" : ""} onClick={() => update("time", "scheduled")} type="button">Ко времени</button>
                </div>
              </div>

              <div className="field">
                <label>Способ оплаты</label>
                <div className="pay-options">
                  <button className={form.pay === "card" ? "active" : ""} onClick={() => update("pay", "card")} type="button">Картой онлайн</button>
                  <button className={form.pay === "cash" ? "active" : ""} onClick={() => update("pay", "cash")} type="button">Наличными курьеру</button>
                </div>
              </div>

              <div className="summary-row total" style={{ marginTop: 16 }}>
                <span>Итого к оплате</span>
                <span>{money(orderInfo?.total || 0)}</span>
              </div>
            </div>
            <div className="drawer-foot">
              <button className="full-btn" onClick={submit}>Подтвердить заказ</button>
            </div>
          </>
        ) : (
          <div className="success-view">
            <div className="success-icon"><Icon.check size={30} /></div>
            <h3>Заказ оформлен!</h3>
            <p>Спасибо, {form.name || "гость"}. Мы уже готовим ваш заказ — курьер свяжется с вами по номеру {form.phone || "телефона"}.</p>
            <button className="btn-primary" onClick={onSuccess} style={{ margin: "0 auto" }}>Вернуться в меню</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- APP ---------------- */

export default function BasilicApp() {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [pdpProduct, setPdpProduct] = useState(null);

  const [globalSearch, setGlobalSearch] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [activeCuisine, setActiveCuisine] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);
  const [sort, setSort] = useState("default");
  const [toast, setToast] = useState(null);

  // sync header search into catalog search
  useEffect(() => {
    if (globalSearch) setCatalogSearch(globalSearch);
  }, [globalSearch]);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1800);
  };

  const handleAdd = (id) => {
    cart.add(id);
    const p = PRODUCTS.find((x) => x.id === id);
    showToast(`${p.name} добавлено в корзину`);
  };
  const handleInc = (id) => cart.setQty(id, (cart.items[id] || 0) + 1);
  const handleDec = (id) => cart.setQty(id, (cart.items[id] || 0) - 1);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openCheckout = (info) => {
    setOrderInfo(info);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="bs">
      <style>{CSS}</style>

      <Header
        onOpenCart={() => setCartOpen(true)}
        cartCount={cart.count}
        search={globalSearch}
        setSearch={setGlobalSearch}
      />

      <Hero onScrollTo={scrollTo} />

      <ScenarioCollections active={activeScenario} onSelect={(id) => { setActiveScenario(id); scrollTo("catalog"); }} />

      <PopularSection onOpenPdp={setPdpProduct} cart={cart} />

      <CuisinesSection active={activeCuisine} onSelect={(id) => { setActiveCuisine(id); scrollTo("catalog"); }} />

      <AdvantagesSection />

      <CatalogSection
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeCuisine={activeCuisine}
        setActiveCuisine={setActiveCuisine}
        activeScenario={activeScenario}
        setActiveScenario={setActiveScenario}
        search={catalogSearch}
        setSearch={(v) => { setCatalogSearch(v); setGlobalSearch(v); }}
        sort={sort}
        setSort={setSort}
        cartItems={cart.items}
        onAdd={handleAdd}
        onInc={handleInc}
        onDec={handleDec}
        onOpenPdp={setPdpProduct}
      />

      <footer className="footer wrap">
        <div className="footer-top">
          <div className="footer-logo">basilic</div>
          <div>Алматы · Ежедневно 9:00–23:00 · Доставка и самовывоз</div>
        </div>
        Прототип интерфейса подготовлен для внутреннего продуктового аудита. Фотографии — демонстрационные заглушки, заменяются одним полем image в данных товара.
      </footer>

      {cart.count > 0 && (
        <button className="mobile-cart-bar show" onClick={() => setCartOpen(true)}>
          <span>{cart.count} товар(а) в корзине</span>
          <span>{money(cart.subtotal)}</span>
        </button>
      )}

      <PdpModal
        product={pdpProduct}
        onClose={() => setPdpProduct(null)}
        cartQty={pdpProduct ? cart.items[pdpProduct.id] || 0 : 0}
        onAdd={handleAdd}
        onInc={handleInc}
        onDec={handleDec}
        onOpenProduct={setPdpProduct}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onOpenCheckout={openCheckout} />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        orderInfo={orderInfo}
        cart={cart}
        onSuccess={() => {
          setCheckoutOpen(false);
        }}
      />

      {toast && <div className="toast"><Icon.check size={15} /> {toast}</div>}
    </div>
  );
}
