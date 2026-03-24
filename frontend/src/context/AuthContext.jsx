import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const guardado = localStorage.getItem("ll_usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
    setCargando(false);
  }, []);

  const login = (datos) => {
    localStorage.setItem("ll_usuario", JSON.stringify(datos));
    setUsuario(datos);
  };

  const logout = () => {
    localStorage.removeItem("ll_usuario");
    setUsuario(null);
  };

  if (cargando) return null;

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}