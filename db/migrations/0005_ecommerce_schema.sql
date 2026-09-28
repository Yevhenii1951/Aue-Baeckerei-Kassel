CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug = lower(slug)),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  postal_codes text[] NOT NULL CHECK (cardinality(postal_codes) > 0),
  fee_cents integer NOT NULL CHECK (fee_cents >= 0),
  free_delivery_cents integer NOT NULL CHECK (free_delivery_cents >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pickup_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL CHECK (ends_at > starts_at),
  capacity integer NOT NULL CHECK (capacity > 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (starts_at, ends_at)
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'preparing', 'ready', 'collected', 'delivered', 'cancelled')),
  fulfillment_type text NOT NULL CHECK (fulfillment_type IN ('pickup', 'delivery')),
  pickup_slot_id uuid REFERENCES pickup_slots(id) ON DELETE SET NULL,
  delivery_zone_id uuid REFERENCES delivery_zones(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text,
  customer_note text,
  subtotal_cents integer NOT NULL CHECK (subtotal_cents >= 0),
  delivery_fee_cents integer NOT NULL DEFAULT 0 CHECK (delivery_fee_cents >= 0),
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  scheduled_for timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (total_cents = subtotal_cents + delivery_fee_cents),
  CHECK (
    (fulfillment_type = 'pickup' AND pickup_slot_id IS NOT NULL)
    OR (fulfillment_type = 'delivery' AND delivery_zone_id IS NOT NULL)
  )
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  line_total_cents integer NOT NULL CHECK (line_total_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (line_total_cents = unit_price_cents * quantity)
);

CREATE INDEX products_published_idx ON products (published, sort_order, name);
CREATE INDEX delivery_zones_active_idx ON delivery_zones (active);
CREATE INDEX pickup_slots_active_starts_idx ON pickup_slots (active, starts_at);
CREATE INDEX orders_scheduled_status_idx ON orders (scheduled_for, status);
CREATE INDEX order_items_order_idx ON order_items (order_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION active_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_profiles
    WHERE auth_user_id = auth.uid() AND active
  );
$$;

REVOKE ALL ON FUNCTION active_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION active_staff() TO authenticated, service_role;

CREATE POLICY products_public_select ON products
  FOR SELECT TO anon, authenticated
  USING (published);

CREATE POLICY delivery_zones_public_select ON delivery_zones
  FOR SELECT TO anon, authenticated
  USING (active);

CREATE POLICY products_staff_manage ON products
  FOR ALL TO authenticated
  USING (active_staff())
  WITH CHECK (active_staff());

CREATE POLICY delivery_zones_staff_manage ON delivery_zones
  FOR ALL TO authenticated
  USING (active_staff())
  WITH CHECK (active_staff());

CREATE POLICY pickup_slots_staff_manage ON pickup_slots
  FOR ALL TO authenticated
  USING (active_staff())
  WITH CHECK (active_staff());

CREATE POLICY orders_staff_manage ON orders
  FOR ALL TO authenticated
  USING (active_staff())
  WITH CHECK (active_staff());

CREATE POLICY order_items_staff_manage ON order_items
  FOR ALL TO authenticated
  USING (active_staff())
  WITH CHECK (active_staff());

REVOKE ALL ON products, delivery_zones, pickup_slots, orders, order_items FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON products, delivery_zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON products, delivery_zones, pickup_slots, orders, order_items TO authenticated;
GRANT ALL ON products, delivery_zones, pickup_slots, orders, order_items TO service_role;
GRANT USAGE, SELECT ON SEQUENCE orders_order_number_seq TO authenticated, service_role;
