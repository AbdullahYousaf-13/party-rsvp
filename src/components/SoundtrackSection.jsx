import { useEffect, useRef, useState } from 'react';
import { Disc3, ExternalLink, Pause, Play, Volume2 } from 'lucide-react';

const WAVEFORM_BARS = [38, 65, 92, 52, 84, 46, 98, 70, 56, 88, 44, 76, 62, 42];
const LOUNGE_CHORD_NOTES = [261.63, 329.63, 392.0, 493.88, 587.33];

export default function SoundtrackSection({ soundtrack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState('Soundtrack preview ready');
  const audioElRef = useRef(null);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);

  const stopAmbientSynth = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  const stopAllAudio = () => {
    if (audioElRef.current) {
      audioElRef.current.pause();
    }
    stopAmbientSynth();
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const playWarmNote = (ctx, freq, delaySec = 0) => {
    const now = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.45);
  };

  const startAmbientSynth = async () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        setAudioStatus('Visual vinyl mode · Open playlist for full audio');
        return;
      }
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      audioCtxRef.current = ctx;

      let step = 0;
      const triggerBar = () => {
        const baseNote = LOUNGE_CHORD_NOTES[step % LOUNGE_CHORD_NOTES.length];
        const fifthNote = LOUNGE_CHORD_NOTES[(step + 2) % LOUNGE_CHORD_NOTES.length];
        playWarmNote(ctx, baseNote, 0);
        playWarmNote(ctx, fifthNote, 0.45);
        step += 1;
      };

      triggerBar();
      timerRef.current = window.setInterval(triggerBar, 2200);
      setAudioStatus('Playing ambient lounge preview');
    } catch {
      setAudioStatus('Visual vinyl mode · Open playlist for full audio');
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      setAudioStatus('Preview paused');
      return;
    }

    const localSrc = soundtrack.audioSrc;
    if (localSrc) {
      try {
        if (!audioElRef.current) {
          const audio = new Audio(localSrc);
          audio.loop = true;
          audioElRef.current = audio;
        }
        await audioElRef.current.play();
        setIsPlaying(true);
        setAudioStatus('Now spinning local soundtrack');
        return;
      } catch {
        // Local MP3 not present or blocked — fall back cleanly to ambient synth
        audioElRef.current = null;
      }
    }

    await startAmbientSynth();
    setIsPlaying(true);
  };

  const playlistHref =
    soundtrack.playlistUrl ||
    soundtrack.youtubeUrl ||
    (soundtrack.youtubeId ? `https://www.youtube.com/watch?v=${soundtrack.youtubeId}` : '#');

  return (
    <section className="ivory-card soundtrack-card" aria-labelledby="soundtrack-heading">
      <div className="section-header">
        <span className="section-kicker">Evening Soundtrack</span>
        <h2 id="soundtrack-heading" className="section-title">
          Spin the Vinyl
        </h2>
        <p className="section-lead">{soundtrack.note}</p>
      </div>

      <div className="soundtrack-layout">
        <div className="vinyl-stage" aria-hidden="true">
          <div className={`vinyl-disc ${isPlaying ? 'is-spinning' : ''}`}>
            <div className="vinyl-grooves" />
            <div className="vinyl-label">
              <span className="vinyl-label-brand">MV · 30</span>
              <Disc3 size={18} className="vinyl-center-icon" />
              <span className="vinyl-label-rpm">33⅓ RPM</span>
            </div>
          </div>
          <div className={`vinyl-tonearm ${isPlaying ? 'is-engaged' : ''}`} />
        </div>

        <div className="soundtrack-meta">
          <p className="track-title">{soundtrack.title}</p>
          <p className="track-artist">{soundtrack.artist}</p>

          <div className={`waveform-bars ${isPlaying ? 'is-active' : ''}`} aria-hidden="true">
            {WAVEFORM_BARS.map((height, index) => (
              <span
                key={index}
                className="waveform-bar"
                style={{
                  '--bar-height': `${height}%`,
                  '--bar-delay': `${index * 0.08}s`,
                }}
              />
            ))}
          </div>

          <div className="soundtrack-actions">
            <button
              type="button"
              className="btn-burgundy"
              onClick={togglePlay}
              aria-pressed={isPlaying}
            >
              {isPlaying ? (
                <>
                  <Pause size={15} aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={15} aria-hidden="true" />
                  <span>Play Soundtrack</span>
                </>
              )}
            </button>

            <a
              href={playlistHref}
              target="_blank"
              rel="noreferrer"
              className="btn-burgundy-outline"
            >
              <span>Open Playlist</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>

          <p className="soundtrack-hint">
            <Volume2 size={14} aria-hidden="true" />
            <span>{audioStatus}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
