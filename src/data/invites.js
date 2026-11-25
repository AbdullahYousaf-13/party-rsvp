const svgToDataUri = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;

export const FALLBACK_PORTRAIT_SVG = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <rect width="400" height="500" fill="#3B0A16"/>
  <rect x="18" y="18" width="364" height="464" rx="182" fill="none" stroke="#DFC286" stroke-width="1.5"/>
  <text x="200" y="255" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="38" fill="#DFC286">Sophia · 30</text>
</svg>
`);

export const FALLBACK_ATTIRE_SVG = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 440">
  <rect width="360" height="440" fill="#2A060F"/>
  <rect x="16" y="16" width="328" height="408" fill="none" stroke="#DFC286" stroke-width="1.2"/>
  <text x="180" y="225" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="26" fill="#FAF6F0">Midnight Velvet</text>
</svg>
`);

export const invites = {
  'sophia-30': {
    slug: 'sophia-30',
    honoree: 'Sophia Laurent',
    shortName: 'Sophia',
    monogram: 'S',
    age: '30',
    milestone: '30th Birthday Soirée',
    headline: 'Cheers to 30',
    subheadline: 'An evening of candlelight, vinyl grooves, and midnight toasts',
    hostLine: 'Hosted with love by Julian & Elena Laurent',
    rsvpDeadline: 'December 5, 2026',

    // ISO 8601 timestamps with timezone offset for accurate countdown & calendar export
    eventStartIso: '2026-12-19T20:00:00-05:00',
    eventEndIso: '2026-12-20T01:00:00-05:00',
    displayDate: 'Saturday, December 19, 2026',
    displayTime: '8:00 PM — 1:00 AM',

    venue: {
      name: 'The Crimson Conservatory',
      room: 'Velvet Mezzanine & Rooftop Salon',
      address: '418 Mercer Street, Penthouse B, New York, NY 10013',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=418+Mercer+Street+New+York+NY+10013',
      neighborhoodNote: 'Complimentary valet available at the Mercer Street porte-cochère.',
    },

    dressCode: {
      title: 'Midnight Velvet & Champagne Glam',
      subtitle: 'Black Tie Optional · Festive Evening Attire',
      description:
        'Think crushed velvet, satin slip silhouettes, tailored dinner jackets, deep burgundy, espresso, or shimmering champagne gold.',
      palette: [
        { name: 'Deep Burgundy', hex: '#3B0A16' },
        { name: 'Velvet Crimson', hex: '#6E1226' },
        { name: 'Champagne Gold', hex: '#DFC286' },
        { name: 'Warm Ivory', hex: '#FAF6F0' },
      ],
    },

    portrait: {
      src: '/images/host-portrait',
      fallbackSrc: FALLBACK_PORTRAIT_SVG,
      alt: 'Sophia Laurent portrait badge',
      objectPosition: '50% 20%',
    },

    heroPortrait: {
      src: '/images/hero-portrait',
      fallbackSrc: FALLBACK_PORTRAIT_SVG,
      alt: 'Sophia Laurent 30th birthday spotlight portrait',
      caption: 'Cheers to three decades of curiosity, late-night laughter, and golden hours.',
      objectPosition: '50% 15%',
    },

    attirePhotos: [
      {
        id: 'attire-1',
        src: '/images/gallery-1',
        fallbackSrc: FALLBACK_ATTIRE_SVG,
        alt: 'Velvet and satin evening attire inspiration',
        caption: 'Velvet & Satin',
        tiltClass: 'tilt-left',
        objectPosition: '50% 18%',
      },
      {
        id: 'attire-2',
        src: '/images/gallery-2',
        fallbackSrc: FALLBACK_ATTIRE_SVG,
        alt: 'Tailored dinner jacket inspiration',
        caption: 'Tailored Evening',
        tiltClass: 'tilt-center',
        objectPosition: '50% 18%',
      },
      {
        id: 'attire-3',
        src: '/images/gallery-3',
        fallbackSrc: FALLBACK_ATTIRE_SVG,
        alt: 'Champagne gold accessories inspiration',
        caption: 'Champagne Glam',
        tiltClass: 'tilt-right',
        objectPosition: 'center',
      },
    ],

    schedule: [
      {
        time: '8:00 PM',
        title: 'Champagne Tower & Arrivals',
        detail: 'Welcome coupe & acoustic vinyl set',
      },
      {
        time: '9:15 PM',
        title: 'Candlelight Grazing & Toasts',
        detail: 'Artisanal hors d’oeuvres & speeches',
      },
      {
        time: '10:30 PM',
        title: 'Midnight Velvet Dance Floor',
        detail: 'Live DJ spinning disco, soul & house',
      },
      {
        time: '12:00 AM',
        title: 'Espresso Martinis & Cake',
        detail: 'Late-night sweets & polaroid keepsakes',
      },
    ],

    guestNotes: [
      {
        title: 'Arrival & Valet',
        body: 'Doors open promptly at 8:00 PM. Ring the Conservatory brass bell for private elevator access to the mezzanine.',
      },
      {
        title: 'Plus-Ones & Seating',
        body: 'This is an intimate 21+ cocktail reception with lounge seating. Please note your guest count in the RSVP card below.',
      },
      {
        title: 'Dietary Care',
        body: 'Our chef is preparing gluten-free, vegetarian, and zero-proof botanical pairings. Share any allergies when you RSVP.',
      },
    ],

    wishlist: [
      {
        title: 'Your Presence & A Handwritten Note',
        category: 'Most Cherished',
        note: 'No gifts are expected—bringing your favorite memory of us on a card means the world.',
      },
      {
        title: 'Vintage Vinyl Pressing',
        category: 'Music',
        note: 'A classic soul, jazz, or French house record to add to Sophia’s living room collection.',
      },
      {
        title: 'Kyoto Spring Fund',
        category: 'Experience',
        note: 'Contributions toward Sophia’s 30th-year solo art & tea pilgrimage to Kyoto.',
      },
      {
        title: 'Grower Champagne',
        category: 'Cellar',
        note: 'A bottle of blanc de blancs to pop on future Sunday dinners together.',
      },
    ],
    // Optional external registry/wishlist URL; "#wishlist-panel" toggles the built-in wishlist drawer
    wishlistUrl: '#wishlist-panel',

    // Soundtrack: drop a local file at public/audio/soundtrack.mp3 or use the external playlist link
    soundtrack: {
      title: 'Midnight Champagne Groove',
      artist: 'Sophia’s 30th Evening Mix',
      audioSrc: '/audio/soundtrack.mp3',
      playlistUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
      note: 'Tap play for the evening soundtrack or open the full playlist.',
    },

    // Leave rsvpWebhookUrl empty ("") or placeholder for simulated demo mode;
    // paste your deployed Google Apps Script Web App URL for live Google Sheets submissions.
    rsvpWebhookUrl:
      'https://script.google.com/macros/s/AKfycbxwLqHRWfaYIwH4IDtXCZvBh2HQ2-ENvGWicESJfuzGiaglVewOjxEqMAYphcXZzDvW3w/exec',
    rsvpSheetId: 'YOUR_GOOGLE_SHEET_ID',
    rsvpSheetTab: 'RSVPs',
  },
};

export function getInviteBySlug(slug) {
  if (!slug) return null;
  return invites[slug] || null;
}
