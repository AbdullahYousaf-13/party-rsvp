import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

function getRemainingTime(targetIso) {
  const targetMs = new Date(targetIso).getTime();
  const diff = Math.max(0, targetMs - Date.now());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { diff, days, hours, minutes, seconds };
}

export default function CountdownSection({ targetIso, displayDate }) {
  const [timeLeft, setTimeLeft] = useState(() => getRemainingTime(targetIso));

  useEffect(() => {
    setTimeLeft(getRemainingTime(targetIso));
    const intervalId = window.setInterval(() => {
      setTimeLeft(getRemainingTime(targetIso));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [targetIso]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section className="velvet-card countdown-card" aria-labelledby="countdown-heading">
      <div className="section-header light">
        <span className="section-kicker gold">
          <Clock size={13} aria-hidden="true" />
          <span>Counting Down</span>
        </span>
        <h2 id="countdown-heading" className="section-title light">
          Until the Champagne Flows
        </h2>
        <p className="section-lead light">{displayDate}</p>
      </div>

      {timeLeft.diff === 0 ? (
        <p className="countdown-live-banner">The soirée is tonight — see you on the mezzanine!</p>
      ) : (
        <div className="countdown-grid" role="timer" aria-live="off">
          {units.map((unit) => (
            <div key={unit.label} className="countdown-cell">
              <span className="countdown-number">{String(unit.value).padStart(2, '0')}</span>
              <span className="countdown-label">{unit.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
