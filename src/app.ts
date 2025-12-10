import express, { NextFunction, Request, Response } from "express";

import logger from "./middlewares/logger";
import { initDb } from "./config/db";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { VehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { UserRoutes } from "./modules/user/user.routes";
import { BookingRoutes } from "./modules/booking/booking.routes";

const app = express();

//  Parser
app.use(express.json());
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World!");
});

// initDb();

initDb()
  .then(() => console.log("DB initialized"))
  .catch(console.error);

//  API Routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/vehicles", VehicleRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/bookings", BookingRoutes);

// Api Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API not found",
  });
});

export default app;
