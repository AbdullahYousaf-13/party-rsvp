function toUtcCalendarStamp(isoString) {
  const date = new Date(isoString);
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    'T',
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    'Z',
  ].join('');
}

function escapeIcsText(text = '') {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function buildGoogleCalendarUrl(invite) {
  const start = toUtcCalendarStamp(invite.eventStartIso);
  const end = toUtcCalendarStamp(invite.eventEndIso);
  const title = `${invite.honoree} — ${invite.milestone}`;
  const details = `${invite.headline}\n\nDress Code: ${invite.dressCode.title} (${invite.dressCode.subtitle})\n\n${invite.subheadline}`;
  const location = `${invite.venue.name}, ${invite.venue.address}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent(invite) {
  const start = toUtcCalendarStamp(invite.eventStartIso);
  const end = toUtcCalendarStamp(invite.eventEndIso);
  const now = toUtcCalendarStamp(new Date().toISOString());
  const uid = `${invite.slug}@party-rsvp.local`;
  const summary = escapeIcsText(`${invite.honoree} — ${invite.milestone}`);
  const location = escapeIcsText(`${invite.venue.name}, ${invite.venue.address}`);
  const description = escapeIcsText(
    `${invite.headline}. Dress Code: ${invite.dressCode.title}. ${invite.venue.neighborhoodNote}`
  );

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Midnight Velvet Party RSVP//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcsFile(invite) {
  const content = buildIcsContent(invite);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${invite.slug}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
