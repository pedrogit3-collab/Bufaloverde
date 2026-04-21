const STORAGE_RESET_MARKER = "parqueadero-entrega-reset-v2";

const CLAVES_RESETEO = [
  "parqueadero-activos-v1",
  "parqueadero-historial-v1",
  "parqueadero-sesion-v1",
  "parqueadero-usuarios-v1",
  "parqueadero-tarifas-v1",
  "parqueadero-activos-v2",
  "parqueadero-historial-v2",
  "parqueadero-sesion-v2",
  "parqueadero-usuarios-v2",
  "parqueadero-tarifas-v2",
];

export function asegurarReseteoEntrega() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.localStorage.getItem(STORAGE_RESET_MARKER)) {
    return;
  }

  CLAVES_RESETEO.forEach((clave) => {
    window.localStorage.removeItem(clave);
  });

  window.localStorage.setItem(STORAGE_RESET_MARKER, "ok");
}

export function leerStorage(clave, valorInicial) {
  if (typeof window === "undefined") {
    return valorInicial;
  }

  asegurarReseteoEntrega();

  try {
    const guardado = window.localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorInicial;
  } catch {
    return valorInicial;
  }
}

export function guardarStorage(clave, valor) {
  if (typeof window === "undefined") {
    return;
  }

  asegurarReseteoEntrega();
  window.localStorage.setItem(clave, JSON.stringify(valor));
}

export function eliminarStorage(clave) {
  if (typeof window === "undefined") {
    return;
  }

  asegurarReseteoEntrega();
  window.localStorage.removeItem(clave);
}
