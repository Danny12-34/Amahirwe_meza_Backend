const db = require('../Config/db');
const bcrypt = require('bcryptjs');

// CREATE
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

    const sql = 'INSERT INTO users (F_Name, L_Name, Email, Password, Role) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [F_Name, L_Name, Email, hashedPassword, Role]);

    res.status(201).json({ message: 'User created successfully!', userId: result.insertId });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

// READ ALL
exports.getAllUsers = async (req, res) => {
  try {
    const [results] = await db.query('SELECT UserId, F_Name, L_Name, Email, Role FROM users');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error.' });
  }
};

// READ SINGLE
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query('SELECT UserId, F_Name, L_Name, Email, Role FROM users WHERE UserId = ?', [id]);
    if (results.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.json(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error.' });
  }
};

// UPDATE
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { F_Name, L_Name, Email, Password, Role } = req.body;

    if (!F_Name || !L_Name || !Email || !Role) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    let updateQuery = 'UPDATE users SET F_Name = ?, L_Name = ?, Email = ?, Role = ?';
    const params = [F_Name, L_Name, Email, Role];

    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      updateQuery += ', Password = ?';
      params.push(hashedPassword);
    }

    updateQuery += ' WHERE UserId = ?';
    params.push(id);

    const [result] = await db.query(updateQuery, params);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM users WHERE UserId = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error.' });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: 'Email and Password are required.' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE Email = ?', [Email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(Password, user.Password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Remove password from user object before sending response
    const { Password: pwd, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// TOTAL USER COUNT
exports.getUserCount = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    res.json({ totalUsers: rows[0].totalUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error.' });
  }
};

// COUNT USERS BY ROLE
exports.getUserCountByRole = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT Role, COUNT(*) AS count 
      FROM users 
      GROUP BY Role
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error.' });
  }
};

// COMBINED DASHBOARD STATS
exports.getUserStats = async (req, res) => {
  try {
    const [total] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [roles] = await db.query(`
      SELECT Role, COUNT(*) AS count 
      FROM users 
      GROUP BY Role
    `);

    res.json({
      totalUsers: total[0].totalUsers,
      countsByRole: roles
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error.' });
  }
};
