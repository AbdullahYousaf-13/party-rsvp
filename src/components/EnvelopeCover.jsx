import { Sparkles } from 'lucide-react';
import SmartImage from './SmartImage';

export default function EnvelopeCover({ invite, isOpen, onToggle }) {
  return (
    <section className="envelope-hero" aria-label="Invitation Envelope">
      <div className="envelope-ambient-glow" aria-hidden="true" />

      <div className="envelope-intro">
        <div className="cover-portrait-medallion">
          <SmartImage
            src={invite.portrait.src}
            fallbackSrc={invite.portrait.fallbackSrc}
            alt={invite.portrait.alt}
            style={{ objectPosition: invite.portrait.objectPosition || '50% 20%' }}
          />
        </div>

        <p className="eyebrow">
          <Sparkles size={13} aria-hidden="true" />
          <span className="script-invited">you are invited</span>
          <Sparkles size={13} aria-hidden="true" />
        </p>

        <h1 className="cover-cheers-title">
          <span className="script-cheers">Cheers to</span>{' '}
          <span className="cover-age">{invite.age}</span>
        </h1>
        <p className="hero-subtitle">
          {invite.honoree} · {invite.displayDate}
        </p>
      </div>

      <div className={`envelope-stage ${isOpen ? 'is-open' : ''}`}>
        <div className="envelope-shell">
          <div className="envelope-back" />

          <div className="envelope-letter-peek">
            <span className="peek-kicker">{invite.milestone}</span>
            <p className="peek-headline">{invite.headline}</p>
            <span className="peek-meta">{invite.venue.name}</span>
          </div>

          <div className="envelope-pocket" />
          <div className="envelope-flap" />

          <button
            type="button"
            className="wax-seal-btn"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close invitation envelope' : 'Break wax seal and open invitation'}
          >
            <span className="wax-seal-ring" />
            <span className="wax-seal-monogram">{invite.monogram}</span>
            <span className="wax-seal-year">{invite.age}</span>
          </button>
        </div>
      </div>

      <p className={`envelope-helper-text ${isOpen ? 'is-hidden' : ''}`} aria-hidden={isOpen}>
        Tap the wax seal
      </p>
    </section>
  );
}
