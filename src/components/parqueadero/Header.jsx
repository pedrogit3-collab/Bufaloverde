import { motion } from "framer-motion";
import { formatearDinero } from "../../utils/formato";

export default function Header({ tarifaPorTipo }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="hero"
    >
      <div>
        <h1>Control de Parqueadero</h1>
        <p>
          Gestiona automoviles, camiones y mulas con cobro diario y control de
          entradas y salidas.
        </p>
      </div>

      <div className="hero-grid">
        <div className="metric-box">
          <span>Automóvil</span>
          <strong>{formatearDinero(tarifaPorTipo.automovil)}</strong>
        </div>
        <div className="metric-box">
          <span>Camion</span>
          <strong>{formatearDinero(tarifaPorTipo.camion)}</strong>
        </div>
        <div className="metric-box">
          <span>Mula</span>
          <strong>{formatearDinero(tarifaPorTipo.mula)}</strong>
        </div>
        <div className="metric-box">
          <span>Estado</span>
          <strong>Operativo</strong>
        </div>
      </div>
    </motion.section>
  );
}
