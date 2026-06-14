const path = require('path');
const pool = require('../Config/db');

// CREATE document
exports.createDocument = async (req, res) => {
  try {
    const { DocID, DocumentType, CreatedAt } = req.body;
    const file = req.file;

    if (!DocID || !DocumentType || !CreatedAt || !file) {
      return res.status(400).json({
        message: 'All fields including file upload are required.'
      });
    }

    const allowedTypes = ['EBM', 'Report', 'Delivery Note'];
    if (!allowedTypes.includes(DocumentType)) {
      return res.status(400).json({
        message: 'Invalid DocumentType value.'
      });
    }

    const result = await pool.query(
      `INSERT INTO documents_comeWith
       (DocID, DocumentType, CreatedAt, FileName, FilePath)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        DocID,
        DocumentType,
        CreatedAt,
        file.filename,
        file.path
      ]
    );

    res.status(201).json({
      message: 'Document saved successfully',
      documentId: result.rows[0].id
    });

  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL
exports.getAllDocuments = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM documents_comeWith ORDER BY created_at DESC'
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BY ID
exports.getDocumentById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM documents_comeWith WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { DocID, DocumentType, CreatedAt } = req.body;

    const allowedTypes = ['EBM', 'Report', 'Delivery Note'];
    if (DocumentType && !allowedTypes.includes(DocumentType)) {
      return res.status(400).json({
        message: 'Invalid DocumentType value.'
      });
    }

    const result = await pool.query(
      `UPDATE documents_comeWith
       SET DocID = $1,
           DocumentType = $2,
           CreatedAt = $3
       WHERE id = $4`,
      [
        DocID,
        DocumentType,
        CreatedAt,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    res.json({
      message: 'Document updated successfully'
    });

  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE
exports.deleteDocument = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM documents_comeWith WHERE id = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    res.json({
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};