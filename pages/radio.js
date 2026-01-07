import { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Layout'; // Ajusta la ruta si tu Layout está en otro lado
import Head from 'next/head';

export default function RadioPage() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const streamUrl = 'https://stream.zeno.fm/ihgolncnt3ttv';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleError = () => {
      setError('No se pudo conectar a la radio');
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);

    // Configurar Media Session (controles en notificaciones)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'UG Stream',
        artist: 'Noticias Mineras',
        artwork: [{ src: '/logo.png', sizes: '192x192', type: 'image/png' }],
      });

      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      try {
        setError(null);
        await audio.play();
      } catch (err) {
        setError('Permita el audio para escuchar la radio');
        console.error('Playback failed:', err);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Radio en Vivo - UG Noticias Mineras</title>
        <meta name="description" content="Escuchá en vivo las 24 horas la radio de UG Noticias Mineras" />
      </Head>

      <Layout currentDate={new Date().toISOString()}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-200 mb-6 text-center">
            📻 Radio en Vivo
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-900">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-6">
                <img
                  src="/logo.png"
                  alt="UG Noticias Mineras"
                  className="h-24 w-auto object-contain"
                />
              </div>

              <button
                onClick={togglePlay}
                disabled={isLoading}
                className={`flex items-center justify-center w-16 h-16 rounded-full text-white text-xl font-bold focus:outline-none transition-all ${
                  isPlaying
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
                }`}
                aria-label={isPlaying ? 'Pausar radio' : 'Reproducir radio'}
              >
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isPlaying ? (
                  '⏸'
                ) : (
                  '▶'
                )}
              </button>

              <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                {isPlaying
                  ? 'Transmisión en vivo • UG Noticias Mineras'
                  : 'Toca ▶ para escuchar en vivo'}
              </p>

              {error && (
                <p className="mt-3 text-center text-red-500 dark:text-red-400 text-sm">
                  {error}
                </p>
              )}

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                ✅ Funciona en segundo plano en Android (Chrome).<br />
                En iPhone, añade esta página a Inicio para mejor experiencia.
              </p>
            </div>
          </div>
        </div>

        {/* Audio invisible */}
        <audio ref={audioRef} src={streamUrl} preload="none" />
      </Layout>
    </>
  );
}