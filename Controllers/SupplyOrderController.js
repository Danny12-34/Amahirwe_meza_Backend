const db = require('../Config/db');

// CREATE Supply Order
exports.createSupplyOrder = async (req, res) => {
  const {
    Date_Sent,
    Supplier_Name,
    Description_of_Goods,
    Quantity,
    Unit_Price
  } = req.body;

  if (!Date_Sent || !Supplier_Name || !Description_of_Goods || !Quantity || !Unit_Price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO supplyorders
       (Date_Sent, Supplier_Name, Description_of_Goods, Quantity, Unit_Price)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING SupplyOrderId`,
      [
        Date_Sent,
        Supplier_Name,
        Description_of_Goods,
        Quantity,
        Unit_Price
      ]
    );

    res.status(201).json({
      message: 'Supply Order created',
      id: result.rows[0].supplyorderid || result.rows[0].SupplyOrderId
    });

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};

// GET ALL
exports.getSupplyOrders = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM supplyorders ORDER BY SupplyOrderId DESC'
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};

// GET ONE
exports.getSupplyOrderById = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM supplyorders WHERE SupplyOrderId = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};

// UPDATE
exports.updateSupplyOrder = async (req, res) => {
  const {
    Date_Sent,
    Supplier_Name,
    Description_of_Goods,
    Quantity,
    Unit_Price
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE supplyorders
       SET Date_Sent = $1,
           Supplier_Name = $2,
           Description_of_Goods = $3,
           Quantity = $4,
           Unit_Price = $5
       WHERE SupplyOrderId = $6`,
      [
        Date_Sent,
        Supplier_Name,
        Description_of_Goods,
        Quantity,
        Unit_Price,
        req.params.id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Supply Order updated' });

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};

// DELETE
exports.deleteSupplyOrder = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM supplyorders WHERE SupplyOrderId = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Supply Order deleted' });

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};

// COUNT
exports.countSupplyOrders = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT COUNT(*) FROM supplyorders'
    );

    res.json({
      success: true,
      totalSupplyOrders: parseInt(result.rows[0].count)
    });

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};