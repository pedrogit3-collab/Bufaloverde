import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";

const items = [
  {
    icon: Clock3,
    title: "Cobro diario automático",
    description:
      "El sistema calcula cuantos dias lleva cada vehiculo y multiplica por su tarifa diaria.",
  },
  {
    icon: CheckCircle2,
    title: "Control por tipo de vehículo",
    description:
      "Se separan automoviles, camiones y mulas para manejar tarifas y reportes.",
  },
  {
    icon: AlertCircle,
    title: "Modulos sugeridos",
    description:
      "Puedes agregar facturación, historial, usuarios, impresión de recibos y reportes mensuales.",
  },
];

export default function InfoPanel() {
  return (
    <aside className="card info-list">
      <div className="card-header">
        <h2>Resumen operativo</h2>
      </div>

      {items.map(({ icon: Icon, title, description }) => (
        <article className="info-item" key={title}>
          <div className="info-title">
            <Icon size={18} />
            <strong>{title}</strong>
          </div>
          <p>{description}</p>
        </article>
      ))}
    </aside>
  );
}
