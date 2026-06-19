USE campus_order_db;

-- Categories
INSERT INTO categories
(name, description, active)
VALUES
('Cafés', 'Bebidas calientes y frías a base de café.', TRUE),
('Bebidas', 'Jugos, agua, gaseosas e infusiones.', TRUE),
('Sándwiches', 'Opciones rápidas para desayuno y almuerzo.', TRUE),
('Postres', 'Dulces, queques y snacks.', TRUE),
('Menú del día', 'Platos preparados para almuerzo universitario.', TRUE);

-- Products
INSERT INTO products
(active, customizable, description, image_url, name, price, stock, category_id)
VALUES
(true, false, 'Café negro clásico, ideal para empezar el día.', 'https://images.pexels.com/photos/25482738/pexels-photo-25482738.jpeg', 'Café americano', 5.5, 80, 1),
(true, false, 'Café con leche espumada y toque de cacao.', 'https://images.pexels.com/photos/11160120/pexels-photo-11160120.jpeg', 'Cappuccino', 8, 60, 1),
(true, false, 'Café latte con esencia de vainilla.', 'https://images.pexels.com/photos/18841330/pexels-photo-18841330.jpeg', 'Latte vainilla', 9, 45, 1),
(true, false, 'Botella de agua mineral personal.', 'https://images.pexels.com/photos/35020123/pexels-photo-35020123.jpeg', 'Agua mineral', 3, 120, 2),
(true, false, 'Jugo natural de naranja.', 'https://images.pexels.com/photos/8679601/pexels-photo-8679601.jpeg', 'Jugo de naranja', 6.5, 50, 2),
(true, false, 'Bebida fría sabor durazno.', 'https://images.pexels.com/photos/5836993/pexels-photo-5836993.jpeg', 'Té helado', 5, 40, 2),
(true, false, 'Pan artesanal con pollo, lechuga y mayonesa.', 'https://images.pexels.com/photos/33014388/pexels-photo-33014388.jpeg', 'Sándwich de pollo', 10.5, 40, 3),
(true, false, 'Jamón, queso y pan crocante.', 'https://images.pexels.com/photos/19202829/pexels-photo-19202829.jpeg', 'Sándwich mixto', 8.5, 30,3),
(true, false, 'Triple clásico con palta, huevo y tomate.', 'https://images.pexels.com/photos/15362507/pexels-photo-15362507.jpeg', 'Triple universitario', 9.5, 30, 3),
(true, false, 'Brownie de chocolate individual.', 'https://images.pexels.com/photos/4597838/pexels-photo-4597838.jpeg', 'Brownie', 6, 40, 4),
(true, false, 'Porción de queque casero.', 'https://images.pexels.com/photos/19794878/pexels-photo-19794878.jpeg', 'Queque de naranja', 5.5, 30, 4),
(true, false, 'Galleta de avena y pasas.', 'https://images.pexels.com/photos/5436476/pexels-photo-5436476.jpeg', 'Galleta de avena', 4, 45, 4),
(true, true, 'Arroz con pollo.', 'https://images.pexels.com/photos/36885731/pexels-photo-36885731.jpeg', 'Arroz con pollo', 16, 25, 5),
(true, false, 'Tallarines verdes con filete de pollo.', 'https://images.pexels.com/photos/20246314/pexels-photo-20246314.jpeg', 'Tallarines verdes', 17.5, 20, 5),
(true, true, 'Lomo saltado con papas y arroz.', 'https://images.pexels.com/photos/28503590/pexels-photo-28503590.jpeg', 'Lomo saltado', 22, 20, 5),
(true, false, 'Ensalada ligera con vegetales y pollo.', 'https://images.pexels.com/photos/34337146/pexels-photo-34337146.jpeg', 'Ensalada fresca', 14, 30, 5),
(true, false, 'Empanada horneada de carne.', 'https://images.pexels.com/photos/37069412/pexels-photo-37069412.jpeg', 'Empanada de carne', 7.5, 40, 3),
(true, false, 'Muffin individual con chips de chocolate.', 'https://images.pexels.com/photos/10167769/pexels-photo-10167769.jpeg', 'Muffin de chocolate', 6.5, 30, 4),
(true, false, 'Bebida natural de maíz morado.', 'https://images.pexels.com/photos/28490837/pexels-photo-28490837.jpeg', 'Chicha morada', 5.5, 60, 2),
(true, false, 'Producto usado para validar filtros de disponibilidad.', NULL, 'Producto sin stock demo', 99, 0, 4);

-- Users
INSERT INTO users
(name, email, phone, password, role, active, email_verified)
VALUES
('Administrador', 'admin@upc.edu.pe', NULL, '$2a$10$GUJwG6.J9qBp7ccUIeeWpueF1VLqIO7/VVxvI4pypae3YEnN/egKK', 'ADMIN', true, true),
('Worker', 'worker@upc.edu.pe', NULL, '$2a$10$GUJwG6.J9qBp7ccUIeeWpueF1VLqIO7/VVxvI4pypae3YEnN/egKK', 'WORKER', true, true),
('Juan Carlos Castro', NULL, 'jc.castroc@upc.edu.pe', '$2a$10$GUJwG6.J9qBp7ccUIeeWpueF1VLqIO7/VVxvI4pypae3YEnN/egKK', 'USER', true, true);

-- Cafeteria Settings
INSERT INTO cafeteria_settings
(name, description, active, address, reference, contact_phone, timezone, currency, min_preparation_minutes, pickup_interval_minutes)
VALUES
('Cafetería Central', 'Cafetería principal del campus', true, 'Campus universitario', 'Frente al patio principal', '999999999', 'America/Lima', 'PEN', 20, 30);

-- Cafeteria Schedules
INSERT INTO cafeteria_schedules
(cafeteria_settings_id, day_of_week, opening_time, closing_time, closed)
VALUES
(1, 'MONDAY', '07:00:00', '21:00:00', false),
(1, 'TUESDAY', '07:00:00', '21:00:00', false),
(1, 'WEDNESDAY', '07:00:00', '21:00:00', false),
(1, 'THURSDAY', '07:00:00', '21:00:00', false),
(1, 'FRIDAY', '07:00:00', '21:00:00', false),
(1, 'SATURDAY', '08:00:00', '14:00:00', false),
(1, 'SUNDAY', '00:00:00', '00:00:00', true);

