import { Pool } from "pg";
import config from ".";
// Database
export const pool = new Pool({
  connectionString: config.CONNECTION_STRING,
});

export const initDb = async () => {
  //  Enums
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('admin', 'customer');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE availability_status AS ENUM ('available', 'booked');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE booking_status AS ENUM ('active', 'cancelled', 'returned');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL CHECK (email = LOWER(email)),
      password TEXT NOT NULL CHECK (LENGTH (password) >= 6),
      role user_role DEFAULT 'customer',
      phone VARCHAR(255) NOT NULL,
      createdAT TIMESTAMP DEFAULT NOW(),
      updatedAT TIMESTAMP DEFAULT NOW()
      )
    `);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name TEXT NOT NULL,
      type VARCHAR(255),
      registration_number INT NOT NULL UNIQUE,
      daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0) ,
      availability_status availability_status NOT NULL DEFAULT 'available',
      createdAT TIMESTAMP DEFAULT NOW(),
      updatedAT TIMESTAMP DEFAULT NOW()

      )`);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL PRIMARY KEY,
     customer_id INT REFERENCES users(id),
     vehicle_id INT REFERENCES vehicles(id),
     rent_start_date DATE NOT NULL,
     rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
     total_price INT NOT NULL CHECK (total_price > 0),
     status booking_status NOT NULL DEFAULT 'active',
    createdAT TIMESTAMP DEFAULT NOW(),
    updatedAT TIMESTAMP DEFAULT NOW()

      )`);
};
