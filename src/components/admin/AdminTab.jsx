import { useEffect, useState } from "react";
import { Settings2, Trash2, UserPlus, Users } from "lucide-react";
import { formatearDinero } from "../../utils/formato";
import { formatearFechaHora } from "../../utils/parqueadero";

const formularioInicialUsuario = {
  nombre: "",
  username: "",
  password: "",
  rol: "operador",
};

export default function AdminTab({
  historial,
  onActualizarTarifas,
  onCrearUsuario,
  onEliminarRegistroHistorial,
  onEliminarUsuario,
  onEliminarVehiculo,
  sesion,
  tarifas,
  usuarios,
  vehiculos,
}) {
  const [tarifasForm, setTarifasForm] = useState(tarifas);
  const [usuarioForm, setUsuarioForm] = useState(formularioInicialUsuario);
  const [mensajeUsuarios, setMensajeUsuarios] = useState("");
  const [mensajeTarifas, setMensajeTarifas] = useState("");

  useEffect(() => {
    setTarifasForm(tarifas);
  }, [tarifas]);

  function actualizarTarifa(tipo, valor) {
    setTarifasForm((previo) => ({
      ...previo,
      [tipo]: valor,
    }));
  }

  function guardarTarifas(event) {
    event.preventDefault();
    const resultado = onActualizarTarifas(tarifasForm);
    setMensajeTarifas(resultado.message);
  }

  function actualizarUsuario(campo, valor) {
    setUsuarioForm((previo) => ({
      ...previo,
      [campo]: valor,
    }));
  }

  function crearUsuario(event) {
    event.preventDefault();
    const resultado = onCrearUsuario(usuarioForm);
    setMensajeUsuarios(resultado.message);

    if (resultado.ok) {
      setUsuarioForm(formularioInicialUsuario);
    }
  }

  return (
    <section className="report-grid">
      <article className="card admin-panel">
        <div className="card-header split">
          <div>
            <h2>Configuracion administrativa</h2>
            <p className="muted report-lead">
              Gestiona usuarios, tarifas y registros del sistema.
            </p>
          </div>
          <div className="price-box">
            Perfil activo: <strong>{sesion.nombre}</strong>
          </div>
        </div>

        <div className="admin-grid">
          <section className="admin-section">
            <div className="admin-section-title">
              <Settings2 size={18} />
              <strong>Tarifas por dia</strong>
            </div>

            <form className="admin-form" onSubmit={guardarTarifas}>
              <label className="login-field">
                <span>Automovil</span>
                <input
                  min="0"
                  type="number"
                  value={tarifasForm.automovil}
                  onChange={(event) =>
                    actualizarTarifa("automovil", event.target.value)
                  }
                />
              </label>

              <label className="login-field">
                <span>Camion</span>
                <input
                  min="0"
                  type="number"
                  value={tarifasForm.camion}
                  onChange={(event) =>
                    actualizarTarifa("camion", event.target.value)
                  }
                />
              </label>

              <label className="login-field">
                <span>Mula</span>
                <input
                  min="0"
                  type="number"
                  value={tarifasForm.mula}
                  onChange={(event) =>
                    actualizarTarifa("mula", event.target.value)
                  }
                />
              </label>

              {mensajeTarifas && <p className="admin-message">{mensajeTarifas}</p>}

              <button className="primary-button" type="submit">
                Guardar tarifas
              </button>
            </form>
          </section>

          <section className="admin-section">
            <div className="admin-section-title">
              <UserPlus size={18} />
              <strong>Crear usuario</strong>
            </div>

            <form className="admin-form" onSubmit={crearUsuario}>
              <label className="login-field">
                <span>Nombre</span>
                <input
                  value={usuarioForm.nombre}
                  onChange={(event) =>
                    actualizarUsuario("nombre", event.target.value)
                  }
                />
              </label>

              <label className="login-field">
                <span>Usuario</span>
                <input
                  value={usuarioForm.username}
                  onChange={(event) =>
                    actualizarUsuario("username", event.target.value)
                  }
                />
              </label>

              <label className="login-field">
                <span>Contrasena</span>
                <input
                  type="text"
                  value={usuarioForm.password}
                  onChange={(event) =>
                    actualizarUsuario("password", event.target.value)
                  }
                />
              </label>

              <label className="login-field">
                <span>Rol</span>
                <select
                  value={usuarioForm.rol}
                  onChange={(event) =>
                    actualizarUsuario("rol", event.target.value)
                  }
                >
                  <option value="operador">Operador</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>

              {mensajeUsuarios && <p className="admin-message">{mensajeUsuarios}</p>}

              <button className="primary-button" type="submit">
                Crear perfil
              </button>
            </form>
          </section>
        </div>
      </article>

      <article className="card wide-card">
        <div className="card-header split">
          <div>
            <h2>Usuarios autorizados</h2>
            <p className="muted report-lead">
              Los perfiles creados aqui pueden iniciar sesion en el sistema.
            </p>
          </div>
          <div className="price-box">
            <Users size={18} /> <strong>{usuarios.length}</strong>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.username}>
                  <td className="cell-strong">{usuario.nombre}</td>
                  <td>{usuario.username}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <button
                      className="danger-button"
                      onClick={() => onEliminarUsuario(usuario.username)}
                      type="button"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="card wide-card">
        <div className="card-header">
          <h2>Registros activos</h2>
        </div>

        {vehiculos.length === 0 ? (
          <div className="empty-state">No hay vehiculos activos para eliminar.</div>
        ) : (
          <div className="table-wrapper">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Conductor</th>
                  <th>Entrada</th>
                  <th>Tarifa</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id}>
                    <td className="cell-strong">{vehiculo.placa}</td>
                    <td>{vehiculo.conductor}</td>
                    <td>{formatearFechaHora(vehiculo.entrada)}</td>
                    <td>{formatearDinero(tarifas[vehiculo.tipo])}</td>
                    <td>
                      <button
                        className="danger-button"
                        onClick={() => onEliminarVehiculo(vehiculo.id)}
                        type="button"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="card wide-card">
        <div className="card-header">
          <h2>Historial guardado</h2>
        </div>

        {historial.length === 0 ? (
          <div className="empty-state">No hay historial guardado para eliminar.</div>
        ) : (
          <div className="table-wrapper">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Pago</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((registro) => (
                  <tr key={`${registro.id}-${registro.salida}`}>
                    <td className="cell-strong">{registro.placa}</td>
                    <td>{formatearFechaHora(registro.entrada)}</td>
                    <td>{formatearFechaHora(registro.salida)}</td>
                    <td>{formatearDinero(registro.valorPagado)}</td>
                    <td>
                      <button
                        className="danger-button"
                        onClick={() =>
                          onEliminarRegistroHistorial(registro.id, registro.salida)
                        }
                        type="button"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
