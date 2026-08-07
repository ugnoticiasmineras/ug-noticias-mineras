// pages/proyectos-mineros-san-juan.js
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const SITE_URL = 'https://ugnoticiasmineras.com';

const ProyectosSanJuan = () => {
  const proyectos = [
    {
      nombre: "Veladero",
      ubicacion: "Departamento Iglesia (Valle del Cura)",
      mineral: "Oro y plata",
      empresa: "Barrick Gold (62,5%, operador) y Shandong Gold (37,5%)",
      estado: "Operación",
      descripcion: "En producción desde 2005, es una de las minas de oro más importantes de Sudamérica. Mantiene inversiones sostenidas y exploración en zonas aledañas; se evalúan sinergias logísticas con los proyectos cupríferos del distrito Vicuña."
    },
    {
      nombre: "Casposo",
      ubicacion: "Departamento Calingasta",
      mineral: "Oro y plata",
      empresa: "Casposo Argentina Ltd.",
      estado: "Operación (reactivada en 2025)",
      descripcion: "Reanudó la producción comercial en 2025 tras la modernización de planta. Genera empleo directo e indirecto en Calingasta y funciona como polo de procesamiento para proyectos cercanos mediante acuerdos de maquila."
    },
    {
      nombre: "Hualilán",
      ubicacion: "Departamento Ullum",
      mineral: "Oro y plata",
      empresa: "Challenger Gold (Australia)",
      estado: "Construcción / inicio productivo 2026",
      descripcion: "Primer proyecto aurífero en entrar en producción en Ullum. El mineral se procesará inicialmente en la planta de Casposo bajo acuerdo de maquila; avanza la construcción de mina e infraestructura."
    },
    {
      nombre: "Los Azules",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre",
      empresa: "McEwen Copper (con Rio Tinto, Stellantis y Mitsubishi como accionistas)",
      estado: "Aprobado en RIGI – Evaluación ambiental en curso",
      descripcion: "Primer proyecto minero aprobado en el RIGI (2024). Uno de los yacimientos de cobre más grandes del mundo, a 3.500 msnm. Inversión proyectada de USD 2.700 millones; construcción estimada hacia 2027 y primera producción al cierre de la década."
    },
    {
      nombre: "Vicuña (Josemaría + Filo del Sol)",
      ubicacion: "Departamento Iglesia (frontera con Chile)",
      mineral: "Cobre, oro y plata",
      empresa: "Vicuña Corp (Lundin Mining y BHP, 50/50)",
      estado: "Estudio de factibilidad / preparación para construcción",
      descripcion: "Integración de Josemaría y Filo del Sol en un único desarrollo cuprífero con economías de escala compartidas. Estudio de factibilidad e ingeniería básica 2025-2026; inversión estimada superior a USD 5.000 millones; emplazado a más de 4.000 msnm."
    },
    {
      nombre: "Luna Huasi",
      ubicacion: "Distrito Vicuña, Cordillera de los Andes",
      mineral: "Cobre, oro y plata",
      empresa: "NGEx Minerals (Grupo Lundin, Canadá)",
      estado: "Exploración avanzada",
      descripcion: "Las campañas de perforación 2024-2025 confirmaron mineralización de cobre de alta ley, con recursos que en estimaciones iniciales podrían superar a los de Filo del Sol y Josemaría. Uno de los programas de exploración más activos de San Juan."
    },
    {
      nombre: "Pachón",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre y molibdeno",
      empresa: "Glencore",
      estado: "Estudio de factibilidad",
      descripcion: "Ubicado a 5 km de la frontera con Chile, a más de 3.600 msnm. Estudio de factibilidad en curso (2025-2026); uno de los mayores depósitos de cobre del país, con proyección de vida útil de varias décadas."
    },
    {
      nombre: "Altar",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre, oro y plata",
      empresa: "Aldebaran Resources (80%) y Sibanye-Stillwater (20%)",
      estado: "Estudio Económico Preliminar aprobado",
      descripcion: "Vida útil estimada de 48 años y VAN cercano a USD 2.000 millones. Se evalúa el uso de tecnología Nuton (Rio Tinto) para lixiviación de sulfuros; actualización de estudios en curso."
    },
    {
      nombre: "Gualcamayo",
      ubicacion: "Departamento Jáchal",
      mineral: "Oro y plata",
      empresa: "Grupo AISA (España) / Minera Andes de Oro",
      estado: "Evaluación de reactivación / exploración avanzada",
      descripcion: "Proyecto con alto potencial en carbonatos profundos. Fase de evaluación de la zona subterránea y reactivación con miras a una producción sostenible en el norte sanjuanino."
    },
    {
      nombre: "Chita",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre y plata",
      empresa: "Minsud Resources, con South32 como socio (acuerdo de opción)",
      estado: "Exploración",
      descripcion: "Ubicado a 35 km de Bella Vista, a 3.300 msnm. South32 avanza en su acuerdo de opción con campañas de perforación que confirman mineralización de pórfido cupro-aurífero."
    },
    {
      nombre: "El Fierro",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre, oro y molibdeno",
      empresa: "Moxico Resources (adquirió Sable Resources)",
      estado: "Exploración",
      descripcion: "Sistema magmático-hidrotermal con varias zonas: Fierro Alto, Fierro Bajo, La Verde y Lagunitas. Cerca de Don Julio y Filo del Sol; campañas de perforación 2025."
    },
    {
      nombre: "Coipita",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre y oro",
      empresa: "Anglo American (ex Teck Resources)",
      estado: "Exploración",
      descripcion: "Propiedad de 70.000 hectáreas en un cinturón de pórfidos, en el corazón del distrito minero de Calingasta. Anglo American avanzó en el acuerdo para quedarse con el proyecto tras la salida de Teck; alto potencial geológico."
    },
    {
      nombre: "Manantiales",
      ubicacion: "Departamento Calingasta",
      mineral: "Oro y plata",
      empresa: "Casposo Argentina Ltd. (Hochschild Mining / Austral Gold)",
      estado: "Exploración avanzada",
      descripcion: "Proyecto para extender la vida de la mina Casposo. Recursos estimados en 57.860 oz de oro equivalente (mayo 2024). Procesamiento previsto en la planta de Casposo (9 km)."
    },
    {
      nombre: "Nacimiento",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre",
      empresa: "Fortescue Metals Group (Australia)",
      estado: "Exploración inicial",
      descripcion: "A más de 3.500 msnm, cerca de Rodeo. Parte de la cartera argentina de Fortescue para minerales críticos en la transición energética."
    },
    {
      nombre: "Sayanca",
      ubicacion: "Departamento Iglesia, Cordillera Frontal",
      mineral: "Cobre, oro y plata",
      empresa: "Fortescue Argentina SAU",
      estado: "Exploración",
      descripcion: "Colindante al proyecto Nacimiento. Sistema de pórfidos con sobreimposición epitermal; parte del portafolio de Fortescue en San Juan."
    },
    {
      nombre: "San Francisco",
      ubicacion: "Departamento Calingasta",
      mineral: "Oro, plata, cobre y molibdeno",
      empresa: "Turmalina Metals (Canadá)",
      estado: "Exploración (en proceso de venta)",
      descripcion: "Exploración en brechas de turmalina y vetas epitermales. La empresa evalúa su desinversión para enfocarse en Perú."
    },
    {
      nombre: "Del Carmen",
      ubicacion: "Departamento Iglesia, Valle del Cura",
      mineral: "Oro y plata",
      empresa: "Boroo (Perú)",
      estado: "Recién adjudicado (2025) – reinicio de exploración",
      descripcion: "Anteriormente en manos de Barrick Gold, devuelto al IPEEM en 2023. Boroo se adjudicó la concesión en 2025 para retomar la exploración y el desarrollo."
    },
    {
      nombre: "Jagüelito",
      ubicacion: "Distrito Valle del Cura, Departamento Iglesia",
      mineral: "Oro y plata",
      empresa: "Propiedad del IPEEM – en licitación",
      estado: "En proceso de concesión",
      descripcion: "Depósito epitermal de alta sulfuración, similar a Veladero. Ha sido explorado por Peñoles, Minera IRL y Austral Gold. Actualmente en concurso público."
    },
    {
      nombre: "La Ortiga",
      ubicacion: "Distrito Valle del Cura, Departamento Iglesia",
      mineral: "Oro y plata",
      empresa: "Minera del Carmen S.A.",
      estado: "Exploración",
      descripcion: "Entre 3.700 y 4.700 msnm, cerca de Veladero y Lama. Proyecto estratégico con participación del Estado provincial."
    },
    {
      nombre: "TMT (Toro-Malambo-Tambo)",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre y oro",
      empresa: "Belararox Limited (Australia)",
      estado: "Exploración",
      descripcion: "Ubicado entre Josemaría y Veladero. Campañas de perforación y geofísica en curso para confirmar mineralización en Tambo Sur y Malambo."
    },
    {
      nombre: "Amarillo II, Los Despoblados y Zaat",
      ubicacion: "Departamento Iglesia, Cordillera Frontal",
      mineral: "Oro, plata y cobre",
      empresa: "Minera del Carmen S.A.",
      estado: "Exploración",
      descripcion: "Ubicados a 350 km de San Juan capital, en la faja metalogénica El Indio. Con más de 4.400 metros de perforación. Sistemas hidrotermales controlados por fallas norte-sur."
    },
    {
      nombre: "Pascua-Lama",
      ubicacion: "Departamento Iglesia (frontera Argentina–Chile)",
      mineral: "Oro, plata y cobre",
      empresa: "Barrick Gold",
      estado: "Suspendido / cuidado y mantenimiento",
      descripcion: "Proyecto binacional suspendido del lado chileno por sanciones ambientales y factores económicos. El lado argentino permanece bajo cuidado y mantenimiento; su infraestructura se considera un activo potencial para futuros desarrollos de la región."
    }
  ];

  return (
    <Layout currentDate={new Date().toISOString()}>
      <Head>
        <title>Mapa de Proyectos Mineros de San Juan 2026 | UG Noticias Mineras</title>
        <meta name="description" content="Guía técnica actualizada 2026 de los proyectos mineros en San Juan: Veladero, Los Azules (RIGI), Vicuña (Josemaría + Filo del Sol), Hualilán, Casposo y más. Empresas, ubicación, estado y recursos." />
        <meta property="og:title" content="Mapa de Proyectos Mineros de San Juan 2026 | UG Noticias Mineras" />
        <meta property="og:description" content="Guía técnica actualizada 2026 de los proyectos mineros en San Juan: empresas, ubicación, estado de desarrollo y recursos." />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta property="og:url" content={`${SITE_URL}/proyectos-mineros-san-juan`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="UG Noticias Mineras" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mapa de Proyectos Mineros de San Juan 2026 | UG Noticias Mineras" />
        <meta name="twitter:description" content="Guía técnica actualizada de los proyectos mineros en San Juan." />
        <meta name="twitter:image" content={`${SITE_URL}/logo.png`} />
        <link rel="canonical" href={`${SITE_URL}/proyectos-mineros-san-juan`} />
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-6">
          Mapa de Proyectos Mineros de San Juan 2026
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          San Juan alberga algunos de los proyectos mineros más relevantes de Argentina y Sudamérica,
          con presencia de oro, plata, cobre y litio. Esta guía técnica reúne información actualizada
          sobre operadores, ubicación, estado de desarrollo y contexto geológico de más de 20 proyectos
          en los departamentos de Iglesia, Calingasta, Jáchal y Ullum, incluyendo los primeros proyectos
          aprobados bajo el régimen RIGI.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-6">
          Información compilada a agosto de 2026 a partir de fuentes públicas (comunicados de compañías,
          Secretaría de Minería de San Juan y organismos provinciales). El estado de los proyectos puede
          variar según estudios, aprobaciones ambientales y decisiones de inversión.
        </p>
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 h-1 w-24 mb-8"></div>
        <div className="space-y-8">
          {proyectos.map((proyecto, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">
                  {proyecto.nombre}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">📍 Ubicación:</span>{' '}
                    {proyecto.ubicacion}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">⛏️ Mineral:</span>{' '}
                    {proyecto.mineral}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">🏢 Empresa:</span>{' '}
                    {proyecto.empresa}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">📊 Estado:</span>{' '}
                    <span className={
                      proyecto.estado === 'Operación' || proyecto.estado.startsWith('Operación')
                        ? 'text-green-600'
                        : proyecto.estado.includes('Suspendido')
                        ? 'text-red-600'
                        : proyecto.estado.includes('Exploración')
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }>
                      {proyecto.estado}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  {proyecto.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/" legacyBehavior>
            <a className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all">
              Volver al inicio
            </a>
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 italic text-center">
          Última actualización: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </Layout>
  );
};

export default ProyectosSanJuan;
