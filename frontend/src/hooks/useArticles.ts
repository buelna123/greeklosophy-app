import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { Article } from "@/types";

interface PaginatedResponse<T> {
  data: T[];
  current_page?: number;
  total?: number;
  per_page?: number;
}

export function useArticlesQuery() {
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Article>>("/articles");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}
