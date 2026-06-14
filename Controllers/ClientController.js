const db = require('../Config/db');

// CREATE
exports.createClient = async (req, res) => {
  try {
    const {
      Client_Name,
      Contact_Person,
      Email,
      Phone,
      Location,
      Status
    } = req.body;

    const result = await db.query(
      `INSERT INTO clients
      (Client_Name, Contact_Person, Email, Phone, Location, Status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ClientId`,
      [
        Client_Name,
        Contact_Person,
        Email,
        Phone,
        Location,
        Status
      ]
    );

    res.status(201).json({
      message: 'Client created',
      clientId: result.rows[0].clientid || result.rows[0].clientId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ALL
exports.getClients = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM clients`);
    res.status(200).json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ONE
exports.getClientById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM clients WHERE ClientId = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateClient = async (req, res) => {
  try {
    const {
      Client_Name,
      Contact_Person,
      Email,
      Phone,
      Location,
      Status
    } = req.body;

    const result = await db.query(
      `UPDATE clients
       SET Client_Name = $1,
           Contact_Person = $2,
           Email = $3,
           Phone = $4,
           Location = $5,
           Status = $6
       WHERE ClientId = $7`,
      [
        Client_Name,
        Contact_Person,
        Email,
        Phone,
        Location,
        Status,
        req.params.id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ message: 'Client updated' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteClient = async (req, res) => {
  try {
    const result = await db.query(
      `DELETE FROM clients WHERE ClientId = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ message: 'Client deleted' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};