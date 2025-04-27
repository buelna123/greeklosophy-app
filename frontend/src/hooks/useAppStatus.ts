import { useAuth } from "@/context/AuthContext";
import { useCoursesQuery } from "./useCourses";
import { useArticlesQuery } from "./useArticles";

export function useAppStatus() {
  const { loading: authLoading } = useAuth();
  const { isLoading: coursesLoading, data: courses } = useCoursesQuery();
  const { isLoading: articlesLoading, data: articles } = useArticlesQuery();

  const appReady = !authLoading && !coursesLoading && !articlesLoading;

  return {
    appReady,
    courses: courses || [],
    articles: articles || [],
  };
}
