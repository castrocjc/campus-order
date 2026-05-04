USE campus_order_db;

-- Passwords encrypted with BCrypt.
-- admin@campusorder.com / admin123
-- users: ana, luis, maria, carlos / user123

INSERT INTO users (id, name, email, password, role, active) VALUES
(1, 'Administrador COFIGO', 'admin@campusorder.com', '$2y$10$vuuToVtXJeULS0kcmUD4nu/aOsJ1IIoGn0VDAg08IFA9xcNAQWkvm', 'ADMIN', TRUE),
(2, 'Ana Torres', 'ana.torres@campus.edu', '$2y$10$vD47iElM2LcV5oTm7/t.yeGdYZJdIJgaOG9LNbLLob1C.nQclMYfy', 'USER', TRUE),
(3, 'Luis Mendoza', 'luis.mendoza@campus.edu', '$2y$10$vD47iElM2LcV5oTm7/t.yeGdYZJdIJgaOG9LNbLLob1C.nQclMYfy', 'USER', TRUE),
(4, 'María Gómez', 'maria.gomez@campus.edu', '$2y$10$vD47iElM2LcV5oTm7/t.yeGdYZJdIJgaOG9LNbLLob1C.nQclMYfy', 'USER', TRUE),
(5, 'Carlos Rojas', 'carlos.rojas@campus.edu', '$2y$10$vD47iElM2LcV5oTm7/t.yeGdYZJdIJgaOG9LNbLLob1C.nQclMYfy', 'USER', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), active = VALUES(active);

INSERT INTO categories (id, name, description, active) VALUES
(1, 'Cafés', 'Bebidas calientes y frías a base de café.', TRUE),
(2, 'Bebidas', 'Jugos, agua, gaseosas e infusiones.', TRUE),
(3, 'Sándwiches', 'Opciones rápidas para desayuno y almuerzo.', TRUE),
(4, 'Postres', 'Dulces, queques y snacks.', TRUE),
(5, 'Menú del día', 'Platos preparados para almuerzo universitario.', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), active = VALUES(active);

INSERT INTO products (id, name, description, price, stock, image_url, active, category_id) VALUES
(1, 'Café americano', 'Café negro clásico, ideal para empezar el día.', 5.50, 80, '/images/cafe-americano.png', TRUE, 1),
(2, 'Cappuccino', 'Café con leche espumada y toque de cacao.', 8.00, 60, '/images/cappuccino.png', TRUE, 1),
(3, 'Latte vainilla', 'Café latte con esencia de vainilla.', 9.00, 45, '/images/latte-vainilla.png', TRUE, 1),
(4, 'Agua mineral', 'Botella de agua mineral personal.', 3.00, 120, '/images/agua.png', TRUE, 2),
(5, 'Jugo de naranja', 'Jugo natural de naranja.', 6.50, 50, '/images/jugo-naranja.png', TRUE, 2),
(6, 'Té helado', 'Bebida fría sabor durazno.', 5.00, 40, '/images/te-helado.png', TRUE, 2),
(7, 'Sándwich de pollo', 'Pan artesanal con pollo, lechuga y mayonesa.', 10.50, 35, '/images/sandwich-pollo.png', TRUE, 3),
(8, 'Sándwich mixto', 'Jamón, queso y pan crocante.', 8.50, 30, '/images/sandwich-mixto.png', TRUE, 3),
(9, 'Triple universitario', 'Triple clásico con palta, huevo y tomate.', 9.50, 25, '/images/triple.png', TRUE, 3),
(10, 'Brownie', 'Brownie de chocolate individual.', 6.00, 40, '/images/brownie.png', TRUE, 4),
(11, 'Queque de naranja', 'Porción de queque casero.', 5.50, 30, '/images/queque-naranja.png', TRUE, 4),
(12, 'Galleta de avena', 'Galleta de avena y pasas.', 4.00, 45, '/images/galleta-avena.png', TRUE, 4),
(13, 'Arroz con pollo', 'Menú del día con ensalada y refresco.', 16.00, 25, '/images/arroz-pollo.png', TRUE, 5),
(14, 'Tallarines verdes', 'Tallarines verdes con filete de pollo.', 17.50, 20, '/images/tallarines-verdes.png', TRUE, 5),
(15, 'Lomo saltado', 'Lomo saltado con papas y arroz.', 22.00, 18, '/images/lomo-saltado.png', TRUE, 5),
(16, 'Ensalada fresca', 'Ensalada ligera con vegetales y pollo.', 14.00, 22, '/images/ensalada.png', TRUE, 5),
(17, 'Empanada de carne', 'Empanada horneada de carne.', 7.50, 35, '/images/empanada-carne.png', TRUE, 3),
(18, 'Muffin de chocolate', 'Muffin individual con chips de chocolate.', 6.50, 28, '/images/muffin-chocolate.png', TRUE, 4),
(19, 'Chicha morada', 'Bebida natural de maíz morado.', 5.50, 55, '/images/chicha-morada.png', TRUE, 2),
(20, 'Producto inactivo demo', 'Producto usado para validar filtros de disponibilidad.', 99.00, 0, '/images/inactivo.png', FALSE, 4)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), price = VALUES(price), stock = VALUES(stock), image_url = VALUES(image_url), active = VALUES(active), category_id = VALUES(category_id);

INSERT INTO orders (id, user_id, status, pickup_time, total_amount, created_at, updated_at) VALUES
(1, 2, 'RECEIVED', DATE_ADD(NOW(), INTERVAL 20 MINUTE), 16.00, DATE_SUB(NOW(), INTERVAL 15 MINUTE), DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
(2, 3, 'IN_PREPARATION', DATE_ADD(NOW(), INTERVAL 15 MINUTE), 19.00, DATE_SUB(NOW(), INTERVAL 45 MINUTE), DATE_SUB(NOW(), INTERVAL 20 MINUTE)),
(3, 4, 'READY_FOR_PICKUP', DATE_ADD(NOW(), INTERVAL 5 MINUTE), 24.50, DATE_SUB(NOW(), INTERVAL 70 MINUTE), DATE_SUB(NOW(), INTERVAL 10 MINUTE)),
(4, 5, 'DELIVERED', DATE_SUB(NOW(), INTERVAL 1 HOUR), 31.00, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(5, 2, 'CANCELLED', DATE_SUB(NOW(), INTERVAL 30 MINUTE), 8.50, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 90 MINUTE)),
(6, 3, 'DELIVERED', DATE_SUB(NOW(), INTERVAL 2 HOUR), 23.50, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(7, 4, 'RECEIVED', DATE_ADD(NOW(), INTERVAL 30 MINUTE), 27.50, DATE_SUB(NOW(), INTERVAL 5 MINUTE), DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
(8, 5, 'IN_PREPARATION', DATE_ADD(NOW(), INTERVAL 25 MINUTE), 22.00, DATE_SUB(NOW(), INTERVAL 25 MINUTE), DATE_SUB(NOW(), INTERVAL 8 MINUTE)),
(9, 2, 'READY_FOR_PICKUP', DATE_ADD(NOW(), INTERVAL 10 MINUTE), 13.50, DATE_SUB(NOW(), INTERVAL 50 MINUTE), DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
(10, 3, 'DELIVERED', DATE_SUB(NOW(), INTERVAL 3 HOUR), 28.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY))
ON DUPLICATE KEY UPDATE status = VALUES(status), pickup_time = VALUES(pickup_time), total_amount = VALUES(total_amount), updated_at = VALUES(updated_at);

INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price, subtotal) VALUES
(1, 1, 2, 'Cappuccino', 1, 8.00, 8.00),
(2, 1, 10, 'Brownie', 1, 6.00, 6.00),
(3, 1, 4, 'Agua mineral', 1, 3.00, 3.00),
(4, 2, 7, 'Sándwich de pollo', 1, 10.50, 10.50),
(5, 2, 8, 'Sándwich mixto', 1, 8.50, 8.50),
(6, 3, 15, 'Lomo saltado', 1, 22.00, 22.00),
(7, 3, 4, 'Agua mineral', 1, 3.00, 3.00),
(8, 4, 13, 'Arroz con pollo', 1, 16.00, 16.00),
(9, 4, 5, 'Jugo de naranja', 1, 6.50, 6.50),
(10, 4, 10, 'Brownie', 1, 6.00, 6.00),
(11, 5, 8, 'Sándwich mixto', 1, 8.50, 8.50),
(12, 6, 14, 'Tallarines verdes', 1, 17.50, 17.50),
(13, 6, 11, 'Queque de naranja', 1, 5.50, 5.50),
(14, 7, 7, 'Sándwich de pollo', 1, 10.50, 10.50),
(15, 7, 3, 'Latte vainilla', 1, 9.00, 9.00),
(16, 7, 18, 'Muffin de chocolate', 1, 6.50, 6.50),
(17, 8, 15, 'Lomo saltado', 1, 22.00, 22.00),
(18, 9, 2, 'Cappuccino', 1, 8.00, 8.00),
(19, 9, 11, 'Queque de naranja', 1, 5.50, 5.50),
(20, 10, 16, 'Ensalada fresca', 1, 14.00, 14.00),
(21, 10, 19, 'Chicha morada', 2, 5.50, 11.00),
(22, 10, 12, 'Galleta de avena', 1, 4.00, 4.00)
ON DUPLICATE KEY UPDATE order_id = VALUES(order_id), product_id = VALUES(product_id), product_name = VALUES(product_name), quantity = VALUES(quantity), unit_price = VALUES(unit_price), subtotal = VALUES(subtotal);
