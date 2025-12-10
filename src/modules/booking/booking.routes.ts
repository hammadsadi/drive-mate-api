import { Router } from "express";
import auth from "../../middlewares/auth";
import { bookingController } from "./booking.controllers";

const route = Router();

route.post("/", auth("admin", "customer"), bookingController.createBooking);
route.get("/", auth("admin", "customer"), bookingController.getAllBookings);
route.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingController.updateBooking
);

export const BookingRoutes = route;
