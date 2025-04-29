import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
const Article = () => {
    const { articleId } = useParams(); // Obtiene el ID del artículo desde la URL
    return (_jsxs("div", { children: [_jsx("h1", { children: "Art\u00EDculo del Blog" }), _jsxs("p", { children: ["Est\u00E1s leyendo el art\u00EDculo con ID: ", _jsx("strong", { children: articleId })] })] }));
};
export default Article;
