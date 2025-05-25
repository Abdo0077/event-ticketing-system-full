import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Fetch current user on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/users/profile", {
          withCredentials: true,
        });
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          // The token is handled by cookies, so we'll set a flag to indicate authentication
          setToken('authenticated');
        } else {
          setUser(null);
          setToken(null);
        }
      } catch(e) {
        console.log('Auth check error:', e);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/login", credentials, {
        withCredentials: true,
      });
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setToken('authenticated');
        return true;
      }
      throw new Error(response.data?.message || 'Login failed');
    } catch (err) {
      console.error('Login error:', err);
      setToken(null);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}