import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  //  Get User Details
  const user = await pool.query(
    `
      SELECT * FROM users WHERE id = $1
      `,
    [customer_id]
  );

  if (user.rows?.length === 0) {
    throw new Error("User not found");
  }
  // get vehicle details
  const vehicle = await pool.query(
    `
      SELECT * FROM vehicles WHERE id = $1
      `,
    [vehicle_id]
  );

  if (vehicle.rows?.length === 0) {
    throw new Error("Vehicle not found");
  }

  const singleVehicle = vehicle.rows[0];
  if (singleVehicle.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  const rentStart = new Date(rent_start_date as string);
  const rentEnd = new Date(rent_end_date as string);
  const diffTime = rentEnd.getTime() - rentStart.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) {
    throw new Error("Invalid rent dates");
  }

  const totalPrice = diffDays * singleVehicle.daily_rent_price;
  const booking = await pool.query(
    `
      INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  const updatedVehicle = await pool.query(
    `
      UPDATE vehicles SET availability_status = 'booked' WHERE id = $1
      `,
    [vehicle_id]
  );
  const bookedData = booking.rows[0];
  const response = {
    id: bookedData.id,
    customer_id: bookedData.customer_id,
    vehicle_id: bookedData.vehicle_id,
    rent_start_date: bookedData.rent_start_date,
    rent_end_date: bookedData.rent_end_date,
    total_price: bookedData.total_price,
    status: bookedData.status,
    vehicle: {
      vehicle_name: singleVehicle.vehicle_name,
      daily_rent_price: singleVehicle.daily_rent_price,
    },
  };
  return booking.rows?.length > 0 ? response : null;
};

const getAllBooking = async (userInfo: JwtPayload) => {
  const expired = await pool.query(`
    UPDATE bookings
    SET status = 'returned'
    WHERE status = 'active'
    AND rent_end_date < CURRENT_DATE
    RETURNING vehicle_id
  `);

  if (expired.rows.length > 0) {
    for (const item of expired.rows) {
      await pool.query(
        `
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id = $1
        `,
        [item.vehicle_id]
      );
    }
  }

  let result;
  if (userInfo.role === "admin") {
    result = await pool.query(
      `
      SELECT 
      b.*, 
      u.name AS customer_name,
      v.vehicle_name,
      u.email AS customer_email,
      v.registration_number
      FROM bookings b
      JOIN users u ON u.id = b.customer_id
      JOIN vehicles v ON v.id = b.vehicle_id
        `
    );
  } else {
    result = await pool.query(
      `
      SELECT 
      b.*, 
      u.name AS customer_name,
      v.vehicle_name,
      u.email AS customer_email,
      v.registration_number
      FROM bookings b
      JOIN users u ON u.id = b.customer_id
      JOIN vehicles v ON v.id = b.vehicle_id
      WHERE b.customer_id = $1
            `,
      [userInfo.id]
    );
  }

  const formattedData = result.rows.map((item) => ({
    id: item.id,
    customer_id: item.customer_id,
    vehicle_id: item.vehicle_id,
    rent_start_date: item.rent_start_date,
    rent_end_date: item.rent_end_date,
    total_price: item.total_price,
    status: item.status,

    customer: {
      name: item.customer_name,
      email: item.customer_email,
    },

    vehicle: {
      vehicle_name: item.vehicle_name,
      registration_number: item.registration_number,
    },
  }));
  return formattedData;
};

const updateBooking = async (
  payload: {
    status: "active" | "cancelled" | "returned";
  },
  userInfo: JwtPayload,
  bookingId: number
) => {
  let result;
  let msg;
  if (userInfo?.role === "customer" && payload.status === "cancelled") {
    result = await pool.query(
      `
      UPDATE bookings SET status = $1 WHERE id = $2 AND customer_id = $3 AND rent_start_date > NOW() RETURNING *
      `,
      [payload.status, bookingId, userInfo.id]
    );

    if (result.rows?.length === 0) {
      throw new Error("You can't cancel this booking");
    }

    await pool.query(
      `
       UPDATE vehicles SET availability_status = 'available' WHERE id = $1
       `,
      [result.rows[0].vehicle_id]
    );
    result = {
      id: result.rows[0].id,
      customer_id: result.rows[0].customer_id,
      vehicle_id: result.rows[0].vehicle_id,
      rent_start_date: result.rows[0].rent_start_date,
      rent_end_date: result.rows[0].rent_end_date,
      total_price: result.rows[0].total_price,
      status: result.rows[0].status,
    };
    msg = "Booking cancelled successfully";
  } else if (userInfo?.role === "admin") {
    result = await pool.query(
      `
      UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *
      `,
      [payload.status, bookingId]
    );

    const vehicleResult = await pool.query(
      `
       UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING *
       `,
      [result.rows[0].vehicle_id]
    );
    result = {
      id: result.rows[0].id,
      customer_id: result.rows[0].customer_id,
      vehicle_id: result.rows[0].vehicle_id,
      rent_start_date: result.rows[0].rent_start_date,
      rent_end_date: result.rows[0].rent_end_date,
      total_price: result.rows[0].total_price,
      status: result.rows[0].status,
      vehicle: {
        availability_status: vehicleResult.rows[0].availability_status,
      },
    };
    msg = "Booking marked as returned. Vehicle is now available";
  } else {
    throw new Error("Unauthorized");
  }

  return { result, msg };
};

export const bookingService = {
  createBooking,
  getAllBooking,
  updateBooking,
};
