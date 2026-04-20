import { useMemo, useState } from "react";
import DashboardTab from "../components/parqueadero/DashboardTab";
import EntryForm from "../components/parqueadero/EntryForm";
import ExitCards from "../components/parqueadero/ExitCards";
import Header from "../components/parqueadero/Header";
import SummaryCards from "../components/parqueadero/SummaryCards";
import TabsNav from "../components/parqueadero/TabsNav";
import { datosIniciales } from "../data/vehiculosIniciales";
import { tarifaPorTipo } from "../data/tarifas";
import {
  crearVehiculo,
  diasParqueado,
  filtrarVehiculos,
} from "../utils/parqueadero";

function fechaActualInput() {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  return hoy.toISOString().slice(0, 10);
}

export default function ParqueaderoControlPage() {
  const [vehiculos, setVehiculos] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [formulario, setFormulario] = useState({
    placa: "",
    tipo: "automovil",
    conductor: "",
    telefono: "",
    entrada: fechaActualInput(),
  });

  const filtrados = useMemo(
    () => filtrarVehiculos(vehiculos, busqueda),
    [vehiculos, busqueda]
  );

  const resumen = useMemo(() => {
    const activos = vehiculos.filter((vehiculo) => vehiculo.estado === "activo");

    return {
      totalVehiculos: activos.length,
      automoviles: activos.filter((vehiculo) => vehiculo.tipo === "automovil").length,
      camiones: activos.filter((vehiculo) => vehiculo.tipo === "camion").length,
      mulas: activos.filter((vehiculo) => vehiculo.tipo === "mula").length,
      ingresosEstimados: activos.reduce((acumulado, vehiculo) => {
        const dias = diasParqueado(vehiculo.entrada);
        return acumulado + dias * tarifaPorTipo[vehiculo.tipo];
      }, 0),
    };
  }, [vehiculos]);

  function registrarEntrada() {
    if (!formulario.placa || !formulario.conductor || !formulario.telefono) {
      return;
    }

    const nuevoVehiculo = crearVehiculo(formulario);
    setVehiculos((previo) => [nuevoVehiculo, ...previo]);
    setFormulario({
      placa: "",
      tipo: "automovil",
      conductor: "",
      telefono: "",
      entrada: fechaActualInput(),
    });
    setActiveTab("dashboard");
  }

  function registrarSalida(id) {
    setVehiculos((previo) => previo.filter((vehiculo) => vehiculo.id !== id));
  }

  return (
    <main className="app-shell">
      <div className="container">
        <Header tarifaPorTipo={tarifaPorTipo} />
        <SummaryCards resumen={resumen} />
        <TabsNav activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "dashboard" && (
          <DashboardTab
            busqueda={busqueda}
            filtrados={filtrados}
            onBusquedaChange={setBusqueda}
            tarifaPorTipo={tarifaPorTipo}
          />
        )}

        {activeTab === "entrada" && (
          <EntryForm
            formulario={formulario}
            onFormularioChange={setFormulario}
            onRegistrarEntrada={registrarEntrada}
            tarifaActual={tarifaPorTipo[formulario.tipo]}
          />
        )}

        {activeTab === "salida" && (
          <ExitCards
            vehiculos={vehiculos}
            tarifaPorTipo={tarifaPorTipo}
            onRegistrarSalida={registrarSalida}
          />
        )}
      </div>
    </main>
  );
}
