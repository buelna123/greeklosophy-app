import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Container } from "react-bootstrap";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { CoursesGrid } from "@/components/CoursesGrid";
import { Testimonials } from "@/components/Testimonials";
import { CallToAction } from "@/components/CallToAction";
import FeaturedArticles from "@/components/FeaturedArticles";
import ProgressBar from "@/components/ProgressBar";
const Home = () => {
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx(ProgressBar, {}), _jsxs("main", { children: [_jsx(HeroSection, {}), _jsx(Container, { className: "my-5", children: _jsx(CoursesGrid, {}) }), _jsx(Container, { className: "my-5", children: _jsx(FeaturedArticles, {}) }), _jsx(Testimonials, {}), _jsx(CallToAction, {})] }), _jsx(Footer, {})] }));
};
export default Home;
