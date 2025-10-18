CREATE TABLE users (
    id INT PRIMARY KEY,
    role VARCHAR(20) NOT NULL DEFAULT 'users' 
        CHECK (role IN ('admin', 'test_admin', 'users')),
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- Increased size for standard email length
    password_hash VARCHAR(60) NOT NULL, -- Changed to reflect modern practice of storing hashes
    created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	refresh_token VARCHAR(512)
	-- carts INT REFERENCES carts(id) ON DELETE SET NULL,
	-- orders INT REFERENCES orders(id) ON DELETE SET NULL
);
CREATE TABLE product_collection(
	id INT PRIMARY KEY,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW()
	-- items INT REFERENCES items(id) ON DELETE SET NULL
);
CREATE TABLE products (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    category VARCHAR(100) NOT NULL,
    new_price NUMERIC(10, 2) NOT NULL,              -- NUMERIC for precise currency values (up to 10 digits, 2 decimal places)
    old_price NUMERIC(10, 2),                       -- Allows NULL if no previous price exists
    -- Availability
    available BOOLEAN NOT NULL DEFAULT TRUE,        -- BOOLEAN is best for true/false status
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE items(
	id INT PRIMARY KEY,
	products INT REFERENCES products(id) ON DELETE SET NULL,
	product_collection INT REFERENCES product_collection(id) ON DELETE SET NULL,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carts (
    id INT PRIMARY KEY,
	users INT REFERENCES users(id) ON DELETE SET NULL,
    product_collection INT REFERENCES product_collection(id) ON DELETE SET NULL 
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
	users INT REFERENCES users(id) ON DELETE SET NULL, 
	payment_status VARCHAR(20)  DEFAULT 'pending',
    product_collection INT REFERENCES product_collection(id) ON DELETE SET NULL 
);

-- Drop TABLE users CASCADE;
-- Drop TABLE product_collection CASCADE;
-- Drop TABLE products CASCADE;
-- Drop TABLE items CASCADE;
-- Drop TABLE carts CASCADE;
-- Drop TABLE orders CASCADE;


