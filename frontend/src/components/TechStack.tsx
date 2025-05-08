import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReact, FaGitAlt, FaDocker, FaNpm, FaBootstrap, FaChevronLeft, FaChevronRight, FaJava, FaNode, FaServer } from 'react-icons/fa';
import { SiTypescript, SiVite, SiVercel, SiLaravel, SiMysql, SiRailway, SiNextdotjs, SiVuedotjs, SiPython, SiCplusplus, SiDotnet, SiJquery, SiPostman, SiTailwindcss, 
  SiRedux, 
  SiSass, 
  SiExpress, 
  SiCypress,
  SiJira,
  SiXml,
  SiJson
} from 'react-icons/si';
import { TbBrandFramerMotion, TbBrandGatsby } from 'react-icons/tb';
import { DiPhp, DiScrum } from 'react-icons/di';
import useViewportSizes from '@/hooks/useViewportSizes';
import "@/styles/teckstack.css";

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

type TechItem = {
  icon: JSX.Element;
  name: string;
  color: string;
  desc: string;
  since: string;
  featured: string[];
  category: 'frontend' | 'backend' | 'tools';
  related?: string[];
};

type TechCategory = 'frontend' | 'backend' | 'tools';

interface TechStackProps {
  onDetailPanelVisibilityChange?: (isVisible: boolean) => void;
}

const TechStack = ({ onDetailPanelVisibilityChange }: TechStackProps) => {
  const [activeCategory, setActiveCategory] = useState<TechCategory>('frontend');
  const [activeTech, setActiveTech] = useState<TechItem | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const techData: TechItem[] = [
    // Frontend
    { 
      icon: <FaReact size={24} />, 
      name: "React", 
      color: "#61DAFB", 
      desc: "Usado para construir interfaces dinámicas en plataformas educativas y dashboards administrativos con renderizado eficiente",
      since: "2023",
      featured: ["Plataformas Educativas", "Dashboard Administrativo", "Sistema de Cursos Online", "Portal Institucional", "Aplicaciones SPA"],
      category: 'frontend'
    },
    { 
      icon: <SiTypescript size={24} />, 
      name: "TypeScript", 
      color: "#3178C6", 
      desc: "Implementado para mejorar la calidad del código en proyectos complejos con tipado estático",
      since: "2023",
      featured: ["Sistema de Gestión", "App de Gestión", "Aplicaciones SPA", "Plataformas Educativas"],
      category: 'frontend'
    },
    { 
      icon: <FaBootstrap size={24} />, 
      name: "Bootstrap", 
      color: "#7952B3", 
      desc: "Utilizado para desarrollar interfaces responsive rápidamente en proyectos con plazos ajustados",
      since: "2015",
      featured: ["Landing Pages", "Portal Institucional", "Implementaciones ligeras con Vue", "Proyectos pequeños con React"],
      category: 'frontend'
    },
    { 
      icon: <SiVite size={24} />, 
      name: "Vite", 
      color: "#646CFF", 
      desc: "Empleado como bundler ultrarrápido para optimizar tiempos de desarrollo en proyectos modernos",
      since: "2023",
      featured: ["Aplicaciones SPA", "Proyectos con React", "Landing Pages", "Sistema de Cursos Online"],
      category: 'frontend'
    },
    { 
      icon: <TbBrandFramerMotion size={24} />, 
      name: "Framer Motion", 
      color: "#0055FF", 
      desc: "Integrado para crear transiciones fluidas y microinteracciones en interfaces de usuario",
      since: "2024",
      featured: ["Dashboard Administrativo", "Plataformas Educativas", "Aplicaciones SPA", "eCommerce"],
      category: 'frontend'
    },
    { 
      icon: <TbBrandGatsby size={24} />, 
      name: "GSAP", 
      color: "#88CE02", 
      desc: "Usado para implementar animaciones complejas y efectos de scroll en proyectos destacados",
      since: "2024",
      featured: ["Landing Pages", "Portal Institucional", "eCommerce", "Proyectos pequeños con React"],
      category: 'frontend'
    },
    { 
      icon: <SiNextdotjs size={24} />, 
      name: "Next.js", 
      color: "#000000", 
      desc: "Utilizado para proyectos que requieren renderizado del lado del servidor y mejor SEO",
      since: "2023",
      featured: ["Plataformas Educativas", "Portal Institucional", "eCommerce", "Sistema de Gestión"],
      category: 'frontend'
    },
    { 
      icon: <SiVuedotjs size={24} />, 
      name: "Vue.js", 
      color: "#4FC08D", 
      desc: "Implementado en proyectos que requieren desarrollo rápido con arquitectura componentizada",
      since: "2023",
      featured: ["Implementaciones ligeras con Vue", "App de Gestión", "Sistema de Cursos Online", "Landing Pages"],
      category: 'frontend'
    },
    { 
      icon: <SiJquery size={24} />, 
      name: "jQuery", 
      color: "#0769AD", 
      desc: "Usado en proyectos legacy y para implementar funcionalidades básicas de forma rápida, como biblioteca de javascript",
      since: "2023",
      featured: ["Sitios web tradicionales", "Portal Institucional", "Landing Pages", "Proyectos pequeños con React"],
      category: 'frontend'
    },
    { 
      icon: <SiTailwindcss size={24} />, 
      name: "Tailwind CSS", 
      color: "#06B6D4", 
      desc: "Utilizado para crear diseños personalizados rápidamente sin salir del HTML",
      since: "2023",
      featured: ["Aplicaciones modernas", "Dashboard Administrativo", "Plataformas Educativas", "Landing Pages"],
      category: 'frontend'
    },
    { 
      icon: <SiRedux size={24} />, 
      name: "Redux", 
      color: "#764ABC", 
      desc: "Implementado para manejar estado global en aplicaciones complejas con múltiples componentes",
      since: "2023",
      featured: ["Sistema de Gestión", "Plataformas Educativas", "Dashboard Administrativo", "Aplicaciones SPA"],
      category: 'frontend'
    },
    { 
      icon: <SiSass size={24} />, 
      name: "Sass/SCSS", 
      color: "#CC6699", 
      desc: "Usado para escribir CSS más mantenible con variables, mixins y funciones avanzadas",
      since: "2016",
      featured: ["Sistemas de diseño", "Plataformas Educativas", "Portal Institucional", "eCommerce"],
      category: 'frontend'
    },
    
    // Backend
    { 
      icon: <SiLaravel size={24} />, 
      name: "Laravel", 
      color: "#FF2D20", 
      desc: "Framework principal para desarrollar APIs robustas y sistemas de gestión completos",
      since: "2023",
      featured: ["Plataformas Educativas", "Sistema de Gestión", "Dashboard Administrativo", "Sistema de Cursos Online"],
      category: 'backend'
    },
    { 
      icon: <SiLaravel size={24} />, 
      name: "Laravel Eloquent", 
      color: "#FF2D20", 
      desc: "ORM utilizado para interactuar con bases de datos de forma intuitiva y productiva",
      since: "2023",
      featured: ["Modelos de datos complejos", "Plataformas Educativas", "Sistema de Gestión", "App de Gestión"],
      category: 'backend'
    },
    { 
      icon: <DiPhp size={24} />, 
      name: "PHP", 
      color: "#777BB4", 
      desc: "Lenguaje backend para desarrollar lógica de negocio e integraciones personalizadas",
      since: "2016",
      featured: ["Backends personalizados", "Portal Institucional", "Sistema de Cursos Online", "Integraciones"],
      category: 'backend'
    },
    { 
      icon: <SiMysql size={24} />, 
      name: "MySQL", 
      color: "#4479A1", 
      desc: "Sistema de gestión de bases de datos relacional para almacenar información estructurada",
      since: "2016",
      featured: ["Plataformas Educativas", "Sistema de Gestión", "Dashboard Administrativo", "eCommerce"],
      category: 'backend'
    },
    { 
      icon: <FaNode size={24} />, 
      name: "Node.js", 
      color: "#539E43", 
      desc: "Entorno de ejecución para construir APIs escalables y aplicaciones en tiempo real",
      since: "2023",
      featured: ["APIs escalables", "App de Gestión", "Sistema de Cursos Online", "Aplicaciones SPA"],
      category: 'backend'
    },
    { 
      icon: <SiExpress size={24} />, 
      name: "Express.js", 
      color: "#000000", 
      desc: "Framework minimalista para crear APIs RESTful y aplicaciones web con Node.js",
      since: "2023",
      featured: ["APIs RESTful", "Sistema de Gestión", "App de Gestión", "Aplicaciones web"],
      category: 'backend'
    },
    { 
      icon: <SiPython size={24} />, 
      name: "Python", 
      color: "#3776AB", 
      desc: "Utilizado para scripting, automatización y desarrollo de backends especializados",
      since: "2016",
      featured: ["Automatización", "Backends", "Scripting", "Sistema de Gestión"],
      category: 'backend'
    },
    { 
      icon: <SiCplusplus size={24} />, 
      name: "C++", 
      color: "#00599C", 
      desc: "Empleado en proyectos que requieren alto rendimiento y eficiencia computacional",
      since: "2016",
      featured: ["Aplicaciones de alto rendimiento", "Sistemas embebidos", "Procesamiento de datos"],
      category: 'backend'
    },
    { 
      icon: <FaJava size={24} />, 
      name: "Java", 
      color: "#007396", 
      desc: "Usado para desarrollar aplicaciones empresariales robustas y mantenibles",
      since: "2016",
      featured: ["Aplicaciones empresariales", "Sistema de Gestión", "Backends complejos"],
      category: 'backend'
    },
    { 
      icon: <SiDotnet size={24} />, 
      name: ".NET", 
      color: "#512BD4", 
      desc: "Framework para desarrollar aplicaciones Windows y APIs empresariales escalables",
      since: "2023",
      featured: ["APIs empresariales", "Aplicaciones Windows", "Sistema de Gestión"],
      category: 'backend'
    },
    { 
      icon: <FaServer size={24} />, 
      name: "RESTful APIs", 
      color: "#FF6B6B", 
      desc: "Arquitectura principal para diseñar servicios web escalables e integrables",
      since: "2016",
      featured: ["Plataformas Educativas", "Sistema de Gestión", "Dashboard Administrativo", "App de Gestión"],
      category: 'backend'
    },
    
    // Tools
    { 
      icon: <FaGitAlt size={24} />, 
      name: "Git", 
      color: "#F05032", 
      desc: "Sistema de control de versiones utilizado en todos los proyectos para colaboración",
      since: "2016",
      featured: ["Control de versiones", "Trabajo en equipo", "Integración continua"],
      category: 'tools'
    },
    { 
      icon: <FaDocker size={24} />, 
      name: "Docker", 
      color: "#2496ED", 
      desc: "Usado para contenerizar aplicaciones y garantizar entornos de desarrollo consistentes",
      since: "2023",
      featured: ["Plataformas Educativas", "Sistema de Gestión", "APIs", "Microservicios"],
      category: 'tools'
    },
    { 
      icon: <DiScrum size={24} />, 
      name: "Scrum", 
      color: "#009FDA", 
      desc: "Metodología ágil implementada para gestionar proyectos de desarrollo eficientemente",
      since: "2023",
      featured: ["Gestión de proyectos", "Planificación de sprints", "Desarrollo iterativo"],
      category: 'tools'
    },
    { 
      icon: <SiJira size={24} />, 
      name: "Jira", 
      color: "#0052CC", 
      desc: "Herramienta principal para seguimiento de tareas y gestión ágil de proyectos",
      since: "2023",
      featured: ["Seguimiento de tareas", "Tableros Scrum", "Reportes de progreso"],
      category: 'tools'
    },
    { 
      icon: <SiJson size={24} />, 
      name: "JSON", 
      color: "#000000", 
      desc: "Formato estándar para intercambio de datos entre frontend y backend",
      since: "2016",
      featured: ["APIs", "Configuraciones", "Almacenamiento estructurado"],
      category: 'tools'
    },
    { 
      icon: <SiXml size={24} />, 
      name: "XML", 
      color: "#005A9C", 
      desc: "Utilizado para integraciones con sistemas legacy y servicios empresariales",
      since: "2016",
      featured: ["Integraciones empresariales", "SOAP APIs", "Sistemas legacy"],
      category: 'tools'
    },
    { 
      icon: <FaNpm size={24} />, 
      name: "npm", 
      color: "#CB3837", 
      desc: "Gestor de paquetes principal para instalar y administrar dependencias JavaScript",
      since: "2023",
      featured: ["Gestión de dependencias", "Scripts personalizados", "Paquetes reutilizables"],
      category: 'tools'
    },
    { 
      icon: <SiPostman size={24} />, 
      name: "Postman", 
      color: "#FF6C37", 
      desc: "Herramienta esencial para probar, documentar y mockear APIs RESTful",
      since: "2016",
      featured: ["Testing APIs", "Documentación", "Mock servers", "Integraciones"],
      category: 'tools'
    },
    { 
      icon: <SiVercel size={24} />, 
      name: "Vercel", 
      color: "#000000", 
      desc: "Plataforma preferida para deployar aplicaciones frontend con integración continua",
      since: "2025",
      featured: ["Plataformas Educativas", "Landing Pages", "Aplicaciones SPA", "Proyectos con React"],
      category: 'tools'
    },
    { 
      icon: <SiRailway size={24} />, 
      name: "Railway", 
      color: "#0B0D0E", 
      desc: "Usado para deployar aplicaciones backend y APIs con configuración simplificada",
      since: "2025",
      featured: ["Deploy de APIs", "Plataformas Educativas", "Sistema de Gestión", "Entornos de prueba"],
      category: 'tools'
    },
    { 
      icon: <SiCypress size={24} />, 
      name: "Cypress", 
      color: "#17202C", 
      desc: "Implementado para testing end-to-end y garantizar calidad en aplicaciones web",
      since: "2023",
      featured: ["Plataformas Educativas", "Dashboard Administrativo", "Aplicaciones SPA", "eCommerce"],
      category: 'tools'
    }
];

  // Group by category
  const techCategories = {
    frontend: techData.filter(tech => tech.category === 'frontend'),
    backend: techData.filter(tech => tech.category === 'backend'),
    tools: techData.filter(tech => tech.category === 'tools')
  };

  const currentTechs = techCategories[activeCategory];
  const visibleTechs = currentTechs.slice(scrollIndex, scrollIndex + 5);

  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'left' && scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1);
    } else if (direction === 'right' && scrollIndex < currentTechs.length - 5) {
      setScrollIndex(scrollIndex + 1);
    }
  };

  return (
    <div 
      className="tech-stack-container" 
      style={{
        background: 'transparent',
        padding: '2rem clamp(1rem, 5vw, 3rem)',
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <h2 className="tech-stack-title">My Tech Stack</h2>
      
      {/* Categories selector */}
      <div className="tech-categories">
        {Object.keys(techCategories).map((category) => (
          <button
            key={category}
            className={`tech-category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(category as TechCategory);
              setScrollIndex(0);
              setActiveTech(null);
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Tech cards carousel */}
      <div className="tech-cards-row-container">
        {scrollIndex > 0 && (
          <button 
            className="tech-scroll-button left"
            onClick={() => handleScroll('left')}
          >
            <FaChevronLeft />
          </button>
        )}

        <div className="tech-cards-row">
          {visibleTechs.map((tech) => (
            <motion.div
              key={tech.name}
              className="tech-card"
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onHoverStart={() => {
                setActiveTech(tech);
                if (onDetailPanelVisibilityChange) {
                  onDetailPanelVisibilityChange(true);
                }
              }}
              onHoverEnd={() => {
                setActiveTech(null);
                if (onDetailPanelVisibilityChange) {
                  onDetailPanelVisibilityChange(false);
                }
              }}
              style={{ '--tech-color': tech.color } as React.CSSProperties}
            >
              <motion.div
                className="tech-card-inner"
                initial={false}
                animate={{ rotateY: activeTech?.name === tech.name ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="tech-card-front">
                  <div className="tech-card-icon" style={{ color: tech.color }}>
                    {React.cloneElement(tech.icon, { size: 45 })}
                  </div>
                  <h3 className="tech-card-name">{tech.name}</h3>
                </div>
                
                <div className="tech-card-back">
                  <div className="tech-card-icon" style={{ color: tech.color }}>
                    {React.cloneElement(tech.icon, { size: 36 })}
                  </div>
                  <div className="tech-card-meta">
                    <span>Since {tech.since}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {scrollIndex < currentTechs.length - 5 && (
          <button 
            className="tech-scroll-button right"
            onClick={() => handleScroll('right')}
          >
            <FaChevronRight />
          </button>
        )}
      </div>
      
      {/* Tech detail panel */}
      <AnimatePresence>
        {activeTech && (
          <motion.div
            className="tech-detail-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                type: "spring",
                damping: 25,
                stiffness: 300
              }
            }}
            exit={{ 
              opacity: 0, 
              y: 20,
              transition: { duration: 0.2 }
            }}
          >
            <div className="tech-detail-content">
              <h3 className="tech-detail-name" style={{ color: activeTech.color }}>
                {activeTech.name}
              </h3>
              <p className="tech-detail-desc">{activeTech.desc}</p>
              <div className="tech-detail-projects">
                <h4>Usado en proyectos:</h4>
                <ul>
                  {activeTech.featured.map((project, i) => (
                    <li key={i}>{project}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="tech-detail-pattern"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechStack;