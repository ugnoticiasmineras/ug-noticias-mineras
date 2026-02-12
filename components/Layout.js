import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, currentDate }) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const getActiveCategory = () => {
    const path = router.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/bolsa-trabajo')) return 'bolsa';
    if (path.startsWith('/noticia/')) {
      const parts = router.asPath.split('/');
      if (parts.length >= 3) {
        const cat = parts[2];
        if (['sanjuan', 'nacionales', 'internacionales', 'sindicales', 'opinion'].includes(cat)) {
          return cat;
        }
      }
    }
    return 'home';
  };

  const activeCategory = getActiveCategory();

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'true' || (saved === null && prefersDark);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen && window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleRouteChange = () => setMobileMenuOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b-2 border-blue-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              <Link href="/" legacyBehavior>
                <a className={`block px-4 py-2 text-sm rounded-full text-white font-semibold ${activeCategory === 'home' ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  Inicio
                </a>
              </Link>
              {['sanjuan', 'nacionales', 'internacionales', 'sindicales', 'opinion'].map(cat => (
                <Link key={cat} href={`/noticia/${cat}`} legacyBehavior>
                  <a className={`block px-4 py-2 text-sm rounded-full text-white font-semibold ${activeCategory === cat ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {cat === 'nacionales' ? 'Nacionales' :
                     cat === 'sanjuan' ? 'San Juan' :
                     cat === 'sindicales' ? 'Sindicales' :
                     cat === 'internacionales' ? 'Internacionales' : 'Opinión'}
                  </a>
                </Link>
              ))}
              <Link href="/bolsa-trabajo" legacyBehavior>
                <a className={`block px-4 py-2 text-sm rounded-full text-white font-semibold ${activeCategory === 'bolsa' ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  Bolsa de Trabajo
                </a>
              </Link>
            </nav>
          </div>
        </div>
      )}

      <header className="bg-white dark:bg-gray-900 border-b-4 border-blue-800 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden text-blue-900 dark:text-blue-200 hover:text-blue-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" legacyBehavior>
              <a><img src="/logo.png" alt="UG Noticias Mineras" className="h-12" /></a>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleDarkMode} className="text-blue-900 dark:text-blue-200 hover:text-blue-700 dark:hover:text-blue-300">
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-blue-900 dark:text-blue-200 hover:text-blue-700 dark:hover:text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        {isSearchOpen && (
          <div className="py-2 px-4 border-t border-blue-100 dark:border-blue-900">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="px-3 py-1 w-full border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
      </header>

      <nav className="hidden lg:block bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-900 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <Link href="/" legacyBehavior>
              <a className={`px-4 py-1.5 text-sm rounded-full text-white font-semibold ${activeCategory === 'home' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'}`}>
                Inicio
              </a>
            </Link>
            {['sanjuan', 'nacionales', 'internacionales', 'sindicales', 'opinion'].map(cat => (
              <Link key={cat} href={`/noticia/${cat}`} legacyBehavior>
                <a className={`px-4 py-1.5 text-sm rounded-full text-white font-semibold ${activeCategory === cat ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'}`}>
                  {cat === 'nacionales' ? 'Nacionales' :
                   cat === 'sanjuan' ? 'San Juan' :
                   cat === 'sindicales' ? 'Sindicales' :
                   cat === 'internacionales' ? 'Internacionales' : 'Opinión'}
                </a>
              </Link>
            ))}
            <Link href="/bolsa-trabajo" legacyBehavior>
              <a className={`px-4 py-1.5 text-sm rounded-full text-white font-semibold ${activeCategory === 'bolsa' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'}`}>
                Bolsa de Trabajo
              </a>
            </Link>
          </div>
          <div className="text-sm text-blue-900 dark:text-blue-200">{formatDate(currentDate)}</div>
        </div>
      </nav>

      <div className="lg:hidden bg-white dark:bg-gray-900 py-1 border-b border-blue-200 dark:border-blue-900 text-center text-xs text-blue-900 dark:text-blue-200">
        {formatDate(currentDate)}
      </div>

      {/* ✅ CARRUSEL SUPERIOR ELIMINADO - NO HAY SPONSORS EN EL HEADER */}

      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>

      {/* ✅ FOOTER CON 4 REDES SOCIALES (TikTok CORREGIDO) */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-4 lg:mb-0">
              <Link href="/" legacyBehavior>
                <a className="flex items-center space-x-2">
                  <img 
                    src="/logo.png" 
                    alt="UG Noticias Mineras Logo" 
                    className="h-12 w-auto object-contain"
                  />
                </a>
              </Link>
            </div>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a 
                href="https://facebook.com/ugnoticiasmineras" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com/ugnoticiasmineras" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.014-3.668.07-4.849.196-4.358 2.618-6.78 6.98-6.98C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@UGNoticiasMineras" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>

              {/* TikTok - CORREGIDO (mismo estilo que los demás) */}
              <a 
                href="https://www.tiktok.com/@UGNoticiasMineras" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.589 6.686a4.793 4.793 0 01-2.828-.912 4.77 4.77 0 01-1.725-2.118h-3.3v12.19a2.91 2.91 0 11-2.91-2.91c.206 0 .407.02.603.062v-3.35a6.26 6.26 0 00-.603-.03 6.26 6.26 0 106.26 6.26V9.54a8.09 8.09 0 004.503 1.376V6.686z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-blue-700 text-center">
            <p className="text-blue-300 text-sm">
              Comprometidos con la información veraz y el desarrollo sostenible de la minería argentina
            </p>
            <p className="text-blue-200 text-sm mt-1">Contacto: ugnoticiasmineras@gmail.com</p>
          </div>
        </div>
      </footer>
    </>
  );
}