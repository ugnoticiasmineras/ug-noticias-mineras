// components/Layout.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const Layout = ({ children, currentDate }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" legacyBehavior>
                  <a className="flex items-center space-x-2">
                    <img 
                      src="/logo.png" 
                      alt="UG Noticias Mineras" 
                      className="h-10 w-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = '<span className="text-blue-800 dark:text-blue-200 font-bold text-xl">UG Noticias Mineras</span>';
                      }}
                    />
                  </a>
                </Link>
              </div>
              <div className="flex items-center">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                >
                  {darkMode ? (
                    <SunIcon className="h-6 w-6" />
                  ) : (
                    <MoonIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar + Main */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>

        {/* ✅ Sidebar Global (si lo tenés aquí, sino ignora) */}
        {/* NOTA: Si el sidebar está en index.js, no se toca aquí */}
      </div>
    </>
  );
};

export default Layout;