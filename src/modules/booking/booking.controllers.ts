import { Request, Response } from "express";
import { bookingService } from "./booking.services";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getAllBooking(req.user as JwtPayload);
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { result, msg } = await bookingService.updateBooking(
      req.body,
      req.user as JwtPayload,
      Number(req.params.bookingId)
    );
    res.status(200).json({
      success: true,
      message: msg,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
