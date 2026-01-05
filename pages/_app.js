// pages/_app.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

import '../styles/globals.css'; // Asegúrate de tener este archivo (Next.js lo crea por defecto)

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeEnd = () => setLoading(false);

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router.events]);

  // Si tu Layout requiere `currentDate`, y no está en `pageProps`, puedes generarlo aquí
  // Pero en tu caso, cada página ya pasa `currentDate` en `getServerSideProps`
  // Así que lo dejamos tal como está.

  return (
    <>
      {/* Loader global durante navegación */}
      {loading && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white dark:bg-gray-900">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-blue-700 dark:text-blue-300">
            Cargando Noticias...
          </p>
        </div>
      )}

      {/* Renderiza la página con su Layout si lo usa */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;