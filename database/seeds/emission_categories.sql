-- Seed data: Emission Categories
-- Core categories for carbon footprint tracking

INSERT INTO emission_categories (name, description, icon, display_order, is_active) VALUES
('transport', 'Transportation including cars, public transit, cycling, and walking', 'car', 1, TRUE),
('energy', 'Home energy consumption including electricity, heating, and cooling', 'lightbulb', 2, TRUE),
('food', 'Food consumption including meat, dairy, vegetables, and dining out', 'apple', 3, TRUE),
('flight', 'Air travel for business and leisure', 'plane', 4, TRUE),
('shopping', 'Consumer goods including clothing, electronics, and household items', 'shopping-bag', 5, TRUE);
