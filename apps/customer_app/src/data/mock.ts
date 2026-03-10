const foodImage = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

const now = new Date();

export type Category = {
  id: string;
  label: string;
  subtitle: string;
  image: string;
};

export type PromoBanner = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  route: string;
  image: string;
};

export type SearchSuggestion = {
  id: string;
  label: string;
  type: 'restaurant' | 'dish' | 'cuisine' | 'trend';
};

export type MenuChoice = {
  id: string;
  label: string;
  priceSos: number;
};

export type MenuOptionGroup = {
  id: string;
  label: string;
  required?: boolean;
  choices: MenuChoice[];
};

export type MenuExtra = {
  id: string;
  label: string;
  priceSos: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceSos: number;
  image: string;
  badge?: string;
  popular?: boolean;
  options?: MenuOptionGroup[];
  extras?: MenuExtra[];
};

export type MenuSection = {
  id: string;
  title: string;
  caption?: string;
  items: MenuItem[];
};

export type Restaurant = {
  id: string;
  name: string;
  merchantEmail: string;
  slug: string;
  coverImage: string;
  gallery: string[];
  cuisines: string[];
  categoryIds: string[];
  district: string;
  deliveryTime: string;
  deliveryFeeSos: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  priceTier: '$' | '$$' | '$$$';
  promo: string;
  primeEligible: boolean;
  fastDelivery: boolean;
  topRated: boolean;
  openNow: boolean;
  minimumOrderSos: number;
  heroNote: string;
  story: string;
  menu: MenuSection[];
};

export type SavedAddress = {
  id: string;
  label: string;
  district: string;
  addressLine: string;
  etaHint: string;
  active?: boolean;
};

export type PaymentMethod = {
  id: string;
  label: string;
  subtitle: string;
  type: 'cash' | 'mobile';
  preferred?: boolean;
};

export type TrackingStageKey = 'received' | 'preparing' | 'picked_up' | 'on_the_way' | 'delivered';

export type TrackingStage = {
  key: TrackingStageKey;
  label: string;
  note: string;
};

export type DriverProfile = {
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
};

export type OrderHistoryEntry = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  itemsPreview: string[];
  totalSos: number;
  placedAt: string;
  etaLabel: string;
  addressLabel: string;
  status: TrackingStageKey;
  driver?: DriverProfile;
};

export type PrimeBenefit = {
  id: string;
  title: string;
  description: string;
};

export type GrocerySpotlight = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  eta: string;
};

const xawaashMenu: MenuSection[] = [
  {
    id: 'popular',
    title: 'Popular now',
    caption: 'Fast-moving favorites around Taleex and KM4.',
    items: [
      {
        id: 'bariis-combo',
        name: 'Bariis combo',
        description: 'Spiced rice, tender beef, banana, basbaas, and house salad.',
        priceSos: 22000,
        image: foodImage('1544025162-d76694265947'),
        badge: 'Best seller',
        popular: true,
        options: [
          {
            id: 'protein',
            label: 'Choose your protein',
            required: true,
            choices: [
              { id: 'beef', label: 'Beef', priceSos: 0 },
              { id: 'chicken', label: 'Chicken', priceSos: 1000 },
              { id: 'goat', label: 'Goat', priceSos: 2500 },
            ],
          },
        ],
        extras: [
          { id: 'basbaas', label: 'Extra basbaas', priceSos: 600 },
          { id: 'salad', label: 'Fresh salad', priceSos: 1200 },
        ],
      },
      {
        id: 'suqaar-flatbread',
        name: 'Suqaar flatbread wrap',
        description: 'Peppered diced beef folded into warm sabaayad with garlic yogurt.',
        priceSos: 15500,
        image: foodImage('1600891964599-f61ba0e24092'),
        badge: 'Prime deal',
        popular: true,
        extras: [
          { id: 'fries', label: 'Crispy fries', priceSos: 2000 },
          { id: 'laban', label: 'Mini laban', priceSos: 1200 },
        ],
      },
      {
        id: 'shaah-set',
        name: 'Shaah & canjeero set',
        description: 'Soft layered canjeero with cardamom tea and date butter.',
        priceSos: 9800,
        image: foodImage('1495474472287-4d71bcdd2085'),
        popular: true,
      },
    ],
  },
  {
    id: 'combos',
    title: 'Combo meals',
    items: [
      {
        id: 'family-platter',
        name: 'Family feast platter',
        description: 'Rice, grilled chicken, hilib, sautéed vegetables, and soft drinks.',
        priceSos: 49500,
        image: foodImage('1517248135467-4c7edcad34c4'),
        badge: 'Feeds 3-4',
      },
      {
        id: 'breakfast-tray',
        name: 'Morning tray',
        description: 'Canjeero, beer, malawax, honey, and thermos tea.',
        priceSos: 24000,
        image: foodImage('1504674900247-0877df9cc836'),
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    items: [
      {
        id: 'iced-qaxwo',
        name: 'Iced qaxwo',
        description: 'Cold brew coffee with milk foam and cardamom.',
        priceSos: 5200,
        image: foodImage('1495474472287-4d71bcdd2085'),
      },
      {
        id: 'fresh-mango',
        name: 'Fresh mango juice',
        description: 'Pressed to order with lime and mint.',
        priceSos: 4800,
        image: foodImage('1467453678174-768ec283a940'),
      },
    ],
  },
];

const makkahMenu: MenuSection[] = [
  {
    id: 'rice-bowls',
    title: 'Rice bowls',
    items: [
      {
        id: 'mandi-bowl',
        name: 'Mandi chicken bowl',
        description: 'Slow roasted chicken, fragrant mandi rice, and house pickles.',
        priceSos: 20500,
        image: foodImage('1517248135467-4c7edcad34c4'),
        badge: 'Free drink',
      },
      {
        id: 'beef-platter',
        name: 'Charcoal beef platter',
        description: 'Tender charcoal beef, cumin rice, onions, and smoky aioli.',
        priceSos: 24800,
        image: foodImage('1544025162-d76694265947'),
      },
    ],
  },
  {
    id: 'tea',
    title: 'Tea & sweets',
    items: [
      {
        id: 'karak',
        name: 'Karak duo',
        description: 'Two cups of karak with mini sesame biscuits.',
        priceSos: 7000,
        image: foodImage('1495474472287-4d71bcdd2085'),
      },
    ],
  },
];

const urbanMenu: MenuSection[] = [
  {
    id: 'burgers',
    title: 'Signature burgers',
    items: [
      {
        id: 'smash-burger',
        name: 'Blue coast smash burger',
        description: 'Double patty, grilled onions, white sauce, and pickles on brioche.',
        priceSos: 18500,
        image: foodImage('1550547660-d9450f859349'),
        badge: 'Fast delivery',
        extras: [
          { id: 'cheese', label: 'Extra cheese', priceSos: 1500 },
          { id: 'jalapeno', label: 'Pickled jalapeno', priceSos: 900 },
        ],
      },
      {
        id: 'crispy-chicken',
        name: 'Crispy chicken stack',
        description: 'Crunchy chicken, slaw, and blue pepper mayo.',
        priceSos: 17600,
        image: foodImage('1568901346375-23c9450c58cd'),
        popular: true,
      },
    ],
  },
  {
    id: 'sides',
    title: 'Sides & shakes',
    items: [
      {
        id: 'loaded-fries',
        name: 'Loaded fries',
        description: 'Seasoned fries with beef dust, aioli, and herbs.',
        priceSos: 7900,
        image: foodImage('1573080496219-bb080dd4f877'),
      },
      {
        id: 'vanilla-shake',
        name: 'Vanilla date shake',
        description: 'Creamy shake blended with dates and sea salt.',
        priceSos: 6800,
        image: foodImage('1572490122747-3968b75cc699'),
      },
    ],
  },
];

const pizzaMenu: MenuSection[] = [
  {
    id: 'wood-fired',
    title: 'Wood-fired',
    items: [
      {
        id: 'somali-star-pizza',
        name: 'Somali star pizza',
        description: 'Roasted peppers, beef suqaar, mozzarella, and coriander.',
        priceSos: 23400,
        image: foodImage('1513104890138-7c749659a591'),
        badge: 'Top rated',
        options: [
          {
            id: 'size',
            label: 'Choose size',
            required: true,
            choices: [
              { id: 'regular', label: 'Regular', priceSos: 0 },
              { id: 'large', label: 'Large', priceSos: 4500 },
            ],
          },
        ],
      },
      {
        id: 'margherita',
        name: 'White margherita',
        description: 'Tomato, mozzarella, basil oil, and sea salt.',
        priceSos: 18900,
        image: foodImage('1513104890138-7c749659a591'),
      },
    ],
  },
];

const groceryMenu: MenuSection[] = [
  {
    id: 'essentials',
    title: 'Daily essentials',
    items: [
      {
        id: 'fruit-crate',
        name: 'Fresh fruit crate',
        description: 'Seasonal bananas, limes, mango, and guava.',
        priceSos: 15500,
        image: foodImage('1576402187878-974f70c890a5'),
      },
      {
        id: 'milk-bread',
        name: 'Milk & bread duo',
        description: 'Local milk plus fresh baked bread for tonight.',
        priceSos: 9200,
        image: foodImage('1509440159596-0249088772ff'),
      },
    ],
  },
];

export const CATEGORIES: Category[] = [
  {
    id: 'somali-food',
    label: 'Somali food',
    subtitle: 'Bariis, suqaar, canjeero',
    image: foodImage('1544025162-d76694265947', 600),
  },
  {
    id: 'rice-dishes',
    label: 'Rice dishes',
    subtitle: 'Mandi, bariis, bowls',
    image: foodImage('1517248135467-4c7edcad34c4', 600),
  },
  {
    id: 'meat-grilled',
    label: 'Meat & grilled',
    subtitle: 'Goat, beef, skewers',
    image: foodImage('1600891964599-f61ba0e24092', 600),
  },
  {
    id: 'breakfast',
    label: 'Breakfast',
    subtitle: 'Morning plates and tea',
    image: foodImage('1504674900247-0877df9cc836', 600),
  },
  {
    id: 'tea-coffee',
    label: 'Tea & coffee',
    subtitle: 'Shaah, qaxwo, karak',
    image: foodImage('1495474472287-4d71bcdd2085', 600),
  },
  {
    id: 'fast-food',
    label: 'Fast food',
    subtitle: 'Comfort classics',
    image: foodImage('1550547660-d9450f859349', 600),
  },
  {
    id: 'pizza',
    label: 'Pizza',
    subtitle: 'Wood-fired slices',
    image: foodImage('1513104890138-7c749659a591', 600),
  },
  {
    id: 'chicken',
    label: 'Chicken',
    subtitle: 'Crispy and grilled',
    image: foodImage('1568901346375-23c9450c58cd', 600),
  },
  {
    id: 'burgers',
    label: 'Burgers',
    subtitle: 'Smash and stack',
    image: foodImage('1550547660-d9450f859349', 600),
  },
  {
    id: 'desserts',
    label: 'Desserts',
    subtitle: 'Sweet endings',
    image: foodImage('1488477181946-6428a0291777', 600),
  },
  {
    id: 'drinks',
    label: 'Drinks',
    subtitle: 'Juices and coolers',
    image: foodImage('1467453678174-768ec283a940', 600),
  },
  {
    id: 'groceries',
    label: 'Groceries',
    subtitle: 'Daily essentials',
    image: foodImage('1576402187878-974f70c890a5', 600),
  },
  {
    id: 'essentials',
    label: 'Essentials',
    subtitle: 'Household and pharmacy',
    image: foodImage('1509440159596-0249088772ff', 600),
  },
];

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'blue-hour',
    eyebrow: 'Tonight in Mogadishu',
    title: 'Free delivery after sunset for Prime',
    description: 'Dinner favorites, lighter checkout, and priority delivery on blue-marked spots.',
    cta: 'See Prime picks',
    route: '/prime',
    image: foodImage('1517248135467-4c7edcad34c4'),
  },
  {
    id: 'breakfast-run',
    eyebrow: 'Morning rush',
    title: 'Breakfast in under 18 minutes',
    description: 'Canjeero, tea, and bakery drops curated for school and office mornings.',
    cta: 'Browse breakfast',
    route: '/category/breakfast',
    image: foodImage('1504674900247-0877df9cc836'),
  },
  {
    id: 'grocery-hour',
    eyebrow: 'Essentials',
    title: 'Groceries and household staples in one stop',
    description: 'Milk, fruit, medicine, and snacks with clean checkout and smart reorders.',
    cta: 'Shop essentials',
    route: '/category/groceries',
    image: foodImage('1576402187878-974f70c890a5'),
  },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'xiddig-xawaash',
    name: 'Xawaash Table',
    merchantEmail: 'merchant@demo.so',
    slug: 'xawaash-table',
    coverImage: foodImage('1544025162-d76694265947'),
    gallery: [foodImage('1544025162-d76694265947'), foodImage('1600891964599-f61ba0e24092'), foodImage('1495474472287-4d71bcdd2085')],
    cuisines: ['Somali', 'Rice dishes', 'Breakfast'],
    categoryIds: ['somali-food', 'rice-dishes', 'breakfast', 'tea-coffee'],
    district: 'Taleex, Mogadishu',
    deliveryTime: '18-28 min',
    deliveryFeeSos: 2500,
    distanceKm: 1.8,
    rating: 4.9,
    reviewCount: 1320,
    priceTier: '$$',
    promo: 'Free shaah with Prime orders over SOS 20,000',
    primeEligible: true,
    fastDelivery: true,
    topRated: true,
    openNow: true,
    minimumOrderSos: 8000,
    heroNote: 'Loved for polished Somali classics and breakfast trays.',
    story: 'A bright modern kitchen delivering refined Somali comfort plates with quick dispatch and careful packaging.',
    menu: xawaashMenu,
  },
  {
    id: 'makkah-grill',
    name: 'Makkah Grill House',
    merchantEmail: 'al_bait@demo.so',
    slug: 'makkah-grill-house',
    coverImage: foodImage('1517248135467-4c7edcad34c4'),
    gallery: [foodImage('1517248135467-4c7edcad34c4'), foodImage('1544025162-d76694265947')],
    cuisines: ['Grilled', 'Rice dishes', 'Tea & coffee'],
    categoryIds: ['meat-grilled', 'rice-dishes', 'tea-coffee', 'chicken'],
    district: 'KM4, Mogadishu',
    deliveryTime: '24-34 min',
    deliveryFeeSos: 3000,
    distanceKm: 2.4,
    rating: 4.8,
    reviewCount: 860,
    priceTier: '$$',
    promo: 'Buy 1 mandi bowl, get karak half off',
    primeEligible: true,
    fastDelivery: false,
    topRated: true,
    openNow: true,
    minimumOrderSos: 10000,
    heroNote: 'Deep charcoal flavor and generous portions.',
    story: 'A favorite for grilled meats, mandi rice, and late-night tea runs near the airport road.',
    menu: makkahMenu,
  },
  {
    id: 'urban-bite',
    name: 'Urban Bite',
    merchantEmail: 'kfc_mogadishu@demo.so',
    slug: 'urban-bite',
    coverImage: foodImage('1550547660-d9450f859349'),
    gallery: [foodImage('1550547660-d9450f859349'), foodImage('1568901346375-23c9450c58cd')],
    cuisines: ['Fast food', 'Burgers', 'Chicken'],
    categoryIds: ['fast-food', 'burgers', 'chicken', 'drinks'],
    district: 'Hodan, Mogadishu',
    deliveryTime: '15-22 min',
    deliveryFeeSos: 2000,
    distanceKm: 1.1,
    rating: 4.7,
    reviewCount: 940,
    priceTier: '$$',
    promo: 'SOS 2,000 off combo meals tonight',
    primeEligible: true,
    fastDelivery: true,
    topRated: false,
    openNow: true,
    minimumOrderSos: 9000,
    heroNote: 'Fast-moving comfort food with clean packaging and strong shakes.',
    story: 'Designed for quick lunches and game-night orders, with a focused menu of burgers, chicken, and loaded sides.',
    menu: urbanMenu,
  },
  {
    id: 'blue-star-pizza',
    name: 'Blue Star Pizza',
    merchantEmail: 'pizza_house@demo.so',
    slug: 'blue-star-pizza',
    coverImage: foodImage('1513104890138-7c749659a591'),
    gallery: [foodImage('1513104890138-7c749659a591')],
    cuisines: ['Pizza', 'Fast food'],
    categoryIds: ['pizza', 'fast-food', 'desserts'],
    district: 'Abdiaziz, Mogadishu',
    deliveryTime: '28-38 min',
    deliveryFeeSos: 3500,
    distanceKm: 3.6,
    rating: 4.6,
    reviewCount: 420,
    priceTier: '$$',
    promo: 'Large pizzas include one free soft drink',
    primeEligible: false,
    fastDelivery: false,
    topRated: true,
    openNow: true,
    minimumOrderSos: 12000,
    heroNote: 'Wood-fired pizzas with late evening demand.',
    story: 'A neighborhood pizza kitchen using thin crusts, simple toppings, and plenty of cheese for group orders.',
    menu: pizzaMenu,
  },
  {
    id: 'suuq-fresh',
    name: 'Suuq Fresh',
    merchantEmail: 'banadir_foods@demo.so',
    slug: 'suuq-fresh',
    coverImage: foodImage('1576402187878-974f70c890a5'),
    gallery: [foodImage('1576402187878-974f70c890a5'), foodImage('1509440159596-0249088772ff')],
    cuisines: ['Groceries', 'Essentials'],
    categoryIds: ['groceries', 'essentials', 'drinks'],
    district: 'Waberi, Mogadishu',
    deliveryTime: '12-18 min',
    deliveryFeeSos: 1500,
    distanceKm: 0.9,
    rating: 4.8,
    reviewCount: 510,
    priceTier: '$',
    promo: 'Fresh essentials in under 20 minutes',
    primeEligible: true,
    fastDelivery: true,
    topRated: false,
    openNow: true,
    minimumOrderSos: 5000,
    heroNote: 'Perfect for milk, fruit, and forgotten basics.',
    story: 'A compact essentials market built for high-frequency replenishment with fast last-mile delivery.',
    menu: groceryMenu,
  },
  {
    id: 'banadir-sweets',
    name: 'Banadir Sweets',
    merchantEmail: 'banadir_foods@demo.so',
    slug: 'banadir-sweets',
    coverImage: foodImage('1488477181946-6428a0291777'),
    gallery: [foodImage('1488477181946-6428a0291777')],
    cuisines: ['Desserts', 'Tea & coffee'],
    categoryIds: ['desserts', 'tea-coffee', 'drinks'],
    district: 'Shangani, Mogadishu',
    deliveryTime: '20-30 min',
    deliveryFeeSos: 2500,
    distanceKm: 2.1,
    rating: 4.9,
    reviewCount: 770,
    priceTier: '$$',
    promo: 'Member-only dessert boxes today',
    primeEligible: true,
    fastDelivery: false,
    topRated: true,
    openNow: true,
    minimumOrderSos: 7000,
    heroNote: 'Desserts, date cakes, and tea-time boxes.',
    story: 'A premium sweets counter focused on celebration boxes, date cakes, and polished gifting options.',
    menu: [
      {
        id: 'desserts',
        title: 'Dessert boxes',
        items: [
          {
            id: 'date-cake',
            name: 'Date cake slice',
            description: 'Soft date sponge with cream and toasted sesame.',
            priceSos: 6400,
            image: foodImage('1488477181946-6428a0291777'),
          },
          {
            id: 'baklava-box',
            name: 'Mini baklava box',
            description: 'Assorted pistachio and walnut bites.',
            priceSos: 13800,
            image: foodImage('1488477181946-6428a0291777'),
            badge: 'Gift favorite',
          },
        ],
      },
    ],
  },
];

export const TRENDING_SEARCHES = [
  'Bariis combo',
  'Canjeero near me',
  'Late night burgers',
  'Prime free delivery',
  'Fresh fruit',
];

export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  ...RESTAURANTS.slice(0, 5).map((restaurant) => ({
    id: restaurant.id,
    label: restaurant.name,
    type: 'restaurant' as const,
  })),
  { id: 'dish-bariis', label: 'Bariis combo', type: 'dish' },
  { id: 'dish-shaah', label: 'Shaah & canjeero', type: 'dish' },
  { id: 'dish-burger', label: 'Smash burger', type: 'dish' },
  { id: 'cuisine-somali', label: 'Somali food', type: 'cuisine' },
  { id: 'cuisine-grocery', label: 'Groceries', type: 'cuisine' },
];

export const SEARCH_FILTERS = [
  'Under 25 min',
  '4.7+ rating',
  'Open now',
  'Prime eligible',
  'Free delivery',
  '$$ or less',
];

export const SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'home',
    label: 'Home',
    district: 'Taleex',
    addressLine: 'Near Digfeer junction, blue gate',
    etaHint: 'Usually 14 min away',
    active: true,
  },
  {
    id: 'work',
    label: 'Office',
    district: 'KM4',
    addressLine: 'Airport road, second floor reception',
    etaHint: 'Usually 19 min away',
  },
  {
    id: 'family',
    label: 'Family',
    district: 'Wadajir',
    addressLine: 'Behind the pharmacy, white villa',
    etaHint: 'Usually 22 min away',
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'evc-plus',
    label: 'Hormuud EVC Plus',
    subtitle: 'Approve the payment on your phone after checkout',
    type: 'mobile',
    preferred: true,
  },
  {
    id: 'edahab',
    label: 'Somtel eDahab',
    subtitle: 'Use your Somtel wallet for one-step confirmation',
    type: 'mobile',
  },
  {
    id: 'sahal',
    label: 'Golis SAHAL',
    subtitle: 'Confirm instantly from your SAHAL wallet',
    type: 'mobile',
  },
  {
    id: 'zaad',
    label: 'Telesom ZAAD',
    subtitle: 'Popular Somaliland wallet flow with phone approval',
    type: 'mobile',
  },
  {
    id: 'cash',
    label: 'Cash on delivery',
    subtitle: 'Pay when the order arrives',
    type: 'cash',
  },
];

export const PRIME_BENEFITS: PrimeBenefit[] = [
  {
    id: 'delivery',
    title: 'Free delivery on eligible orders',
    description: 'Blue-star partners unlock zero delivery fees once your basket crosses the minimum.',
  },
  {
    id: 'offers',
    title: 'Member-only offers',
    description: 'Prime keeps dessert boxes, breakfast drops, and weekly bundles just for subscribers.',
  },
  {
    id: 'support',
    title: 'Priority support',
    description: 'Get faster issue resolution and priority replacement credits when something goes wrong.',
  },
];

export const GROCERY_SPOTLIGHTS: GrocerySpotlight[] = [
  {
    id: 'midweek',
    title: 'Midweek fruit refresh',
    subtitle: 'Bananas, mango, and limes packed for the week',
    image: foodImage('1576402187878-974f70c890a5', 700),
    eta: '12 min',
  },
  {
    id: 'night-essentials',
    title: 'Night essentials',
    subtitle: 'Milk, bread, snacks, and medicine cabinet basics',
    image: foodImage('1509440159596-0249088772ff', 700),
    eta: '16 min',
  },
];

export const MEMBERSHIP_PRICE_SOS = 7900;

export const DEFAULT_RECENT_SEARCHES = ['Canjeero', 'Burgers', 'Fresh juice'];

export const DEFAULT_FAVORITE_RESTAURANTS = ['xiddig-xawaash', 'banadir-sweets'];

export const TRACKING_STAGES: TrackingStage[] = [
  { key: 'received', label: 'Order received', note: 'We locked in your basket and sent it to the kitchen.' },
  { key: 'preparing', label: 'Preparing', note: 'Your order is being packed fresh right now.' },
  { key: 'picked_up', label: 'Picked up', note: 'The courier has your order and is leaving the store.' },
  { key: 'on_the_way', label: 'On the way', note: 'The courier is getting close to your drop-off point.' },
  { key: 'delivered', label: 'Delivered', note: 'Delivered and ready to enjoy.' },
];

export const ORDER_HISTORY: OrderHistoryEntry[] = [
  {
    id: 'XD-5401',
    restaurantId: 'xiddig-xawaash',
    restaurantName: 'Xawaash Table',
    restaurantImage: foodImage('1544025162-d76694265947', 700),
    itemsPreview: ['Bariis combo', 'Fresh mango juice'],
    totalSos: 31400,
    placedAt: new Date(now.getTime() - 1000 * 60 * 40).toISOString(),
    etaLabel: '9 min away',
    addressLabel: 'Taleex, near Digfeer junction',
    status: 'on_the_way',
    driver: {
      name: 'Sahal',
      rating: 4.9,
      vehicle: 'Blue Honda Fit',
      plate: 'SO 4271',
    },
  },
  {
    id: 'XD-5178',
    restaurantId: 'urban-bite',
    restaurantName: 'Urban Bite',
    restaurantImage: foodImage('1550547660-d9450f859349', 700),
    itemsPreview: ['Blue coast smash burger', 'Loaded fries'],
    totalSos: 26400,
    placedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    etaLabel: 'Delivered',
    addressLabel: 'KM4 office',
    status: 'delivered',
  },
  {
    id: 'XD-5063',
    restaurantId: 'banadir-sweets',
    restaurantName: 'Banadir Sweets',
    restaurantImage: foodImage('1488477181946-6428a0291777', 700),
    itemsPreview: ['Mini baklava box', 'Karak duo'],
    totalSos: 20800,
    placedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    etaLabel: 'Delivered',
    addressLabel: 'Taleex',
    status: 'delivered',
  },
];

export function getRestaurantById(id?: string) {
  return RESTAURANTS.find((restaurant) => restaurant.id === id) ?? null;
}

export function getRestaurantByMerchantEmail(email?: string) {
  return RESTAURANTS.find((restaurant) => restaurant.merchantEmail === email) ?? null;
}

export function getRestaurantsByCategory(categoryId: string) {
  return RESTAURANTS.filter((restaurant) => restaurant.categoryIds.includes(categoryId));
}

export function getCategoryById(categoryId?: string) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? null;
}

export function getFeaturedRestaurants() {
  return RESTAURANTS.filter((restaurant) => restaurant.openNow).slice(0, 5);
}

export function getFastDeliveryRestaurants() {
  return RESTAURANTS.filter((restaurant) => restaurant.fastDelivery);
}

export function getTopRatedRestaurants() {
  return RESTAURANTS.filter((restaurant) => restaurant.topRated);
}

export function getOfferRestaurants() {
  return RESTAURANTS.filter((restaurant) => restaurant.primeEligible || restaurant.promo.length > 0).slice(0, 4);
}

export function getPrimeRestaurants() {
  return RESTAURANTS.filter((restaurant) => restaurant.primeEligible);
}

export function getRecentOrderRestaurantIds() {
  return ORDER_HISTORY.map((order) => order.restaurantId);
}

export function searchRestaurants(term: string) {
  const query = term.trim().toLowerCase();
  if (!query) return RESTAURANTS;

  return RESTAURANTS.filter((restaurant) => {
    const restaurantMatch =
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisines.some((cuisine) => cuisine.toLowerCase().includes(query)) ||
      restaurant.categoryIds.some((category) => category.includes(query.replace(/\s+/g, '-')));

    const menuMatch = restaurant.menu.some((section) =>
      section.items.some(
        (item) =>
          item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
      ),
    );

    return restaurantMatch || menuMatch;
  });
}

export function searchMenuItems(term: string) {
  const query = term.trim().toLowerCase();
  if (!query) return [];

  return RESTAURANTS.flatMap((restaurant) =>
    restaurant.menu.flatMap((section) =>
      section.items
        .filter(
          (item) =>
            item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
        )
        .map((item) => ({
          ...item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
        })),
    ),
  ).slice(0, 8);
}
