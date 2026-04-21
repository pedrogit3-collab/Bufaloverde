import { Banknote, CalendarDays, Clock3, ReceiptText } from "lucide-react";
import { formatearDinero } from "../../utils/formato";
import { formatearFechaHora } from "../../utils/parqueadero";

const tiposVehiculo = ["automovil", "camion", "mula"];

function formatearMes(mes) {
  if (!mes) {
    return "el mes seleccionado";
  }

  const [anio, numeroMes] = mes.split("-");

  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(anio), Number(numeroMes) - 1, 1));
}

function calcularResumenMensual(historial, movimientosRegistrados, mesReporte) {
  const cobrosDelMes = historial.filter((registro) =>
    registro.salida?.startsWith(mesReporte)
  );
  const entradasDelMes = movimientosRegistrados.filter((registro) =>
    registro.entrada?.startsWith(mesReporte)
  );
  const totalGanado = cobrosDelMes.reduce(
    (acumulado, registro) => acumulado + registro.valorPagado,
    0
  );
  const totalDias = cobrosDelMes.reduce(
    (acumulado, registro) => acumulado + registro.diasEstadia,
    0
  );

  return {
    cobrosDelMes,
    entradasDelMes: entradasDelMes.length,
    totalGanado,
    totalCobros: cobrosDelMes.length,
    ticketPromedio: cobrosDelMes.length ? totalGanado / cobrosDelMes.length : 0,
    promedioEstadia: cobrosDelMes.length ? totalDias / cobrosDelMes.length : 0,
  };
}

export default function ReportTab({
  historial,
  movimientosRegistrados,
  mesReporte,
  onMesReporteChange,
}) {
  const historialOrdenado = [...historial].sort((a, b) =>
    b.salida.localeCompare(a.salida)
  );
  const resumenMes = calcularResumenMensual(
    historialOrdenado,
    movimientosRegistrados,
    mesReporte
  );

  return (
    <section className="report-grid">
      <article className="card report-overview">
        <div className="card-header split">
          <div>
            <h2>Reporte mensual</h2>
            <p className="muted report-lead">
              Resumen de ingresos y permanencia para {formatearMes(mesReporte)}.
            </p>
          </div>

          <label className="month-filter">
            <span>Mes</span>
            <input
              type="month"
              value={mesReporte}
              onChange={(event) => onMesReporteChange(event.target.value)}
            />
          </label>
        </div>

        <div className="report-summary-grid">
          <article className="compact-card report-stat">
            <div className="summary-icon">
              <Banknote size={24} />
            </div>
            <div>
              <p className="muted">Ganancias del mes</p>
              <strong className="money">
                {formatearDinero(resumenMes.totalGanado)}
              </strong>
            </div>
          </article>

          <article className="compact-card report-stat">
            <div className="summary-icon">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="muted">Vehiculos que entraron</p>
              <strong className="big-number">{resumenMes.entradasDelMes}</strong>
            </div>
          </article>

          <article className="compact-card report-stat">
            <div className="summary-icon">
              <ReceiptText size={24} />
            </div>
            <div>
              <p className="muted">Vehiculos cobrados</p>
              <strong className="big-number">{resumenMes.totalCobros}</strong>
            </div>
          </article>

          <article className="compact-card report-stat">
            <div className="summary-icon">
              <Clock3 size={24} />
            </div>
            <div>
              <p className="muted">Estadia promedio</p>
              <strong className="big-number">
                {resumenMes.promedioEstadia.toFixed(1)} dias
              </strong>
            </div>
          </article>
        </div>

        <div className="report-type-grid">
          {tiposVehiculo.map((tipo) => {
            const registrosTipo = resumenMes.cobrosDelMes.filter(
              (registro) => registro.tipo === tipo
            );
            const totalTipo = registrosTipo.reduce(
              (acumulado, registro) => acumulado + registro.valorPagado,
              0
            );

            return (
              <article key={tipo} className="report-type-card">
                <p className="muted">Ganancia por {tipo}</p>
                <strong>{formatearDinero(totalTipo)}</strong>
                <span>{registrosTipo.length} cobro(s)</span>
              </article>
            );
          })}
        </div>
      </article>

      <article className="card wide-card">
        <div className="card-header">
          <h2>Detalle de cobros del mes</h2>
        </div>

        {resumenMes.cobrosDelMes.length === 0 ? (
          <div className="empty-state">
            Todavia no hay salidas cobradas en {formatearMes(mesReporte)}.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Tipo</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Tiempo</th>
                  <th>Pago</th>
                </tr>
              </thead>
              <tbody>
                {resumenMes.cobrosDelMes.map((registro) => (
                  <tr key={registro.id}>
                    <td className="cell-strong">{registro.placa}</td>
                    <td>{registro.tipo}</td>
                    <td>{formatearFechaHora(registro.entrada)}</td>
                    <td>{formatearFechaHora(registro.salida)}</td>
                    <td>{registro.diasEstadia} dias</td>
                    <td>{formatearDinero(registro.valorPagado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="card wide-card">
        <div className="card-header split">
          <div>
            <h2>Historial guardado</h2>
            <p className="muted report-lead">
              Cada salida registrada queda almacenada para futuros reportes.
            </p>
          </div>
          <div className="price-box">
            Ticket promedio:{" "}
            <strong>{formatearDinero(resumenMes.ticketPromedio)}</strong>
          </div>
        </div>

        {historialOrdenado.length === 0 ? (
          <div className="empty-state">
            Aun no hay movimientos en el historial. Registra una salida para
            empezar a acumular reportes.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Conductor</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Tiempo</th>
                  <th>Valor pagado</th>
                </tr>
              </thead>
              <tbody>
                {historialOrdenado.map((registro) => (
                  <tr key={`${registro.id}-${registro.salida}`}>
                    <td className="cell-strong">{registro.placa}</td>
                    <td>{registro.conductor}</td>
                    <td>{formatearFechaHora(registro.entrada)}</td>
                    <td>{formatearFechaHora(registro.salida)}</td>
                    <td>{registro.diasEstadia} dias</td>
                    <td>{formatearDinero(registro.valorPagado)}</td>
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
