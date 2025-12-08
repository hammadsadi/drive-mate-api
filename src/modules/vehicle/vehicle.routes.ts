import { Router } from "express";
import { vehicleController } from "./vehicle.controllers";
import auth from "../../middlewares/auth";

const route = Router();

route.post("/", auth("admin"), vehicleController.createVehicle);
route.get("/", vehicleController.getAllVehicles);
route.get("/:vehicleId", vehicleController.getVehicleById);
route.put("/:vehicleId", auth("admin"), vehicleController.updateVehicleById);
route.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicleById);

export const VehicleRoutes = route;
