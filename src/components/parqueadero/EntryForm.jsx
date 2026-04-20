import { LogIn } from "lucide-react";
import { formatearDinero } from "../../utils/formato";

export default function EntryForm({
  formulario,
  onFormularioChange,
  onRegistrarEntrada,
  tarifaActual,
}) {
  function actualizarCampo(campo, valor) {
    onFormularioChange({ ...formulario, [campo]: valor });
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Registrar ingreso de vehículo</h2>
      </div>

      <div className="form-grid">
        <input
          placeholder="Placa"
          value={formulario.placa}
          onChange={(event) => actualizarCampo("placa", event.target.value)}
        />

        <select
          value={formulario.tipo}
          onChange={(event) => actualizarCampo("tipo", event.target.value)}
        >
          <option value="automovil">Automovil</option>
          <option value="camion">Camion</option>
          <option value="mula">Mula</option>
        </select>

        <input
          placeholder="Nombre del conductor"
          value={formulario.conductor}
          onChange={(event) =>
            actualizarCampo("conductor", event.target.value)
          }
        />

        <input
          placeholder="Teléfono"
          value={formulario.telefono}
          onChange={(event) => actualizarCampo("telefono", event.target.value)}
        />

        <input
          type="date"
          value={formulario.entrada}
          onChange={(event) => actualizarCampo("entrada", event.target.value)}
        />
      </div>

      <div className="actions-row">
        <div className="price-box">
          Tarifa aplicada: <strong>{formatearDinero(tarifaActual)}</strong>
        </div>

        <button type="button" className="primary-button" onClick={onRegistrarEntrada}>
          <LogIn size={18} />
          Guardar ingreso
        </button>
      </div>
    </section>
  );
}
