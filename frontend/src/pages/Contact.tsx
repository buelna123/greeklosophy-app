import { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CallToAction } from "../components/CallToAction";
import TechStack from "../components/TechStack";
import { motion, useInView } from "framer-motion";
import { FaLinkedin, FaEnvelope, FaFileDownload, FaPhone, FaArrowDown, FaArrowUp } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useViewportSizes from "@/hooks/useViewportSizes";
import "@/styles/Contact.css";
import "@/styles/projectshowcase.css";
import MessaSVG from "@/components/MessaSVG";

gsap.registerPlugin(ScrollTrigger);

interface TiltCardProps {
  children: React.ReactNode;
  tiltIntensity?: number;
  scale?: number;
  perspective?: number;
  transitionSpeed?: number;
  glare?: boolean;
  glareMaxOpacity?: number;
}

const TiltCard = ({ 
  children, 
  tiltIntensity = 5, 
  scale = 1.01, 
  perspective = 5000, 
  transitionSpeed = 600,
  glare = true,
  glareMaxOpacity = 0.2
}: TiltCardProps) => {
  const tiltRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tiltElement = tiltRef.current;
    if (!tiltElement) return;

    const handleMove = (e: MouseEvent) => {
      const rect = tiltElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const posX = (x - centerX) / centerX;
      const posY = (y - centerY) / centerY;
      
      const tiltX = posY * tiltIntensity;
      const tiltY = -posX * tiltIntensity;
      
      tiltElement.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
      
      if (glare && glareRef.current) {
        const glarePosX = (posX + 1) * 50;
        const glarePosY = (posY + 1) * 50;
        glareRef.current.style.background = `radial-gradient(circle at ${glarePosX}% ${glarePosY}%, rgba(255, 255, 255, ${glareMaxOpacity}), rgba(255, 255, 255, 0))`;
      }
    };

    const handleLeave = () => {
      tiltElement.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale(1)`;
      if (glare && glareRef.current) {
        glareRef.current.style.background = 'transparent';
      }
    };

    tiltElement.addEventListener('mousemove', handleMove);
    tiltElement.addEventListener('mouseleave', handleLeave);

    return () => {
      tiltElement.removeEventListener('mousemove', handleMove);
      tiltElement.removeEventListener('mouseleave', handleLeave);
    };
  }, [tiltIntensity, scale, perspective, glare, glareMaxOpacity]);

  return (
    <div 
      ref={tiltRef}
      style={{
        transition: `transform ${transitionSpeed}ms cubic-bezier(.03,.98,.52,.99)`,
        transformStyle: 'preserve-3d',
        position: 'relative'
      }}
    >
      {children}
      {glare && (
        <div 
          ref={glareRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            transition: 'background 0.3s ease',
            borderRadius: 'inherit'
          }}
        />
      )}
    </div>
  );
};

const ContactPage = () => {
  const { realHeight, headerHeight } = useViewportSizes();
  const contactHeroRef = useRef<HTMLDivElement>(null);
  const contactTitleRef = useRef<HTMLHeadingElement>(null);
  const contactSubtitleRef = useRef<HTMLParagraphElement>(null);
  const contactIconsRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledToShowcase, setIsScrolledToShowcase] = useState(false);
  const [isScrolledToTechStack, setIsScrolledToTechStack] = useState(false);
  const nextSectionRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const showcasePromptRef = useRef<HTMLDivElement>(null);
  const backToTopPromptRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isDetailPanelVisible, setIsDetailPanelVisible] = useState(false);

  // Asegurar que la página comience en el top al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!isMounted) return;
      
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
      
      if (nextSectionRef.current) {
        const showcasePosition = nextSectionRef.current.offsetTop;
        setIsScrolledToShowcase(scrollPosition > showcasePosition - window.innerHeight / 2);
      }
      
      if (techStackRef.current) {
        const techStackPosition = techStackRef.current.offsetTop;
        setIsScrolledToTechStack(scrollPosition > techStackPosition - window.innerHeight / 2);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  const handleScrollClick = () => {
    if (isTransitioning || !nextSectionRef.current) return;
    
    setIsTransitioning(true);
    
    gsap.to(contactHeroRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        const nextSection = nextSectionRef.current;
        if (!nextSection) return;
        
        const scrollTo = nextSection.offsetTop - headerHeight + 230;
        
        window.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          gsap.to(contactHeroRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => setIsTransitioning(false)
          });
        }, 1000);
      }
    });
  };

  const handleShowcaseScrollClick = () => {
    if (!techStackRef.current) return;
    
    const scrollTo = techStackRef.current.offsetTop - headerHeight - (isDetailPanelVisible ? 50 : -150);
    
    window.scrollTo({
      top: scrollTo,
      behavior: 'smooth'
    });
  };

  const handleDetailPanelVisibility = (isVisible: boolean) => {
    setIsDetailPanelVisible(isVisible);
    
    if (isVisible && techStackRef.current) {
      const scrollTo = techStackRef.current.offsetTop - headerHeight + 150;
      window.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (!isMounted) return;
  
    const ctx = gsap.context(() => {
      // Set initial positions and visibility
      if (contactIconsRef.current?.children) {
        gsap.set(Array.from(contactIconsRef.current.children), {
          opacity: 1,
          visibility: 'visible'
        });
      }
  
      if (scrollPromptRef.current) {
        gsap.set(scrollPromptRef.current, {
          opacity: 1,
          y: 0,
          visibility: 'visible'
        });
      }
  
      if (showcasePromptRef.current) {
        gsap.set(showcasePromptRef.current, {
          opacity: 1,
          y: 0,
          visibility: 'visible'
        });
      }
  
      if (backToTopPromptRef.current) {
        gsap.set(backToTopPromptRef.current, {
          opacity: 0,
          y: 0,
          visibility: 'visible'
        });
      }
  
      // Hero section animations
      if (contactTitleRef.current && contactSubtitleRef.current) {
        gsap.from([contactTitleRef.current, contactSubtitleRef.current], {
          opacity: 0,
          y: 50,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out",
          delay: 0.2
        });
      }
  
      if (contactIconsRef.current) {
        const icons = Array.from(contactIconsRef.current.children);
        
        if (icons.length > 0) {
          gsap.from(icons, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            delay: 0.8,
            ease: "back.out(1.7)"
          });
  
          icons.forEach((icon, i) => {
            const delay = i * 0.1;
            gsap.to(icon, {
              y: i % 2 === 0 ? -8 : 8,
              rotation: i % 3 === 0 ? -3 : 3,
              duration: 3 + Math.random() * 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay
            });
            
            gsap.to(icon, {
              scale: 1.05,
              duration: 0.5,
              repeat: -1,
              repeatDelay: 5 + Math.random() * 5,
              yoyo: true,
              ease: "power1.inOut",
              delay
            });
          });
        }
      }
  
      // Scroll prompt animations
      if (scrollPromptRef.current) {
        gsap.to(scrollPromptRef.current, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5
        });
      }
  
      if (showcasePromptRef.current) {
        gsap.to(showcasePromptRef.current, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5
        });
      }
  
      if (backToTopPromptRef.current) {
        gsap.to(backToTopPromptRef.current, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5
        });
      }
  
    }, contactHeroRef);
  
    return () => ctx.revert();
  }, [isMounted]);

  const renderHeroSection = () => (
    <section 
      ref={contactHeroRef} 
      className="contact-hero-section"
      style={{ 
        height: `${realHeight}px`,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="contact-hero-content">
        <div className="hero-text-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 ref={contactTitleRef} className="contact-hero-title">
              Miguel Buelna
            </h1>
            <p ref={contactSubtitleRef} className="contact-hero-subtitle">
              Full Stack Developer | Desarrollador de aplicaciones web
            </p>
            
            <div ref={contactIconsRef} className="contact-hero-icons">
              <motion.a 
                href="https://www.linkedin.com/in/miguel-buelna-bojorquez-58884532a" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="contact-icon-link contact-linkedin"
              >
                <FaLinkedin className="contact-icon" />
              </motion.a>
              
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onHoverStart={() => setShowContactInfo(true)}
                onHoverEnd={() => setShowContactInfo(false)}
                className="contact-icon-link contact-email"
              >
                <FaEnvelope className="contact-icon" />
                {showContactInfo && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="contact-info-tooltip"
                  >
                    <p>14miguel13@gmail.com</p>
                    <p><FaPhone /> +52 687 134 33 94</p>
                  </motion.div>
                )}
              </motion.div>
              
              <motion.a 
                href="https://drive.google.com/your-cv-link" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="contact-icon-link contact-cv"
              >
                <FaFileDownload className="contact-icon" />
                <span>CV</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
  
        <motion.div 
          className="hero-illustration-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <MessaSVG />
        </motion.div>
      </div>

      <motion.div 
        ref={scrollPromptRef}
        className="scroll-prompt"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        onClick={handleScrollClick}
        style={{ 
          position: 'absolute',
          right: '40px',
          bottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}
      >
        <p style={{ margin: 0 }}>Ver proyectos</p>
        <FaArrowDown className="scroll-arrow" />
      </motion.div>
    </section>
  );

  const showcaseRef = useRef(null);
  const isInView = useInView(showcaseRef, { once: true, margin: "-100px" });

  const renderProjectShowcase = () => (
    <section 
      ref={nextSectionRef} 
      className="contact-showcase-section"
      style={{
        minHeight: `${realHeight}px`,
        position: 'relative'
      }}
    >
      <motion.h2 
        className="contact-section-title"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        The Greeklosophy Experience
      </motion.h2>
      
      <div className="contact-showcase-grid">
        <motion.div
          ref={showcaseRef}
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="contact-showcase-card-container"
        >
          <TiltCard tiltIntensity={10} scale={1.05} glareMaxOpacity={0.15}>
            <div className="contact-showcase-card contact-admin-card">
              <div className="card-image-container">
                <img
                  src="https://i.imgur.com/28BXTO0.gif"
                  alt="Admin Panel Screenshot"
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <h3>Admin Dashboard</h3>
                <p>Complete management system for educational platforms</p>
                <div className="card-tech-tags">
                  <span>React</span>
                  <span>Laravel</span>
                  <span>MySQL</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="contact-showcase-card-container"
        >
          <TiltCard tiltIntensity={10} scale={1.05} glareMaxOpacity={0.15}>
            <div className="contact-showcase-card contact-student-card">
              <div className="card-image-container">
                <img
                 src="https://i.imgur.com/M4YagIP.gif"
                  alt="Student Experience Screenshot"
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <h3>Student Experience</h3>
                <p>Optimized interface for online learning</p>
                <div className="card-tech-tags">
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>Bootstrap</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>

      <motion.div 
        ref={showcasePromptRef}
        className="scroll-prompt"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isScrolledToShowcase && !isScrolledToTechStack ? 1 : 0,
          visibility: isScrolledToShowcase && !isScrolledToTechStack ? 'visible' : 'hidden'
        }}
        transition={{ duration: 0.3 }}
        onClick={handleShowcaseScrollClick}
        style={{ 
          position: 'absolute',
          right: '40px',
          bottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}
      >
        <p style={{ margin: 0 }}>Ver tecnologías</p>
        <FaArrowDown className="scroll-arrow" />
      </motion.div>
    </section>
  );

  return (
    <>
      <Header />
      <main className="contact-page-container">
        {renderHeroSection()}
        {renderProjectShowcase()}
        
        <div 
          ref={techStackRef}
          style={{ 
            minHeight: isDetailPanelVisible ? `${realHeight + 200}px` : `${realHeight}px`,
            position: 'relative',
            transition: 'min-height 0.5s ease'
          }}
        >
          <TechStack onDetailPanelVisibilityChange={handleDetailPanelVisibility} />
          
          <motion.div 
            ref={backToTopPromptRef}
            className="scroll-prompt"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isScrolledToTechStack ? 1 : 0,
              visibility: isScrolledToTechStack ? 'visible' : 'hidden'
            }}
            transition={{ duration: 0.3 }}
            onClick={handleBackToTop}
            style={{ 
              position: 'absolute',
              right: '40px',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <p style={{ margin: 0 }}>Volver arriba</p>
            <FaArrowUp className="scroll-arrow" />
          </motion.div>
        </div>
        
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;