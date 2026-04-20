export function diasParqueado(fechaEntrada) {
  const inicio = new Date(`${fechaEntrada}T00:00:00`);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diff = Math.ceil((hoy - inicio) / (1000 * 60 * 60 * 24));
  return diff <= 0 ? 1 : diff;
}

export function crearVehiculo(formulario) {
  return {
    id: Date.now(),
    ...formulario,
    placa: formulario.placa.toUpperCase(),
    estado: "activo",
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
