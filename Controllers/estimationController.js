const db = require('../Config/db');

// ------------------ CREATE ------------------
exports.createEstimation = async (req, res) => {
  try {
    const { B_Code, Site, Board_command, description, quantity, u_p_coting } = req.body;

    const qty = parseFloat(quantity) || 0;
    const UPC = parseFloat(u_p_coting) || 0;

    const TPC = UPC * qty;
    const UPM = UPC * 1.1;
    const TPM = UPM * qty;
    const tva = TPC * 0.15;
    const exc_tva = TPC - tva;
    const three_perc = exc_tva * 0.03;
    const t_taxes = tva + three_perc;
    const refund = TPM * 0.15;
    const profit = TPC - TPM - t_taxes;

    const result = await db.query(
      `INSERT INTO estimation
      (B_Code, Site, Board_command, description, quantity,
       u_p_coting, t_p_coting, u_p_market, t_p_market,
       tva, exc_tva, three_perc, t_taxes, refund, profit)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING id`,
      [
        B_Code,
        Site,
        Board_command,
        description,
        qty,
        UPC,
        TPC,
        UPM,
        TPM,
        tva,
        exc_tva,
        three_perc,
        t_taxes,
        refund,
        profit
      ]
    );

    res.status(201).json({
      message: 'Estimation created',
      id: result.rows[0].id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ------------------ READ ALL ------------------
exports.getEstimations = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM estimation ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ------------------ READ ONE ------------------
exports.getEstimationById = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM estimation WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Estimation not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ------------------ UPDATE ------------------
exports.updateEstimation = async (req, res) => {
  try {
    const { B_Code, Site, Board_command, description, quantity, u_p_coting } = req.body;

    const qty = parseFloat(quantity) || 0;
    const UPC = parseFloat(u_p_coting) || 0;

    const TPC = UPC * qty;
    const UPM = UPC * 1.1;
    const TPM = UPM * qty;
    const tva = TPC * 0.18;
    const exc_tva = TPC - tva;
    const three_perc = TPC * 0.03;
    const t_taxes = tva + three_perc;
    const refund = t_taxes * 0.1;
    const profit = TPM - TPC - t_taxes + refund;

    const result = await db.query(
      `UPDATE estimation SET
        B_Code = $1,
        Site = $2,
        Board_command = $3,
        description = $4,
        quantity = $5,
        u_p_coting = $6,
        t_p_coting = $7,
        u_p_market = $8,
        t_p_market = $9,
        tva = $10,
        exc_tva = $11,
        three_perc = $12,
        t_taxes = $13,
        refund = $14,
        profit = $15
      WHERE id = $16`,
      [
        B_Code,
        Site,
        Board_command,
        description,
        qty,
        UPC,
        TPC,
        UPM,
        TPM,
        tva,
        exc_tva,
        three_perc,
        t_taxes,
        refund,
        profit,
        req.params.id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Estimation not found' });
    }

    res.json({ message: 'Estimation updated' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ------------------ DELETE ------------------
exports.deleteEstimation = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM estimation WHERE id = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Estimation not found' });
    }

    res.json({ message: 'Estimation deleted' });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};