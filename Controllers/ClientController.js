const db = require('../Config/db');

// Create
exports.createClient = async (req, res) => {
  try {
    const { Client_Name, Contact_Person, Email, Phone, Location, Status } = req.body;
    const [result] = await db.query(
      `INSERT INTO Clients (Client_Name, Contact_Person, Email, Phone, Location, Status) VALUES (?, ?, ?, ?, ?, ?)`,
      [Client_Name, Contact_Person, Email, Phone, Location, Status]
    );
    res.status(201).json({ message: 'Client created', clientId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all
exports.getClients = async (req, res) => {
  try {
    const [clients] = await db.query(`SELECT * FROM Clients`);
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read one
exports.getClientById = async (req, res) => {
  try {
    const [client] = await db.query(`SELECT * FROM Clients WHERE ClientId = ?`, [req.params.id]);
    if (client.length === 0) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json(client[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
exports.updateClient = async (req, res) => {
  try {
    const { Client_Name, Contact_Person, Email, Phone, Location, Status } = req.body;
    const [result] = await db.query(
      `UPDATE Clients SET Client_Name=?, Contact_Person=?, Email=?, Phone=?, Location=?, Status=? WHERE ClientId=?`,
      [Client_Name, Contact_Person, Email, Phone, Location, Status, req.params.id]
    );
    res.status(200).json({ message: 'Client updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.deleteClient = async (req, res) => {
  try {
    await db.query(`DELETE FROM Clients WHERE ClientId = ?`, [req.params.id]);
    res.status(200).json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
