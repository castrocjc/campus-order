USE campus_order_db;

ALTER TABLE users
ADD COLUMN password_reset_code VARCHAR(100) NULL,
ADD COLUMN password_reset_code_expires_at DATETIME NULL;