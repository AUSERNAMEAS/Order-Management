const Pedido = require("../models/pedido");

// ================= GET ALL =================
exports.getOrder = async (req, res) => {
  try {
    //we fetch the orders and orders them by ascendent
    const pedidos = await Pedido.find().sort({ createdAt: -1 });
    //then we return the json to work with it later
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo pedidos" });
  }
};

// ================= CREATE =================
exports.createNewOrder = async (req, res) => {
  try {
    //create a new order with the function new and save from MOONGO
    const newOrder = new Pedido(req.body);
    await newOrder.save();
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Error creando pedido" });
  }
};

// ================= UPDATE =================
exports.updateOrder = async (req, res) => {
  try {
    //We try to find the order by the id we get from the page
    //then with all of the data from the body we updated th order
    const orderUpdated = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(orderUpdated);
  } catch (error) {
    
    res.status(500).json({ error: "Error actualizando pedido" });
  }
};

// ================= DELETE =================
exports.deleteOrder = async (req, res) => {
  try {
    //try to delete a order by its id
    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Pedido eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando pedido" });
  }
};
