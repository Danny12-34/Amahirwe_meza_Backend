const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../Controllers/ClassMarks');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploadedTrash/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes

// Create document (with file upload)
router.post('/create', upload.single('uploadDocument'), documentController.createDocument);

// Get all documents
router.get('/getAll', documentController.getAllDocuments);

// Get one document by id
router.get('/get/:id', documentController.getDocumentById);

// Update document by id (no file upload here)
router.put('/update/:id', documentController.updateDocument);

// Delete document by id
router.delete('/Delete/:id', documentController.deleteDocument);

module.exports = router;
