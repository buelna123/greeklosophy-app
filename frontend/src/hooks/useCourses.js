import { useQuery } from "@tanstack/react-query";
import api from "@/api";
export function useCoursesQuery() {
    return useQuery({
        queryKey: ["courses"],
        queryFn: async () => {
            const response = await api.get("/courses");
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });
}
