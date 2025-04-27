import React from "react";
import { Container } from "react-bootstrap";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { CoursesGrid } from "@/components/CoursesGrid";
import { Testimonials } from "@/components/Testimonials";
import { CallToAction } from "@/components/CallToAction";
import FeaturedArticles from "@/components/FeaturedArticles";
import ProgressBar from "@/components/ProgressBar";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <ProgressBar />
      <main>
        <HeroSection />
        <Container className="my-5">
          <CoursesGrid />
        </Container>
        
        {/* Sección de artículos relevantes */}
        <Container className="my-5">
          <FeaturedArticles />
        </Container>

        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default Home;
