// pages/proyectos-mineros-san-juan.js
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const SITE_URL = 'https://ugnoticiasmineras.com';

const ProyectosSanJuan = () => {
  const proyectos = [
    {
      nombre: "Veladero",
      ubicacion: "Departamento Iglesia",
      mineral: "Oro y plata",
      empresa: "Barrick Gold",
      estado: "Operación",
      empleo: "Más de 1.500 trabajadores (mayoría AOMA)",
      descripcion: "Una de las minas de oro más importantes de Argentina. Operada por Barrick, es fuente clave de empleo para la región y está bajo el convenio colectivo de AOMA."
    },
    {
      nombre: "Gualcamayo",
      ubicacion: "Departamento Iglesia",
      mineral: "Oro",
      empresa: "McEwen Mining",
      estado: "Exploración avanzada / Reapertura",
      empleo: "Potencial de 500+ empleos directos",
      descripcion: "Proyecto aurífero en fase de evaluación para reactivación. La reapertura generaría cientos de puestos de trabajo sindicalizados en la zona de Iglesia."
    },
    {
      nombre: "Casposo",
      ubicacion: "Departamento Iglesia",
      mineral: "Oro y plata",
      empresa: "Covalent Lithium (antes SSR Mining)",
      estado: "Operación (baja escala)",
      empleo: "Personal reducido, con posibilidad de expansión",
      descripcion: "Mina en operación con capacidad de crecimiento. Su desarrollo futuro dependerá del contexto económico y el precio del oro."
    },
    {
      nombre: "José María",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre, oro y plata",
      empresa: "Los Azules Copper (filial de McEwen Copper)",
      estado: "Exploración avanzada",
      empleo: "En fase de desarrollo — proyección de 1.000+ empleos",
      descripcion: "Proyecto estratégico en Calingasta, en la misma zona de Los Azules. Forma parte del corredor metalífero más prometedor de San Juan."
    },
    {
      nombre: "Filo del Sol",
      ubicacion: "Límite San Juan-La Rioja",
      mineral: "Cobre, oro y plata",
      empresa: "Lundin Mining (a través de Filo Corp)",
      estado: "Estudio de factibilidad",
      empleo: "Estimado de 3.000 empleos en construcción, 1.000 en operación",
      descripcion: "Uno de los proyectos mineros más grandes de Sudamérica. Aunque comparte ubicación con La Rioja, su impacto en San Juan es significativo."
    },
    {
      nombre: "Hualilán",
      ubicacion: "Departamento Iglesia",
      mineral: "Litio",
      empresa: "Argentina Lithium & Energy",
      estado: "Exploración",
      empleo: "Futuro potencial en cadena de litio",
      descripcion: "Proyecto de litio en etapa inicial. Su desarrollo se alinea con la política provincial de diversificación hacia minerales críticos."
    },
    {
      nombre: "Luna Hua**s**i",
      ubicacion: "Departamento Calingasta",
      mineral: "Litio",
      empresa: "Luna Lithium (alianza local)",
      estado: "Exploración temprana",
      empleo: "En estudio — posible integración con proyectos de baterías",
      descripcion: "Iniciativa regional para aprovechar salares no tradicionales. Aún en fases iniciales, pero con apoyo provincial."
    },
    {
      nombre: "Los Azules",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre (uno de los yacimientos más grandes del mundo)",
      empresa: "McEwen Copper (subsidiaria de Rob McEwen)",
      estado: "Estudio de impacto ambiental (EIA) en curso",
      empleo: "Proyección de 2.500 empleos directos en operación",
      descripcion: "El proyecto minero más importante de San Juan en la próxima década. AOMA ha acompañado su desarrollo y exige condiciones laborales dignas desde la fase de construcción."
    },
    {
      nombre: "Altar",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre, oro y plata",
      empresa: "Mirva Exploration (alianza con Yamana Gold)",
      estado: "Exploración avanzada",
      empleo: "Potencial de 800+ empleos en operación",
      descripcion: "Proyecto con alto potencial metalúrgico. Su avance depende de estudios ambientales y sociales en curso."
    }
  ];

  return (
    <Layout currentDate={new Date().toISOString()}>
      <Head>
        <title>Mapa de Proyectos Mineros de San Juan 2025 | UG Noticias Mineras</title>
        <meta name="description" content="Guía actualizada de todos los proyectos mineros en San Juan: Veladero, Los Azules, Gualcamayo, Hualilán y más. Estado, empresas, empleo y rol de AOMA." />
        <meta property="og:title" content="Mapa de Proyectos Mineros de San Juan 2025 | UG Noticias Mineras" />
        <meta property="og:description" content="Guía actualizada de todos los proyectos mineros en San Juan: Veladero, Los Azules, Gualcamayo, Hualilán y más. Estado, empresas, empleo y rol de AOMA." />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta property="og:url" content={`${SITE_URL}/proyectos-mineros-san-juan`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="UG Noticias Mineras" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mapa de Proyectos Mineros de San Juan 2025 | UG Noticias Mineras" />
        <meta name="twitter:description" content="Guía actualizada de todos los proyectos mineros en San Juan: Veladero, Los Azules, Gualcamayo, Hualilán y más." />
        <meta name="twitter:image" content={`${SITE_URL}/logo.png`} />
        <link rel="canonical" href={`${SITE_URL}/proyectos-mineros-san-juan`} />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-6">
          Mapa de Proyectos Mineros de San Juan 2025
        </h1>
        
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          San Juan es una de las provincias con mayor potencial minero de Argentina. 
          Aquí encontrarás un resumen actualizado de los principales proyectos en operación, construcción y exploración, 
          con enfoque en empleo, sindicalización (AOMA) y desarrollo regional.
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
                    <span className={proyecto.estado === 'Operación' ? 'text-green-600' : proyecto.estado.includes('Exploración') ? 'text-yellow-600' : 'text-blue-600'}>
                      {proyecto.estado}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">👷 Empleo:</span>{' '}
                    {proyecto.empleo}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  {proyecto.descripcion}
                </p>
                {/* Aquí podrás enlazar a noticias específicas en el futuro */}
                {/* Ej: <Link href="/noticia/sanjuan/los-azules-avanza-eia" className="text-blue-600 hover:underline">Ver noticia reciente</Link> */}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-blue-50 dark:bg-gray-900 rounded-2xl border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-lg text-blue-900 dark:text-blue-200 mb-3">
            ¿Querés estar al tanto de las novedades mineras en San Juan?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Seguí a <strong>UG Noticias Mineras</strong> para cobertura exclusiva sobre negociaciones salariales, 
            avances de proyectos y la voz del sindicato AOMA.
          </p>
          <Link href="/" legacyBehavior>
            <a className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all">
              Ver últimas noticias
            </a>
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 italic">
          Última actualización: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </Layout>
  );
};

export default ProyectosSanJuan;