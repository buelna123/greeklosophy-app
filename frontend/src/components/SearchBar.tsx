import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { Spinner } from "react-bootstrap";

interface SearchResult {
  id: number;
  title: string;
  type: "course" | "article";
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const listRef = useRef<HTMLUListElement>(null);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim().length > 2) {
      setLoading(true);
      try {
        const response = await api.get<SearchResult[]>(`/search?query=${encodeURIComponent(value)}`);
        const data = response.data;
        if (Array.isArray(data)) {
          setError(null);
          setResults(data);
        } else {
          setError("Datos de búsqueda no válidos.");
          setResults([]);
        }
      } catch (err: any) {
        setError(`Error en la búsqueda: ${err.message}`);
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
      setError(null);
      setLoading(false);
    }
    setSelectedIndex(-1);
  };

  const handleSelect = (result: SearchResult) => {
    const route = result.type === "course" ? `/courses/${result.id}` : `/articles/${result.id}`;
    navigate(route);
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => {
        const nextIndex = prev < results.length - 1 ? prev + 1 : prev;
        scrollToItem(nextIndex);
        return nextIndex;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => {
        const nextIndex = prev > 0 ? prev - 1 : prev;
        scrollToItem(nextIndex);
        return nextIndex;
      });
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      handleSelect(results[selectedIndex]);
    }
  };

  const scrollToItem = (index: number) => {
    if (listRef.current && listRef.current.children[index]) {
      (listRef.current.children[index] as HTMLElement).scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        placeholder="Buscar cursos, artículos o categorías..."
        className="search-input"
      />
      {loading && (
        <div className="search-loading">
          <Spinner animation="border" size="sm" role="status" />
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {results.length > 0 && (
        <ul className="search-results" ref={listRef}>
          {results.map((result, index) => (
            <li
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              tabIndex={0}
              className={index === selectedIndex ? "selected" : ""}
            >
              {result.title} ({result.type === "course" ? "Curso" : "Artículo"})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
