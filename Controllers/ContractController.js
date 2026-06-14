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

    let Contr_file_path = null;
    if (req.file) {
      Contr_file_path = req.file.filename;
    }

    const result = await db.query(
      `INSERT INTO contract
       (Client_Name, DescriptionOfGood, Amount_category, Quantity,
        Delivery_location, Delivery_deadline, Contract_Date,
        Status, Contr_file_path, Created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING ContractId`,
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

    res.status(201).json({
      success: true,
      message: 'Contract created',
      insertId: result.rows[0].contractid || result.rows[0].ContractId
    });

  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating contract',
      error: error.message
    });
  }
};

// READ ALL
const getAllContracts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contract');

    res.status(200).json({
      success: true,
      total: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contracts',
      error: error.message
    });
  }
};

// READ ONE
const getContractById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM contract WHERE ContractId = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contract',
      error: error.message
    });
  }
};

// UPDATE
const updateContract = async (req, res) => {
  try {
    const { id } = req.params;

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

    let Contr_file_path = req.file
      ? req.file.filename
      : req.body.Contr_file_path;

    const result = await db.query(
      `UPDATE contract SET
        Client_Name = $1,
        DescriptionOfGood = $2,
        Amount_category = $3,
        Quantity = $4,
        Delivery_location = $5,
        Delivery_deadline = $6,
        Contract_Date = $7,
        Status = $8,
        Contr_file_path = $9,
        Created_by = $10
       WHERE ContractId = $11`,
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

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No contract found with this ID'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contract updated'
    });

  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contract',
      error: error.message
    });
  }
};

// DELETE
const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM contract WHERE ContractId = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No contract found with this ID'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contract deleted'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contract',
      error: error.message
    });
  }
};

// COUNT
const countContracts = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT COUNT(*) FROM contract'
    );

    res.status(200).json({
      success: true,
      totalContracts: parseInt(result.rows[0].count)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error counting contracts',
      error: error.message
    });
  }
};

// AUTO STATUS UPDATE (PostgreSQL version)
const autoUpdateContractStatus = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contract');
    const contracts = result.rows;

    const today = new Date();
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const nextMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    const nextMonthEnd = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0
    );

    for (const item of contracts) {
      const contractDate = item.contract_date
        ? new Date(item.contract_date)
        : null;

      let updatedStatus = item.status;

      if (contractDate) {
        const contractYear = contractDate.getFullYear();
        const contractMonth = contractDate.getMonth();

        if (
          contractYear === today.getFullYear() &&
          contractMonth === today.getMonth()
        ) {
          updatedStatus = 'In progress';
        } else if (
          contractDate >= nextMonthStart &&
          contractDate <= nextMonthEnd
        ) {
          updatedStatus = 'Next Month';
        } else if (contractDate < todayDateOnly) {
          updatedStatus = 'Complete';
        } else if (contractDate > nextMonthEnd) {
          updatedStatus = 'Upcoming';
        }
      }

      if (updatedStatus !== item.status) {
        await db.query(
          'UPDATE contract SET Status = $1 WHERE ContractId = $2',
          [updatedStatus, item.contractid]
        );
      }
    }

    res.status(200).json({
      message: 'Statuses updated successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update statuses'
    });
  }
};

// CANCEL
const cancelContract = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE contract SET Status = $1 WHERE ContractId = $2`,
      ['Cancelled', id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No contract found with this ID'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contract status updated to Cancelled'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling contract',
      error: error.message
    });
  }
};

module.exports = {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
  countContracts,
  autoUpdateContractStatus,
  cancelContract
};