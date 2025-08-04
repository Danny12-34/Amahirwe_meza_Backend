const express = require('express');
const router = express.Router();
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} = require('../Controllers/ClientController');

router.post('/create', createClient);
router.get('/getAll', getClients);
router.get('/get/:id', getClientById);
router.put('/update/:id', updateClient);
router.delete('/delete/:id', deleteClient);

module.exports = router;
