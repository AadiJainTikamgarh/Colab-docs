import { type Request, type Response, type NextFunction } from "express";

const asyncHandler = async (
  fun: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fun(req, res, next)).catch((error) => next(error));
  };
};

export default asyncHandler;
