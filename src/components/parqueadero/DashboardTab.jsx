import InfoPanel from "./InfoPanel";
import SearchBar from "./SearchBar";
import VehicleTable from "./VehicleTable";

export default function DashboardTab({
  busqueda,
  filtrados,
  onBusquedaChange,
  tarifaPorTipo,
}) {
  return (
    <section className="dashboard-grid">
      <article className="card wide-card">
        <div className="card-header split">
          <h2>Vehiculos en parqueadero</h2>
          <SearchBar value={busqueda} onChange={onBusquedaChange} />
        </div>
        <VehicleTable vehiculos={filtrados} tarifaPorTipo={tarifaPorTipo} />
      </article>

      <InfoPanel />
    </section>
  );
}
