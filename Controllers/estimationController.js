const db = require('../Config/db');

// Create
exports.createEstimation = async (req, res) => {
  try {
    const {
      description, quantity, u_p_coting, u_p_market,
    } = req.body;

    const qty = parseFloat(quantity);
    const UPC = parseFloat(u_p_coting);
    const UPM = parseFloat(u_p_market);

    const TPC = UPC * qty; // Total Price Coting
    const TPM = UPM * qty; // Total Price Market

    const tva = TPC * 0.18;
    const exc_tva = TPC - tva;
    const three_perc = TPC * 0.03;
    const t_taxes = tva + three_perc;
    const refund = TPC - t_taxes;
    const profit = TPC - TPM - t_taxes;

    const [result] = await db.execute(
      `INSERT INTO estimation 
      (description, quantity, u_p_coting, t_p_coting, u_p_market, t_p_market, tva, exc_tva, three_perc, t_taxes, refund, profit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [description, qty, UPC, TPC, UPM, TPM, tva, exc_tva, three_perc, t_taxes, refund, profit]
    );

    res.status(201).json({ message: 'Estimation created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Read All
exports.getEstimations = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM estimation ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Read One
exports.getEstimationById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM estimation WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update
exports.updateEstimation = async (req, res) => {
  try {
    const {
      description, quantity, u_p_coting, u_p_market,
    } = req.body;

    const qty = parseFloat(quantity);
    const UPC = parseFloat(u_p_coting);
    const UPM = parseFloat(u_p_market);

    const TPC = UPC * qty;
    const TPM = UPM * qty;

    const tva = TPC * 0.18;
    const exc_tva = TPC - tva;
    const three_perc = TPC * 0.03;
    const t_taxes = tva + three_perc;
    const refund = TPC - t_taxes;
    const profit = TPC - TPM - t_taxes;

    const [result] = await db.execute(
      `UPDATE estimation SET 
        description = ?, quantity = ?, u_p_coting = ?, t_p_coting = ?, 
        u_p_market = ?, t_p_market = ?, tva = ?, exc_tva = ?, 
        three_perc = ?, t_taxes = ?, refund = ?, profit = ?
      WHERE id = ?`,
      [description, qty, UPC, TPC, UPM, TPM, tva, exc_tva, three_perc, t_taxes, refund, profit, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Estimation not found' });
    res.json({ message: 'Estimation updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete
exports.deleteEstimation = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM estimation WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Estimation not found' });
    res.json({ message: 'Estimation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
