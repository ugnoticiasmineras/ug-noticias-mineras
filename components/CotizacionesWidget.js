// components/CotizacionesWidget.js
import { useState, useEffect } from 'react';

export default function CotizacionesWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dolarRes = await fetch('https://dolarapi.com/v1/dolares');
        const dolares = await dolarRes.json();
        
        const oficial = dolares.find(d => d.casa === 'oficial');
        const blue = dolares.find(d => d.casa === 'blue');
        const mep = dolares.find(d => d.casa === 'mep');

        setData({
          oficial: oficial || null,
          blue: blue || null,
          mep: mep || null
        });
      } catch (err) {
        console.error('Error al cargar cotizaciones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Actualiza cada minuto
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Cargando...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-blue-100 dark:border-blue-900 p-4 mb-4">
      <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 text-center">Cotizaciones</h3>
      <div className="space-y-2 text-sm">
        {data.oficial && (
          <>
            <div className="font-medium text-blue-800 dark:text-blue-300">Dólar Oficial</div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Compra:</span>
              <span className="font-medium">${data.oficial.compra?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Venta:</span>
              <span className="font-medium">${data.oficial.venta?.toFixed(2) || 'N/A'}</span>
            </div>
          </>
        )}

        {data.blue && (
          <>
            <div className="font-medium text-blue-800 dark:text-blue-300">Dólar Blue</div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Compra:</span>
              <span className="font-medium">${data.blue.compra?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Venta:</span>
              <span className="font-medium">${data.blue.venta?.toFixed(2) || 'N/A'}</span>
            </div>
          </>
        )}

        {data.mep && (
          <>
            <div className="font-medium text-blue-800 dark:text-blue-300">Dólar MEP</div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Compra:</span>
              <span className="font-medium">${data.mep.compra?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Venta:</span>
              <span className="font-medium">${data.mep.venta?.toFixed(2) || 'N/A'}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}