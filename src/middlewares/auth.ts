import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log(token);
      // if (!token) {
      //   return res.status(401).json({
      //     success: false,
      //     message: "You are not allowed to access this route",
      //   });
      // }
      // const decode = jwt.verify(
      //   token,
      //   config.JWT_SECRET as string
      // ) as JwtPayload;
      // req.user = decode;
      // if (roles?.length && !roles.includes(decode.role)) {
      //   return res.status(401).json({
      //     success: false,
      //     message: "You are not allowed to access this route",
      //   });
      // }
      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error?.message,
      });
    }
  };
};

export default auth;
