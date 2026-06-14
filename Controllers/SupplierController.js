const db = require('../Config/db');

// CREATE
const createSupplier = async (req, res) => {
  try {
    const {
      Supplier_Name,
      ContactPerson,
      Email,
      Phone,
      Location,
      Registration_number,
      Product_Category,
      Verifiered
    } = req.body;

    const result = await db.query(
      `INSERT INTO suppliers
      (Supplier_Name, ContactPerson, Email, Phone, Location, Registration_number, Product_Category, Verifiered)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING SupplierId`,
      [
        Supplier_Name,
        ContactPerson,
        Email,
        Phone,
        Location,
        Registration_number,
        Product_Category,
        Verifiered || 'N'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Supplier created',
      insertId: result.rows[0].supplierid || result.rows[0].SupplierId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating supplier',
      error: error.message
    });
  }
};

// READ ALL
const getAllSuppliers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM suppliers ORDER BY SupplierId DESC'
    );

    res.status(200).json({
      success: true,
      total: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching suppliers',
      error: error.message
    });
  }
};

// READ ONE
const getSupplierById = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM suppliers WHERE SupplierId = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching supplier',
      error: error.message
    });
  }
};

// UPDATE
const updateSupplier = async (req, res) => {
  try {
    const {
      Supplier_Name,
      ContactPerson,
      Email,
      Phone,
      Location,
      Registration_number,
      Product_Category,
      Verifiered
    } = req.body;

    const result = await db.query(
      `UPDATE suppliers SET
        Supplier_Name = $1,
        ContactPerson = $2,
        Email = $3,
        Phone = $4,
        Location = $5,
        Registration_number = $6,
        Product_Category = $7,
        Verifiered = $8
       WHERE SupplierId = $9`,
      [
        Supplier_Name,
        ContactPerson,
        Email,
        Phone,
        Location,
        Registration_number,
        Product_Category,
        Verifiered,
        req.params.id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No supplier found with this ID'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supplier updated'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating supplier',
      error: error.message
    });
  }
};

// DELETE
const deleteSupplier = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM suppliers WHERE SupplierId = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No supplier found with this ID'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supplier deleted'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting supplier',
      error: error.message
    });
  }
};

// COUNT
const countSuppliers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT COUNT(*) FROM suppliers'
    );

    res.status(200).json({
      success: true,
      totalSuppliers: parseInt(result.rows[0].count)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error counting suppliers',
      error: error.message
    });
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