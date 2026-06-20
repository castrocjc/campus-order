USE campus_order_db;

-- ==========================
-- USERS
-- ==========================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_code VARCHAR(100),
    verification_code_expires_at DATETIME,
    password_reset_code VARCHAR(100),
    password_reset_code_expires_at DATETIME
);

-- ==========================
-- CATEGORIES
-- ==========================

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT UK_CATEGORY_NAME UNIQUE (name)
);

-- ==========================
-- PRODUCTS
-- ==========================

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(1000),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    customizable BOOLEAN NOT NULL DEFAULT FALSE,
    category_id BIGINT,
    CONSTRAINT FK_PRODUCT_CATEGORY
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
);

-- ==========================
-- CUSTOMIZATIONS_OPTIONS
-- ==========================

CREATE TABLE customization_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ==========================
-- ORDERS
-- ==========================

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    pickup_time DATETIME,
    total_amount DECIMAL(10,2),
    ready_for_pickup_notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- ORDER ITEMS
-- ==========================

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    customization_notes VARCHAR(500),
    order_id BIGINT NOT NULL,
    CONSTRAINT FK_ORDERITEM_ORDER
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

-- ==========================
-- CAFETERIA SETTINGS
-- ==========================

CREATE TABLE cafeteria_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    address VARCHAR(255),
    reference VARCHAR(255),
    contact_phone VARCHAR(50),
    timezone VARCHAR(100) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    min_preparation_minutes INT NOT NULL,
    pickup_interval_minutes INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- CAFETERIA SCHEDULES
-- ==========================

CREATE TABLE cafeteria_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cafeteria_settings_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    closed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cafeteria_schedule_settings
        FOREIGN KEY (cafeteria_settings_id)
        REFERENCES cafeteria_settings(id)
);

