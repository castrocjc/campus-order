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
(active, description, image_url, name, price, stock, category_id)
VALUES
(true, 'Café negro clásico, ideal para empezar el día.', 'https://images.pexels.com/photos/25482738/pexels-photo-25482738.jpeg', 'Café americano', 5.5, 80, 1),
(true, 'Café con leche espumada y toque de cacao.', 'https://images.pexels.com/photos/11160120/pexels-photo-11160120.jpeg', 'Cappuccino', 8, 60, 1),
(true, 'Café latte con esencia de vainilla.', 'https://images.pexels.com/photos/18841330/pexels-photo-18841330.jpeg', 'Latte vainilla', 9, 45, 1),
(true, 'Botella de agua mineral personal.', 'https://images.pexels.com/photos/35020123/pexels-photo-35020123.jpeg', 'Agua mineral', 3, 120, 2),
(true, 'Jugo natural de naranja.', 'https://images.pexels.com/photos/8679601/pexels-photo-8679601.jpeg', 'Jugo de naranja', 6.5, 50, 2),
(true, 'Bebida fría sabor durazno.', 'https://images.pexels.com/photos/5836993/pexels-photo-5836993.jpeg', 'Té helado', 5, 40, 2),
(true, 'Pan artesanal con pollo, lechuga y mayonesa.', 'https://images.pexels.com/photos/33014388/pexels-photo-33014388.jpeg', 'Sándwich de pollo', 10.5, 40, 3),
(true, 'Jamón, queso y pan crocante.', 'https://images.pexels.com/photos/19202829/pexels-photo-19202829.jpeg', 'Sándwich mixto', 8.5, 30,3),
(true, 'Triple clásico con palta, huevo y tomate.', 'https://images.pexels.com/photos/15362507/pexels-photo-15362507.jpeg', 'Triple universitario', 9.5, 30, 3),
(true, 'Brownie de chocolate individual.', 'https://images.pexels.com/photos/4597838/pexels-photo-4597838.jpeg', 'Brownie', 6, 40, 4),
(true, 'Porción de queque casero.', 'https://images.pexels.com/photos/19794878/pexels-photo-19794878.jpeg', 'Queque de naranja', 5.5, 30, 4),
(true, 'Galleta de avena y pasas.', 'https://images.pexels.com/photos/5436476/pexels-photo-5436476.jpeg', 'Galleta de avena', 4, 45, 4),
(true, 'Menú del día con ensalada y refresco.', 'https://images.pexels.com/photos/36885731/pexels-photo-36885731.jpeg', 'Arroz con pollo', 16, 25, 5),
(true, 'Tallarines verdes con filete de pollo.', 'https://images.pexels.com/photos/20246314/pexels-photo-20246314.jpeg', 'Tallarines verdes', 17.5, 20, 5),
(true, 'Lomo saltado con papas y arroz.', 'https://images.pexels.com/photos/28503590/pexels-photo-28503590.jpeg', 'Lomo saltado', 22, 20, 5),
(true, 'Ensalada ligera con vegetales y pollo.', 'https://images.pexels.com/photos/34337146/pexels-photo-34337146.jpeg', 'Ensalada fresca', 14, 30, 5),
(true, 'Empanada horneada de carne.', 'https://images.pexels.com/photos/37069412/pexels-photo-37069412.jpeg', 'Empanada de carne', 7.5, 40, 3),
(true, 'Muffin individual con chips de chocolate.', 'https://images.pexels.com/photos/10167769/pexels-photo-10167769.jpeg', 'Muffin de chocolate', 6.5, 30, 4),
(true, 'Bebida natural de maíz morado.', 'https://images.pexels.com/photos/28490837/pexels-photo-28490837.jpeg', 'Chicha morada', 5.5, 60, 2),
(true, 'Producto usado para validar filtros de disponibilidad.', '/images/inactivo.png', 'Producto inactivo demo', 99, 0, 4);

-- Users
INSERT INTO users
(name, email, password, role, active, email_verified)
VALUES
('Administrador', 'admin.cofigo@upc.edu.pe', '$2a$10$gXz2go6JAZ3Woh/VZLBMCuhnmIlywDwtGY1nwe.yjUJHVRbKit2qC', 'ADMIN', TRUE, TRUE);
