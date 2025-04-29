import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import AppRoutes from "@/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Instanciar el cliente de React Query
const queryClient = new QueryClient();
function App() {
    return (_jsx(Router, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsxs("div", { className: "app-container", children: [_jsx(AppRoutes, {}), _jsx(ToastContainer, { position: "top-right", autoClose: 3000 })] }) }) }) }));
}
export default App;
