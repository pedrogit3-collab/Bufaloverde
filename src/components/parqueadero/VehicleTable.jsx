import { Car, Truck } from "lucide-react";
import { diasParqueado, formatearFechaHora } from "../../utils/parqueadero";
import { formatearDinero } from "../../utils/formato";

function IconoTipo({ tipo }) {
  if (tipo === "automovil") {
    return <Car size={16} />;
  }

  return <Truck size={16} />;
}

export default function VehicleTable({ vehiculos, tarifaPorTipo }) {
  return (
    <div className="table-wrapper">
      <table className="vehicles-table">
        <thead>
          <tr>
            <th>Placa</th>
            <th>Tipo</th>
            <th>Conductor</th>
            <th>Entrada</th>
            <th>Dias</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => {
            const dias = diasParqueado(vehiculo.entrada);
            const total = dias * tarifaPorTipo[vehiculo.tipo];

            return (
              <tr key={vehiculo.id}>
                <td className="cell-strong">{vehiculo.placa}</td>
                <td>
                  <span className="type-pill">
                    <IconoTipo tipo={vehiculo.tipo} />
                    {vehiculo.tipo}
                  </span>
                </td>
                <td>{vehiculo.conductor}</td>
                <td>{formatearFechaHora(vehiculo.entrada)}</td>
                <td>{dias}</td>
                <td>{formatearDinero(total)}</td>
                <td>
                  <span className="badge success">Activo</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
