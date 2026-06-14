const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Forces IPv4 resolution

const express = require("express");
const app = express();
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables early (before requiring database)
dotenv.config();

// ✅ PostgreSQL connection (Supabase)
const db = require("./Config/db");

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

// Static files
app.use('/uploads/contracts', express.static(path.join(__dirname, 'uploads/contracts')));
app.use('/uploaded', express.static(path.join(__dirname, 'uploaded')));
app.use('/uploadedTrashDocment', express.static(path.join(__dirname, 'uploadedTrash')));

// Routes
app.use('/api/v1/suppliers', require('./Routes/SupplierRoutes'));
app.use('/api/v1/contracts', require('./Routes/ContractRoutes'));
app.use('/api/v1/clients', require('./Routes/ClientRoutes'));
app.use('/api/v1/purchase-orders', require('./Routes/PurchaseOrderRoutes'));
app.use('/api/v1/supply-orders', require('./Routes/SupplyOrderRoutes'));
app.use('/api/cashrequest', require('./Routes/cashRequestRoutes'));
app.use('/api/estimation', require('./Routes/estimationRoutes'));
app.use('/api/comewith', require('./Routes/Field_documentRoutes'));
app.use('/api/login', require('./Routes/userRoutes'));
app.use('/api/v1/Users', require('./Routes/userRoutes'));
app.use('/api/Trash', require('./Routes/ClassMarksRoute'));

// Test route
app.get("/test", (req, res) => {
  res.status(200).send("Server is running 👋");
});

// Server startup
const PORT = process.env.PORT || 8000;

(async () => {
  try {
    // ✅ Proper PostgreSQL health check
    const result = await db.query('SELECT NOW()');

    // Make sure result.rows[0].now is converted to a string before using colors extension
    console.log('✅ PostgreSQL Connected:', String(result.rows[0].now).bgCyan.white);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`.bgMagenta.white);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
})();