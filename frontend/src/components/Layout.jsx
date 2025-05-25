import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Portal Dashboard</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          {user?.role === "System Admin" && (
            <Link to="/admin/users" className="hover:text-blue-200">Manage Users</Link>
          )}
          <Link to="/profile" className="hover:text-blue-200">Profile</Link>
          <button 
            onClick={logout} 
            className="hover:text-blue-200 underline"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}