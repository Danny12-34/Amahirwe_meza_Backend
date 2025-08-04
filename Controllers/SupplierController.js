const db = require('../Config/db');

// CREATE
const createSupplier = async (req, res) => {
  try {
    const {
      Supplier_Name, ContactPerson, Email, Phone,
      Location, Registration_number, Product_Category, Verifiered
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO suppliers (Supplier_Name, ContactPerson, Email, Phone, Location, Registration_number, Product_Category, Verifiered)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [Supplier_Name, ContactPerson, Email, Phone, Location, Registration_number, Product_Category, Verifiered || 'N']
    );

    res.status(201).json({ success: true, message: 'Supplier created', insertId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating supplier', error: error.message });
  }
};

// READ ALL
const getAllSuppliers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suppliers');
    res.status(200).json({ success: true, total: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching suppliers', error: error.message });
  }
};

// READ ONE
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM suppliers WHERE SupplierId = ?', [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching supplier', error: error.message });
  }
};

// UPDATE
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Supplier_Name, ContactPerson, Email, Phone,
      Location, Registration_number, Product_Category, Verifiered
    } = req.body;

    const [result] = await db.query(
      `UPDATE suppliers SET Supplier_Name=?, ContactPerson=?, Email=?, Phone=?, Location=?, Registration_number=?, Product_Category=?, Verifiered=? 
       WHERE SupplierId=?`,
      [Supplier_Name, ContactPerson, Email, Phone, Location, Registration_number, Product_Category, Verifiered, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'No supplier found with this ID' });
    }

    res.status(200).json({ success: true, message: 'Supplier updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating supplier', error: error.message });
  }
};

// DELETE
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM suppliers WHERE SupplierId = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'No supplier found with this ID' });
    }

    res.status(200).json({ success: true, message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting supplier', error: error.message });
  }
};

// COUNT ALL SUPPLIERS
const countSuppliers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS totalSuppliers FROM suppliers');
    res.status(200).json({ success: true, totalSuppliers: rows[0].totalSuppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error counting suppliers', error: error.message });
  }
};


module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  countSuppliers
};
