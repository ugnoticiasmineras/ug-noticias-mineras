import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

// Estilos globales (sin Tailwind inline)
const BolsaTrabajoStyles = () => (
  <style jsx global>{`
    .experience-item {
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    .dark .experience-item {
      background: #1e293b;
    }
    .legal-notice {
      background-color: #dbeafe;
      border-left: 4px solid #1e40af;
      color: #1e3a8a;
    }
    .dark .legal-notice {
      background-color: #1e3a8a20;
      border-left-color: #3b82f6;
      color: #bfdbfe;
    }
  `}</style>
);

const BolsaTrabajo = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    provincia: 'San Juan',
    departamento: '',
    telefono: '',
    email: '',
    instruccion: '',
    otros_oficios: '',
    tiene_carnet: false,
    acepto_terminos: false,
  });

  const [disponibilidad, setDisponibilidad] = useState([]);
  const [roster, setRoster] = useState([]);
  const [maquinaria, setMaquinaria] = useState([]);
  const [certificaciones, setCertificaciones] = useState([]);
  const [oficios, setOficios] = useState([]);
  const [categoriasCarnet, setCategoriasCarnet] = useState([]);
  const [experiencias, setExperiencias] = useState([]);
  const [fotoBase64, setFotoBase64] = useState('');
  const fileInputRef = useRef(null);

  // Sincronizar modo oscuro con Layout
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'true' || (saved === null && prefersDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleArray = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter(v => v !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'acepto_terminos' || name === 'tiene_carnet') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else if (name === 'disponibilidad') {
        toggleArray(disponibilidad, setDisponibilidad, value);
      } else if (name === 'roster') {
        toggleArray(roster, setRoster, value);
      } else if (name === 'maquinaria') {
        toggleArray(maquinaria, setMaquinaria, value);
      } else if (name === 'certificaciones') {
        toggleArray(certificaciones, setCertificaciones, value);
      } else if (name === 'oficios') {
        toggleArray(oficios, setOficios, value);
      } else if (name === 'categorias_carnet') {
        toggleArray(categoriasCarnet, setCategoriasCarnet, value);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const agregarExperiencia = () => {
    setExperiencias(prev => [...prev, {
      id: Date.now(),
      empresa: '',
      sector: 'minería',
      cargo: '',
      desde: '',
      hasta: '',
      ref_nombre: '',
      ref_telefono: '',
    }]);
  };

  const actualizarExperiencia = (id, field, value) => {
    setExperiencias(prev =>
      prev.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    );
  };

  const eliminarExperiencia = (id) => {
    setExperiencias(prev => prev.filter(exp => exp.id !== id));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result);
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

    if (fotoBase64) {
      try {
        doc.addImage(fotoBase64, 'JPEG', pageWidth - 50, 30, 40, 40);
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
    doc.text(`Roster: ${roster.join(', ') || 'Ninguno'}`, margin, y); y += 5;
    doc.text(`Condiciones: ${disponibilidad.join(', ') || 'Ninguno'}`, margin, y); y += 10;

    if (formData.tiene_carnet) {
      doc.setFontSize(14);
      doc.text("CARNET DE CONDUCIR", margin, y); y += 8;
      doc.setFontSize(11);
      doc.text(`Categorías: ${categoriasCarnet.join(', ') || 'Ninguna'}`, margin, y); y += 10;
    }

    doc.setFontSize(14);
    doc.text("MAQUINARIA OPERADA", margin, y); y += 8;
    doc.setFontSize(11);
    const maq = maquinaria.join(', ') || 'Ninguna';
    const maqLines = doc.splitTextToSize(maq, 180);
    doc.text(maqLines, margin, y); y += 5 + maqLines.length * 5; y += 5;

    doc.setFontSize(14);
    doc.text("CERTIFICACIONES", margin, y); y += 8;
    doc.setFontSize(11);
    const cert = certificaciones.join(', ') || 'Ninguna';
    const certLines = doc.splitTextToSize(cert, 180);
    doc.text(certLines, margin, y); y += 5 + certLines.length * 5; y += 5;

    doc.setFontSize(14);
    doc.text("OFICIOS TÉCNICOS", margin, y); y += 8;
    doc.setFontSize(11);
    const ofi = oficios.join(', ') || 'Ninguno';
    const ofiLines = doc.splitTextToSize(ofi, 180);
    doc.text(ofiLines, margin, y); y += 5 + ofiLines.length * 5;

    if (formData.otros_oficios.trim()) {
      y += 5;
      doc.text(`Otros: ${formData.otros_oficios.substring(0, 200)}`, margin, y);
      y += 10;
    }

    if (experiencias.length > 0) {
      y += 5;
      doc.setFontSize(14);
      doc.text("EXPERIENCIA LABORAL", margin, y); y += 8;
      doc.setFontSize(11);
      experiencias.forEach(exp => {
        doc.text(`${exp.empresa} – ${exp.sector}`, margin, y); y += 5;
        doc.text(`• ${exp.cargo} (${exp.desde || '–'} – ${exp.hasta || 'Actualidad'})`, margin + 5, y); y += 5;
        if (exp.ref_nombre || exp.ref_telefono) {
          let refText = 'Referencia: ';
          if (exp.ref_nombre) refText += exp.ref_nombre;
          if (exp.ref_telefono) refText += (exp.ref_nombre ? ' – ' : '') + exp.ref_telefono;
          doc.text(refText, margin + 10, y); y += 6;
        }
      });
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

    generarPDF();

    // Datos para Web3Forms
    const dataToSend = {
      ...formData,
      foto_base64: undefined,
      disponibilidad: disponibilidad.join(', '),
      roster: roster.join(', '),
      maquinaria: maquinaria.join(', '),
      certificaciones: certificaciones.join(', '),
      oficios: oficios.join(', '),
      categorias_carnet: formData.tiene_carnet ? categoriasCarnet.join(', ') : '',
      experiencias: experiencias,
    };

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

    if (res.ok) {
      alert("¡Gracias! Tus datos fueron enviados.");
      setFormData({
        nombre: '', edad: '', provincia: 'San Juan', departamento: '', telefono: '',
        email: '', instruccion: '', otros_oficios: '', tiene_carnet: false, acepto_terminos: false
      });
      setDisponibilidad([]);
      setRoster([]);
      setMaquinaria([]);
      setCertificaciones([]);
      setOficios([]);
      setCategoriasCarnet([]);
      setExperiencias([]);
      setFotoBase64('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      alert("Error al enviar. Intente nuevamente.");
    }
  };

  return (
    <>
      <Head>
        <title>Bolsa de Trabajo – UG Noticias Mineras</title>
        {/* ✅ Eliminamos Tailwind inline para respetar el modo del Layout */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      </Head>
      <BolsaTrabajoStyles />
      <Layout currentDate={new Date().toISOString()}>
        <div className="min-h-screen p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
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
                <div><label className="block text-sm font-medium mb-1">Provincia</label><select name="provincia" value={formData.provincia} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">{['Buenos Aires','Catamarca','Chaco','Chubut','Córdoba','Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucumán'].map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label className="block text-sm font-medium mb-1">Departamento / Localidad</label><input type="text" name="departamento" value={formData.departamento} onChange={handleChange} placeholder="Ej: Iglesia, Rawson..." required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="block text-sm font-medium mb-1">Teléfono</label><input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: 2645123456" required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>
              </div>
              <div className="mb-4"><label className="block text-sm font-medium mb-1">Email (opcional)</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" /></div>

              {/* FOTO */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Foto de identificación (opcional)</h2>
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="block w-full text-sm text-blue-900 dark:text-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {fotoBase64 && (
                  <img
                    id="foto-preview"
                    src={fotoBase64}
                    className="mt-2 max-h-32 rounded shadow"
                  />
                )}
              </div>

              {/* EXPERIENCIA LABORAL */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-white mt-6 border-b border-blue-200 dark:border-blue-900 pb-2 inline-block">
                  Experiencia laboral
                </h2>
                <button
                  type="button"
                  onClick={agregarExperiencia}
                  className="px-4 py-1.5 text-sm rounded-full text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                >
                  + Agregar experiencia
                </button>
              </div>

              <div id="experiencia-container" className="mb-6">
                {experiencias.map((exp) => (
                  <div key={exp.id} className="experience-item">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-xs mb-1">Empresa</label>
                        <input
                          type="text"
                          value={exp.empresa}
                          onChange={(e) => actualizarExperiencia(exp.id, 'empresa', e.target.value)}
                          required
                          className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Sector</label>
                        <select
                          value={exp.sector}
                          onChange={(e) => actualizarExperiencia(exp.id, 'sector', e.target.value)}
                          required
                          className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                        >
                          <option value="minería">Minería</option>
                          <option value="construcción">Construcción</option>
                          <option value="industria">Industria</option>
                          <option value="otros">Otros</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Cargo</label>
                        <input
                          type="text"
                          value={exp.cargo}
                          onChange={(e) => actualizarExperiencia(exp.id, 'cargo', e.target.value)}
                          required
                          className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Desde</label>
                        <input
                          type="month"
                          value={exp.desde}
                          onChange={(e) => actualizarExperiencia(exp.id, 'desde', e.target.value)}
                          required
                          className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Hasta</label>
                        <input
                          type="month"
                          value={exp.hasta}
                          onChange={(e) => actualizarExperiencia(exp.id, 'hasta', e.target.value)}
                          className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                        />
                        <small className="text-xs text-gray-500 dark:text-gray-300">Deja en blanco si actualmente</small>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Contacto para referencias (opcional)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs mb-1">Nombre del contacto</label>
                          <input
                            type="text"
                            value={exp.ref_nombre}
                            onChange={(e) => actualizarExperiencia(exp.id, 'ref_nombre', e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1">Teléfono del contacto</label>
                          <input
                            type="tel"
                            value={exp.ref_telefono}
                            onChange={(e) => actualizarExperiencia(exp.id, 'ref_telefono', e.target.value)}
                            placeholder="Ej: 2645123456"
                            className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => eliminarExperiencia(exp.id)}
                      className="mt-3 px-3 py-1 bg-red-600 text-white text-xs rounded"
                    >
                      Eliminar experiencia
                    </button>
                  </div>
                ))}
              </div>

              {/* DISPONIBILIDAD */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Disponibilidad laboral</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {['altura', 'turnos', 'viajar'].map(opt => (
                  <label key={opt} className="flex items-center">
                    <input
                      type="checkbox"
                      name="disponibilidad"
                      value={opt}
                      checked={disponibilidad.includes(opt)}
                      onChange={handleChange}
                      className="mr-2 accent-blue-600"
                    />
                    {opt === 'altura' ? 'Trabajo en altura' :
                     opt === 'turnos' ? 'Turnos rotativos' : 'Disponible para viajar'}
                  </label>
                ))}
                {['7x7', '10x10', '14x14'].map(r => (
                  <label key={r} className="flex items-center">
                    <input
                      type="checkbox"
                      name="roster"
                      value={r}
                      checked={roster.includes(r)}
                      onChange={handleChange}
                      className="mr-2 accent-blue-600"
                    />
                    Roster {r}
                  </label>
                ))}
              </div>

              {/* MAQUINARIA */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Operación de maquinaria</h2>
              {['camion_fuera_ruta', 'pala_cargadora', 'bulldozer', 'wheeldozer', 'motoniveladora', 'cargadora_frontal', 'retroexcavadora', 'perforadora'].map(maq => (
                <label key={maq} className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="maquinaria"
                    value={maq}
                    checked={maquinaria.includes(maq)}
                    onChange={handleChange}
                    className="mr-2 accent-blue-600"
                  />
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
                  <input
                    type="checkbox"
                    name="certificaciones"
                    value={cert}
                    checked={certificaciones.includes(cert)}
                    onChange={handleChange}
                    className="mr-2 accent-blue-600"
                  />
                  {cert === 'cargas_peligrosas' ? 'Cargas Peligrosas' :
                   cert === 'auto_elevador' ? 'Manejo Auto elevador' :
                   cert === 'puente_grua' ? 'Manejo Puente Grúa' :
                   cert === 'hidrogrua' ? 'Hidrogrúa' :
                   cert === 'explosivos' ? 'Manejo de explosivos' :
                   cert === 'rescate' ? 'Rescate subterráneo' : 'Primeros auxilios'}
                </label>
              ))}
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="tiene_carnet"
                  checked={formData.tiene_carnet}
                  onChange={handleChange}
                  className="mr-2 accent-blue-600"
                />
                Tengo carnet de conducir
              </label>
              {formData.tiene_carnet && (
                <div className="ml-6 mt-2">
                  {['A', 'B', 'C', 'D', 'E'].map(cat => (
                    <label key={cat} className="flex items-center mr-4">
                      <input
                        type="checkbox"
                        name="categorias_carnet"
                        value={cat}
                        checked={categoriasCarnet.includes(cat)}
                        onChange={handleChange}
                        className="mr-2 accent-blue-600"
                      />
                      {cat} ({cat === 'A' ? 'Motocicletas' : cat === 'B' ? 'Automóviles' : cat === 'C' ? 'Camiones' : cat === 'D' ? 'Ómnibus' : 'Acoplados'})
                    </label>
                  ))}
                </div>
              )}

              {/* OFICIOS */}
              <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 mt-6 border-b border-blue-200 dark:border-blue-900 pb-2">Oficios técnicos</h2>
              {['mecanico_flota', 'soldador', 'electricista', 'instrumentista', 'topografo', 'data_entry', 'sistemas', 'panol'].map(oficio => (
                <label key={oficio} className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="oficios"
                    value={oficio}
                    checked={oficios.includes(oficio)}
                    onChange={handleChange}
                    className="mr-2 accent-blue-600"
                  />
                  {oficio === 'mecanico_flota' ? 'Mecánico de flota' :
                   oficio === 'data_entry' ? 'Data Entry' :
                   oficio === 'sistemas' ? 'Sistemas' :
                   oficio === 'panol' ? 'Pañol' : oficio.charAt(0).toUpperCase() + oficio.slice(1)}
                </label>
              ))}

              <div className="mb-6 mt-4">
                <label className="block text-sm font-medium mb-1">Otros oficios, cursos o capacidades no listadas</label>
                <textarea
                  name="otros_oficios"
                  value={formData.otros_oficios}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
              </div>

              {/* AVISO LEGAL */}
              <div className="legal-notice p-4 rounded-lg mb-4 text-sm">
                <p>
                  <strong>Protección de Datos Personales (Ley 25.326):</strong> 
                  Los datos personales que usted proporcione serán incorporados a un archivo bajo la responsabilidad de <strong>UG Noticias Mineras</strong>, 
                  con la finalidad de gestionar su inclusión en la bolsa de trabajo del sector minero. 
                  Sus datos podrán ser compartidos con empresas mineras interesadas en procesos de selección de personal. 
                  Usted tiene derecho a acceder, rectificar, actualizar y suprimir sus datos. 
                  Para más información, puede contactarnos a través de ugnoticiasmineras@gmail.com.
                </p>
              </div>

              <label className="flex items-start mb-6">
                <input
                  type="checkbox"
                  name="acepto_terminos"
                  checked={formData.acepto_terminos}
                  onChange={handleChange}
                  className="mr-2 mt-1 accent-blue-600"
                />
                <span>Acepto el tratamiento de mis datos personales según la Ley de Protección de Datos.</span>
              </label>

              <button
                type="submit"
                disabled={!formData.acepto_terminos}
                className="w-full px-6 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:opacity-50"
              >
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