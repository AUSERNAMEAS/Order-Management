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
const ordersRoutes = require('./routes/orders')


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



/* ===== routes ===== */
// we only have one because we use modular router
// we use the same /api/pedidos but we add the extra url in the roouter
app.use("/api/pedidos", ordersRoutes);




// this displays our html to all of urls that are not related to the backend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});




app.listen(5000, () => {
  console.log("🚀 Servidor corriendo en puerto 5000");
});
