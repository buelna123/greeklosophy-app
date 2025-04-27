// src/services/EnrollmentService.ts
import api from "@/api";

interface EnrollmentResponse {
  message: string;
  progress?: number;
}

class EnrollmentService {
  static async checkAndEnroll(courseId: string): Promise<EnrollmentResponse> {
    try {
      // Primero intentamos obtener el registro de progreso.
      const getResponse = await api.get<EnrollmentResponse>(`/courses/${courseId}/progress`);
      if (getResponse.data && getResponse.data.progress !== undefined) {
        // Si ya existe, retornamos el mensaje indicando que ya está inscrito.
        return { message: "Ya inscrito", progress: getResponse.data.progress };
      }

      // Si no existe, realizamos el enroll (establecemos el progreso a 0).
      const response = await api.post<EnrollmentResponse>(`/courses/${courseId}/progress/update`, {
        progress: 0,
      });
      return response.data;
    } catch (error: any) {
      console.error("EnrollmentService - Error al inscribir el curso:", error);
      throw error;
    }
  }
}

export default EnrollmentService;
