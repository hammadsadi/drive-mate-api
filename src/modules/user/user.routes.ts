import { Router } from "express";
import auth from "../../middlewares/auth";
import { userController } from "./user.controllers";

const route = Router();

route.get("/", auth("admin"), userController.getAllUsers);
route.put("/:userId", auth("admin", "customer"), userController.updateUser);
route.delete("/:userId", auth("admin"), userController.deleteUser);

export const UserRoutes = route;
