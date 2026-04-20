const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let dbConnection;

const db = {
  init: async () => {
    dbConnection = await open({
      filename: "./test.sqlite",
      driver: sqlite3.Database,
    });

    await dbConnection.exec(`
      CREATE TABLE IF NOT EXISTS coches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        matricula TEXT UNIQUE NOT NULL,
        problema TEXT
      )
    `);
  },

  findCocheByMatricula: async (matricula) => {
    const coche = await dbConnection.get(
      "SELECT * FROM coches WHERE matricula = ?",
      [matricula],
    );
    return coche || null;
  },

  findCocheByName: async (name) => {
    const coche = await dbConnection.get(
      "SELECT * FROM coches WHERE name = ?",
      [name],
    );
    return coche || null;
  },

  findAllCoches: async () => {
    const coches = await dbConnection.all("SELECT * FROM coches");
    return coches;
  },

  saveCoche: async (coche) => {
    const result = await dbConnection.run(
      "INSERT INTO coches (name, matricula, problema) VALUES (?, ?, ?)",
      [coche.name, coche.matricula, coche.problema],
    );
    return {
      id: result.lastID,
      name: coche.name,
      matricula: coche.matricula,
      problema: coche.problema,
    };
  },

  clear: async () => {
    await dbConnection.run("DELETE FROM coches");
  },

  close: async () => {
    if (dbConnection) {
      await dbConnection.close();
    }
  },
};

module.exports = db;
