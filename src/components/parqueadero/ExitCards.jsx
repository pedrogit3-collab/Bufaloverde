import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { diasParqueado, formatearFechaHora } from "../../utils/parqueadero";
import { formatearDinero } from "../../utils/formato";

export default function ExitCards({
  fechaHoraSistema,
  vehiculos,
  tarifaPorTipo,
  onRegistrarSalida,
}) {
  if (vehiculos.length === 0) {
    return (
      <section className="card">
        <div className="card-header">
          <h2>Registrar salida y cobrar</h2>
        </div>

        <div className="empty-state">
          No hay vehiculos activos pendientes por cobrar.
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Registrar salida y cobrar</h2>
      </div>

      <div className="exit-grid">
        {vehiculos.map((vehiculo) => {
          const dias = diasParqueado(vehiculo.entrada);
          const total = dias * tarifaPorTipo[vehiculo.tipo];

          return (
            <motion.article
              key={vehiculo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="exit-card"
            >
              <div className="exit-header">
                <div>
                  <h3>{vehiculo.placa}</h3>
                  <p>{vehiculo.tipo}</p>
                </div>
                <span className="badge neutral">{dias} dia(s)</span>
              </div>

              <div className="exit-details">
                <p>
                  <strong>Conductor:</strong> {vehiculo.conductor}
                </p>
                <p>
                  <strong>Telefono:</strong> {vehiculo.telefono}
                </p>
                <p>
                  <strong>Entrada:</strong> {formatearFechaHora(vehiculo.entrada)}
                </p>
                <p>
                  <strong>Salida automatica:</strong>{" "}
                  {formatearFechaHora(fechaHoraSistema)}
                </p>
                <p>
                  <strong>Valor a cobrar:</strong> {formatearDinero(total)}
                </p>
              </div>

              <button
                type="button"
                className="primary-button full"
                onClick={() => onRegistrarSalida(vehiculo.id)}
              >
                <LogOut size={18} />
                Registrar salida
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
