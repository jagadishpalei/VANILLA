import React, { createContext, useContext, useState } from 'react';

/* Shared offer-banner context — accessible by both:
   - CakesHome (customer-facing homepage)
   - AdminOffers (admin panel upload page)
   Both live inside <BannerProvider> in CakesApp.jsx
*/
const BannerCtx = createContext(null);
export const useBanner = () => useContext(BannerCtx);

const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

export function BannerProvider({ children }) {
  const [offerBanner, setOfferBanner] = useState(null);
  // null  = no banner active
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

  /* Only non-null when active=true */
  const activeBanner = offerBanner?.active ? offerBanner : null;

  return (
    <BannerCtx.Provider value={{ offerBanner, activeBanner, uploadBanner, toggleBanner, deleteBanner }}>
      {children}
    </BannerCtx.Provider>
  );
}
