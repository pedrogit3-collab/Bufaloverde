import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { usuariosIniciales } from "../../data/usuariosAutorizados";

const formularioInicial = {
  username: "",
  password: "",
};

export default function LoginPage({ onLogin }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [error, setError] = useState("");

  function cargarAccesoDemo(usuario) {
    setFormulario({
      username: usuario.username,
      password: usuario.password,
    });
    setError("");
  }

  function actualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((previo) => ({
      ...previo,
      [name]: value,
    }));
  }

  function enviarFormulario(event) {
    event.preventDefault();

    const resultado = onLogin(formulario);

    if (!resultado.ok) {
      setError(resultado.message);
      return;
    }

    setError("");
    setFormulario(formularioInicial);
  }

  return (
    <main className="login-shell">
      <section className="login-layout">
        <article className="login-hero">
          <span className="login-eyebrow">Sistema privado</span>
          <h1>Control de Parqueadero</h1>
          <p>
            Publica la aplicacion para que tu equipo la use, pero protege el
            acceso con usuarios autorizados antes de entrar al panel.
          </p>

          <div className="login-points">
            <div className="login-point">
              <ShieldCheck size={20} />
              <span>Acceso restringido al personal autorizado</span>
            </div>
            <div className="login-point">
              <LockKeyhole size={20} />
              <span>Sesion persistente en el navegador del operador</span>
            </div>
          </div>
        </article>

        <section className="login-card card">
          <div className="login-card-header">
            <span className="login-badge">Ingreso seguro</span>
            <h2>Inicia sesion para usar el sistema</h2>
            <p className="muted">
              Usa un usuario registrado para administrar entradas, salidas y
              reportes del parqueadero.
            </p>
          </div>

          <div className="demo-access">
            <p className="demo-access-title">Accesos de demostracion</p>
            <div className="demo-access-grid">
              {usuariosIniciales.map((usuario) => (
                <button
                  className="demo-access-card"
                  key={usuario.username}
                  onClick={() => cargarAccesoDemo(usuario)}
                  type="button"
                >
                  <strong>{usuario.nombre}</strong>
                  <span>Usuario: {usuario.username}</span>
                  <span>Clave: {usuario.password}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="login-form" onSubmit={enviarFormulario}>
            <label className="login-field">
              <span>Usuario</span>
              <input
                autoComplete="username"
                name="username"
                onChange={actualizarCampo}
                placeholder="Escribe tu usuario"
                value={formulario.username}
              />
            </label>

            <label className="login-field">
              <span>Contrasena</span>
              <input
                autoComplete="current-password"
                name="password"
                onChange={actualizarCampo}
                placeholder="Escribe tu contrasena"
                type="password"
                value={formulario.password}
              />
            </label>

            {error && <p className="login-error">{error}</p>}

            <button className="primary-button full" type="submit">
              Entrar al panel
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
