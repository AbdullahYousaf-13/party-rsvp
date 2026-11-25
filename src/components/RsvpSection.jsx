import { useState } from 'react';
import { CheckCircle2, HeartHandshake, Send, Sparkles } from 'lucide-react';

export default function RsvpSection({ invite }) {
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(1);
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [resultInfo, setResultInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name so we can reserve your place.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const payload = {
      slug: invite.slug,
      sheetId: invite.rsvpSheetId || '',
      sheetTab: invite.rsvpSheetTab || 'RSVPs',
      name: name.trim(),
      attending,
      guests: attending ? Number(guests) : 0,
      contact: contact.trim(),
      notes: notes.trim(),
      songRequest: songRequest.trim(),
      submittedAt: new Date().toISOString(),
    };

    const webhookUrl = (invite.rsvpWebhookUrl || '').trim();
    const isPlaceholderWebhook =
      !webhookUrl ||
      /YOUR_|PLACEHOLDER|example\.com/i.test(webhookUrl) ||
      !webhookUrl.startsWith('http');

    if (isPlaceholderWebhook) {
      console.info('[RSVP Preview Mode] Simulated submission payload:', payload);
      setResultInfo({ mode: 'preview', payload });
      setStatus('success');
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    };

    try {
      const response = await fetch(webhookUrl, requestOptions);

      if (!response.ok && response.type !== 'opaque') {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      setResultInfo({ mode: 'live', payload });
      setStatus('success');
    } catch (err) {
      // Google Apps Script 302 redirects can trigger a CORS TypeError in browsers even when POST succeeds.
      // Retry with mode: "no-cors" so the simple text/plain request delivers e.postData.contents cleanly.
      if (err instanceof TypeError || /failed to fetch|networkerror/i.test(err?.message || '')) {
        try {
          await fetch(webhookUrl, {
            ...requestOptions,
            mode: 'no-cors',
          });
          setResultInfo({ mode: 'live', payload });
          setStatus('success');
          return;
        } catch (fallbackErr) {
          setErrorMessage(
            fallbackErr?.message || 'Unable to reach the RSVP webhook right now. Please try again.'
          );
          setStatus('error');
          return;
        }
      }

      setErrorMessage(
        err?.message || 'Unable to reach the RSVP webhook right now. Please try again.'
      );
      setStatus('error');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setResultInfo(null);
    setErrorMessage('');
  };

  return (
    <section id="rsvp-section" className="ivory-card rsvp-card" aria-labelledby="rsvp-heading">
      <div className="section-header">
        <span className="section-kicker">Kindly Reply</span>
        <h2 id="rsvp-heading" className="section-title">
          RSVP by {invite.rsvpDeadline}
        </h2>
        <p className="section-lead">
          Let us know if you will be raising a glass with {invite.shortName}.
        </p>
      </div>

      {status === 'success' && resultInfo ? (
        <div className="rsvp-confirmation" role="status">
          <div className="rsvp-confirmation-icon">
            <CheckCircle2 size={34} aria-hidden="true" />
          </div>
          <h3>
            {resultInfo.payload.attending
              ? `We can't wait to celebrate with you, ${resultInfo.payload.name}!`
              : `Thank you for letting us know, ${resultInfo.payload.name}.`}
          </h3>
          <p className="rsvp-confirmation-sub">
            {resultInfo.mode === 'preview'
              ? 'Preview Confirmation — No rsvpWebhookUrl is configured in src/data/invites.js, so your RSVP was verified locally without sending a network request.'
              : 'Your response has been recorded in our guest list.'}
          </p>

          <dl className="rsvp-summary-list">
            <div>
              <dt>Response</dt>
              <dd>{resultInfo.payload.attending ? 'Joyfully Accepts' : 'Regretfully Declines'}</dd>
            </div>
            {resultInfo.payload.attending && (
              <div>
                <dt>Party Size</dt>
                <dd>
                  {resultInfo.payload.guests} {resultInfo.payload.guests === 1 ? 'Guest' : 'Guests'}
                </dd>
              </div>
            )}
            {resultInfo.payload.contact && (
              <div>
                <dt>Contact</dt>
                <dd>{resultInfo.payload.contact}</dd>
              </div>
            )}
            {resultInfo.payload.notes && (
              <div>
                <dt>Notes</dt>
                <dd>{resultInfo.payload.notes}</dd>
              </div>
            )}
          </dl>

          <button type="button" className="btn-burgundy-outline" onClick={resetForm}>
            Update RSVP Details
          </button>
        </div>
      ) : (
        <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
          <div className="attendance-toggle" role="group" aria-label="Attendance choice">
            <button
              type="button"
              className={`toggle-pill ${attending ? 'is-selected' : ''}`}
              onClick={() => setAttending(true)}
            >
              <Sparkles size={15} aria-hidden="true" />
              <span>Joyfully Accepts</span>
            </button>
            <button
              type="button"
              className={`toggle-pill ${!attending ? 'is-selected' : ''}`}
              onClick={() => setAttending(false)}
            >
              <HeartHandshake size={15} aria-hidden="true" />
              <span>Regretfully Declines</span>
            </button>
          </div>

          <div className="form-grid">
            <label className="form-field">
              <span>Full Name *</span>
              <input
                type="text"
                required
                placeholder="e.g. Camille Beaumont"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            {attending && (
              <label className="form-field">
                <span>Number of Guests</span>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                  <option value={1}>1 Guest (Just me)</option>
                  <option value={2}>2 Guests (With +1)</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </label>
            )}

            <label className="form-field">
              <span>Email or Phone</span>
              <input
                type="text"
                placeholder="you@example.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </label>

            {attending && (
              <label className="form-field">
                <span>Song Request for the DJ</span>
                <input
                  type="text"
                  placeholder="Optional dance floor favorite"
                  value={songRequest}
                  onChange={(e) => setSongRequest(e.target.value)}
                />
              </label>
            )}
          </div>

          <label className="form-field">
            <span>{attending ? `Dietary Restrictions or Note for ${invite.shortName}` : `Note for ${invite.shortName}`}</span>
            <textarea
              rows={3}
              placeholder={attending ? 'Allergies, mocktail preferences, or a birthday wish...' : 'Send a birthday wish or let us know what changed...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          {status === 'error' && errorMessage && (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className="btn-burgundy submit-btn" disabled={status === 'submitting'}>
            <Send size={15} aria-hidden="true" />
            <span>{status === 'submitting' ? 'Sending RSVP...' : 'Send RSVP'}</span>
          </button>
        </form>
      )}
    </section>
  );
}
