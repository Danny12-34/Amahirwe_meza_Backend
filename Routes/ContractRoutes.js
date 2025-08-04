const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  countContracts,
  autoUpdateContractStatus,
  deleteContract
} = require('../Controllers/ContractController');

// Ensure upload directory exists
const uploadDir = 'uploads/contracts';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Use multer middleware on create and update routes
router.post('/create', upload.single('contractFile'), createContract);
router.put('/update/:id', upload.single('contractFile'), updateContract);  // <-- multer added here

router.get('/getAll', getAllContracts);
router.get('/get/:id', getContractById);
router.get('/count', countContracts);
router.put('/auto-update-status', autoUpdateContractStatus);
router.delete('/delete/:id', deleteContract);

module.exports = router;
