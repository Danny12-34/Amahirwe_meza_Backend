const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// CREATE
router.post('/create', userController.createUser);

// READ
router.get('/getAll', userController.getAllUsers);
router.get('/get/:id', userController.getUserById);

// UPDATE
router.put('/update/:id', userController.updateUser);

// DELETE
router.delete('/delete/:id', userController.deleteUser);

router.post('/login', userController.loginUser);


module.exports = router;
