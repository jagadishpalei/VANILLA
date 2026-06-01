import React, { createContext, useContext, useState } from 'react';

/* Shared offer-banner context — accessible by both:
   - CakesHome (customer-facing homepage)
   - AdminOffers (admin panel upload page)
   Both live inside <BannerProvider> in CakesApp.jsx
*/
const BannerCtx = createContext(null);
export const useBanner = () => useContext(BannerCtx);

const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

/* ── Default fallback banner (shown until admin uploads their own) ── */
export const DEFAULT_BANNER = {
  id: 'BAN-DEFAULT',
  image: '/cake-images/hero/offer-banner-default.png',
  title: 'Celebrate Every Occasion — Vanilla Crafted Cakes',
  isDefault: true,   // flag so AdminOffers knows this isn't an uploaded banner
};

export function BannerProvider({ children }) {
  const [offerBanner, setOfferBanner] = useState(null);
  // null  = no admin-uploaded banner
  // object = { id, image, title, active, createdAt, updatedAt }

  const uploadBanner = (image, title = '') =>
    setOfferBanner({
      id: 'BAN-' + uid(),
      image,
      title,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

  const toggleBanner = () =>
    setOfferBanner(b =>
      b ? { ...b, active: !b.active, updatedAt: new Date().toISOString() } : b
    );

  const deleteBanner = () => setOfferBanner(null);

  /* Admin-uploaded banner when active */
  const activeBanner = offerBanner?.active ? offerBanner : null;

  /* What the homepage displays:
     - Uploaded + active admin banner → show it
     - Otherwise                      → show default fallback
  */
  const displayBanner = activeBanner ?? DEFAULT_BANNER;

  return (
    <BannerCtx.Provider value={{
      offerBanner, activeBanner, displayBanner,
      uploadBanner, toggleBanner, deleteBanner,
    }}>
      {children}
    </BannerCtx.Provider>
  );
}

