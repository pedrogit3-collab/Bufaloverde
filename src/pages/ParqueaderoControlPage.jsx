import { useEffect, useMemo, useState } from "react";
import AdminTab from "../components/admin/AdminTab";
import DashboardTab from "../components/parqueadero/DashboardTab";
import EntryForm from "../components/parqueadero/EntryForm";
import ExitCards from "../components/parqueadero/ExitCards";
import Header from "../components/parqueadero/Header";
import ReportTab from "../components/parqueadero/ReportTab";
import SummaryCards from "../components/parqueadero/SummaryCards";
import TabsNav from "../components/parqueadero/TabsNav";
import { datosIniciales } from "../data/vehiculosIniciales";
import { tarifasIniciales } from "../data/tarifas";
import { guardarUsuarios, leerUsuarios } from "../utils/auth";
import {
  crearRegistroSalida,
  crearVehiculo,
  diasParqueado,
  fechaActualConHora,
  filtrarVehiculos,
} from "../utils/parqueadero";
import { guardarStorage, leerStorage } from "../utils/storage";

const VEHICULOS_STORAGE_KEY = "parqueadero-activos-v2";
const HISTORIAL_STORAGE_KEY = "parqueadero-historial-v2";
const TARIFAS_STORAGE_KEY = "parqueadero-tarifas-v2";

function mesActualInput() {
  return fechaActualConHora().slice(0, 7);
}

export default function ParqueaderoControlPage({ onLogout, sesion }) {
  const esAdmin = sesion.rol === "admin";
  const [vehiculos, setVehiculos] = useState(() =>
    leerStorage(VEHICULOS_STORAGE_KEY, datosIniciales)
  );
  const [historial, setHistorial] = useState(() =>
    leerStorage(HISTORIAL_STORAGE_KEY, [])
  );
  const [tarifas, setTarifas] = useState(() =>
    leerStorage(TARIFAS_STORAGE_KEY, tarifasIniciales)
  );
  const [usuarios, setUsuarios] = useState(() => leerUsuarios());
  const [busqueda, setBusqueda] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mesReporte, setMesReporte] = useState(mesActualInput());
  const [fechaHoraSistema, setFechaHoraSistema] = useState(() =>
    fechaActualConHora()
  );
  const [formulario, setFormulario] = useState({
    placa: "",
    tipo: "automovil",
    conductor: "",
    telefono: "",
  });

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setFechaHoraSistema(fechaActualConHora());
    }, 30000);

    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    guardarStorage(VEHICULOS_STORAGE_KEY, vehiculos);
  }, [vehiculos]);

  useEffect(() => {
    guardarStorage(HISTORIAL_STORAGE_KEY, historial);
  }, [historial]);

  useEffect(() => {
    guardarStorage(TARIFAS_STORAGE_KEY, tarifas);
  }, [tarifas]);

  useEffect(() => {
    guardarUsuarios(usuarios);
  }, [usuarios]);

  useEffect(() => {
    if (!esAdmin && activeTab === "admin") {
      setActiveTab("dashboard");
    }
  }, [activeTab, esAdmin]);

  const filtrados = useMemo(
    () => filtrarVehiculos(vehiculos, busqueda),
    [vehiculos, busqueda]
  );

  const movimientosRegistrados = useMemo(
    () => [...historial, ...vehiculos],
    [historial, vehiculos]
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
        return acumulado + dias * tarifas[vehiculo.tipo];
      }, 0),
    };
  }, [tarifas, vehiculos]);

  function registrarEntrada() {
    if (!formulario.placa || !formulario.conductor || !formulario.telefono) {
      window.alert("Completa placa, conductor y telefono antes de guardar.");
      return;
    }

    const placaNormalizada = formulario.placa.trim().toUpperCase();

    if (vehiculos.some((vehiculo) => vehiculo.placa === placaNormalizada)) {
      window.alert("Esa placa ya esta registrada como activa en el parqueadero.");
      return;
    }

    const nuevoVehiculo = crearVehiculo({
      ...formulario,
      placa: placaNormalizada,
      entrada: fechaActualConHora(),
      registradoPor: sesion.username,
    });

    setVehiculos((previo) => [nuevoVehiculo, ...previo]);
    setFormulario({
      placa: "",
      tipo: "automovil",
      conductor: "",
      telefono: "",
    });
    setActiveTab("dashboard");
  }

  function registrarSalida(id) {
    const vehiculo = vehiculos.find((item) => item.id === id);

    if (!vehiculo) {
      return;
    }

    const registroSalida = {
      ...crearRegistroSalida(vehiculo, tarifas),
      atendidoPor: sesion.username,
    };

    setHistorial((previo) => [registroSalida, ...previo]);
    setVehiculos((previo) => previo.filter((item) => item.id !== id));
    setMesReporte(registroSalida.salida.slice(0, 7));
  }

  function actualizarTarifas(nuevasTarifas) {
    const siguienteTarifa = {
      automovil: Number(nuevasTarifas.automovil),
      camion: Number(nuevasTarifas.camion),
      mula: Number(nuevasTarifas.mula),
    };

    const tarifasValidas = Object.values(siguienteTarifa).every(
      (valor) => Number.isFinite(valor) && valor >= 0
    );

    if (!tarifasValidas) {
      return {
        ok: false,
        message: "Ingresa valores validos para las tarifas por dia.",
      };
    }

    setTarifas(siguienteTarifa);
    return {
      ok: true,
      message: "Las tarifas diarias quedaron actualizadas.",
    };
  }

  function crearUsuario(datosUsuario) {
    const nombre = datosUsuario.nombre.trim();
    const username = datosUsuario.username.trim().toLowerCase();
    const password = datosUsuario.password.trim();

    if (!nombre || !username || !password) {
      return {
        ok: false,
        message: "Completa nombre, usuario y contrasena del nuevo perfil.",
      };
    }

    if (usuarios.some((usuario) => usuario.username.toLowerCase() === username)) {
      return {
        ok: false,
        message: "Ese usuario ya existe. Usa otro identificador.",
      };
    }

    setUsuarios((previo) => [
      ...previo,
      {
        nombre,
        username,
        password,
        rol: datosUsuario.rol,
      },
    ]);

    return {
      ok: true,
      message: "Usuario creado correctamente.",
    };
  }

  function eliminarUsuario(username) {
    const usuario = usuarios.find((item) => item.username === username);

    if (!usuario) {
      return;
    }

    if (username === sesion.username) {
      window.alert("No puedes eliminar el usuario con el que tienes la sesion activa.");
      return;
    }

    const totalAdmins = usuarios.filter((item) => item.rol === "admin").length;

    if (usuario.rol === "admin" && totalAdmins === 1) {
      window.alert("Debe quedar al menos un administrador en el sistema.");
      return;
    }

    if (!window.confirm(`Eliminar al usuario ${username}?`)) {
      return;
    }

    setUsuarios((previo) => previo.filter((item) => item.username !== username));
  }

  function eliminarVehiculo(id) {
    if (!window.confirm("Eliminar este registro activo del parqueadero?")) {
      return;
    }

    setVehiculos((previo) => previo.filter((vehiculo) => vehiculo.id !== id));
  }

  function eliminarRegistroHistorial(id, salida) {
    if (!window.confirm("Eliminar este registro del historial?")) {
      return;
    }

    setHistorial((previo) =>
      previo.filter(
        (registro) => !(registro.id === id && registro.salida === salida)
      )
    );
  }

  return (
    <main className="app-shell">
      <div className="container">
        <Header onLogout={onLogout} sesion={sesion} tarifaPorTipo={tarifas} />
        <SummaryCards resumen={resumen} />
        <TabsNav activeTab={activeTab} esAdmin={esAdmin} onChange={setActiveTab} />

        {activeTab === "dashboard" && (
          <DashboardTab
            busqueda={busqueda}
            filtrados={filtrados}
            onBusquedaChange={setBusqueda}
            tarifaPorTipo={tarifas}
          />
        )}

        {activeTab === "entrada" && (
          <EntryForm
            fechaHoraSistema={fechaHoraSistema}
            formulario={formulario}
            onFormularioChange={setFormulario}
            onRegistrarEntrada={registrarEntrada}
            tarifaActual={tarifas[formulario.tipo]}
          />
        )}

        {activeTab === "salida" && (
          <ExitCards
            fechaHoraSistema={fechaHoraSistema}
            vehiculos={vehiculos}
            tarifaPorTipo={tarifas}
            onRegistrarSalida={registrarSalida}
          />
        )}

        {activeTab === "reportes" && (
          <ReportTab
            historial={historial}
            movimientosRegistrados={movimientosRegistrados}
            mesReporte={mesReporte}
            onMesReporteChange={setMesReporte}
          />
        )}

        {activeTab === "admin" && esAdmin && (
          <AdminTab
            historial={historial}
            onActualizarTarifas={actualizarTarifas}
            onCrearUsuario={crearUsuario}
            onEliminarRegistroHistorial={eliminarRegistroHistorial}
            onEliminarUsuario={eliminarUsuario}
            onEliminarVehiculo={eliminarVehiculo}
            sesion={sesion}
            tarifas={tarifas}
            usuarios={usuarios}
            vehiculos={vehiculos}
          />
        )}
      </div>
    </main>
  );
}
