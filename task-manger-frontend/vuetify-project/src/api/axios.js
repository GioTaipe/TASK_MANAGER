import axios from "axios";
import { useUiStore } from "@/stores/uiStore";

// 1. Definimos la lógica de Device ID arriba para que esté lista
const getDeviceId = () => {
  let id = localStorage.getItem("chrono_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chrono_device_id", id);
  }
  return id;
};

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// 2. Interceptor de Petición
api.interceptors.request.use((config) => {
  // Llamada al store dentro de la función (Correcto para evitar el error de Pinia)
  const uiStore = useUiStore();
  uiStore.setLoading(true);

  config.headers["x-device-id"] = getDeviceId();
  return config;
});

// 3. Interceptor de Respuesta
api.interceptors.response.use(
  (response) => {
    const uiStore = useUiStore();
    uiStore.setLoading(false);
    return response;
  },
  (error) => {
    const uiStore = useUiStore();
    uiStore.setLoading(false);
    
    let mensajeParaMostrar = "";

    if (error.code === "ERR_NETWORK") {
        // Axios nos da este código cuando el servidor está apagado
        mensajeParaMostrar = "No se pudo conectar con el servidor.";
    } else {
        // Si hay respuesta del server pero con error (400, 500, etc)
        mensajeParaMostrar = error.response?.data?.message || "Error inesperado en el servidor";
    }

    console.log("Enviando a notificación:", mensajeParaMostrar);
    uiStore.notify(mensajeParaMostrar, "error");

    return Promise.reject(error);
  },
);

export default api;
