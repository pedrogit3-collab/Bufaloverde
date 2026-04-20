import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { diasParqueado } from "../../utils/parqueadero";
import { formatearDinero } from "../../utils/formato";

export default function ExitCards({ vehiculos, tarifaPorTipo, onRegistrarSalida }) {
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
                <span className="badge neutral">{dias} día(s)</span>
              </div>

              <div className="exit-details">
                <p>
                  <strong>Conductor:</strong> {vehiculo.conductor}
                </p>
                <p>
                  <strong>Teléfono:</strong> {vehiculo.telefono}
                </p>
                <p>
                  <strong>Fecha entrada:</strong> {vehiculo.entrada}
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
