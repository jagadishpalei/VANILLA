/**
 * VANILLA CRAFTED CAKES — ID GENERATION SYSTEM
 *
 * CAKE ID  : VCC-{CAT}-{4-digit-seq}  e.g. VCC-CHO-0001
 * ORDER ID : VC-ORD-{YEAR}-{5-digit-seq}  e.g. VC-ORD-2026-00035
 */

/* ─── Category prefix map ─────────────────────────── */
export const CATEGORY_PREFIX = {
  chocolate:    'CHO',
  'red-velvet': 'RDV',
  designer:     'DES',
  truffle:      'TRF',
  fruit:        'FRT',
  mango:        'MNG',
  pineapple:    'PIN',
  vanilla:      'VAN',
  wedding:      'WED',
  anniversary:  'ANN',
  birthday:     'BIR',
  'baby-shower':'BSH',
  bento:        'BEN',
  seasonal:     'SEA',
  cheesecake:   'CHZ',
};

export function getCategoryPrefix(category = '') {
  return CATEGORY_PREFIX[category.toLowerCase()] || 'CAK';
}

/**
 * Build a Cake ID from category + sequence number.
 * VCC-CHO-0001
 */
export function buildCakeId(category, seq) {
  const prefix = getCategoryPrefix(category);
  return `VCC-${prefix}-${String(seq).padStart(4, '0')}`;
}

/**
 * Generate the next Cake ID for a new cake being added by admin.
 * Uses localStorage to persist counter per category.
 */
export function nextCakeId(category) {
  const key = `vcc_cake_seq_${(category || 'cak').toLowerCase()}`;
  const n   = parseInt(localStorage.getItem(key) || '0') + 1;
  localStorage.setItem(key, String(n));
  return buildCakeId(category, n);
}

/**
 * Generate a unique Order ID.
 * VC-ORD-2026-00035
 * Uses localStorage to persist a global sequential counter.
 */
export function generateOrderId() {
  const year = new Date().getFullYear();
  const key  = `vcc_order_seq_${year}`;
  const n    = parseInt(localStorage.getItem(key) || '0') + 1;
  localStorage.setItem(key, String(n));
  return `VC-ORD-${year}-${String(n).padStart(5, '0')}`;
}

/**
 * Given a list of existing cakes of a category, return the next seq number.
 * Used to assign IDs to imported/curated cakes deterministically.
 */
export function assignCakeIds(cakes) {
  const counters = {};
  return cakes.map(cake => {
    if (cake.cakeId) return cake; // already has one
    const prefix = getCategoryPrefix(cake.category);
    counters[prefix] = (counters[prefix] || 0) + 1;
    return { ...cake, cakeId: buildCakeId(cake.category, counters[prefix]) };
  });
}
