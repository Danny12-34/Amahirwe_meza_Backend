const db = require('../Config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.submitCashRequest = async (req, res) => {
  try {
    const {
      requisition_no,
      tender_name,
      request_for,
      amount_requested,
      amount_in_word,
      signature_requested_by,
      signature_cashier,
      signature_accountant,
      signature_md
    } = req.body;

    const result = await db.query(
      `INSERT INTO cash_requests
      (
        requisition_no,
        tender_name,
        request_for,
        amount_requested,
        amount_in_word,
        signature_requested_by,
        signature_cashier,
        signature_accountant,
        signature_md
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id`,
      [
        requisition_no,
        tender_name,
        request_for,
        amount_requested,
        amount_in_word,
        signature_requested_by,
        signature_cashier,
        signature_accountant,
        signature_md
      ]
    );

    res.json({
      success: true,
      id: result.rows[0].id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCashRequests = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM cash_requests ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM cash_requests WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Not found');
    }

    const data = result.rows[0];

    const doc = new PDFDocument({
      size: 'A4',
      margin: 0
    });

    const filePath = path.join(
      __dirname,
      `../pdfs/form_${id}.pdf`
    );

    doc.pipe(fs.createWriteStream(filePath));

    doc.image(
      path.join(
        __dirname,
        '../pdfs/c70f9ef5-be12-4ce4-8706-0324883cef2f.png'
      ),
      0,
      0,
      {
        width: 595.28,
        height: 841.89
      }
    );

    doc.fontSize(12).fillColor('black');

    doc.text(data.requisition_no || '', 170, 165);
    doc.text(data.tender_name || '', 80, 210);
    doc.text(data.request_for || '', 80, 280, { width: 450 });

    doc.text(
      `${data.amount_requested || ''} (${data.amount_in_word || ''})`,
      80,
      370
    );

    doc.text(data.signature_requested_by || '', 60, 480);
    doc.text(data.signature_cashier || '', 190, 480);
    doc.text(data.signature_accountant || '', 330, 480);
    doc.text(data.signature_md || '', 450, 480);

    doc.end();

    doc.on('finish', () => {
      res.download(
        filePath,
        `cash_request_${id}.pdf`,
        () => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      );
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};