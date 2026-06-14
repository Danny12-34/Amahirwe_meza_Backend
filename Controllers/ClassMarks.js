const path = require('path');
const pool = require('../Config/db');

// Create document
exports.createDocument = async (req, res) => {
  try {
    const { DocID, Description, CreatedAt } = req.body;
    const file = req.file;

    if (!DocID || !Description || !CreatedAt || !file) {
      return res.status(400).json({
        message: 'All fields including file upload are required.'
      });
    }

    const result = await pool.query(
      `INSERT INTO Trash
      (DocID, Description, CreatedAt, FileName, FilePath)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`,
      [
        DocID,
        Description,
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
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM Trash ORDER BY created_at DESC'
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM Trash WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Update document
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { DocID, Description, CreatedAt } = req.body;

    const result = await pool.query(
      `UPDATE Trash
       SET DocID = $1,
           Description = $2,
           CreatedAt = $3
       WHERE id = $4`,
      [
        DocID,
        Description,
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
    res.status(500).json({
      message: 'Server error'
    });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM Trash WHERE id = $1',
      [id]
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
    res.status(500).json({
      message: 'Server error'
    });
  }
};