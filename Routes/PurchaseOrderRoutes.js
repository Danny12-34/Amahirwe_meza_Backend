const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  countOrders,
  deleteOrder
} = require('../Controllers/PurchaseOrderController');

router.post('/create', createOrder);
router.get('/getAll', getOrders);
router.get('/count', countOrders);
router.get('/get/:id', getOrderById);
router.put('/update/:id', updateOrder);
router.delete('/delete/:id', deleteOrder);

module.exports = router;
