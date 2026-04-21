import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

const formularioInicial = {
  username: "",
  password: "",
};

export default function LoginPage({ onLogin }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [error, setError] = useState("");

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
