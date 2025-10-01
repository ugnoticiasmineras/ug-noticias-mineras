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
        const oficial = dolares.find(d => d.casa === 'oficial')?.venta;
        const blue = dolares.find(d => d.casa === 'blue')?.venta;

        const metalsRes = await fetch('/api/metals');
        const metals = await metalsRes.json();

        setData({
          dolarOficial: oficial ? oficial.toFixed(2) : 'N/A',
          dolarBlue: blue ? blue.toFixed(2) : 'N/A',
          oro: metals.oro || 'N/A',
          cobre: metals.cobre || 'N/A'
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
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Dólar Oficial:</span>
          <span className="font-medium">${data.dolarOficial}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Dólar Blue:</span>
          <span className="font-medium">${data.dolarBlue}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Oro (USD/onza):</span>
          <span className="font-medium">{data.oro}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Cobre (USD/lb):</span>
          <span className="font-medium">{data.cobre}</span>
        </div>
      </div>
    </div>
  );
}