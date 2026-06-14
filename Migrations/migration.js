const db = require('../Config/db');

async function runMigration() {
  try {
    console.log('🚀 Starting migration...');

    // =========================
    // CASH REQUESTS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS cash_requests (
        id SERIAL PRIMARY KEY,
        requisition_no VARCHAR(50),
        tender_name VARCHAR(255),
        request_for TEXT,
        amount_requested DECIMAL(15,2),
        amount_in_word VARCHAR(255),
        signature_requested_by VARCHAR(255),
        signature_cashier VARCHAR(255),
        signature_accountant VARCHAR(255),
        signature_md VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // CLIENTS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS clients (
        client_id SERIAL PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        contact_person VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        location VARCHAR(100),
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // CONTRACTS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS contracts (
        contract_id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        description_of_good TEXT NOT NULL,
        amount_category VARCHAR(100),
        quantity INTEGER NOT NULL,
        delivery_location VARCHAR(255) NOT NULL,
        delivery_deadline DATE,
        contract_date DATE,
        status VARCHAR(50) DEFAULT 'In progress',
        contract_file_path VARCHAR(255),
        created_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // SUPPLY ORDERS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS supplyorders (
        supply_order_id SERIAL PRIMARY KEY,
        date_sent DATE NOT NULL,
        supplier_name VARCHAR(255) NOT NULL,
        description_of_goods TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(15,2) NOT NULL,
        total_amount DECIMAL(15,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // SUPPLIERS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        supplier_id SERIAL PRIMARY KEY,
        supplier_name VARCHAR(100),
        contact_person VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        location VARCHAR(100),
        registration_number VARCHAR(100),
        product_category VARCHAR(100),
        verified VARCHAR(1) DEFAULT 'N',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // PURCHASE ORDERS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS purchaseorders (
        purchase_order_id SERIAL PRIMARY KEY,
        date_received DATE NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        description_of_goods TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(15,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'In Progress',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // ESTIMATIONS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS estimations (
        id SERIAL PRIMARY KEY,
        b_code VARCHAR(255),
        board_command VARCHAR(255),
        site VARCHAR(255),
        description VARCHAR(255),
        quantity INTEGER,
        u_p_coting DECIMAL(15,2),
        t_p_coting DECIMAL(15,2),
        u_p_market DECIMAL(15,2),
        t_p_market DECIMAL(15,2),
        tva DECIMAL(15,2),
        exc_tva DECIMAL(15,2),
        three_perc DECIMAL(15,2),
        t_taxes DECIMAL(15,2),
        refund DECIMAL(15,2),
        profit DECIMAL(15,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // TRASH DOCUMENTS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS trash_documents (
        id SERIAL PRIMARY KEY,
        doc_id VARCHAR(100) NOT NULL,
        description VARCHAR(100) NOT NULL,
        created_at_doc TIMESTAMP NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // USERS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        f_name VARCHAR(100) NOT NULL,
        l_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'Operation',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // =========================
    // DOCUMENTS
    // =========================
    await db.query(`
      CREATE TABLE IF NOT EXISTS documents_come_with (
        id SERIAL PRIMARY KEY,
        doc_id VARCHAR(100) NOT NULL,
        document_type VARCHAR(50) NOT NULL,
        created_at_doc TIMESTAMP NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:');
    console.error(error.message);
    process.exit(1);
  }
}

runMigration();