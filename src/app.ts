import express, { NextFunction, Request, Response } from "express";

import logger from "./middlewares/logger";

const app = express();

//  Parser
app.use(express.json());
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Api Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API not found",
  });
});

export default app;
