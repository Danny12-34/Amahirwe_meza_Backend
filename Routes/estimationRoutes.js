const express = require('express');
const router = express.Router();
const estimationController = require('../Controllers/estimationController');

router.post('/create', estimationController.createEstimation);
router.get('/all', estimationController.getEstimations);
router.get('get/:id', estimationController.getEstimationById);
router.put('/update/:id', estimationController.updateEstimation);
router.delete('/delete/:id', estimationController.deleteEstimation);

module.exports = router;
