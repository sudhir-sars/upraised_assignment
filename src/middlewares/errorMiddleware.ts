// src/middlewares/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';

//Middleware to handle errors.
const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
};

export default errorMiddleware;
