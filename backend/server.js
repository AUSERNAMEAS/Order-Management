//we import the modules to initialize our app
//and mongoose to manage our database

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
//this let us get the MONGO_URI and not have issues in the process
require("dotenv").config({ path: __dirname + "/.env" });
const app = express();
const router = express.Router();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist"))); // <- carpeta build de React

console.log("MONGO_URI:", process.env.MONGO_URI);

//this connect the databse with out project
//mongo provides us the MONGO_URI
//it has to be secrest tho
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.log(err));

/* ===== SCHEMA ===== */

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

// then we add a name and created the data base
const Pedido = mongoose.model("pedido", PedidoSchema);

/* ===== routes ===== */

// get all of the orders
app.get("/api/pedidos", async (req, res) => {
  //we fetch the orders and orders them by ascendent
  const pedidos = await Pedido.find().sort({ createdAt: -1 });
  //then we return the json to work with it later
  res.json(pedidos);


});

// create new orders
app.post("/api/pedidos", async (req, res) => {
  const nuevo = new Pedido(req.body);
  await nuevo.save();
  res.json(nuevo);
});

// edit
app.put("/api/pedidos/:id", async (req, res) => {
  //the functions like findById are provide by MONGO
  // and we use it to locate the order and do the things we want with it
  const actualizado = await Pedido.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(actualizado);
});

// delete
app.delete("/api/pedidos/:id", async (req, res) => {
  //function provide by MONGO
  await Pedido.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Eliminado" });
});

// this displays our html to all of urls that are not related to the backend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});




app.listen(5000, () => {
  console.log("🚀 Servidor corriendo en puerto 5000");
});
/*fix(server.js) reorganize the structure of the project and delete duplicated data*/ 