const express = require("express");
const router = express.Router();
//we use destructurin to save all the functions we made without
//save them one by one
const {
  getOrder,
  createNewOrder,
  updateOrder,
  deleteOrder,
} = require("../controller/orders.controller");

router.get("/", getOrder);
router.post("/", createNewOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
