import { buildImportedCakes } from './CakeImageData';

export const CATEGORIES = [
  { id: 'chocolate',   label: 'Chocolate',     emoji: '🍫', count: 90 },
  { id: 'truffle',     label: 'Truffle',       emoji: '🎂', count: 36 },
  { id: 'red-velvet', label: 'Red Velvet',   emoji: '❤️', count: 59 },
  { id: 'designer',    label: 'Designer',      emoji: '✨', count: 95 },
  { id: 'fruit',       label: 'Fruit Cakes',   emoji: '🍓', count: 19 },
  { id: 'mango',       label: 'Mango',         emoji: '🥭', count: 11 },
  { id: 'pineapple',   label: 'Pineapple',     emoji: '🍍', count: 8  },
];

export const OCCASIONS = [
  { id: 'birthday',        label: 'Birthday',        emoji: '🎂', subtitle: 'Make their day unforgettable' },
  { id: 'anniversary',     label: 'Anniversary',     emoji: '💍', subtitle: 'Celebrate years of love' },
  { id: 'wedding',         label: 'Wedding',         emoji: '👰', subtitle: 'For your perfect day' },
  { id: 'engagement',      label: 'Engagement',      emoji: '💍', subtitle: 'A sweet new beginning' },
  { id: 'graduation',      label: 'Graduation',      emoji: '🎓', subtitle: 'Cheers to success' },
  { id: 'baby-shower',     label: 'Baby Shower',     emoji: '🍼', subtitle: 'Welcome the little one' },
  { id: 'romantic',        label: 'Romantic',        emoji: '❤️', subtitle: 'Express your deep love' },
  { id: 'congratulations', label: 'Congratulations', emoji: '🎉', subtitle: 'Celebrate the big news' },
  { id: 'farewell',        label: 'Farewell',        emoji: '👋', subtitle: 'A sweet goodbye' },
  { id: 'festival',        label: 'Festivals',       emoji: '🎆', subtitle: 'Festive joyous treats' },
];

const CAKES_CURATED = [
  // ── Chocolate ─────────────────────────────────────────────────────────
  { id: 1,  category: 'chocolate',  occasions: ['birthday', 'romantic', 'anniversary'], name: 'Belgian Chocolate Truffle',  subtitle: 'Rich ganache with gold leaf',     image: '/cake-images/chocolate/p-chocolate-truffle-cream-cake-361113-m.avif',   price: 849,  originalPrice: 1099, discount: 23, rating: 4.9, reviews: 2847, deliveryTime: '2 hrs', emoji: '🍫', tag: 'BESTSELLER', weights: ['500g','1Kg','1.5Kg','2Kg'], serves: '6–8',   flavor: 'Dark Chocolate',  desc: 'Indulgent Belgian chocolate layers with silky truffle ganache, finished with gold leaf and cocoa dusting.',        ingredients: 'Belgian Dark Chocolate, Fresh Cream, Butter, Eggs, Flour, Sugar, Cocoa, Gold Leaf', allergens: 'Gluten, Dairy, Eggs', storage: 'Refrigerate. Best within 2 days.' },
  { id: 2,  category: 'chocolate',  occasions: ['birthday', 'congratulations'], name: 'Ferrero Rocher Cake',        subtitle: 'Hazelnut choco crown',            image: '/cake-images/chocolate/p-chocolate-hazelnut-crunch-cake-361115-m.avif', price: 1149, originalPrice: 1399, discount: 18, rating: 4.9, reviews: 3124, deliveryTime: '2 hrs', emoji: '🍫', tag: 'PREMIUM',    weights: ['500g','1Kg','1.5Kg','2Kg'], serves: '8–10',  flavor: 'Hazelnut',        desc: 'Crowned with Ferrero Rocher chocolates on a rich hazelnut sponge with chocolate ganache.',                         ingredients: 'Ferrero Rocher, Hazelnut, Dark Chocolate, Cream, Eggs', allergens: 'Gluten, Dairy, Eggs, Nuts', storage: 'Refrigerate. Best within 2 days.' },
  { id: 3,  category: 'chocolate',  occasions: ['birthday'], name: 'Choco Lava Cake',            subtitle: 'Molten dark center',              image: '/cake-images/chocolate/p-gooey-chocolate-cake-361122-m.avif',          price: 699,  originalPrice: 899,  discount: 22, rating: 4.8, reviews: 1456, deliveryTime: '45 min', emoji: '🌋', tag: 'POPULAR',    weights: ['500g','1Kg'],               serves: '4–6',   flavor: 'Dark Chocolate',  desc: 'Warm molten dark chocolate center oozing out of a perfectly baked soft sponge.',                                   ingredients: 'Dark Chocolate, Butter, Eggs, Flour, Sugar', allergens: 'Gluten, Dairy, Eggs', storage: 'Best consumed fresh.' },
  { id: 4,  category: 'chocolate',  occasions: ['birthday'], name: 'Dark Fantasy Chocolate',     subtitle: '70% dark cacao layers',           image: '/cake-images/chocolate/p-decadent-dark-chocolate-cake-269995-m.avif',   price: 749,  originalPrice: 999,  discount: 25, rating: 4.8, reviews: 1923, deliveryTime: '2 hrs', emoji: '🍫', tag: 'NEW',        weights: ['500g','1Kg','1.5Kg'],       serves: '4–6',   flavor: 'Dark Chocolate',  desc: 'Deep, intense dark chocolate with 70% cacao sponge layers and bitter cocoa cream.',                                ingredients: 'Dark Chocolate 70%, Cream, Butter, Flour, Cocoa', allergens: 'Gluten, Dairy, Eggs', storage: 'Refrigerate. Best within 2 days.' },
  { id: 5,  category: 'chocolate',  occasions: ['birthday', 'festival'], name: 'Chocolate Overload Cake',    subtitle: 'Triple chocolate heaven',         image: '/cake-images/chocolate/p-chocolate-noir-gateau-361085-m.avif',         price: 999,  originalPrice: 1249, discount: 20, rating: 4.9, reviews: 2101, deliveryTime: '2 hrs', emoji: '🍫', tag: 'TRENDING',   weights: ['1Kg','1.5Kg','2Kg'],        serves: '8–10',  flavor: 'Triple Choco',    desc: 'Three layers of white, milk and dark chocolate sponge, glazed with chocolate and loaded with shavings.',           ingredients: 'Dark, Milk & White Chocolate, Cream, Butter, Eggs', allergens: 'Gluten, Dairy, Eggs', storage: 'Refrigerate. Best within 2 days.' },
  // ── Red Velvet ──────────────────────────────────────────
  { id: 10, category: 'red-velvet', occasions: ['romantic', 'anniversary'], name: 'Red Velvet Love Cake',      subtitle: 'Cream cheese dream',              image: '/cake-images/red velvet/p-classic-red-velvet-cake-109230-m.avif',       price: 899,  originalPrice: 1149, discount: 22, rating: 4.9, reviews: 2234, deliveryTime: '2 hrs', emoji: '❤️', tag: 'BESTSELLER', weights: ['500g','1Kg','1.5Kg','2Kg'], serves: '6–10',  flavor: 'Red Velvet',      desc: 'Romantic red velvet with cream cheese frosting and hand-piped velvet roses.',                                       ingredients: 'Red Velvet Flour, Cocoa, Cream Cheese, Butter, Buttermilk', allergens: 'Gluten, Dairy, Eggs', storage: 'Refrigerate. Best within 2 days.' },
  { id: 11, category: 'red-velvet', occasions: ['romantic', 'anniversary', 'wedding'], name: 'Romantic Rose Cake',        subtitle: 'Hundreds of buttercream roses',   image: '/cake-images/red velvet/p-rose-hearts-cake-199613-m.avif',              price: 1099, originalPrice: 1349, discount: 19, rating: 4.8, reviews: 1102, deliveryTime: '2 hrs', emoji: '🌹', tag: 'ROMANTIC',   weights: ['500g','1Kg','1.5Kg'],       serves: '6–8',   flavor: 'Rose Vanilla',    desc: 'Vanilla sponge adorned with hand-piped buttercream roses in soft pink and ivory.',                                  ingredients: 'Vanilla Sponge, Buttercream, Rose Essence, Edible Roses', allergens: 'Gluten, Dairy, Eggs', storage: 'Refrigerate. Best within 2 days.' },
  { id: 12, category: 'red-velvet', occasions: ['anniversary', 'romantic'], name: 'Crimson Love Anniversary',  subtitle: 'Rich velvet & cream cheese',      image: '/cake-images/red velvet/p-crimson-love-anniversary-red-velvet-cake-431689-m.avif', price: 1399, originalPrice: 1699, discount: 18, rating: 4.9, reviews: 678, deliveryTime: '2 hrs', emoji: '💛', tag: 'LUXURY', weights: ['1Kg','1.5Kg','2Kg'], serves: '8–12', flavor: 'Red Velvet', desc: 'Anniversary special red velvet with rich cream cheese and gold leaf finish.', ingredients: 'Red Velvet, Cream Cheese, Gold Leaf, Flour', allergens: 'Gluten, Dairy, Eggs', storage: 'Refrigerate. Best within 2 days.' },
  { id: 13, category: 'red-velvet', occasions: ['anniversary', 'engagement', 'romantic'], name: 'Sweet Hearts Delight',      subtitle: 'Love-shaped velvet perfection',   image: '/cake-images/red velvet/p-sweet-hearts-delight-cake-360893-m.avif',      price: 1199, originalPrice: 1499, discount: 20, rating: 5.0, reviews: 412,  deliveryTime: '3 hrs', emoji: '💐', tag: 'DESIGNER',   weights: ['1Kg','1.5Kg','2Kg'],        serves: '8–12',  flavor: 'Red Velvet',      desc: 'A heart-shaped velvet masterpiece with delicate rose cream and edible flowers.',                                   ingredients: 'Red Velvet, Cream, Rose Essence, Edible Flowers', allergens: 'Gluten, Dairy, Eggs', storage: 'Refrigerate. Best within 2 days.' },
  // ── Designer ──────────────────────────────────────────────────────────
  { id: 17, category: 'designer',   occasions: ['birthday', 'anniversary', 'engagement', 'wedding'], name: 'Sparkling Celebration Cake', subtitle: 'Handcrafted fondant art',        image: '/cake-images/desiner/p-sparkling-celebration-cream-cake-271465-m.avif', price: 1499, originalPrice: 1899, discount: 21, rating: 4.9, reviews: 756,  deliveryTime: '2 hrs', emoji: '✨', tag: 'DESIGNER',   weights: ['1Kg','1.5Kg','2Kg'],        serves: '8–12',  flavor: 'Vanilla',         desc: 'Breathtaking celebration fondant with gold accents. Every cake unique, handcrafted by master artisans.',           ingredients: 'Fondant, Gold Luster Dust, Vanilla Sponge, Buttercream', allergens: 'Gluten, Dairy, Eggs', storage: 'Room temp 4hrs, refrigerate after.' },
  { id: 18, category: 'designer',   occasions: ['wedding', 'engagement', 'anniversary'], name: 'Floral Garden Fondant',     subtitle: 'Blooming luxury creation',        image: '/cake-images/desiner/p-floral-garden-fondant-cake-6-kg--112709-m.avif', price: 2499, originalPrice: 2999, discount: 17, rating: 5.0, reviews: 412,  deliveryTime: '3 hrs', emoji: '👑', tag: 'LUXURY',     weights: ['1Kg','1.5Kg','2Kg','3Kg'], serves: '10–16', flavor: 'Champagne',       desc: 'Draped in artisan fondant blooms with hand-placed sugar flowers. A showstopper for any occasion.',                 ingredients: 'Fondant, Edible Flowers, Champagne Cream, Vanilla Bean', allergens: 'Gluten, Dairy, Eggs', storage: 'Room temp 2hrs, refrigerate after.' },
  { id: 19, category: 'designer',   occasions: ['birthday', 'baby-shower'], name: 'Tiny Petals Lilac Cake',    subtitle: 'Clean pastel bento style',        image: '/cake-images/desiner/p-tiny-petals-lilac-cake-361100-m.avif',          price: 1199, originalPrice: 1499, discount: 20, rating: 4.8, reviews: 634,  deliveryTime: '2 hrs', emoji: '🎨', tag: 'TRENDING',   weights: ['500g','1Kg'],               serves: '4–8',   flavor: 'Vanilla',         desc: 'Korean-inspired minimalist design with clean lines, soft lilac tones and delicate petal details.',                 ingredients: 'Vanilla Sponge, Buttercream, Edible Petals', allergens: 'Gluten, Dairy, Eggs', storage: 'Refrigerate. Best within 2 days.' },
];

// ── Merge hand-curated + image-imported cakes ──────────────────────
const _imported = buildImportedCakes(100);

// Deduplicate: if imported name matches a curated cake, skip it (curated wins)
const _curatedNames = new Set(CAKES_CURATED.map(c => c.name.toLowerCase().trim()));
const _newOnly      = _imported.filter(c => !_curatedNames.has(c.name.toLowerCase().trim()));

export const ALL_CAKES = [...CAKES_CURATED, ..._newOnly];
export { ALL_CAKES as CAKES };

export const ADDONS = [
  { id: 'message',  label: 'Message on Cake', icon: '✍️', price: 0,   desc: 'Custom text piped on cake' },
  { id: 'candle',   label: 'Candles',          icon: '🕯️', price: 49,  desc: 'Set of 6 premium candles' },
  { id: 'knife',    label: 'Cake Knife',        icon: '🔪', price: 29,  desc: 'Elegant silver knife' },
  { id: 'flower',   label: 'Fresh Flowers',     icon: '💐', price: 149, desc: 'Seasonal fresh flowers' },
  { id: 'card',     label: 'Greeting Card',     icon: '💌', price: 49,  desc: 'Handwritten premium card' },
  { id: 'balloon',  label: 'Balloon Bouquet',   icon: '🎈', price: 99,  desc: '5 helium balloons' },
  { id: 'choco',    label: 'Chocolate Box',     icon: '🍫', price: 199, desc: '12-piece assorted box' },
];

export const DELIVERY_SLOTS = [
  { id: 'std',      label: 'Standard',     time: '4–6 hours',  price: 49,  icon: '📦' },
  { id: 'sameday',  label: 'Same Day',     time: 'By 9 PM',    price: 0,   icon: '🚀' },
  { id: 'fixed',    label: 'Fixed Time',   time: 'You choose', price: 79,  icon: '🕐' },
];

export const OFFERS = [
  { id: 1, title: 'FLAT 20% OFF',  subtitle: 'On all Birthday Cakes',    code: 'BDAY20',   color: '#D97706' },
  { id: 3, title: 'BUY 1 GET 1',  subtitle: 'On select cupcake boxes',   code: 'BOGO',     color: '#6B4F3A' },
  { id: 4, title: 'FESTIVAL 30%', subtitle: 'Off on Designer Cakes',     code: 'FEST30',   color: '#2D6A4F' },
];

export const REVIEWS = [
  { id: 1, name: 'Priya Sharma',  city: 'Delhi',     rating: 5, avatar: 'PS', cake: 'Belgian Chocolate Truffle', text: 'Ordered for my husband\'s birthday — absolutely divine! Fresh delivery, stunning presentation. Will definitely order again.' },
  { id: 2, name: 'Arjun Mehta',   city: 'Mumbai',    rating: 5, avatar: 'AM', cake: 'Gold Luxe Cake',            text: 'Blew everyone\'s minds at our anniversary dinner. The gold presentation was truly cinematic. Worth every rupee.' },
  { id: 3, name: 'Sneha Patel',   city: 'Bangalore', rating: 5, avatar: 'SP', cake: 'Unicorn Magic Cake',        text: 'My daughter was in tears of joy. Magical cake, perfect packaging, and on-time delivery!' },
  { id: 4, name: 'Rohit Kumar',   city: 'Hyderabad', rating: 5, avatar: 'RK', cake: 'Red Velvet Love Cake',      text: 'Ordered standard delivery — arrived perfectly on time. Impressive logistics and incredible taste!' },
  { id: 5, name: 'Ananya Singh',  city: 'Pune',      rating: 5, avatar: 'AS', cake: 'Marble Texture Cake',       text: 'My guests thought I got it from abroad. Stunning art, incredible flavour. The team is so talented.' },
  { id: 6, name: 'Vikram Nair',   city: 'Chennai',   rating: 5, avatar: 'VN', cake: 'Rainbow Birthday Cake',     text: 'Fed 15 office colleagues — everyone loved every bite. Premium packaging too. 10/10 experience.' },
];
