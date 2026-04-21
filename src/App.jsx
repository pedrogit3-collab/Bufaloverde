import { useState } from "react";
import LoginPage from "./components/auth/LoginPage";
import ParqueaderoControlPage from "./pages/ParqueaderoControlPage";
import {
  autenticarUsuario,
  cerrarSesionGuardada,
  guardarSesion,
  leerSesion,
} from "./utils/auth";

export default function App() {
  const [sesion, setSesion] = useState(() => leerSesion());

  function iniciarSesion({ username, password }) {
    if (!username.trim() || !password.trim()) {
      return {
        ok: false,
        message: "Escribe usuario y contrasena para continuar.",
      };
    }

    const usuario = autenticarUsuario(username, password);

    if (!usuario) {
      return {
        ok: false,
        message: "Credenciales invalidas. Verifica el acceso autorizado.",
      };
    }

    guardarSesion(usuario);
    setSesion(usuario);

    return { ok: true };
  }

  function cerrarSesion() {
    cerrarSesionGuardada();
    setSesion(null);
  }

  if (!sesion) {
    return <LoginPage onLogin={iniciarSesion} />;
  }

  return <ParqueaderoControlPage onLogout={cerrarSesion} sesion={sesion} />;
}
