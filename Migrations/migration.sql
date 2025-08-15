-- cash_requests table
CREATE TABLE IF NOT EXISTS cash_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  requisition_no VARCHAR(50) NULL,
  tender_name VARCHAR(255) NULL,
  request_for TEXT NULL,
  amount_requested DECIMAL(15,2) NULL,
  amount_in_word VARCHAR(255) NULL,
  signature_requested_by VARCHAR(255) NULL,
  signature_cashier VARCHAR(255) NULL,
  signature_accountant VARCHAR(255) NULL,
  signature_md VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- clients table
CREATE TABLE IF NOT EXISTS clients (
  ClientId INT AUTO_INCREMENT PRIMARY KEY,
  Client_Name VARCHAR(100) NOT NULL,
  Contact_Person VARCHAR(100) NULL,
  Email VARCHAR(100) NULL,
  Phone VARCHAR(20) NULL,
  Location VARCHAR(100) NULL,
  Status ENUM('Active', 'Inactive') DEFAULT 'Active',
  Created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- contract table
CREATE TABLE IF NOT EXISTS contract (
  ContractId INT AUTO_INCREMENT PRIMARY KEY,
  Client_Name VARCHAR(255) NOT NULL,
  DescriptionOfGood TEXT NOT NULL,
  Amount_category VARCHAR(100) NULL,
  Quantity INT NOT NULL,
  Delivery_location VARCHAR(255) NOT NULL,
  Delivery_deadline DATE NULL,
  Contract_Date DATE NULL,
  Status VARCHAR(50) DEFAULT 'In progress',
  Contr_file_path VARCHAR(255) NULL,
  Created_by VARCHAR(100) NULL
);

-- supplyorders table
CREATE TABLE IF NOT EXISTS supplyorders (
  SupplyOrderId INT AUTO_INCREMENT PRIMARY KEY,
  Date_Sent DATE NOT NULL,
  Supplier_Name VARCHAR(255) NOT NULL,
  Description_of_Goods TEXT NOT NULL,
  Quantity INT NOT NULL,
  Unit_Price DECIMAL(15,2) NOT NULL,
  Total_Amount DECIMAL(15,2) NULL
);

-- suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  SupplierId INT AUTO_INCREMENT PRIMARY KEY,
  Supplier_Name VARCHAR(100) NULL,
  ContactPerson VARCHAR(100) NULL,
  Email VARCHAR(100) NULL,
  Phone VARCHAR(20) NULL,
  Location VARCHAR(100) NULL,
  Registration_number VARCHAR(100) NULL,
  Product_Category VARCHAR(100) NULL,
  Verifiered ENUM('Y','N') DEFAULT 'N'
);

-- purchaseorders table
CREATE TABLE IF NOT EXISTS purchaseorders (
  PurchaseOrderId INT AUTO_INCREMENT PRIMARY KEY,
  Date_Received DATE NOT NULL,
  Client_Name VARCHAR(255) NOT NULL,
  Description_of_Goods TEXT NOT NULL,
  Quantity INT NOT NULL,
  Unit_Price DECIMAL(15,2) NOT NULL,
  Status ENUM('In Progress', 'Complete', 'Cancelled') DEFAULT 'In Progress'
);

-- estimation table
CREATE TABLE IF NOT EXISTS estimation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  B_Code VARCHAR(255),
  Board_command VARCHAR(255),
  Site VARCHAR(255),
  description VARCHAR(255) NULL,
  quantity INT NULL,
  u_p_coting DECIMAL(15,2) NULL,
  t_p_coting DECIMAL(15,2) NULL,
  u_p_market DECIMAL(15,2) NULL,
  t_p_market DECIMAL(15,2) NULL,
  tva DECIMAL(15,2) NULL,
  exc_tva DECIMAL(15,2) NULL,
  three_perc DECIMAL(15,2) NULL,
  t_taxes DECIMAL(15,2) NULL,
  refund DECIMAL(15,2) NULL,
  profit DECIMAL(15,2) NULL
);


-- Fied Document
CREATE TABLE IF NOT EXISTS Trash (
  id INT AUTO_INCREMENT PRIMARY KEY,
  DocID VARCHAR(100) NOT NULL,
  Description  VARCHAR(100) NOT NULL,
  CreatedAt DATETIME NOT NULL,
  FileName VARCHAR(255) NOT NULL,
  FilePath VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Users

CREATE TABLE IF NOT EXISTS users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    F_Name VARCHAR(100) NOT NULL,
    L_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('Operation', 'Procurement', 'Field Chief', 'M_D','Admin') NOT NULL DEFAULT 'Operation'
);

-- Documents

CREATE TABLE IF NOT EXISTS documents_comeWith (
  id INT AUTO_INCREMENT PRIMARY KEY,
  DocID VARCHAR(100) NOT NULL,
  DocumentType ENUM('EBM', 'Report', 'Delivery Note') NOT NULL,
  CreatedAt DATETIME NOT NULL,
  FileName VARCHAR(255) NOT NULL,
  FilePath VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


