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
      empresa: "Barrick Gold (Canadá) y Shandong Gold (China)",
      estado: "Operación",
      descripcion: "Una de las minas de oro más importantes de Argentina, ubicada a gran altura en el Valle del Cura. Opera de forma conjunta entre Barrick y Shandong Gold, con producción estable desde 2005."
    },
    {
      nombre: "Gualcamayo",
      ubicacion: "Departamento Jachal",
      mineral: "Oro y plata",
      empresa: "Grupo AISA (España)",
      estado: "Exploración avanzada",
      descripcion: "Proyecto con alto potencial en carbonatos profundos. En fase de evaluación para reactivación con miras a una producción sostenible en el norte sanjuanino."
    },
    {
      nombre: "Casposo",
      ubicacion: "Departamento Calingasta",
      mineral: "Oro y plata",
      empresa: "Austral Gold",
      estado: "Operación (reactivada en 2025)",
      descripcion: "La producción comercial se reanudó en 2025 tras modernización de planta. Genera empleo directo e indirecto y contribuye al desarrollo minero de Calingasta."
    },
    {
      nombre: "Los Azules",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre",
      empresa: "McEwen Copper (Canadá), con apoyo de Rio Tinto y Stellantis",
      estado: "Aprobado en RIGI – Estudio de Impacto Ambiental en curso",
      descripcion: "Uno de los yacimientos de cobre más grandes del mundo. Ubicado a 3.500 msnm, cerca de la frontera con Chile. Inversión proyectada de USD 2.700 millones."
    },
    {
      nombre: "Hualilán",
      ubicacion: "Departamento Ullum",
      mineral: "Oro y plata",
      empresa: "Challenger Gold (Australia)",
      estado: "Inicio de producción previsto para finales de 2025",
      descripcion: "Primer proyecto aurífero en iniciar producción en Ullum. El mineral se procesará inicialmente en la planta de Casposo bajo acuerdo de maquila."
    },
    {
      nombre: "Filo del Sol",
      ubicacion: "Departamento Iglesia (frontera con Chile)",
      mineral: "Cobre, oro y plata",
      empresa: "Vicuña Corp (Lundin Mining y BHP, 50/50)",
      estado: "Desarrollo avanzado",
      descripcion: "Parte de un “super proyecto” integrado con Josemaría. Se ubica en el Distrito Vicuña, con economías de escala compartidas y enfoque en sostenibilidad."
    },
    {
      nombre: "Josemaría",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre, oro y plata",
      empresa: "Vicuña Corp (Lundin Mining y BHP)",
      estado: "Preparación para construcción",
      descripcion: "Ubicado a 4.100 msnm, en zona cordillerana. En etapa final de ingeniería, con énfasis en uso responsable del agua y licencia social."
    },
    {
      nombre: "Luna Huasi",
      ubicacion: "Distrito Vicuña, Cordillera de los Andes",
      mineral: "Cobre, oro y plata",
      empresa: "NGEx Minerals (Grupo Lundin, Canadá)",
      estado: "Exploración",
      descripcion: "Proyecto con gran potencial, incluso superior a Filo del Sol y Josemaría en recursos iniciales. Forma parte del distrito minero Vicuña."
    },
    {
      nombre: "Altar",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre, oro y plata",
      empresa: "Aldebaran Resources (80%) y Sibanye-Stillwater (20%)",
      estado: "Estudio Económico Preliminar aprobado",
      descripcion: "Vida útil estimada de 48 años. VAN de USD 2.000 millones. Se evalúa el uso de tecnología Nuton (Rio Tinto) para lixiviación de sulfuros."
    },
    {
      nombre: "Pachón",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre y molibdeno",
      empresa: "Glencore",
      estado: "Exploración avanzada",
      descripcion: "Ubicado a 5 km de la frontera con Chile, a más de 3.600 msnm. En fase de perforaciones y estudios de factibilidad para un proyecto de larga vida."
    },
    {
      nombre: "Coipita",
      ubicacion: "Departamento Calingasta",
      mineral: "Cobre y oro",
      empresa: "AbraSilver Resources y Anglo American (ex Teck)",
      estado: "Exploración",
      descripcion: "Propiedad de 70.000 hectáreas en un cinturón de pórfidos. En el corazón del distrito minero de Calingasta, con alto potencial geológico."
    },
    {
      nombre: "Manantiales",
      ubicacion: "Departamento Calingasta",
      mineral: "Oro y plata",
      empresa: "Casposo Argentina Ltd. (Hochschild Mining / Austral Gold)",
      estado: "Exploración avanzada",
      descripcion: "Proyecto para extender la vida de la mina Casposo. Recursos estimados en 57.861 oz de oro equivalente a mayo de 2024. Procesamiento en planta de Casposo (9 km)."
    },
    {
      nombre: "Chita",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre y plata",
      empresa: "Minsud Resources Corp (50.1% South32)",
      estado: "Exploración",
      descripcion: "Ubicado a 35 km de Bella Vista, a 3.300 msnm. South32, líder global, impulsa el desarrollo del yacimiento con recursos significativos de cobre."
    },
    {
      nombre: "El Fierro",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre, oro y molibdeno",
      empresa: "Sable Resources (Canadá) y Moxico Resources (Reino Unido)",
      estado: "Exploración",
      descripcion: "Sistema magmático-hidrotermal en varias zonas: Fierro Alto, Fierro Bajo, La Verde y Lagunitas. Cerca de Don Julio y Filo del Sol."
    },
    {
      nombre: "TMT (Toro-Malambo-Tambo)",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre y oro",
      empresa: "Belararox Limited (Australia)",
      estado: "Exploración",
      descripcion: "Ubicado entre José María y Veladero. Campañas de perforación y geofísica en curso para confirmar mineralización en Tambo Sur y Malambo."
    },
    {
      nombre: "Nacimiento",
      ubicacion: "Departamento Iglesia",
      mineral: "Cobre y oro",
      empresa: "Fortescue Metals Group (Australia)",
      estado: "Exploración inicial",
      descripcion: "A más de 3.500 msnm, cerca de Rodeo. Parte de la cartera argentina de Fortescue para minerales críticos en la transición energética."
    },
    {
      nombre: "San Francisco",
      ubicacion: "Departamento Calingasta",
      mineral: "Oro, plata, cobre y molibdeno",
      empresa: "Turmalina Metals (Canadá)",
      estado: "Exploración avanzada (en proceso de venta)",
      descripcion: "Exploración en brechas de turmalina y vetas epitermales. La empresa evalúa su desinversión para enfocarse en Perú."
    },
    {
      nombre: "Del Carmen",
      ubicacion: "Departamento Iglesia, Valle del Cura",
      mineral: "Oro y plata",
      empresa: "Boroo (Perú)",
      estado: "Recién adjudicado (2025)",
      descripcion: "Anteriormente en manos de Barrick Gold, devuelto al IPEEM en 2023. Boroo se adjudicó la concesión en 2025 para retomar exploración y desarrollo."
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
      nombre: "Sayanca",
      ubicacion: "Departamento Iglesia, Cordillera Frontal",
      mineral: "Cobre, oro y plata",
      empresa: "Fortescue Argentina SAU",
      estado: "Exploración",
      descripcion: "Colindante al proyecto Nacimiento. Sistema de pórfidos con sobreimposición epitermal. Parte del portafolio de Fortescue en San Juan."
    },
    {
      nombre: "Amarillo II, Los Despoblados y Zaat",
      ubicacion: "Departamento Iglesia, Cordillera Frontal",
      mineral: "Oro, plata y cobre",
      empresa: "Minera del Carmen S.A.",
      estado: "Exploración",
      descripcion: "Ubicados a 350 km de San Juan, en la faja metalogénica El Indio. Con más de 4.400 metros de perforación. Sistemas hidrotermales controlados por fallas norte-sur."
    }
  ];

  return (
    <Layout currentDate={new Date().toISOString()}>
      <Head>
        <title>Mapa de Proyectos Mineros de San Juan 2025 | UG Noticias Mineras</title>
        <meta name="description" content="Guía técnica actualizada de los proyectos mineros en San Juan: Veladero, Los Azules, Casposo, Hualilán, Filo del Sol y más. Empresas, ubicación, estado y recursos." />
        <meta property="og:title" content="Mapa de Proyectos Mineros de San Juan 2.