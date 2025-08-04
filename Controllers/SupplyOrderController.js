const db = require('../Config/db');

// Create Supply Order
exports.createSupplyOrder = async (req, res) => {
  const { Date_Sent, Supplier_Name, Description_of_Goods, Quantity, Unit_Price } = req.body;

  if (!Date_Sent || !Supplier_Name || !Description_of_Goods || !Quantity || !Unit_Price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO SupplyOrders (Date_Sent, Supplier_Name, Description_of_Goods, Quantity, Unit_Price)
       VALUES (?, ?, ?, ?, ?)`,
      [Date_Sent, Supplier_Name, Description_of_Goods, Quantity, Unit_Price]
    );
    res.status(201).json({ message: 'Supply Order created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Get all Supply Orders
exports.getSupplyOrders = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM SupplyOrders');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Get single Supply Order by ID
exports.getSupplyOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM SupplyOrders WHERE SupplyOrderId = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Update Supply Order
exports.updateSupplyOrder = async (req, res) => {
  const { id } = req.params;
  const { Date_Sent, Supplier_Name, Description_of_Goods, Quantity, Unit_Price } = req.body;

  try {
    await db.execute(
      `UPDATE SupplyOrders
       SET Date_Sent = ?, Supplier_Name = ?, Description_of_Goods = ?, Quantity = ?, Unit_Price = ?
       WHERE SupplyOrderId = ?`,
      [Date_Sent, Supplier_Name, Description_of_Goods, Quantity, Unit_Price, id]
    );
    res.json({ message: 'Supply Order updated' });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Delete Supply Order
exports.deleteSupplyOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM SupplyOrders WHERE SupplyOrderId = ?', [id]);
    res.json({ message: 'Supply Order deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};


// COUNT ALL SUPPLY ORDERS
exports.countSupplyOrders = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT COUNT(*) AS totalSupplyOrders FROM SupplyOrders');
    res.json({ success: true, totalSupplyOrders: rows[0].totalSupplyOrders });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

