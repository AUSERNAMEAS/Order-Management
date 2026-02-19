const express = require("express");
const router = express.Router();
const Pedido = require("../models/pedido");

// ================= get ALL orders =================
router.get("/", async (req, res) => {
  try {
    // we fetch the products and return the json
    const pedidos = await Pedido.find().sort({ pedido:1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo pedidos" });
  }
});

// ================= CREAR PEDIDO =================
router.post("/", async (req, res) => {
  try {
    const nuevoPedido = new Pedido(req.body);
    await nuevoPedido.save();
    res.json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ error: "Error creando pedido" });
  }
});

// ================= ACTUALIZAR PEDIDO =================
router.put("/:id", async (req, res) => {
  try {
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(pedidoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando pedido" });
  }
});

// 🗑 ELIMINAR PEDIDO
router.delete("/:id", async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Pedido eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar pedido" });
  }
});

module.exports = router;