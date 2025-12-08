import { Request, Response } from "express";
import { vehicleService } from "./vehicle.services";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicleById(
      Number(req.params.vehicleId)
    );
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.updateVehicleById(
      Number(req.params.vehicleId),
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.deleteVehicleById(
      Number(req.params.vehicleId)
    );
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
