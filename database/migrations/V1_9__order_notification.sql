ALTER TABLE orders
ADD COLUMN ready_for_pickup_notification_sent BOOLEAN NOT NULL DEFAULT FALSE;