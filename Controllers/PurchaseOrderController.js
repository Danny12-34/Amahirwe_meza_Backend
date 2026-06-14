const db = require('../Config/db');

// CREATE
exports.createOrder = async (req, res) => {
  const {
    Date_Received,
    Client_Name,
    Description_of_Goods,
    Quantity,
    Unit_Price,
    Status
  } = req.body;

  if (!Date_Received || !Client_Name || !Description_of_Goods || !Quantity || !Unit_Price || !Status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO purchaseorders
       (Date_Received, Client_Name, Description_of_Goods, Quantity, Unit_Price, Status)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING PurchaseOrderId`,
      [
        Date_Received,
        Client_Name,
        Description_of_Goods,
        Quantity,
        Unit_Price,
        Status
      ]
    );

    res.status(201).json({
      message: 'Purchase Order created',
      id: result.rows[0].purchaseorderid || result.rows[0].PurchaseOrderId
    });

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};

// READ ALL
exports.getOrders = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM purchaseorders ORDER BY purchaseorderid DESC'
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};

// READ ONE
exports.getOrderById = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM purchaseorders WHERE PurchaseOrderId = $1',
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
exports.updateOrder = async (req, res) => {
  const {
    Date_Received,
    Client_Name,
    Description_of_Goods,
    Quantity,
    Unit_Price,
    Status
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE purchaseorders
       SET Date_Received = $1,
           Client_Name = $2,
           Description_of_Goods = $3,
           Quantity = $4,
           Unit_Price = $5,
           Status = $6
       WHERE PurchaseOrderId = $7`,
      [
        Date_Received,
        Client_Name,
        Description_of_Goods,
        Quantity,
        Unit_Price,
        Status,
        req.params.id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated' });

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};

// DELETE
exports.deleteOrder = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM purchaseorders WHERE PurchaseOrderId = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted' });

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};

// COUNT
exports.countOrders = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT COUNT(*) FROM purchaseorders'
    );

    res.json({
      success: true,
      totalOrders: parseInt(result.rows[0].count)
    });

  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
};