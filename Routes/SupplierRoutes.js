const express = require('express');
const router = express.Router();

const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  countSuppliers,
  deleteSupplier
} = require('../Controllers/SupplierController');

router.post('/create', createSupplier);
router.get('/getAll', getAllSuppliers);
router.get('/get/:id', getSupplierById);
router.put('/update/:id', updateSupplier);
router.delete('/delete/:id', deleteSupplier);
router.get('/count', countSuppliers);

module.exports = router;
