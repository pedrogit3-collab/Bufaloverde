import { Banknote, Car, LayoutDashboard, Truck } from "lucide-react";
import { formatearDinero } from "../../utils/formato";

const cards = [
  {
    key: "totalVehiculos",
    label: "Vehículos activos",
    icon: LayoutDashboard,
  },
  {
    key: "automoviles",
    label: "Automoviles",
    icon: Car,
  },
  {
    key: "camiones",
    label: "Camiones",
    icon: Truck,
  },
  {
    key: "mulas",
    label: "Mulas",
    icon: Truck,
  },
];

export default function SummaryCards({ resumen }) {
  return (
    <section className="summary-grid">
      {cards.map(({ key, label, icon: Icon }) => (
        <article className="card compact-card" key={key}>
          <div className="summary-icon">
            <Icon size={24} />
          </div>
          <div>
            <p className="muted">{label}</p>
            <strong className="big-number">{resumen[key]}</strong>
          </div>
        </article>
      ))}

      <article className="card compact-card">
        <div className="summary-icon">
          <Banknote size={24} />
        </div>
        <div>
          <p className="muted">Cobro proyectado activo</p>
          <strong className="money">
            {formatearDinero(resumen.ingresosEstimados)}
          </strong>
        </div>
      </article>
    </section>
  );
}
