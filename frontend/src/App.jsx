import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./auth/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";
import Layout from "./components/layout";
import Profile from "./pages/Profile";
import AdminUsersPage from "./pages/AdminUsersPage";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import MyEvents from "./pages/MyEvents";
import EditEvent from "./pages/EditEvent";
import CreateEvent from "./pages/CreateEvent";
import EventAnalytics from "./pages/EventAnalytics";

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
            <Route index element={<EventList />} />
            {/* Dashboard Route */}
            <Route path="dashboard" element={<Dashboard />} />
            {/* Profile Route */}
            <Route path="profile" element={<Profile />} />
            {/* Event Details Route */}
            <Route path="events/:eventId" element={<EventDetails />} />
            {/* Booking Routes */}
            <Route path="booking/:eventId" element={<Booking />} />
            <Route path="booking-success" element={<BookingSuccess />} />
            {/* My Bookings Route */}
            <Route path="my-bookings" element={<MyBookings />} />

            {/* My Events Route - Only for Organizers */}
            <Route
              path="my-events"
              element={
                <ProtectedRoute allowedRoles={["Organizer"]}>
                  <MyEvents />
                </ProtectedRoute>
              }
            />

            {/* Create Event Route - Only for Organizers */}
            <Route
              path="create-event"
              element={
                <ProtectedRoute allowedRoles={["Organizer"]}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />

            {/* Edit Event Route - Only for Organizers */}
            <Route
              path="edit-event/:eventId"
              element={
                <ProtectedRoute allowedRoles={["Organizer"]}>
                  <EditEvent />
                </ProtectedRoute>
              }
            />

            {/* Event Analytics Route - Only for Organizers */}
            <Route
              path="event-analytics/:eventId"
              element={
                <ProtectedRoute allowedRoles={["Organizer"]}>
                  <EventAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="admin">
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={["System Admin"]}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
            </Route>
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