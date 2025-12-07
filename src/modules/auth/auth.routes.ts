import { Router } from "express";
import { authController } from "./auth.controllers";

const route = Router();

route.post("/signup", authController.createUser);
route.post("/signin", authController.loginUser);

export const AuthRoutes = route;
