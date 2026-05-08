/**
 * CAKE IMAGE CATALOG — Auto-generated from local folder scan
 * Folder: d:\mamu\cake photos\{category}\{image.avif}
 *
 * NAME PROCESSING RULE:
 *   - Strip leading "p-"
 *   - Remove trailing numeric IDs (e.g. -274709-m, -360887-m)
 *   - Replace hyphens with spaces
 *   - Title-case the result
 *   - Remove weight/size suffixes like "200 Gm", "1 Kg", "Half Kg"
 */

/** Maps folder name → category id used in CakesData */
export const FOLDER_TO_CATEGORY = {
  chocolate:   'chocolate',
  desiner:     'designer',
  mango:       'mango',
  pineapple:   'pineapple',
  'red velvet':'red-velvet',
  truffle:     'truffle',
};

/** Maps folder name → display subcategory label */
export const FOLDER_TO_SUBCATEGORY = {
  chocolate:   'Chocolate Cakes',
  desiner:     'Designer Cakes',
  mango:       'Mango Cakes',
  pineapple:   'Pineapple Cakes',
  'red velvet':'Red Velvet Cakes',
  truffle:     'Truffle Cakes',
};

/** Maps folder name → emoji */
export const FOLDER_TO_EMOJI = {
  chocolate:   '🍫',
  desiner:     '✨',
  mango:       '🥭',
  pineapple:   '🍍',
  'red velvet':'❤️',
  truffle:     '🎂',
};

/**
 * Parse a raw filename into a clean product name.
 * "p-chocolate-truffle-cream-cake-361113-m.avif" → "Chocolate Truffle Cream Cake"
 */
export function parseImageName(filename) {
  let name = filename
    .replace(/\.[^/.]+$/, '')          // remove extension
    .replace(/^p-/, '')                // strip leading "p-"
    .replace(/-\d[\d-]*-m$/, '')       // strip trailing -361113-m or -200-gm--274709-m
    .replace(/-m$/, '')                // strip trailing -m
    .replace(/-+/g, ' ')              // hyphens → spaces
    .replace(/\s+\d+(\s+\d+)*\s*$/,'') // strip trailing numbers
    .replace(/\b(200|250|300|500|750|1|1\.5|2|2\.5|3|4|5|6|8)\s*(gm|g|kg)\b/gi, '') // strip weights
    .replace(/\bhalf\s+kg\b/gi, '')
    .replace(/\bpack\s+of\s+\d+\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Title case
  return name.replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Generate a URL slug from name.
 */
export function nameToSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Auto-generate placeholder product data for a new cake image.
 */
export function generateProduct(id, filename, folder) {
  const name      = parseImageName(filename);
  const category  = FOLDER_TO_CATEGORY[folder]  || 'chocolate';
  const subcat    = FOLDER_TO_SUBCATEGORY[folder]|| 'Specialty Cakes';
  const emoji     = FOLDER_TO_EMOJI[folder]      || '🎂';
  const imgPath   = `/cake-images/${folder}/${filename}`;
  const slug      = nameToSlug(name);

  // Assign tag based on name keywords
  let tag = 'NEW';
  if (/truffle|belgian|ganache/i.test(name))   tag = 'BESTSELLER';
  if (/velvet|romantic|love|anniversary/i.test(name)) tag = 'TRENDING';
  if (/premium|luxury|gold|ultimate/i.test(name)) tag = 'PREMIUM';
  if (/classic|old\s+school/i.test(name))       tag = 'CLASSIC';
  if (/delicious|delightful|loaded/i.test(name)) tag = 'POPULAR';

  // Auto price range based on category
  const basePrices = { chocolate:800, designer:1400, fruit:750, 'red-velvet':900, birthday:850 };
  const base       = basePrices[category] || 800;
  const price      = base + Math.floor(Math.random() * 200);
  const originalPrice = Math.round(price * 1.25 / 50) * 50;
  const discount   = Math.round(((originalPrice - price) / originalPrice) * 100);

  // Auto-tag occasions
  const occasions = [];
  const nameL = name.toLowerCase();

  // Direct Keyword Matching
  if (/birthday|bday/.test(nameL)) occasions.push('birthday');
  if (/anniversary/.test(nameL)) occasions.push('anniversary');
  if (/wedding|bride|groom/.test(nameL)) occasions.push('wedding');
  if (/engagement|ring/.test(nameL)) occasions.push('engagement');
  if (/graduation|grad/.test(nameL)) occasions.push('graduation');
  if (/baby|shower|boy|girl|kid/.test(nameL)) occasions.push('baby-shower');
  if (/love|romantic|heart|valentine|rose/.test(nameL)) occasions.push('romantic');
  if (/congrats|congratulations|success/.test(nameL)) occasions.push('congratulations');
  if (/farewell|goodbye/.test(nameL)) occasions.push('farewell');
  if (/festival|diwali|christmas|holi/.test(nameL)) occasions.push('festival');

  // Intelligent Category Mixing
  if (category === 'designer') {
    if (!occasions.includes('birthday')) occasions.push('birthday');
    if (/floral|tier|elegant|fondant/i.test(nameL)) {
      if (!occasions.includes('wedding')) occasions.push('wedding');
      if (!occasions.includes('engagement')) occasions.push('engagement');
      if (!occasions.includes('anniversary')) occasions.push('anniversary');
    }
  }

  if (category === 'red-velvet' || /truffle/.test(nameL)) {
    if (!occasions.includes('romantic')) occasions.push('romantic');
    if (!occasions.includes('anniversary')) occasions.push('anniversary');
  }

  if (category === 'chocolate' && !occasions.includes('birthday')) {
    occasions.push('birthday');
  }

  if (category === 'fruit' || category === 'mango' || category === 'pineapple') {
    if (!occasions.includes('festival')) occasions.push('festival');
    if (!occasions.includes('congratulations')) occasions.push('congratulations');
  }

  // Ensure every cake has at least one occasion
  if (occasions.length === 0) occasions.push('birthday', 'congratulations');

  return {
    id,
    category,
    subcategory: subcat,
    name,
    subtitle:    `${subcat} · Freshly Baked`,
    price,
    originalPrice,
    discount,
    rating:      4.5 + Math.round(Math.random() * 4) / 10,
    reviews:     200 + Math.floor(Math.random() * 1800),
    deliveryTime:'2 hrs',
    emoji,
    image:       imgPath,
    tag,
    slug,
    occasions,
    weights:     ['500g','1Kg','1.5Kg','2Kg'],
    serves:      '6–8',
    flavor:      subcat.replace(' Cakes',''),
    desc:        `A premium ${name.toLowerCase()} crafted with the finest ingredients. Freshly baked to order and delivered to your doorstep.`,
    ingredients: 'Premium Flour, Fresh Cream, Sugar, Butter, Natural Flavors',
    allergens:   'Gluten, Dairy, Eggs',
    storage:     'Refrigerate. Best within 2 days.',
    source:      'imported',
  };
}

/**
 * RAW IMAGE CATALOG — folder → [filename, ...]
 * Generated from: d:\mamu\cake photos\
 */
export const IMAGE_CATALOG = {
  chocolate: [
    'p-almond-drizzle-truffle-cake-200-gm--274709-m.avif',
    'p-authentic-choco-cream-anniversary-cake-443412-m.avif',
    'p-belgian-bliss-couverture-cake-418424-m.avif',
    'p-choco-berry-almond-cake-360896-m.avif',
    'p-choco-craze-fudge-cake-270016-m.avif',
    'p-choco-dream-truffle-cake-347290-m.avif',
    'p-choco-swirls-cake-361182-m.avif',
    'p-chocolate-and-vanilla-cupcakes-pack-of-6--135335-m.avif',
    'p-chocolate-chips-and-cherry-cake-360905-m.avif',
    'p-chocolate-hazelnut-crunch-cake-361115-m.avif',
    'p-chocolate-heart-truffle-cake-360903-m.avif',
    'p-chocolate-heaven-cake-223420-m.avif',
    'p-chocolate-noir-gateau-361085-m.avif',
    'p-chocolate-paradise-cake-269999-m.avif',
    'p-chocolate-supreme-cake-436727-m.avif',
    'p-chocolate-temptations-cake-223404-m.avif',
    'p-chocolate-truffle-cream-cake-361113-m.avif',
    'p-dapper-suit-chocolate-cake-414402-m.avif',
    'p-decadent-chocolate-truffle-cake-361084-m.avif',
    'p-decadent-dark-chocolate-cake-269995-m.avif',
    'p-delectable-chocolate-cream-cake-192845-m.avif',
    'p-delicious-black-forest-cake-190858-m.avif',
    'p-delightful-chocolate-cake-190813-m.avif',
    'p-elegant-bows-mini-cake-396318-m.avif',
    'p-floral-treat-pineapple-cake-200-gm--274706-m.avif',
    'p-gooey-chocolate-cake-361122-m.avif',
    'p-hazelnut-fantasy-chocolate-cake-299246-m.avif',
    'p-loaded-choco-chip-truffle-cake-265855-m.avif',
    'p-luscious-ganache-nutella-cake-half-kg--270011-m.avif',
    'p-midnight-truffle-magic-chocolate-cake-270013-m.avif',
    'p-nutty-chocolate-delight-cake-392402-m.avif',
    'p-ombre-chocolate-cake-433730-m.avif',
    'p-pearly-indulgence-chocolate-cake-200-gm--274712-m.avif',
    'p-pink-piggy-cake-192819-m.avif',
    'p-rosette-splendor-chocolate-mini-cake-281110-m.avif',
    'p-whimsical-bunny-pastel-cake-407975-m.avif',
  ],
  desiner: [
    'p-3-tier-rosette-fondant-cake-8-kg--112712-m.avif',
    'p-batman-bonanza-fondant-cake-1-kg--285310-m.avif',
    'p-beary-delight-semi-fondant-cake-1-kg--273923-m.avif',
    'p-beer-mug-cake-1-kg--192863-m.avif',
    'p-black-and-white-teddy-bear-cake--192822-m.avif',
    'p-chocolate-pinata-ball-cake-for-birthday-750-grams--146281-m.avif',
    'p-cloud-and-rainbow-cake-1kg--424297-m.avif',
    'p-cricket-field-semi-fondant-cake-1-kg--141380-m.avif',
    'p-cricket-theme-cake-1-kg--192834-m.avif',
    'p-decorative-and-delicious-cake-1-5-kg--188716-m.avif',
    'p-delicious-bow-cake-600-g--418427-m.avif',
    'p-delicious-lion-face-cake-1-kg--191651-m.avif',
    'p-floral-garden-fondant-cake-6-kg--112709-m.avif',
    'p-frozen-inspired-snowman-cake-424411-m.avif',
    'p-fruits-fondant-cake-4-kg--113028-m.avif',
    'p-graduation-hat-fondant-cake-2-5-kg--111355-m.avif',
    'p-half-birthday-unicorn-celebration-cake-424414-m.avif',
    'p-half-year-baby-boy-birthday-cake-146241-m.avif',
    'p-half-year-birthday-cake-for-boy-146559-m.avif',
    'p-half-year-crown-themed-designer-cake-1-5-kg--139994-m.avif',
    'p-half-year-unicorn-themed-cake-1-kg--141378-m.avif',
    'p-happy-birthday-personalized-photo-cake-2-kg--271625-m.avif',
    'p-hearts-and-pearls-personalized-photo-cake-271630-m.avif',
    'p-hearty-paradise-semi-fondant-cake-272622-m.avif',
    'p-ipl-2020-fan-fondant-cake-5-kg--120538-m.avif',
    'p-lil-prince-half-year-birthday-cake-1-5-kg--146567-m.avif',
    'p-lion-jungle-cake-1-kg--192825-m.avif',
    'p-little-princess-semi-fondant-birthday-cake-3-kg--268727-m.avif',
    'p-magnificent-and-vibrant-rainbow-cake-1-5-kg--189016-m.avif',
    'p-makeup-theme-cake-750-gm--192837-m.avif',
    'p-minion-madness-fondant-cake-1-kg--285312-m.avif',
    'p-moon-and-stars-cake-1-kg--192458-m.avif',
    'p-music-theme-cake-192857-m.avif',
    'p-not-out-cricket-field-birthday-fondant-cake-3-5-kg--120540-m.avif',
    'p-personalized-semi-fondant-cake-271632-m.avif',
    'p-pink-blossom-unicorn-cake-1-5-kg--140949-m.avif',
    'p-pink-piggy-cake-192819-m.avif',
    'p-pink-silver-striped-fondant-cake-2-kg--122870-m.avif',
    'p-purple-butterfly-celebration-cake-1kg--424304-m.avif',
    'p-rainbow-unicorn-half-year-birthday-cake-1-5-kg--149561-m.avif',
    'p-rose-hearts-cake-199613-m.avif',
    'p-rosy-fantasy-personalized-photo-cake-271628-m.avif',
    'p-snowman-semi-fondant-cake-197283-m.avif',
    'p-snowy-white-delicious-graduation-cake-1-kg--190841-m.avif',
    'p-soft-and-creamy-photo-cake-196955-m.avif',
    'p-sparkling-celebration-cream-cake-271465-m.avif',
    'p-spidey-sensation-fondant-cake-1-kg--285303-m.avif',
    'p-sunshine-smiles-half-birthday-cake-half-kg--424531-m.avif',
    'p-superhero-cake-1-kg--192817-m.avif',
    'p-superhero-themed-semifondant-cake-1-kg-303899-m.avif',
    'p-teddy-bear-blue-half-year-birthday-cake-1-5-kg--146561-m.avif',
    'p-teddy-bear-cream-cake-192831-m.avif',
    'p-tiny-petals-lilac-cake-361100-m.avif',
    'p-underwater-cake-1-kg--196913-m.avif',
    'p-whimsical-animal-themed-cake-1-kg--303898-m.avif',
    'p-whimsical-bunny-pastel-cake-407975-m.avif',
  ],
  mango: [
    'p-choco-mango-fusion-cake-410401-m.avif',
    'p-delicious-mango-cake-114268-m.avif',
    'p-exotic-mango-cake-135341-m.avif',
    'p-fresh-cream-mango-cake-410530-m.avif',
    'p-mango-bliss-bento-cake-449766-m.avif',
    'p-mango-bliss-cake-281117-m.avif',
    'p-mango-lovers-delight-206179-m.avif',
    'p-mango-magic-cream-cake-for-mom-half-kg-177676-m.avif',
    'p-mango-tango-cake-half-kg--206183-m.avif',
    'p-premium-mango-cake-135608-m.avif',
    'p-white-summer-mango-harvest-cake-177673-m.avif',
  ],
  pineapple: [
    'p-creamy-pineapple-dream-cake-361090-m.avif',
    'p-exotic-pineapple-cake-403845-m.avif',
    'p-floral-treat-pineapple-cake-200-gm--274706-m.avif',
    'p-frozen-inspired-snowman-cake-424411-m.avif',
    'p-old-school-pineapple-cake-436669-m.avif',
    'p-personalized-semi-fondant-cake-271632-m.avif',
    'p-pineapple-cream-pastry-set-of-6--195606-m.avif',
    'p-tropical-pineapple-swirl-cream-cake-427470-m.avif',
  ],
  'red velvet': [
    'p-blissful-red-velvet-cake-395415-m.avif',
    'p-chocolate-kiss-red-velvet-cake-750-gm--431510-m.avif',
    'p-chocolate-love-red-velvet-cake-250-gm--431516-m.avif',
    'p-classic-red-velvet-cake-109230-m.avif',
    'p-classic-red-velvet-love-cake-431513-m.avif',
    'p-cocoa-blush-red-velvet-cake-300-gm--431511-m.avif',
    'p-crimson-love-anniversary-red-velvet-cake-431689-m.avif',
    'p-delicious-heart-red-velvet-cake-300-gm--431505-m.avif',
    'p-good-old-red-velvet-cake-436899-m.avif',
    'p-heart-shaped-red-velvet-cake-360797-m.avif',
    'p-heartfelt-red-velvet-cake-250-gm--431509-m.avif',
    'p-love-you-bliss-cake-395375-m.avif',
    'p-love-you-forever-cake-395935-m.avif',
    'p-monochrome-love-personalized-photo-cake-431911-m.avif',
    'p-playful-love-fondant-cake-360904-m.avif',
    'p-red-heart-drip-designer-cake-431515-m.avif',
    'p-red-velvet-cake-with-rosette-cream-431676-m.avif',
    'p-red-velvet-legacy-431498-m.avif',
    'p-red-velvet-romance-cake-361108-m.avif',
    'p-romantic-heartbeat-red-velvet-photo-cake-431912-m.avif',
    'p-rose-hearts-cake-199613-m.avif',
    'p-sweet-anniversary-personalized-red-velvet-cake-431914-m.avif',
    'p-sweet-harmony-anniversary-red-velvet-cake-431679-m.avif',
    'p-sweet-hearts-delight-cake-360893-m.avif',
    'p-sweet-swirl-red-velvet-cake-431496-m.avif',
    'p-timeless-red-velvet-mini-cake-281114-m.avif',
    'p-velvet-ribbon-festive-cake-434328-m.avif',
  ],
  truffle: [
    'p-almond-drizzle-truffle-cake-200-gm--274709-m.avif',
    'p-anniversary-truffle-indulgence-cake-441191-m.avif',
    'p-belgium-truffle-cake-436663-m.avif',
    'p-choco-chip-truffle-cake-360887-m.avif',
    'p-choco-cream-delight-cake-361112-m.avif',
    'p-choco-dream-truffle-cake-347290-m.avif',
    'p-chocolate-heaven-cake-223420-m.avif',
    'p-chocolate-temptations-cake-223404-m.avif',
    'p-decadent-chocolate-truffle-cake-436660-m.avif',
    'p-delicious-and-decadent-chocolate-truffle-cake-188661-m.avif',
    'p-delightful-chocolate-cake-190813-m.avif',
    'p-dutch-truffle-cake-436657-m.avif',
    'p-gooey-chocolate-cake-361122-m.avif',
    'p-loaded-choco-chip-truffle-cake-265855-m.avif',
    'p-nutty-chocolate-delight-cake-392402-m.avif',
    'p-truffle-decadence-birthday-cake-276158-m.avif',
    'p-truffle-delight-anniversary-cake-276245-m.avif',
    'p-ultimate-chocolate-truffle-symphony-250-g--272463-m.avif',
  ],
};

/**
 * Build the full imported product list from IMAGE_CATALOG.
 * Deduplicates by normalized name.
 */
export function buildImportedCakes(startId = 100) {
  const seen  = new Map(); // normalizedName → product
  let   id    = startId;

  for (const [folder, files] of Object.entries(IMAGE_CATALOG)) {
    for (const filename of files) {
      const name    = parseImageName(filename);
      const normKey = name.toLowerCase().replace(/\s+/g, ' ').trim();

      if (seen.has(normKey)) {
        // Already added — just update image if first occurrence had different folder
        continue;
      }

      seen.set(normKey, generateProduct(id++, filename, folder));
    }
  }

  return Array.from(seen.values());
}
