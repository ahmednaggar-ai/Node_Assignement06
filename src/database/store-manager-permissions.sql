CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'StoreManager@123';

GRANT SELECT, INSERT, UPDATE ON assignment_06.* TO 'store_manager'@'localhost';

FLUSH PRIVILEGES;
