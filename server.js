const express = require("express");
const app = express();
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path"); // ✅ REQUIRED for path.join to work
const mySqlConnection = require("./Config/db");

dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// ✅ Serve uploaded files
app.use('/uploads/contracts', express.static(path.join(__dirname, 'uploads/contracts')));

// Routes
app.use('/api/v1/suppliers', require('./Routes/SupplierRoutes'));
app.use('/api/v1/contracts', require('./Routes/ContractRoutes'));
app.use('/api/v1/clients', require('./Routes/ClientRoutes'));
app.use('/api/v1/purchase-orders', require('./Routes/PurchaseOrderRoutes'));
app.use('/api/v1/supply-orders', require('./Routes/SupplyOrderRoutes'));

// Test route
app.get("/test", (req, res) => {
  res.status(200).send("Hello? 👋");
});

// Server startup
const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await mySqlConnection.query('SELECT 1');
    console.log('✅ MySQL DB Connected'.bgCyan.white);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`.bgMagenta.white);
    });
  } catch (error) {
    console.error('❌ Failed to connect to DB:', error.message);
  }
})();
