const express = require('express');
const router = express.Router();
const {
  createSupplyOrder,
  getSupplyOrders,
  getSupplyOrderById,
  updateSupplyOrder,
  countSupplyOrders,
  deleteSupplyOrder
} = require('../Controllers/SupplyOrderController');

router.post('/create', createSupplyOrder);
router.get('/count', countSupplyOrders);
router.get('/getAll', getSupplyOrders);
router.get('/get/:id', getSupplyOrderById);
router.put('/update/:id', updateSupplyOrder);
router.delete('/delete/:id', deleteSupplyOrder);

module.exports = router;
