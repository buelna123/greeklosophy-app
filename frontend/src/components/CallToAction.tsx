import { FaBookOpen, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import "@/styles/CallToAction.css";

export function CallToAction() {
    return (
        <section className="call-to-action">
            <div className="cta-container">
                <h2 className="cta-title">¿Listo para explorar la historia como nunca antes?</h2>
                <p className="cta-subtitle">
                    Únete a miles de estudiantes apasionados por el conocimiento y accede a cursos, artículos y más.
                </p>

                <div className="cta-benefits">
                    <div className="cta-benefit">
                        <FaBookOpen className="cta-icon" />
                        <p>+50 cursos sobre historia y cultura</p>
                    </div>
                    <div className="cta-benefit">
                        <FaChalkboardTeacher className="cta-icon" />
                        <p>Expertos en historia como instructores</p>
                    </div>
                    <div className="cta-benefit">
                        <FaUsers className="cta-icon" />
                        <p>Comunidad activa de aprendizaje</p>
                    </div>
                </div>

                <a href="/registro" className="cta-button">¡Empieza ahora!</a>
            </div>
        </section>
    );
}
