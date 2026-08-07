import { useEffect, useRef, useState } from 'react';

/**
 * ✅ SPONSORS EN VIDEO
 * Fuente única de verdad para los sponsors en video.
 * Para agregar un sponsor nuevo: agregar una entrada a SPONSOR_VIDEOS.
 * La rotación secuencial funciona con cualquier cantidad de sponsors:
 * cuando un video termina arranca el siguiente y al llegar al último vuelve al primero.
 */
const SPONSOR_VIDEOS = [
  {
    id: 'aoma',
    src: '/sponsors/sponsor-video-aoma.mp4',
    poster: '/sponsors/sponsor-video-aoma.jpg',
    label: 'AOMA San Juan',
    url: null, // ej: 'https://aomasanjuan.com.ar'
  },
  {
    id: 'sponsor-2',
    src: '/sponsors/sponsor-video-2.mp4',
    poster: '/sponsors/sponsor-video-2.jpg',
    label: 'Sponsor',
    url: null,
  },
];

/** Marca true cuando el elemento entra (o está por entrar) al viewport. */
function useInView(ref, rootMargin = '200px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);
  return inView;
}

function SponsorVideo({ sponsor, heightClass, loop = true, onEnded }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const inView = useInView(containerRef);

  // (Re)intenta reproducir cuando el video entra en pantalla o cambia de src
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    const playAttempt = video.play();
    if (playAttempt !== undefined) {
      playAttempt.catch(() => {
        /* Autoplay bloqueado: queda el poster visible */
      });
    }
  }, [inView, sponsor.src]);

  const videoEl = inView ? (
    <video
      ref={videoRef}
      className={`w-full ${heightClass} object-contain bg-white dark:bg-gray-900`}
      src={sponsor.src}
      poster={sponsor.poster}
      autoPlay
      muted
      loop={loop}
      onEnded={onEnded}
      playsInline
      preload="metadata"
      aria-label={`Video sponsor: ${sponsor.label}`}
    >
      Tu navegador no soporta la reproducción de video.
    </video>
  ) : (
    // Carga diferida: hasta acercarse al viewport se muestra solo el poster (liviano)
    <img
      src={sponsor.poster}
      alt={sponsor.label}
      loading="lazy"
      className={`w-full ${heightClass} object-contain bg-white dark:bg-gray-900`}
    />
  );

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-blue-100 dark:border-blue-900 shadow-sm"
    >
      {sponsor.url ? (
        <a href={sponsor.url} target="_blank" rel="noopener noreferrer sponsored" className="block">
          {videoEl}
        </a>
      ) : (
        videoEl
      )}
    </div>
  );
}

/**
 * Muestra los sponsors en video uno junto al otro.
 * Usar en: Home (debajo de Noticias Destacadas) y páginas de sección.
 */
export function SponsorVideoDuo({ className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SPONSOR_VIDEOS.map((sponsor) => (
          <SponsorVideo key={sponsor.id} sponsor={sponsor} heightClass="h-20 sm:h-24" />
        ))}
      </div>
    </div>
  );
}

/**
 * Muestra UN sponsor en video con ROTACIÓN SECUENCIAL (bucle).
 * - seed (id de la nota) define por cuál empieza.
 * - offset desfasa una segunda instancia: arriba empieza por un sponsor
 *   y abajo por el siguiente, para que no se vea el mismo a la vez.
 * - Ocupa TODO el ancho disponible (se estira en PC).
 * Funciona con cualquier cantidad de sponsors en SPONSOR_VIDEOS.
 */
export function SponsorVideoSingle({ seed, offset = 0, className = '' }) {
  const numericSeed = parseInt(String(seed).replace(/\D/g, ''), 10);
  const base = Number.isFinite(numericSeed) ? numericSeed : 0;
  const [index, setIndex] = useState(() => (base + offset) % SPONSOR_VIDEOS.length);

  const sponsor = SPONSOR_VIDEOS[index];
  const handleEnded = () => setIndex((i) => (i + 1) % SPONSOR_VIDEOS.length);

  return (
    <div className={`my-6 w-full ${className}`}>
      <SponsorVideo
        sponsor={sponsor}
        heightClass="h-20 sm:h-24 md:h-28"
        loop={false}
        onEnded={handleEnded}
      />
    </div>
  );
}
