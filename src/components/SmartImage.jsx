import { useEffect, useMemo, useState } from 'react';

const EXTENSION_CANDIDATES = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.svg',
  '.jpg.jpg',
  '.jpeg.jpeg',
  '.png.png',
];

function buildCandidateUrls(basePath) {
  if (!basePath) return [];
  if (
    basePath.startsWith('data:') ||
    basePath.startsWith('http://') ||
    basePath.startsWith('https://') ||
    /\.[a-z0-9]+$/i.test(basePath)
  ) {
    return [basePath];
  }
  return EXTENSION_CANDIDATES.map((ext) => `${basePath}${ext}`);
}

function InlineFallbackSvg({ alt, className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 480"
      role="img"
      aria-label={alt || 'Midnight Velvet & Champagne Glam placeholder'}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    >
      <defs>
        <linearGradient id="velvetBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B0A16" />
          <stop offset="55%" stopColor="#6E1226" />
          <stop offset="100%" stopColor="#2A060F" />
        </linearGradient>
        <linearGradient id="champagneGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5E4BC" />
          <stop offset="50%" stopColor="#DFC286" />
          <stop offset="100%" stopColor="#B58E44" />
        </linearGradient>
      </defs>
      <rect width="360" height="480" fill="url(#velvetBg)" />
      <rect
        x="18"
        y="18"
        width="324"
        height="444"
        rx="162"
        fill="none"
        stroke="url(#champagneGold)"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <circle
        cx="180"
        cy="170"
        r="48"
        fill="url(#champagneGold)"
        opacity="0.18"
      />
      <circle
        cx="180"
        cy="170"
        r="38"
        fill="none"
        stroke="url(#champagneGold)"
        strokeWidth="1.2"
        opacity="0.75"
      />
      <path
        d="M110 385 C110 265 250 265 250 385"
        fill="url(#champagneGold)"
        opacity="0.14"
        stroke="url(#champagneGold)"
        strokeWidth="1.2"
      />
      <text
        x="180"
        y="270"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="30"
        fill="#DFC286"
      >
        Cheers to 30
      </text>
      <text
        x="180"
        y="428"
        textAnchor="middle"
        fontFamily="sans-serif"
        letterSpacing="4"
        fontSize="10"
        fill="#FAF6F0"
        opacity="0.82"
      >
        MIDNIGHT VELVET
      </text>
    </svg>
  );
}

export default function SmartImage({ src, alt = '', className, style, ...props }) {
  const candidates = useMemo(() => buildCandidateUrls(src), [src]);
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setAttemptIndex(0);
    setFailed(false);
  }, [src]);

  if (failed || candidates.length === 0 || attemptIndex >= candidates.length) {
    return <InlineFallbackSvg alt={alt} className={className} style={style} />;
  }

  const handleError = () => {
    const nextIndex = attemptIndex + 1;
    if (nextIndex >= candidates.length) {
      setFailed(true);
    } else {
      setAttemptIndex(nextIndex);
    }
  };

  return (
    <img
      src={candidates[attemptIndex]}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
}
