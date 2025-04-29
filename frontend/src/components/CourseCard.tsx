import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Course } from "@/types";  // Se importa la interfaz global de Course
import "@/styles/CourseCard.css";

interface CourseProps {
  course: Course;
}

const CourseCard: React.FC<CourseProps> = ({ course }) => {
  return (
    <motion.div
      className="course-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      
      <div className="course-img-container">
        <img
          src={course.image ? course.image : "https://via.placeholder.com/300x200?text=Sin+Imagen"}
          className="course-img"
          alt={course.title}
        />
      </div>

      <div className="course-body">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <Link to={`/courses/${course.id}`} className="course-button">
          Ver más
        </Link>
      </div>
    </motion.div>
  );
};

export default CourseCard;
