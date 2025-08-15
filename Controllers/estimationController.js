const db = require('../Config/db');

// ------------------ CREATE ------------------
exports.createEstimation = async (req, res) => {
  try {
    const { B_Code,Site,Board_command, description, quantity, u_p_coting } = req.body;

    // Convert numbers
    const qty = parseFloat(quantity) || 0;
    const UPC = parseFloat(u_p_coting) || 0;

    // Calculations
    const TPC = UPC * qty; // Total Price Coting
    const UPM = UPC * 1.1; // Unit Price Market (example logic)
    const TPM = UPM * qty;  // Total Price Market
    const tva = TPC * 0.15;
    const exc_tva = TPC - tva;
    const three_perc = exc_tva * 0.03;
    const t_taxes = tva + three_perc;
    const refund = TPM * 0.15;
    const profit = TPC - TPM - t_taxes;

    // Insert into DB
    const [result] = await db.execute(
      `INSERT INTO estimation 
      (B_Code,Site,Board_command, description, quantity, u_p_coting, t_p_coting, u_p_market, t_p_market, tva, exc_tva, three_perc, t_taxes, refund, profit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [B_Code,Site, Board_command, description, qty, UPC, TPC, UPM, TPM, tva, exc_tva, three_perc, t_taxes, refund, profit]
    );

    res.status(201).json({ message: 'Estimation created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ------------------ READ ALL ------------------
exports.getEstimations = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM estimation ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ------------------ READ ONE ------------------
exports.getEstimationById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM estimation WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Estimation not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ------------------ UPDATE ------------------
exports.updateEstimation = async (req, res) => {
  try {
    const { B_Code,Site,Board_command, description, quantity, u_p_coting } = req.body;

    const qty = parseFloat(quantity) || 0;
    const UPC = parseFloat(u_p_coting) || 0;

    // Calculations
    const TPC = UPC * qty; // Total Price Coting
    const UPM = UPC * 1.1; // Unit Price Market
    const TPM = UPM * qty;  // Total Price Market
    const tva = TPC * 0.18;
    const exc_tva = TPC - tva;
    const three_perc = TPC * 0.03;
    const t_taxes = tva + three_perc;
    const refund = t_taxes * 0.1;
    const profit = TPM - TPC - t_taxes + refund;

    const [result] = await db.execute(
      `UPDATE estimation SET
        B_Code = ?,
        Site = ?,
        Board_command = ?, 
        description = ?, 
        quantity = ?, 
        u_p_coting = ?, 
        t_p_coting = ?, 
        u_p_market = ?, 
        t_p_market = ?, 
        tva = ?, 
        exc_tva = ?, 
        three_perc = ?, 
        t_taxes = ?, 
        refund = ?, 
        profit = ?
      WHERE id = ?`,
      [B_Code,Site,Board_command, description, qty, UPC, TPC, UPM, TPM, tva, exc_tva, three_perc, t_taxes, refund, profit, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Estimation not found' });
    res.json({ message: 'Estimation updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ------------------ DELETE ------------------
exports.deleteEstimation = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM estimation WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Estimation not found' });
    res.json({ message: 'Estimation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
