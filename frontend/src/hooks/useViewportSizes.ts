import { useState, useEffect } from 'react';

const useViewportSizes = () => {
  const HEADER_HEIGHT = 120; // Altura fija del header en píxeles
  
  const [viewportSize, setViewportSize] = useState({
    width: 0,
    height: 0,
    realHeight: 0,
    isMobile: false
  });

  useEffect(() => {
    // Solo ejecutar en cliente
    if (typeof window === 'undefined') return;

    // Función para actualizar las dimensiones
    const updateDimensions = () => {
      const visualViewport = window.visualViewport;
      const viewportHeight = visualViewport?.height || window.innerHeight;
      
      // Calculamos realHeight restando el header y asegurando un mínimo de 300px
      const realHeight = Math.max(viewportHeight - HEADER_HEIGHT, 300);
      
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
        realHeight: realHeight,
        isMobile: window.innerWidth < 768
      });
    };

    let timeoutId: NodeJS.Timeout;
    let resizeObserver: ResizeObserver | null = null;
    
    // Función con throttling para manejar redimensionamiento
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    // Manejar cambios de orientación
    const handleOrientationChange = () => {
      // Doble chequeo para asegurar que los valores sean correctos
      setTimeout(updateDimensions, 100);
      setTimeout(updateDimensions, 500); // Segundo chequeo después de que se complete la animación
    };

    // Configurar observers y event listeners
    const setupListeners = () => {
      // Usar ResizeObserver para detectar cambios en el viewport
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(document.documentElement);
      }

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleOrientationChange);
      
      // VisualViewport API para dispositivos móviles
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleResize);
        window.visualViewport.addEventListener('scroll', handleResize);
      }
    };

    // Inicialización
    const initialize = () => {
      // Primera actualización inmediata
      updateDimensions();
      
      // Segunda actualización después de un breve delay para capturar valores correctos
      const initTimeout1 = setTimeout(updateDimensions, 50);
      
      // Tercera actualización después de que todo esté completamente cargado
      const initTimeout2 = setTimeout(updateDimensions, 300);
      
      setupListeners();

      return () => {
        clearTimeout(initTimeout1);
        clearTimeout(initTimeout2);
      };
    };

    const initCleanup = initialize();

    // Cleanup
    return () => {
      initCleanup();
      clearTimeout(timeoutId);
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, []);

  // Función para calcular alturas de sección
  const calculateSectionHeight = (percentage: number, includeMobileBar = false) => {
    const baseHeight = (includeMobileBar ? viewportSize.height : viewportSize.realHeight);
    return (baseHeight * percentage) / 100;
  };

  return {
    ...viewportSize,
    calculateSectionHeight,
    vh: (percentage: number) => `calc(${percentage}vh - ${HEADER_HEIGHT}px)`,
    vhPx: (percentage: number) => calculateSectionHeight(percentage),
    headerHeight: HEADER_HEIGHT
  };
};

export default useViewportSizes;