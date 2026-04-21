import { usuariosIniciales } from "../data/usuariosAutorizados";
import { eliminarStorage, guardarStorage, leerStorage } from "./storage";

export const SESION_STORAGE_KEY = "parqueadero-sesion-v2";
export const USUARIOS_STORAGE_KEY = "parqueadero-usuarios-v2";

export function leerUsuarios() {
  return leerStorage(USUARIOS_STORAGE_KEY, usuariosIniciales);
}

export function guardarUsuarios(usuarios) {
  guardarStorage(USUARIOS_STORAGE_KEY, usuarios);
}

export function leerSesion() {
  return leerStorage(SESION_STORAGE_KEY, null);
}

export function guardarSesion(sesion) {
  guardarStorage(SESION_STORAGE_KEY, sesion);
}

export function cerrarSesionGuardada() {
  eliminarStorage(SESION_STORAGE_KEY);
}

export function autenticarUsuario(username, password) {
  const usernameNormalizado = username.trim().toLowerCase();
  const passwordNormalizado = password.trim();

  const usuario = leerUsuarios().find(
    (item) =>
      item.username.toLowerCase() === usernameNormalizado &&
      item.password === passwordNormalizado
  );

  if (!usuario) {
    return null;
  }

  return {
    username: usuario.username,
    nombre: usuario.nombre,
    rol: usuario.rol,
  };
}
