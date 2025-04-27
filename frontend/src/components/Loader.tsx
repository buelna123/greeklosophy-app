import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import "@/styles/loading.css";

interface LoaderProps {
  ready: boolean;
}

export const Loader = ({ ready }: LoaderProps) => {
  const [show, setShow] = useState(true);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready) {
      setShow(false); // Ocultar loader con fade
    }
  }, [ready]);

  useEffect(() => {
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotate: 360,
        duration: 2,
        ease: "linear",
        repeat: -1,
      });
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="loading-container"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="loader-wrapper">
            <div className="particles-background" />
            <div ref={ringRef} className="loader-ring-gsap" />
            <img src="/logo.svg" alt="Logo" className="loading-logo-large" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
