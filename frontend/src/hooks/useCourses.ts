import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { Course } from "@/types";

interface PaginatedResponse<T> {
  data: T[];
  current_page?: number;
  total?: number;
  per_page?: number;
}

export function useCoursesQuery() {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Course>>("/courses");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}
