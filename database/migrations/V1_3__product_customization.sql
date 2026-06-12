USE campus_order_db;

ALTER TABLE products
ADD COLUMN customizable BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE order_items
ADD COLUMN customization_notes VARCHAR(500) NULL;