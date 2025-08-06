const db = require('../Config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.submitCashRequest = async (req, res) => {
  const {
    requisition_no, tender_name, request_for, amount_requested, amount_in_word, signature_requested_by, signature_cashier,
    signature_accountant, signature_md
  } = req.body;

  const [result] = await db.query(
    `INSERT INTO cash_requests 
    (requisition_no, tender_name, request_for, amount_requested, amount_in_word,
     signature_requested_by, signature_cashier, signature_accountant, signature_md)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [requisition_no, tender_name, request_for, amount_requested, amount_in_word,
     signature_requested_by, signature_cashier, signature_accountant, signature_md]
  );

  res.json({ id: result.insertId, success: true });
};

exports.getCashRequests = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM cash_requests ORDER BY id DESC");
  res.json(rows);
};

exports.downloadPDF = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM cash_requests WHERE id = ?", [id]);

  if (!rows.length) return res.status(404).send("Not found");

  const data = rows[0];

  const doc = new PDFDocument({
    size: 'A4',
    margin: 0
  });

  const filePath = path.join(__dirname, `../pdfs/form_${id}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  // Add background image
  doc.image(path.join(__dirname, '../pdfs/c70f9ef5-be12-4ce4-8706-0324883cef2f.png'), 0, 0, {
    width: 595.28, height: 841.89
  });

  // Fill data on image
  doc.fontSize(12).fillColor('black');

  doc.text(data.requisition_no, 170, 165);
  doc.text(data.tender_name, 80, 210);
  doc.text(data.request_for, 80, 280, { width: 450 });
  doc.text(`${data.amount_requested} (${data.amount_in_word})`, 80, 370);
  

  doc.text(data.signature_requested_by, 60, 480);
  doc.text(data.signature_cashier, 190, 480);
  doc.text(data.signature_accountant, 330, 480);
  doc.text(data.signature_md, 450, 480);

  doc.end();

  doc.on('finish', () => {
    res.download(filePath, `cash_request_${id}.pdf`, () => {
      fs.unlinkSync(filePath); // cleanup
    });
  });
};
