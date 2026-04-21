import { LogIn } from "lucide-react";
import { formatearDinero } from "../../utils/formato";
import { formatearFechaHora } from "../../utils/parqueadero";

export default function EntryForm({
  fechaHoraSistema,
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
        <h2>Registrar ingreso de vehiculo</h2>
        <p className="muted report-lead">
          La fecha y hora de ingreso se registran automaticamente al guardar.
        </p>
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
          onChange={(event) => actualizarCampo("conductor", event.target.value)}
        />

        <input
          placeholder="Telefono"
          value={formulario.telefono}
          onChange={(event) => actualizarCampo("telefono", event.target.value)}
        />

        <div className="readonly-box">
          <span>Ingreso automatico</span>
          <strong>{formatearFechaHora(fechaHoraSistema)}</strong>
        </div>
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
