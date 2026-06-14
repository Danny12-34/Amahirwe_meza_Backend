const db = require('../Config/db');
const bcrypt = require('bcryptjs');


// =========================
// CREATE USER
// =========================
exports.createUser = async (req, res) => {
  try {
    const { F_Name, L_Name, Email, Password, ConfirmPassword, Role } = req.body;

    if (!F_Name || !L_Name || !Email || !Password || !ConfirmPassword || !Role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (Password !== ConfirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const result = await db.query(
      `INSERT INTO users (f_name, l_name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id`,
      [F_Name, L_Name, Email, hashedPassword, Role]
    );

    return res.status(201).json({
      message: 'User created successfully!',
      userId: result.rows[0].user_id
    });

  } catch (error) {
    console.error('CREATE USER ERROR:', error);

    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// =========================
// GET ALL USERS
// =========================
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT user_id, f_name, l_name, email, role
       FROM users
       ORDER BY user_id DESC`
    );

    return res.json(result.rows);

  } catch (error) {
    console.error('GET ALL USERS ERROR:', error);

    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
};


// =========================
// GET USER BY ID
// =========================
exports.getUserById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT user_id, f_name, l_name, email, role
       FROM users
       WHERE user_id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
};


// =========================
// UPDATE USER
// =========================
exports.updateUser = async (req, res) => {
  try {
    const { F_Name, L_Name, Email, Password, Role } = req.body;
    const { id } = req.params;

    if (!F_Name || !L_Name || !Email || !Role) {
      return res.status(400).json({
        message: 'All required fields must be provided.'
      });
    }

    let query;
    let params;

    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);

      query = `
        UPDATE users 
        SET f_name = $1, l_name = $2, email = $3, role = $4, password = $5
        WHERE user_id = $6
      `;

      params = [F_Name, L_Name, Email, Role, hashedPassword, id];
    } else {
      query = `
        UPDATE users 
        SET f_name = $1, l_name = $2, email = $3, role = $4
        WHERE user_id = $5
      `;

      params = [F_Name, L_Name, Email, Role, id];
    }

    const result = await db.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ message: 'User updated successfully.' });

  } catch (error) {
    console.error('UPDATE ERROR:', error);

    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// =========================
// DELETE USER
// =========================
exports.deleteUser = async (req, res) => {
  try {
    const result = await db.query(
      `DELETE FROM users WHERE user_id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ message: 'User deleted successfully.' });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
};


// =========================
// LOGIN USER
// =========================
exports.loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({
        message: 'Email and Password are required.'
      });
    }

    const result = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [Email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(Password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const { password, ...userWithoutPassword } = user;

    return res.json({ user: userWithoutPassword });

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// =========================
// USER COUNT
// =========================
exports.getUserCount = async (req, res) => {
  try {
    const result = await db.query(`SELECT COUNT(*) FROM users`);

    return res.json({
      totalUsers: parseInt(result.rows[0].count)
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
};


// =========================
// USERS BY ROLE
// =========================
exports.getUserCountByRole = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT role, COUNT(*) AS count
      FROM users
      GROUP BY role
    `);

    return res.json(result.rows);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
};


// =========================
// DASHBOARD STATS
// =========================
exports.getUserStats = async (req, res) => {
  try {
    const total = await db.query(`SELECT COUNT(*) FROM users`);

    const roles = await db.query(`
      SELECT role, COUNT(*) AS count
      FROM users
      GROUP BY role
    `);

    return res.json({
      totalUsers: parseInt(total.rows[0].count),
      countsByRole: roles.rows
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Database error',
      error: error.message
    });
  }
};