const mongoose = require("mongoose");

// with the connection alr made
// we define our kinda database but howll it be with object 
// we use MONGO insted of SQL

const PedidoSchema = new mongoose.Schema(
  {
    pedido: Number,
    nombre: String,
    usuario: String,
    redes: String,
    detalle: String,
    anticipo: Number,
    total: Number,
    estado: String,
    tipoEntrega: String,
  },
  { timestamps: true }
);

// then we add a name and created the data base and export it

module.exports = mongoose.model("Pedido", PedidoSchema);