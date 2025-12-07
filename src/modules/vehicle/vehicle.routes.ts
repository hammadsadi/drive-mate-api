import { Router } from "express";
import { vehicleController } from "./vehicle.controllers";
import auth from "../../middlewares/auth";

const route = Router();

route.post("/", auth(), vehicleController.createVehicle);

export const VehicleRoutes = route;
