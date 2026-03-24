import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// rolesPermitidos: array de roles que pueden acceder, ej: ["ADMIN", "DEVELOPER"]
// Si no se pasa rolesPermitidos, solo requiere estar logueado
export default function PrivateRoute({ children, rolesPermitidos }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
