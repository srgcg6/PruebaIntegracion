const express = require("express");
const cors = require("cors");
const db = require("../repository/tallerRepository");
const cochesService = require("../service/tallerService");

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());

app.get("/coches", async (req, res) => {
  try {
    const coches = await cochesService.getAllCoches();
    res.status(200).json(coches);
  } catch (error) {
    res.status(500).json({ error: "Error interno", details: error.message });
  }
});

app.post("/coches", async (req, res) => {
  try {
    const { name, matricula, problema } = req.body;
    const newCoche = await cochesService.registerCoche(name, matricula, problema);
    res.status(201).json(newCoche);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

async function startServer() {
  try {
    await db.init();
    app.listen(PORT, () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Error al iniciar la aplicación:", error);
  }
}

startServer();
