import { useParams } from "react-router-dom";

const Article = () => {
  const { articleId } = useParams(); // Obtiene el ID del artículo desde la URL

  return (
    <div>
      <h1>Artículo del Blog</h1>
      <p>
        Estás leyendo el artículo con ID: <strong>{articleId}</strong>
      </p>
    </div>
  );
};

export default Article;
