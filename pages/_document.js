// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body>
        {/* Loader inicial: visible desde el primer momento */}
        <div id="initial-loader" className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-blue-700 dark:text-blue-300">Cargando Noticias...</p>
        </div>

        <Main />
        <NextScript />

        {/* Script ligero para eliminar el loader cuando la app esté lista */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function removeLoader() {
                  var loader = document.getElementById('initial-loader');
                  if (loader) {
                    loader.style.transition = 'opacity 0.3s';
                    loader.style.opacity = '0';
                    setTimeout(function() {
                      if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                      }
                    }, 300);
                  }
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', removeLoader);
                } else {
                  removeLoader();
                }
              })();
            `,
          }}
        />
      </body>
    </Html>
  );
}