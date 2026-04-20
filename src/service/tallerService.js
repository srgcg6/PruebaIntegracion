const db = require("../repository/tallerRepository");

async function registerCoche(name, matricula, problema) {
  if (!name || !matricula) {
    throw new Error("El nombre y la matrícula son obligatorios");
  }

  const matriculaRegex = /^[0-9]{4}\s?[A-Za-z]{3}$/;
  if (!matriculaRegex.test(matricula)) {
    throw new Error("Formato de matrícula inválido (ej. 1234 ABC)");
  }

  const existingCoche = await db.findCocheByMatricula(matricula);

  if (existingCoche) {
    throw new Error("Ya existe un coche registrado con esa matrícula");
  }

  const newCoche = await db.saveCoche({ name, matricula, problema });

  return newCoche;
}

async function getAllCoches() {
  const coches = await db.findAllCoches();
  return coches;
}

module.exports = { registerCoche, getAllCoches };
