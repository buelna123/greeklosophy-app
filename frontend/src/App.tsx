import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import AppRoutes from "@/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Instanciar el cliente de React Query
const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="app-container">
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
