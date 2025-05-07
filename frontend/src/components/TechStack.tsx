import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReact, FaGitAlt, FaDocker, FaNpm, FaBootstrap, FaChevronLeft, FaChevronRight, FaJava, FaNode, FaServer } from 'react-icons/fa';
import { SiTypescript, SiVite, SiVercel, SiLaravel, SiMysql, SiRailway, SiNextdotjs, SiVuedotjs, SiPython, SiCplusplus, SiDotnet, SiJquery, SiPostman, SiTailwindcss,
  SiRedux,
  SiSass,
  SiExpress,
  SiCypress
} from 'react-icons/si';
import { TbBrandFramerMotion, TbBrandGatsby } from 'react-icons/tb';
import { DiPhp } from 'react-icons/di';
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
  projects: number | string;
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
      desc: "Librería JavaScript para construir interfaces de usuario interactivas",
      since: "2020", 
      projects: 15,
      featured: ["Plataforma Educativa", "Dashboard Administrativo"],
      category: 'frontend',
      related: ['TypeScript', 'Vite', 'Framer Motion']
    },
    { 
      icon: <SiTypescript size={24} />, 
      name: "TypeScript", 
      color: "#3178C6", 
      desc: "Superset tipado de JavaScript que mejora la calidad del código",
      since: "2021", 
      projects: 10,
      featured: ["Sistema de Cursos Online", "App de Gestión"],
      category: 'frontend',
      related: ['React', 'Vite']
    },
    { 
      icon: <FaBootstrap size={24} />, 
      name: "Bootstrap", 
      color: "#7952B3", 
      desc: "Framework CSS para desarrollo responsive y rápido",
      since: "2019", 
      projects: 8,
      featured: ["Portal Institucional", "Landing Pages"],
      category: 'frontend',
      related: []
    },
    { 
      icon: <SiVite size={24} />, 
      name: "Vite", 
      color: "#646CFF", 
      desc: "Herramienta de construcción frontend ultrarrápida",
      since: "2022", 
      projects: 7,
      featured: ["Proyectos con React", "Aplicaciones SPA"],
      category: 'frontend',
      related: ['React', 'TypeScript']
    },
    { 
      icon: <TbBrandFramerMotion size={24} />, 
      name: "Framer Motion", 
      color: "#0055FF", 
      desc: "Biblioteca de animaciones para React",
      since: "2021", 
      projects: 9,
      featured: ["Microinteracciones", "Transiciones fluidas"],
      category: 'frontend',
      related: ['React']
    },
    { 
      icon: <TbBrandGatsby size={24} />, 
      name: "GSAP", 
      color: "#88CE02", 
      desc: "Motor de animaciones JavaScript de alto rendimiento",
      since: "2020", 
      projects: 6,
      featured: ["Animaciones complejas", "Efectos scroll"],
      category: 'frontend',
      related: []
    },
    { 
      icon: <SiNextdotjs size={24} />, 
      name: "Next.js", 
      color: "#000000", 
      desc: "Framework de React para aplicaciones web estáticas y servidor",
      since: "2021", 
      projects: 8,
      featured: ["SSR Applications", "Static Sites"],
      category: 'frontend',
      related: ['React']
    },
    { 
      icon: <SiVuedotjs size={24} />, 
      name: "Vue.js", 
      color: "#4FC08D", 
      desc: "Framework progresivo de JavaScript para construir UIs",
      since: "2020", 
      projects: 7,
      featured: ["Aplicaciones interactivas", "SPAs"],
      category: 'frontend',
      related: []
    },
    { 
      icon: <SiJquery size={24} />, 
      name: "jQuery", 
      color: "#0769AD", 
      desc: "Biblioteca JavaScript para manipulación del DOM",
      since: "2018", 
      projects: 10,
      featured: ["Sitios web tradicionales", "Animaciones"],
      category: 'frontend',
      related: []
    },
    { 
      icon: <SiTailwindcss size={24} />, 
      name: "Tailwind CSS", 
      color: "#06B6D4", 
      desc: "Framework CSS utility-first para diseños personalizados rápidamente",
      since: "2021", 
      projects: 10,
      featured: ["Aplicaciones modernas", "Prototipado rápido"],
      category: 'frontend',
      related: ['React', 'Vue.js']
    },
    { 
      icon: <SiRedux size={24} />, 
      name: "Redux", 
      color: "#764ABC", 
      desc: "Librería de gestión de estado predecible para aplicaciones JavaScript",
      since: "2021", 
      projects: 8,
      featured: ["Aplicaciones complejas", "Gestión de estado global"],
      category: 'frontend',
      related: ['React']
    },
    { 
      icon: <SiSass size={24} />, 
      name: "Sass/SCSS", 
      color: "#CC6699", 
      desc: "Preprocesador CSS que añade características avanzadas",
      since: "2020", 
      projects: 12,
      featured: ["Estilos mantenibles", "Sistemas de diseño"],
      category: 'frontend',
      related: []
    },
    
    // Backend
    { 
      icon: <SiLaravel size={24} />, 
      name: "Laravel", 
      color: "#FF2D20", 
      desc: "Framework PHP elegante y expresivo para desarrollo web",
      since: "2020", 
      projects: 8,
      featured: ["API REST", "Sistema de gestión"],
      category: 'backend',
      related: ['PHP', 'MySQL', 'Eloquent']
    },
    { 
      icon: <SiLaravel size={24} />, 
      name: "Laravel Eloquent", 
      color: "#FF2D20", 
      desc: "ORM incluido en Laravel para trabajar con bases de datos",
      since: "2020", 
      projects: 8,
      featured: ["Modelos de datos", "Relaciones complejas"],
      category: 'backend',
      related: ['Laravel', 'MySQL']
    },
    { 
      icon: <DiPhp size={24} />, 
      name: "PHP", 
      color: "#777BB4", 
      desc: "Lenguaje de scripting del lado del servidor",
      since: "2019", 
      projects: 10,
      featured: ["Backends personalizados", "Integraciones"],
      category: 'backend',
      related: ['Laravel', 'MySQL']
    },
    { 
      icon: <SiMysql size={24} />, 
      name: "MySQL", 
      color: "#4479A1", 
      desc: "Sistema de gestión de bases de datos relacionales",
      since: "2020", 
      projects: 12,
      featured: ["Diseño de bases de datos", "Consultas optimizadas"],
      category: 'backend',
      related: ['PHP', 'Laravel']
    },
    { 
      icon: <FaNode size={24} />, 
      name: "Node.js", 
      color: "#539E43", 
      desc: "Entorno de ejecución para JavaScript del lado del servidor",
      since: "2020", 
      projects: 9,
      featured: ["APIs escalables", "Aplicaciones en tiempo real"],
      category: 'backend',
      related: []
    },
    { 
      icon: <SiExpress size={24} />, 
      name: "Express.js", 
      color: "#000000", 
      desc: "Framework minimalista para Node.js para construir aplicaciones web y APIs",
      since: "2021", 
      projects: 7,
      featured: ["APIs RESTful", "Aplicaciones web"],
      category: 'backend',
      related: ['Node.js']
    },
    { 
      icon: <SiPython size={24} />, 
      name: "Python", 
      color: "#3776AB", 
      desc: "Lenguaje de programación versátil y potente",
      since: "2021", 
      projects: 6,
      featured: ["Scripting", "Automatización", "Backends"],
      category: 'backend',
      related: []
    },
    { 
      icon: <SiCplusplus size={24} />, 
      name: "C++", 
      color: "#00599C", 
      desc: "Lenguaje de programación compilado de propósito general",
      since: "2018", 
      projects: 4,
      featured: ["Aplicaciones de alto rendimiento", "Sistemas embebidos"],
      category: 'backend',
      related: []
    },
    { 
      icon: <FaJava size={24} />, 
      name: "Java", 
      color: "#007396", 
      desc: "Lenguaje de programación orientado a objetos",
      since: "2019", 
      projects: 7,
      featured: ["Aplicaciones empresariales", "Android development"],
      category: 'backend',
      related: []
    },
    { 
      icon: <SiDotnet size={24} />, 
      name: ".NET", 
      color: "#512BD4", 
      desc: "Framework de desarrollo de software de Microsoft",
      since: "2021", 
      projects: 5,
      featured: ["Aplicaciones Windows", "APIs empresariales"],
      category: 'backend',
      related: []
    },
    { 
      icon: <FaServer size={24} />, 
      name: "RESTful APIs", 
      color: "#FF6B6B", 
      desc: "Arquitectura para diseño de servicios web",
      since: "2020", 
      projects: 12,
      featured: ["Integraciones", "Microservicios"],
      category: 'backend',
      related: []
    },
    
    // Tools
    { 
      icon: <FaGitAlt size={24} />, 
      name: "Git", 
      color: "#F05032", 
      desc: "Sistema de control de versiones distribuido",
      since: "2019", 
      projects: "Todos",
      featured: ["Control de versiones", "Trabajo en equipo"],
      category: 'tools',
      related: []
    },
    { 
      icon: <FaDocker size={24} />, 
      name: "Docker", 
      color: "#2496ED", 
      desc: "Plataforma para contenerizar aplicaciones",
      since: "2021", 
      projects: 6,
      featured: ["Entornos aislados", "Deployment consistente"],
      category: 'tools',
      related: []
    },
    { 
      icon: <FaNpm size={24} />, 
      name: "npm", 
      color: "#CB3837", 
      desc: "Gestor de paquetes para Node.js",
      since: "2019", 
      projects: "Todos",
      featured: ["Gestión de dependencias", "Scripts personalizados"],
      category: 'tools',
      related: []
    },
    { 
      icon: <SiPostman size={24} />, 
      name: "Postman", 
      color: "#FF6C37", 
      desc: "Plataforma para desarrollo y testing de APIs",
      since: "2020", 
      projects: "Todos",
      featured: ["Testing APIs", "Documentación", "Mock servers"],
      category: 'tools',
      related: []
    },
    { 
      icon: <SiVercel size={24} />, 
      name: "Vercel", 
      color: "#000000", 
      desc: "Plataforma para deploy y hosting de aplicaciones frontend",
      since: "2021", 
      projects: 12,
      featured: ["Deploys instantáneos", "Proyectos cliente"],
      category: 'tools',
      related: ['React', 'Vite']
    },
    { 
      icon: <SiRailway size={24} />, 
      name: "Railway", 
      color: "#0B0D0E", 
      desc: "Plataforma para deploy de aplicaciones backend",
      since: "2022", 
      projects: 5,
      featured: ["Deploy de APIs", "Entornos de prueba"],
      category: 'tools',
      related: ['Laravel']
    },
    { 
      icon: <SiCypress size={24} />, 
      name: "Cypress", 
      color: "#17202C", 
      desc: "Herramienta de testing end-to-end para aplicaciones web",
      since: "2021", 
      projects: 8,
      featured: ["Pruebas E2E", "Testing de componentes", "Integración continua"],
      category: 'tools',
      related: ['React', 'Vue.js']
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
                    <span>{tech.projects} projects</span>
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
                <h4>Featured Projects:</h4>
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