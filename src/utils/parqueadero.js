function ajustarFechaLocal(fecha = new Date()) {
  const copia = new Date(fecha);
  copia.setMinutes(copia.getMinutes() - copia.getTimezoneOffset());
  return copia;
}

function extraerPartesFecha(fechaHora) {
  const [fecha = "", hora = "00:00"] = String(fechaHora).split("T");
  const [anio = "0", mes = "1", dia = "1"] = fecha.split("-");
  const [horas = "0", minutos = "0"] = hora.split(":");

  return {
    anio: Number(anio),
    mes: Number(mes),
    dia: Number(dia),
    horas: Number(horas),
    minutos: Number(minutos),
  };
}

export function fechaActualInput() {
  return ajustarFechaLocal().toISOString().slice(0, 10);
}

export function fechaActualConHora() {
  return ajustarFechaLocal().toISOString().slice(0, 16);
}

export function obtenerFecha(fechaHora) {
  return String(fechaHora || "").split("T")[0] || "";
}

export function crearFechaLocal(fechaHora) {
  if (!fechaHora) {
    return null;
  }

  const { anio, mes, dia, horas, minutos } = extraerPartesFecha(fechaHora);
  return new Date(anio, mes - 1, dia, horas, minutos);
}

export function formatearFechaHora(fechaHora) {
  const fecha = crearFechaLocal(fechaHora);

  if (!fecha) {
    return "--";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(fecha);
}

export function diasEntreFechas(
  fechaEntrada,
  fechaSalida = fechaActualConHora()
) {
  const inicio = new Date(`${obtenerFecha(fechaEntrada)}T00:00:00`);
  const fin = new Date(`${obtenerFecha(fechaSalida)}T00:00:00`);
  const diff = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
  return diff <= 0 ? 1 : diff;
}

export function diasParqueado(fechaEntrada) {
  return diasEntreFechas(fechaEntrada);
}

export function crearVehiculo(formulario) {
  return {
    id: Date.now(),
    ...formulario,
    placa: formulario.placa.toUpperCase(),
    estado: "activo",
  };
}

export function crearRegistroSalida(vehiculo, tarifaPorTipo) {
  const salida = fechaActualConHora();
  const dias = diasEntreFechas(vehiculo.entrada, salida);
  const valorPagado = dias * tarifaPorTipo[vehiculo.tipo];

  return {
    ...vehiculo,
    estado: "finalizado",
    salida,
    diasEstadia: dias,
    valorPagado,
  };
}

export function filtrarVehiculos(vehiculos, busqueda) {
  const termino = busqueda.toLowerCase().trim();

  if (!termino) {
    return vehiculos;
  }

  return vehiculos.filter((vehiculo) =>
    [vehiculo.placa, vehiculo.tipo, vehiculo.conductor]
      .join(" ")
      .toLowerCase()
      .includes(termino)
  );
}
