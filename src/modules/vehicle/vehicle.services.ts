import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  return payload;
};

export const vehicleService = {
  createVehicle,
};
