const { registerCoche } = require("../src/service/tallerService");
const db = require("../src/repository/tallerRepository");

describe("Pruebas de Integración: CochesService + SQLite", () => {
  beforeAll(async () => {
    await db.init();
  });

  afterAll(async () => {
    await db.close();
  });

  test("Debe registrar un coche nuevo y guardarlo en la base de datos", async () => {
    const result = await registerCoche(
      "Carlos García",
      "1234 ABC",
      "Fallo en frenos",
    );

    expect(result).toHaveProperty("id");
    expect(result.name).toBe("Carlos García");

    const cocheInDb = await db.findCocheByMatricula("1234 ABC");
    expect(cocheInDb).not.toBeNull();
    expect(cocheInDb.name).toBe("Carlos García");
  });

  test("Debe lanzar un error si intentamos registrar una matrícula duplicada", async () => {
    await registerCoche(
      "María López",
      "5678 DEF",
      "Motor no arranca",
    );

    await expect(
      registerCoche(
        "Pedro Ruiz",
        "5678 DEF",
        "Fallo eléctrico",
      ),
    ).rejects.toThrow("Ya existe un coche registrado con esa matrícula");
  });

  test("Debe lanzar un error si faltan datos y no tocar la base de datos", async () => {
    await expect(registerCoche("Solo Nombre", null, null)).rejects.toThrow(
      "El nombre y la matrícula son obligatorios",
    );

    const cocheInDb = await db.findCocheByMatricula(null);
    expect(cocheInDb).toBeNull();
  });
});
