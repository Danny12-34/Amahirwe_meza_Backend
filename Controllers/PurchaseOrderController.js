const db = require('../Config/db');

// Create
exports.createOrder = async (req, res) => {
  const { Date_Received, Client_Name, Description_of_Goods, Quantity, Unit_Price, Status } = req.body;

  if (!Date_Received || !Client_Name || !Description_of_Goods || !Quantity || !Unit_Price|| !Status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO PurchaseOrders (Date_Received, Client_Name, Description_of_Goods, Quantity, Unit_Price,Status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Date_Received, Client_Name, Description_of_Goods, Quantity, Unit_Price,Status]
    );
    res.status(201).json({ message: 'Purchase Order created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Read All
exports.getOrders = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM PurchaseOrders');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Read One
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM PurchaseOrders WHERE PurchaseOrderId = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Update
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { Date_Received, Client_Name, Description_of_Goods, Quantity, Unit_Price,Status } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE PurchaseOrders
       SET Date_Received = ?, Client_Name = ?, Description_of_Goods = ?, Quantity = ?, Unit_Price = ?, Status = ?
       WHERE PurchaseOrderId = ?`,
      [Date_Received, Client_Name, Description_of_Goods, Quantity, Unit_Price,Status, id]
    );
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Delete
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM PurchaseOrders WHERE PurchaseOrderId = ?', [id]);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};



// COUNT ALL PURCHASE ORDERS
exports.countOrders = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT COUNT(*) AS totalOrders FROM PurchaseOrders');
    res.json({ success: true, totalOrders: rows[0].totalOrders });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

