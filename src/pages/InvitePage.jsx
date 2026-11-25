import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Gift,
  MapPin,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { getInviteBySlug } from '../data/invites';
import { buildGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import EnvelopeCover from '../components/EnvelopeCover';
import CountdownSection from '../components/CountdownSection';
import SoundtrackSection from '../components/SoundtrackSection';
import RsvpSection from '../components/RsvpSection';
import SmartImage from '../components/SmartImage';

function FiligreeCorners() {
  return (
    <>
      <span className="filigree-corner top-left" aria-hidden="true" />
      <span className="filigree-corner top-right" aria-hidden="true" />
      <span className="filigree-corner bottom-left" aria-hidden="true" />
      <span className="filigree-corner bottom-right" aria-hidden="true" />
    </>
  );
}

export default function InvitePage() {
  const { slug } = useParams();
  const invite = getInviteBySlug(slug);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const detailsRef = useRef(null);

  if (!invite) {
    return (
      <main className="not-found-shell">
        <section className="ivory-card filigree-card not-found-card" aria-labelledby="not-found-heading">
          <FiligreeCorners />
          <span className="not-found-code">Invitation Not Found</span>
          <h1 id="not-found-heading" className="section-title">
            We Couldn&rsquo;t Find That Seal
          </h1>
          <p className="section-lead">
            The invitation link <code>/i/{slug}</code> isn&rsquo;t on our guest list. Check the
            spelling of your link or head to Sophia&rsquo;s 30th birthday soirée.
          </p>
          <div className="action-row">
            <Link to="/i/sophia-30" className="btn-burgundy">
              <Sparkles size={15} aria-hidden="true" />
              <span>Open Sophia&rsquo;s 30th Invite</span>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const handleToggleEnvelope = () => {
    setEnvelopeOpen((prev) => !prev);
  };

  const googleCalendarUrl = buildGoogleCalendarUrl(invite);

  return (
    <main className={`invite-page ${envelopeOpen ? 'is-revealed' : 'is-sealed'}`}>
      <EnvelopeCover invite={invite} isOpen={envelopeOpen} onToggle={handleToggleEnvelope} />

      {envelopeOpen && (
        <>
          <div id="invitation-details" ref={detailsRef} className="invite-content reveal-enter">
            {/* Main Invitation Header, Portrait Spotlight & Filigree Framing */}
            <section className="ivory-card filigree-card" aria-labelledby="welcome-heading">
              <FiligreeCorners />
              <div className="lace-inner-frame">
                <div className="section-header">
                  <span className="section-kicker">{invite.milestone}</span>
                  <h2 id="welcome-heading" className="main-cheers-heading">
                    <span className="script-cheers-dark">Cheers to</span>{' '}
                    <span className="cheers-numeral">{invite.age}</span>
                  </h2>
                  <p className="honoree-subtitle">{invite.honoree}</p>
                </div>

                <div className="portrait-grid">
                  <div className="portrait-frame">
                    <SmartImage
                      src={invite.heroPortrait.src}
                      fallbackSrc={invite.heroPortrait.fallbackSrc}
                      alt={invite.heroPortrait.alt}
                      style={{ objectPosition: invite.heroPortrait.objectPosition || '50% 15%' }}
                    />
                  </div>
                  <div className="portrait-copy">
                    <p className="section-lead">{invite.subheadline}</p>
                    <p className="section-lead">{invite.heroPortrait.caption}</p>
                    <p className="host-line">{invite.hostLine}</p>
                  </div>
                </div>

                <div className="details-grid spotlight-details">
                  <div className="detail-tile">
                    <div className="detail-icon">
                      <CalendarDays size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h3>{invite.displayDate}</h3>
                      <p>{invite.displayTime}</p>
                      <p>Kindly RSVP by {invite.rsvpDeadline}</p>
                    </div>
                  </div>

                  <div className="detail-tile">
                    <div className="detail-icon">
                      <MapPin size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h3>{invite.venue.name}</h3>
                      <p>{invite.venue.room}</p>
                      <p>{invite.venue.address}</p>
                    </div>
                  </div>
                </div>

                <div className="action-row">
                  <a
                    href={invite.venue.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-burgundy"
                  >
                    <MapPin size={15} aria-hidden="true" />
                    <span>Open Venue in Maps</span>
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </section>

            {/* Music / Soundtrack */}
            <SoundtrackSection soundtrack={invite.soundtrack} />

            {/* Live Countdown */}
            <CountdownSection targetIso={invite.eventStartIso} displayDate={invite.displayDate} />

            {/* Attire Section with Tilted Polaroid Cluster */}
            <section className="velvet-card filigree-card-dark" aria-labelledby="dresscode-heading">
              <div className="section-header light">
                <span className="section-kicker gold">
                  <Shirt size={13} aria-hidden="true" />
                  <span>Attire</span>
                </span>
                <h2 id="dresscode-heading" className="section-title light">
                  {invite.dressCode.title}
                </h2>
                <p className="section-lead light">
                  <strong>{invite.dressCode.subtitle}</strong> — {invite.dressCode.description}
                </p>
              </div>

              <div className="swatch-row" aria-label="Suggested color palette">
                {invite.dressCode.palette.map((color) => (
                  <span key={color.name} className="swatch-chip dark">
                    <span className="swatch-dot" style={{ backgroundColor: color.hex }} />
                    <span>{color.name}</span>
                  </span>
                ))}
              </div>

              <div className="polaroid-cluster">
                {invite.attirePhotos.map((photo) => (
                  <figure key={photo.id} className={`polaroid-card ${photo.tiltClass}`}>
                    <div className="polaroid-media">
                      <SmartImage
                        src={photo.src}
                        fallbackSrc={photo.fallbackSrc}
                        alt={photo.alt}
                        style={{ objectPosition: photo.objectPosition || '50% 18%' }}
                      />
                    </div>
                    <figcaption className="polaroid-caption">{photo.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            {/* Details Section: Gifts & Wishes, Guests Note, What to Expect */}
            <section className="ivory-card filigree-card" aria-labelledby="evening-details-heading">
              <FiligreeCorners />
              <div className="section-header">
                <span className="section-kicker">Details</span>
                <h2 id="evening-details-heading" className="section-title">
                  Gifts, Notes &amp; What to Expect
                </h2>
              </div>

              {/* Gifts & Wishes with Wishlist Button */}
              <div className="details-subsection">
                <div className="gifts-banner">
                  <div>
                    <span className="section-kicker">
                      <Gift size={13} aria-hidden="true" />
                      <span>Gifts &amp; Wishes</span>
                    </span>
                    <h3 className="subsection-title">Your Presence Is the Greatest Gift</h3>
                    <p className="subsection-copy">
                      No gifts are expected—if you would like a little inspiration, Sophia curated a
                      small wishlist of meaningful keepsakes and experiences.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-burgundy"
                    onClick={() => setWishlistOpen((prev) => !prev)}
                    aria-expanded={wishlistOpen}
                  >
                    <Gift size={15} aria-hidden="true" />
                    <span>{wishlistOpen ? 'Hide Wishlist' : 'View Wishlist'}</span>
                    {wishlistOpen ? (
                      <ChevronUp size={15} aria-hidden="true" />
                    ) : (
                      <ChevronDown size={15} aria-hidden="true" />
                    )}
                  </button>
                </div>

                {wishlistOpen && (
                  <div id="wishlist-panel" className="wishlist-grid wishlist-drawer">
                    {invite.wishlist.map((item) => (
                      <article key={item.title} className="wishlist-item">
                        <span className="wishlist-tag">{item.category}</span>
                        <h4>{item.title}</h4>
                        <p>{item.note}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Guests Note */}
              <div className="details-subsection">
                <h3 className="subsection-heading">Guests Note</h3>
                <div className="notes-grid">
                  {invite.guestNotes.map((note) => (
                    <article key={note.title} className="note-box">
                      <h4>{note.title}</h4>
                      <p>{note.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              {/* What to Expect */}
              <div className="details-subsection">
                <h3 className="subsection-heading">What to Expect</h3>
                <ul className="timeline-list">
                  {invite.schedule.map((slot) => (
                    <li key={slot.time} className="timeline-item">
                      <span className="timeline-time">{slot.time}</span>
                      <div>
                        <h4 className="timeline-title">{slot.title}</h4>
                        <p className="timeline-detail">{slot.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Save the Date */}
            <section className="velvet-card save-date-card" aria-labelledby="save-date-heading">
              <div className="section-header light">
                <span className="section-kicker gold">Save the Date</span>
                <h2 id="save-date-heading" className="section-title light">
                  Add to Your Calendar
                </h2>
                <p className="section-lead light">
                  {invite.displayDate} · {invite.displayTime} at {invite.venue.name}
                </p>
              </div>

              <div className="action-row">
                <button
                  type="button"
                  className="btn-champagne-solid"
                  onClick={() => downloadIcsFile(invite)}
                >
                  <Download size={15} aria-hidden="true" />
                  <span>Download .ics</span>
                </button>

                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-champagne-outline"
                >
                  <CalendarPlus size={15} aria-hidden="true" />
                  <span>Google Calendar</span>
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              </div>
            </section>

            {/* RSVP Form */}
            <RsvpSection invite={invite} />
          </div>

          <footer className="invite-footer">
            <p>
              {invite.honoree} · {invite.milestone} · Midnight Velvet &amp; Champagne Glam
            </p>
          </footer>
        </>
      )}
    </main>
  );
}
