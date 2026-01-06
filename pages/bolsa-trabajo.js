import React, { useState } from 'react';
import Head from 'next/head';

// 👇 Importamos el Layout para que el header y footer se muestren
import Layout from '../components/Layout';

const BolsaTrabajo = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    provincia: 'San Juan',
    departamento: '',
    telefono: '',
    email: '',
    instruccion: '',
    disponibilidad: [],
    roster: [],
    maquinaria: [],
    certificaciones: [],
    oficios: [],
    otros_oficios: '',
    tiene_carnet: false,
    categorias_carnet: [],
    foto_base64: '', // Solo para el PDF
    acepto_terminos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'acepto_terminos' || name === 'tiene_carnet') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => {
          const current = prev[name] || [];
          if (checked) {
            return { ...prev, [name]: [...current, value] };
          } else {
            return { ...prev, [name]: current.filter(v => v !== value) };
          }
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto_base64: reader.result }));
        document.getElementById('foto-preview').src = reader.result;
        document.getElementById('foto-preview').classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  };

  const generarPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 20;

    doc.setFontSize(18);
    doc.setTextColor(30, 64, 175);
    doc.text("CURRICULUM VITAE – SECTOR MINERO", pageWidth / 2, y, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100);
    y += 10;
    doc.text("Generado automáticamente por UG Noticias Mineras", pageWidth / 2, y, { align: 'center' });
    y += 15;

    // ✅ Foto a la derecha, debajo del título
    if (formData.foto_base64) {
      try {
        doc.addImage(formData.foto_base64, 'JPEG', pageWidth - 50, 30, 40, 40);
      } catch (e) {
        console.warn("Foto no compatible con PDF");
      }
    }

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("DATOS PERSONALES", margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Nombre: ${formData.nombre}`, margin, y); y += 5;
    doc.text(`Edad: ${formData.edad} años`, margin, y); y += 5;
    doc.text(`Provincia: ${formData.provincia}`, margin, y); y += 5;
    doc.text(`Localidad: ${formData.departamento}`, margin, y); y += 5;
    doc.text(`Teléfono: ${formData.telefono}`, margin, y); y += 5;
    doc.text(`Email: ${formData.email || 'No proporcionado'}`, margin, y); y += 5;
    doc.text(`Nivel de instrucción: ${formData.instruccion}`, margin, y); y += 10;

    doc.setFontSize(14);
    doc.text("DISPONIBILIDAD", margin, y); y += 8;
    doc.setFontSize(11);
    doc.text(`Roster: ${formData.roster.join(', ') || 'Ninguno'}`, margin, y); y += 5;
    doc.text(`Condiciones: ${formData.disponibilidad.join(', ') || 'Ninguno'}`, margin, y); y += 10;

    if (formData.tiene_carnet) {
      doc.setFontSize(14);
      doc.text("CARNET DE CONDUCIR", margin, y); y += 8;
      doc.setFontSize(11);
      doc.text(`Categorías: ${formData.categorias_carnet.join(', ') || 'Ninguna'}`, margin, y); y += 10;
    }

    doc.setFontSize(14);
    doc.text("MAQUINARIA OPERADA", margin, y); y += 8;
    doc.setFontSize(11);
    const maq = formData.maquinaria.join(', ') || 'Ninguna';
    const maqLines = doc.splitTextToSize(maq, 180);
    doc.text(maqLines, margin, y); y += 5 + maqLines.length * 5; y += 5;

    doc.setFontSize(14);
    doc.text("CERTIFICACIONES", margin, y); y += 8;
    doc.setFontSize(11);
    const cert = formData.certificaciones.join(', ') || 'Ninguna';
    const certLines = doc.splitTextToSize(cert, 180);
    doc.text(certLines, margin, y); y += 5 + certLines.length * 5; y += 5;

    doc.setFontSize(14);
    doc.text("OFICIOS TÉCNICOS", margin, y); y += 8;
    doc.setFontSize(11);
    const ofi = formData.oficios.join(', ') || 'Ninguno';
    const ofiLines = doc.splitTextToSize(ofi, 180);
    doc.text(ofiLines, margin, y); y += 5 + ofiLines.length * 5;

    if (formData.otros_oficios.trim()) {
      y += 5;
      doc.text(`Otros: ${formData.otros_oficios.substring(0, 200)}`, margin, y);
      y += 10;
    }

    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Documento generado el " + new Date().toLocaleDateString(), margin, y);
    doc.text("© UG Noticias Mineras – Datos compartidos con empresas del sector minero", margin, y + 5);

    doc.save(`CV-UG-${formData.nombre.replace(/\s+/g, '-')}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acepto_terminos) return;

    // Generar PDF primero
    generarPDF();

    // Preparar datos para enviar (sin foto_base64)
    const dataToSend = {
      ...formData,
      // Eliminar foto_base64 para no enviarla por email
      foto_base64: undefined,
      // Convertir arrays a strings
      disponibilidad: formData.disponibilidad.join(', '),
      roster: formData.roster.join(', '),
      maquinaria: formData.maquinaria.join(', '),
      certificaciones: formData.certificaciones.join(', '),
      oficios: formData.oficios.join(', '),
    };

    // Enviar a Web3Forms
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "6d4b05ae-df14-45c3-a74a-590303ff7865",
        subject: "Nueva inscripción - Bolsa de Trabajo UG",
        from_name: formData.nombre || "Anónimo",
        ...dataToSend
      })
    });

    const result = await res.json();
    if (result.success) {
      alert("¡Gracias! Tus datos fueron enviados.");
      setFormData({
        nombre: '', edad: '', provincia: 'San Juan', departamento: '', telefono: '',
        email: '', instruccion: '', disponibilidad: [], roster: [], maquinaria: [],
        certificaciones: [], oficios: [], otros_oficios: '', tiene_carnet: false,
        categorias_carnet: [], foto_base64: '', acepto_terminos: false
      });
      document.getElementById('foto-preview').classList.add('hidden');
    } else {
      alert("Error al enviar. Intente nuevamente.");
    }
  };

  return (
    <>
      <Head>
        <title>Bolsa de Trabajo – UG Noticias Mineras</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    primary: { 600: '#1E40AF', 800: '#1E3A8A' },
                    gray: { 900: '#111827' }
                  }
                }
              }
            };
          `
        }} />
        <style dangerouslySetInnerHTML={{
          __html: `
            .dark .legal-notice { background-color: #1e3a8a20; border-left-color: #3b82f6; color: #bfdbfe; }
            .legal-notice { background-color: #dbeafe; border-left: 4px solid #1e40af; color: #1e3a8a; }
          `
        }} />
      </Head>

      {/* ✅ El contenido va dentro del Layout */}
      <Layout currentDate={new Date().toISOString()}>
        <div className="bg-white dark:bg-gray-900 text-blue-900 dark:text-blue-200 min-h-screen p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-blue-900 dark:text-white">Bolsa de Trabajo – Sector Minero</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-900">

              {/* DATOS PERSONALES */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Datos personales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label className="block text-sm font-medium mb-1">Nombre completo</label><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="block text-sm font-medium mb-1">Edad</label><input type="number" name="edad" value={formData.edad} onChange={handleChange} min="18" max="80" required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label className="block text-sm font-medium mb-1">Nivel de instrucción</label><select name="instruccion" value={formData.instruccion} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"><option value="">Selecciona</option><option value="Primaria">Primaria</option><option value="Secundaria">Secundaria</option><option value="Técnico">Técnico</option><option value="Universitario">Universitario</option><option value="Posgrado">Posgrado</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Provincia</label><select name="provincia" value={formData.provincia} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"><option value="Buenos Aires">Buenos Aires</option><option value="Catamarca">Catamarca</option><option value="Chaco">Chaco</option><option value="Chubut">Chubut</option><option value="Córdoba">Córdoba</option><option value="Corrientes">Corrientes</option><option value="Entre Ríos">Entre Ríos</option><option value="Formosa">Formosa</option><option value="Jujuy">Jujuy</option><option value="La Pampa">La Pampa</option><option value="La Rioja">La Rioja</option><option value="Mendoza">Mendoza</option><option value="Misiones">Misiones</option><option value="Neuquén">Neuquén</option><option value="Río Negro">Río Negro</option><option value="Salta">Salta</option><option value="San Juan">San Juan</option><option value="San Luis">San Luis</option><option value="Santa Cruz">Santa Cruz</option><option value="Santa Fe">Santa Fe</option><option value="Santiago del Estero">Santiago del Estero</option><option value="Tierra del Fuego">Tierra del Fuego</option><option value="Tucumán">Tucumán</option></select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label className="block text-sm font-medium mb-1">Departamento / Localidad</label><input type="text" name="departamento" value={formData.departamento} onChange={handleChange} placeholder="Ej: Iglesia, Rawson..." required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="block text-sm font-medium mb-1">Teléfono</label><input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: 2645123456" required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              </div>
              <div className="mb-4"><label className="block text-sm font-medium mb-1">Email (opcional)</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>

              {/* FOTO */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Foto de identificación (opcional)</h2>
              <div className="mb-4">
                <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="block w-full text-sm text-blue-900 dark:text-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
                <img id="foto-preview" className="mt-2 max-h-32 hidden rounded shadow" />
              </div>

              {/* DISPONIBILIDAD */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Disponibilidad laboral</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {['altura', 'turnos', 'viajar'].map(opt => (
                  <label key={opt} className="flex items-center">
                    <input type="checkbox" name="disponibilidad" value={opt} checked={formData.disponibilidad.includes(opt)} onChange={handleChange} className="mr-2 accent-blue-600" />
                    {opt === 'altura' ? 'Trabajo en altura' : opt === 'turnos' ? 'Turnos rotativos' : 'Disponible para viajar'}
                  </label>
                ))}
                {['7x7', '10x10', '14x14'].map(r => (
                  <label key={r} className="flex items-center">
                    <input type="checkbox" name="roster" value={r} checked={formData.roster.includes(r)} onChange={handleChange} className="mr-2 accent-blue-600" />
                    Roster {r}
                  </label>
                ))}
              </div>

              {/* MAQUINARIA */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Operación de maquinaria</h2>
              {['camion_fuera_ruta', 'pala_cargadora', 'bulldozer', 'wheeldozer', 'motoniveladora', 'cargadora_frontal', 'retroexcavadora', 'perforadora'].map(maq => (
                <label key={maq} className="flex items-center mr-4">
                  <input type="checkbox" name="maquinaria" value={maq} checked={formData.maquinaria.includes(maq)} onChange={handleChange} className="mr-2 accent-blue-600" />
                  {maq === 'camion_fuera_ruta' ? 'Camión fuera de ruta' :
                   maq === 'pala_cargadora' ? 'Pala cargadora' :
                   maq === 'wheeldozer' ? 'Wheeldozer' :
                   maq === 'motoniveladora' ? 'Motoniveladora' :
                   maq === 'cargadora_frontal' ? 'Cargadora frontal' :
                   maq === 'retroexcavadora' ? 'Retroexcavadora' :
                   maq === 'perforadora' ? 'Perforadora' : 'Bulldozer'}
                </label>
              ))}

              {/* CERTIFICACIONES */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Certificaciones vigentes</h2>
              {['cargas_peligrosas', 'auto_elevador', 'puente_grua', 'hidrogrua', 'explosivos', 'rescate', 'primeros_auxilios'].map(cert => (
                <label key={cert} className="flex items-center mr-4">
                  <input type="checkbox" name="certificaciones" value={cert} checked={formData.certificaciones.includes(cert)} onChange={handleChange} className="mr-2 accent-blue-600" />
                  {cert === 'cargas_peligrosas' ? 'Cargas Peligrosas' :
                   cert === 'auto_elevador' ? 'Manejo Auto elevador' :
                   cert === 'puente_grua' ? 'Manejo Puente Grúa' :
                   cert === 'hidrogrua' ? 'Hidrogrúa' :
                   cert === 'explosivos' ? 'Manejo de explosivos' :
                   cert === 'rescate' ? 'Rescate subterráneo' : 'Primeros auxilios'}
                </label>
              ))}
              <label className="flex items-center mt-2"><input type="checkbox" name="tiene_carnet" checked={formData.tiene_carnet} onChange={handleChange} className="mr-2 accent-blue-600" />Tengo carnet de conducir</label>
              {formData.tiene_carnet && (
                <div className="ml-6 mt-2">
                  {['A', 'B', 'C', 'D', 'E'].map(cat => (
                    <label key={cat} className="flex items-center mr-4">
                      <input type="checkbox" name="categorias_carnet" value={cat} checked={formData.categorias_carnet.includes(cat)} onChange={handleChange} className="mr-2 accent-blue-600" />
                      {cat} ({cat === 'A' ? 'Motocicletas' : cat === 'B' ? 'Automóviles' : cat === 'C' ? 'Camiones' : cat === 'D' ? 'Ómnibus' : 'Acoplados'})
                    </label>
                  ))}
                </div>
              )}

              {/* OFICIOS */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Oficios técnicos</h2>
              {['mecanico_flota', 'soldador', 'electricista', 'instrumentista', 'topografo', 'data_entry', 'sistemas', 'panol'].map(oficio => (
                <label key={oficio} className="flex items-center mr-4">
                  <input type="checkbox" name="oficios" value={oficio} checked={formData.oficios.includes(oficio)} onChange={handleChange} className="mr-2 accent-blue-600" />
                  {oficio === 'mecanico_flota' ? 'Mecánico de flota' :
                   oficio === 'data_entry' ? 'Data Entry' :
                   oficio === 'sistemas' ? 'Sistemas' :
                   oficio === 'panol' ? 'Pañol' : oficio.charAt(0).toUpperCase() + oficio.slice(1)}
                </label>
              ))}

              <div className="mb-6 mt-4"><label className="block text-sm font-medium mb-1">Otros oficios, cursos o capacidades no listadas</label><textarea name="otros_oficios" value={formData.otros_oficios} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"></textarea></div>

              {/* AVISO LEGAL */}
              <div className="legal-notice p-4 rounded-lg mb-4 text-sm">
                <p><strong>Protección de Datos Personales (Ley 25.326):</strong> Los datos personales que usted proporcione serán incorporados a un archivo bajo la responsabilidad de <strong>UG Noticias Mineras</strong>, con la finalidad de gestionar su inclusión en la bolsa de trabajo del sector minero. Sus datos podrán ser compartidos con empresas mineras interesadas en procesos de selección de personal. Usted tiene derecho a acceder, rectificar, actualizar y suprimir sus datos. Para más información, puede contactarnos a través de ugnoticiasmineras@gmail.com.</p>
              </div>

              <label className="flex items-start mb-6">
                <input type="checkbox" name="acepto_terminos" checked={formData.acepto_terminos} onChange={handleChange} className="mr-2 mt-1 accent-blue-600" />
                <span>Acepto el tratamiento de mis datos personales según la Ley de Protección de Datos.</span>
              </label>

              <button type="submit" disabled={!formData.acepto_terminos} className="w-full px-6 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:opacity-50">
                Enviar mis datos
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default BolsaTrabajo;