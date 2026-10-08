# Sehrish Guest House — Pure HTML / CSS / JavaScript

A premium quiet-luxury concept for Sehrish Guest House, Skardu.

## Files

- `index.html` — complete semantic page
- `style.css` — responsive design system, animation and layout
- `script.js` — navigation, loader, enquiry sheet, gallery lightbox, copy actions, reveal animations and progressive enhancement

No React, Tailwind, Bootstrap, GSAP, Lenis or other frontend framework is used.

## Run

Open `index.html` directly in a browser, or use VS Code Live Server.

## Important content honesty

The supplied brief confirms the guest house name, category, Aliabad/Skardu location, postal code, phone, Google rating, review count and Plus Code. Room types, prices, amenities, authentic property photography, WhatsApp availability and booking platform were not confirmed.

Property image areas therefore say **Photograph coming soon**. The visual landscape areas are atmospheric destination placeholders and should be replaced with properly licensed/credited Skardu photographs before production.

## WhatsApp

In `script.js`:

```js
const CONFIG = {
  whatsappEnabled: false
};
```

Keep this `false` until the owner confirms that the listed phone number is WhatsApp-enabled. A WhatsApp action can then be added using the confirmed number.

## Booking

There is no fake availability system and no payment flow. The availability form opens an enquiry sheet with selected dates and guests, plus Call and Copy enquiry actions.

Set `CONFIG.bookingUrl` only when a real external booking platform exists.

## Real rooms

When room data is confirmed, replace the placeholder room card with actual room names, capacity, bed type, amenities, prices and authentic photos. Do not display invented data.

## Deploy

This is a static site. It can be deployed to Netlify, Vercel or GitHub Pages by uploading the three files.

## Design rationale

The design uses deep forest, warm ivory, stone, sage and restrained sand accents. Cormorant Garamond creates an editorial travel-journal voice while Manrope keeps navigation and utility text precise. Large type, generous whitespace, subtle contour motifs and slow CSS motion create the requested quiet-luxury feeling without relying on flashy effects or false property claims.

## Client content needed

- Authentic exterior and interior photographs
- Confirmed room list
- Room capacity / bed types
- Confirmed amenities
- Prices and currency
- WhatsApp confirmation
- Booking platform URL, if available
- Exact coordinates, if desired
- Guest-house policies
- Official Google review URL
