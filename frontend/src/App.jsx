import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./auth/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";
import Layout from "./components/layout";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes with Layout and Nested Children */}
          <Route path="/"
            element={
              <ProtectedRoute allowedRoles={["Standard User", "Organizer", "System Admin"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Index Route */}
            <Route index element={<Dashboard />} />
            {/* Events Routes */}
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetails />} />
          </Route>

          {/* Wildcard Route */}
          <Route
            path="*"
            element={<Navigate to={"/login"} replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;