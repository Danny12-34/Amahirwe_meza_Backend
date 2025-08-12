const db = require('../Config/db');

// CREATE
const createContract = async (req, res) => {
  try {
    const {
      Client_Name,
      DescriptionOfGood,
      Amount_category,
      Quantity,
      Delivery_location,
      Delivery_deadline,
      Contract_Date,
      Status = 'In progress',
      Created_by
    } = req.body;

    // Get file path from multer if file uploaded
    let Contr_file_path = null;
    if (req.file) {
      Contr_file_path = req.file.filename; // or use req.file.path for relative path
    }

    const [result] = await db.query(
      `INSERT INTO Contract 
       (Client_Name, DescriptionOfGood,Amount_category, Quantity, Delivery_location, Delivery_deadline, Contract_Date, Status, Contr_file_path, Created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Client_Name,
        DescriptionOfGood,
        Amount_category,
        Quantity,
        Delivery_location,
        Delivery_deadline,
        Contract_Date,
        Status,
        Contr_file_path,
        Created_by
      ]
    );

    res.status(201).json({ success: true, message: 'Contract created', insertId: result.insertId });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ success: false, message: 'Error creating contract', error: error.message });
  }
};

// READ ALL
const getAllContracts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Contract');
    res.status(200).json({ success: true, total: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contracts', error: error.message });
  }
};

// READ ONE by ID
const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM Contract WHERE ContractId = ?', [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contract', error: error.message });
  }
};

// UPDATE
// Assuming multer middleware is set up to handle 'Contr_file' field

const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    // Destructure fields from req.body
    const {
      Client_Name,
      DescriptionOfGood,
      Amount_category,
      Quantity,
      Delivery_location,
      Delivery_deadline,
      Contract_Date,
      Status,
      Created_by
    } = req.body;

    // Handle file upload: if a new file was uploaded, use its filename
    let Contr_file_path = null;
    if (req.file) {
      Contr_file_path = req.file.filename;
    } else if (req.body.Contr_file_path) {
      // if file path sent in body (like old file path), keep it
      Contr_file_path = req.body.Contr_file_path;
    }

    const [result] = await db.query(
      `UPDATE Contract SET
        Client_Name=?, DescriptionOfGood=?, Amount_category=?, Quantity=?, Delivery_location=?, Delivery_deadline=?, Contract_Date=?, Status=?, Contr_file_path=?, Created_by=?
       WHERE ContractId=?`,
      [
        Client_Name,
        DescriptionOfGood,
        Amount_category,
        Quantity,
        Delivery_location,
        Delivery_deadline,
        Contract_Date,
        Status,
        Contr_file_path,
        Created_by,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'No contract found with this ID' });
    }

    res.status(200).json({ success: true, message: 'Contract updated' });
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ success: false, message: 'Error updating contract', error: error.message });
  }
};


// DELETE
const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM Contract WHERE ContractId = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'No contract found with this ID' });
    }

    res.status(200).json({ success: true, message: 'Contract deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting contract', error: error.message });
  }
};



// COUNT ALL CONTRACTS
const countContracts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS totalContracts FROM Contract');
    res.status(200).json({ success: true, totalContracts: rows[0].totalContracts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error counting contracts', error: error.message });
  }
};

const autoUpdateContractStatus = async (req, res) => {
  try {
    const [contracts] = await db.query('SELECT * FROM contract');
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    for (const item of contracts) {
      const dateStr = item.Contract_Date;
      const contractDate = dateStr ? new Date(dateStr) : null;

      let updatedStatus = item.Status;

      if (contractDate) {
        const contractYear = contractDate.getFullYear();
        const contractMonth = contractDate.getMonth();

        // Check if in same month and year
        if (
          contractYear === today.getFullYear() &&
          contractMonth === today.getMonth()
        ) {
          updatedStatus = 'In progress';
        }
        // Check if in next month
        else if (
          contractDate >= nextMonthStart &&
          contractDate <= nextMonthEnd
        ) {
          updatedStatus = 'Next Month';
        }
        // Check if in the past
        else if (contractDate < todayDateOnly) {
          updatedStatus = 'Complete';
        }
        // If future beyond next month
        else if (contractDate > nextMonthEnd) {
          updatedStatus = 'Upcoming';
        }
      }

      // Save if status changed
      if (updatedStatus !== item.Status) {
        await db.query(
          'UPDATE contract SET Status = ? WHERE ContractId = ?',
          [updatedStatus, item.ContractId]
        );
      }
    }

    res.status(200).json({ message: 'Statuses updated successfully.' });
  } catch (error) {
    console.error('Error updating contract statuses:', error);
    res.status(500).json({ message: 'Failed to update statuses.' });
  }
};

// Update contract status to Cancelled
const cancelContract = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE Contract SET Status = ? WHERE ContractId = ?',
      ['Cancelled', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'No contract found with this ID' });
    }

    res.status(200).json({ success: true, message: 'Contract status updated to Cancelled' });
  } catch (error) {
    console.error('Error cancelling contract:', error);
    res.status(500).json({ success: false, message: 'Error cancelling contract', error: error.message });
  }
};




module.exports = {
  createContract,
  getAllContracts,
  cancelContract ,
  getContractById,
  updateContract,
  deleteContract,
  countContracts,
  autoUpdateContractStatus
};
