import { createContext, useContext } from "react";
export const CourseContext = createContext(undefined);
export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error("useCourseContext debe usarse dentro de <CourseContext.Provider>");
    }
    return context;
};
