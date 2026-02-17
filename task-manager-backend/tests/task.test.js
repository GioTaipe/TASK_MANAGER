const request = require("supertest");
const app = require("../src/app"); // servidor express
const taskService = require("../src/services/taskService");

const commonHeaders = { 'x-device-id': 'dev-123' }; // Header común para simular el deviceId en las pruebas

// 1. "Simulamos" el servicio para no escribir en la base de datos real
jest.mock("../src/services/taskService");

describe("Pruebas de Crear Tarea", () => {
  // Limpiamos los simulacros después de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("DEBERÍA fallar (400) si el título está vacío", async () => {
    // Ejecución
    const response = await request(app)
      .post("/api") // ruta de creación
      .set(commonHeaders)
      .send({
        title: "", // Título vacío
        isPomodoro: false,
      });

    // Verificación
    expect(response.statusCode).toBe(400);
    // Aquí confirmamos que el servicio NI SIQUIERA llegó a llamarse
    expect(taskService.createTask).not.toHaveBeenCalled();
  });

  it("DEBERÍA crear la tarea (201) si los datos son correctos", async () => {
    // Programamos el Mock: "Cuando te llamen, di que todo ok"
    const mockTask = {
      _id: "abc",
      title: "Aprender Java",
      deviceId: "device-123",
    };
    taskService.createTask.mockResolvedValue(mockTask);

    // Ejecución
    const response = await request(app)
      .post("/api") // ruta de creación
      .set(commonHeaders)
      .send({
        title: "Aprender Java",
        isPomodoro: false,
      });

    // Verificación
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Aprender Java");
    // Confirmamos que el servicio recibió el deviceId correctamente
    expect(taskService.createTask).toHaveBeenCalledWith(
      expect.objectContaining({ deviceId: commonHeaders["x-device-id"] }),
    );
  });
});

describe("Pruebas de Flujo de Seguridad (DeviceId)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("DEBERÍA fallar (401) si el header x-device-id está vacío", async () => {
    const response = await request(app).get("/api/").set("x-device-id", ""); // Header presente pero vacío

    expect(response.statusCode).toBe(401);
    expect(taskService.getAllTasks).not.toHaveBeenCalled();
  });

  it("DEBERÍA fallar (401) si el header x-device-id NO existe", async () => {
    const response = await request(app).get("/api/"); // No seteamos el header en absoluto

    expect(response.statusCode).toBe(401); // Aquí esperamos un 401 porque el middleware debería bloquear la petición por falta del header
    expect(taskService.getAllTasks).not.toHaveBeenCalled();
  });
});

describe("Pruebas de Eliminar Tarea", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("DEBERÍA llamar al servicio con el ID y el DeviceID correctos", async () => {
    // Datos de prueba
    const taskId = "tarea-123";
    const mockDeviceId = "dispositivo-789";

    // Configuramos el Mock para que devuelva algo (éxito)
    taskService.deleteTask.mockResolvedValue({ _id: taskId });

    // Ejecución
    const response = await request(app)
      .delete(`/api/${taskId}`) // Pasamos el ID en la URL
      .set("x-device-id", mockDeviceId); // Pasamos el deviceId en el header

    // Verificaciones
    expect(response.statusCode).toBe(200);

    // Verificamos que el controlador llamó al servicio con los argumentos exactos
    expect(taskService.deleteTask).toHaveBeenCalledWith(taskId, mockDeviceId);
  });
});

describe("Pruebas de Error en la bdd", () => {
  it("DEBERÍA devolver 500 si el servicio lanza una excepción inesperada", async () => {
    taskService.deleteTask.mockRejectedValue(
      new Error("Error de base de datos"),
    );

    const response = await request(app)
      .delete("/api/123")
      .set(commonHeaders);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Error de base de datos");
  });
});
