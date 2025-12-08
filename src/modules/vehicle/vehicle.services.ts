import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `
      INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  const vehicle = result.rows[0];
  return {
    id: vehicle.id,
    vehicle_name: vehicle.vehicle_name,
    type: vehicle.type,
    registration_number: vehicle.registration_number,
    daily_rent_price: vehicle.daily_rent_price,
    availability_status: vehicle.availability_status,
  };
};

const getAllVehicles = async () => {
  const result = await pool.query(
    `
      SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles
      `
  );
  return result.rows?.length > 0 ? result.rows : [];
};

const getVehicleById = async (id: number) => {
  const result = await pool.query(
    `
      SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1
      `,
    [id]
  );
  return result.rows?.length > 0 ? result.rows[0] : null;
};

const updateVehicleById = async (
  id: number,
  payload: Record<string, unknown>
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const oldVehicle = await pool.query(
    `
    SELECT * FROM vehicles WHERE id = $1
    `,
    [id]
  );

  if (oldVehicle.rows?.length === 0) {
    throw new Error("Vehicle not found");
  }

  const currentVehicle = oldVehicle.rows[0];
  const updatedData = {
    vehicle_name: vehicle_name || currentVehicle.vehicle_name,
    type: type || currentVehicle.type,
    registration_number:
      registration_number || currentVehicle.registration_number,
    daily_rent_price: daily_rent_price || currentVehicle.daily_rent_price,
    availability_status:
      availability_status || currentVehicle.availability_status,
  };

  const result = await pool.query(
    `
      UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *
      `,
    [
      updatedData.vehicle_name,
      updatedData.type,
      updatedData.registration_number,
      updatedData.daily_rent_price,
      updatedData.availability_status,
      id,
    ]
  );
  return result.rows?.length > 0 ? result.rows[0] : null;
};

const deleteVehicleById = async (id: number) => {
  const result = await pool.query(
    `
      DELETE FROM vehicles WHERE id = $1 RETURNING *
      `,
    [id]
  );
  return result.rows?.length > 0 ? result.rows[0] : null;
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
