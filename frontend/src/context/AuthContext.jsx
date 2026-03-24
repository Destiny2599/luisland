import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("ll_usuario");
    if (!guardado) return null;
    try {
      return JSON.parse(guardado);
    } catch {
      localStorage.removeItem("ll_usuario");
      return null;
    }
  });

  const login = (datos) => {
    localStorage.setItem("ll_usuario", JSON.stringify(datos));
    setUsuario(datos);
  };

  const logout = () => {
    localStorage.removeItem("ll_usuario");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
