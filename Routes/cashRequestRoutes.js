const express = require('express');
const router = express.Router();
const controller = require('../Controllers/cashRequestController');

router.post('/submit', controller.submitCashRequest);
router.get('/getAll', controller.getCashRequests);
router.get('/download/:id', controller.downloadPDF);

module.exports = router;
