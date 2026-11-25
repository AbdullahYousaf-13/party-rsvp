# Midnight Velvet & Champagne Glam — Party RSVP Template

A mobile-first Vite + React digital invitation and RSVP template featuring an interactive wax-seal envelope reveal, live countdown, vinyl soundtrack player, tilted polaroid attire gallery, calendar export (`.ics` + Google Calendar), and Google Sheets RSVP integration.

---

## 1. Replace the 5 Generic Images (`public/images/`)

Drop your customer's 5 photos into `public/images/` using these exact base names (any format works: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, or `.svg`—no code edits needed):

| Base Filename | Used For | Recommended Framing |
| --- | --- | --- |
| `host-portrait` | Circular badge above the envelope | Face-to-chest portrait |
| `hero-portrait` | Main spotlight card (`3:4` portrait) | Full or three-quarter portrait |
| `gallery-1` | First tilted polaroid card | Portrait (`3:4`) |
| `gallery-2` | Second tilted polaroid card | Portrait (`3:4`) |
| `gallery-3` | Third tilted polaroid card | Portrait (`3:4`) |

If any file is missing, `SmartImage` renders an inline burgundy & gold SVG fallback with zero broken images.

### Optional Local Soundtrack (`public/audio/soundtrack.mp3`)
Drop an MP3 file at `public/audio/soundtrack.mp3` to play a local track from the vinyl player. If no MP3 is present, the player falls back cleanly to an ambient Web Audio lounge preview and the external `playlistUrl` link.

---

## 2. Customize Event Details (`src/data/invites.js`)

Open `src/data/invites.js` and edit the `sophia-30` entry (or add a new slug key, e.g. `/i/alex-40`):

- **Host & Milestone**: `honoree`, `shortName`, `monogram`, `age`, `milestone`, `headline`, `subheadline`, `hostLine`
- **Event Date & Countdown**: `eventStartIso`, `eventEndIso` (ISO 8601 with timezone offset, e.g. `2026-12-19T20:00:00-05:00`), `displayDate`, `displayTime`, `rsvpDeadline`
- **Venue**: `venue.name`, `venue.room`, `venue.address`, `venue.mapsUrl`, `venue.neighborhoodNote`
- **Dress Code & Polaroids**: `dressCode` palette/copy and `attirePhotos` captions + `objectPosition` (`"50% 18%"` for people, `"center"` for objects)
- **Wishlist & Soundtrack**: `wishlist`, `wishlistUrl`, `soundtrack.audioSrc`, `soundtrack.playlistUrl`
- **RSVP Backend**: `rsvpWebhookUrl`, `rsvpSheetId`, `rsvpSheetTab`

> **Note:** When `rsvpWebhookUrl` is empty (`""`) or a placeholder, the RSVP form automatically runs in **Preview Mode** and shows a realistic confirmation summary while logging the payload to the browser console.

---

## 3. Deploy Google Sheets RSVP Webhook (`apps-script/Code.gs`)

1. Create a Google Sheet for your RSVPs and copy its Sheet ID from the URL (`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`).
2. In the Google Sheet, open **Extensions → Apps Script**.
3. Replace the contents of `Code.gs` with [apps-script/Code.gs](apps-script/Code.gs).
4. Click **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the generated **Web App URL** and paste it into `rsvpWebhookUrl` (along with your `rsvpSheetId`) in `src/data/invites.js`.

---

## 4. Local Development & Build

```bash
npm install
npm run dev      # Local preview
npm run build    # Production bundle in dist/
```
