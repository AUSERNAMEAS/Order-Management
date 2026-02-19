const mongoose = require("mongoose");

// Esquema de cómo se guardan los pedidos
const PedidoSchema = new mongoose.Schema(
  {
    pedido: Number,
    nombre: String,
    usuario: String,
    redes: String,
    detalle: String,
    total: Number,
    anticipo: Number,
    estado: {
      type: String,
      default: "pendiente",
    },
    tipoEntrega: {
      type: String,
      default: "personal",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pedido", PedidoSchema);