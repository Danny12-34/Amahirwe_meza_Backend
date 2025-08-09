const path = require('path');
const pool = require('../Config/db'); // your MySQL pool connection

// Create document with file upload
exports.createDocument = async (req, res) => {
  try {
    const { DocID, DocumentType, CreatedAt } = req.body;
    const file = req.file;

    if (!DocID || !DocumentType || !CreatedAt || !file) {
      return res.status(400).json({ message: 'All fields including file upload are required.' });
    }

    const allowedTypes = ['EBM', 'Report', 'Delivery Note'];
    if (!allowedTypes.includes(DocumentType)) {
      return res.status(400).json({ message: 'Invalid DocumentType value.' });
    }

    const sql = `INSERT INTO documents_comeWith (DocID, DocumentType, CreatedAt, FileName, FilePath) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [
      DocID,
      DocumentType,
      CreatedAt,
      file.filename,
      file.path,
    ]);

    res.status(201).json({ message: 'Document saved successfully', documentId: result.insertId });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM documents_comeWith ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get document by id
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`SELECT * FROM documents_comeWith WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update document (without file upload)
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { DocID, DocumentType, CreatedAt } = req.body;

    const allowedTypes = ['EBM', 'Report', 'Delivery Note'];
    if (DocumentType && !allowedTypes.includes(DocumentType)) {
      return res.status(400).json({ message: 'Invalid DocumentType value.' });
    }

    const sql = `UPDATE documents_comeWith SET DocID = ?, DocumentType = ?, CreatedAt = ? WHERE id = ?`;
    const [result] = await pool.execute(sql, [
      DocID,
      DocumentType,
      CreatedAt,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document updated successfully' });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete document by id
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: delete the file from disk here if you want

    const [result] = await pool.execute(`DELETE FROM documents_comeWith WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
