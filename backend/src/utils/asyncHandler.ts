import type { Request, Response, NextFunction } from "express";

const asyncHandler = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await func(req, res, next);
    } catch (error: any) {
      console.error("Error caught in asyncHandler:", error); // Optional, for debugging

      const statusCode =
        typeof error.statusCode === "number"
          ? error.statusCode
          : typeof error.status === "number"
          ? error.status
          : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
};

export { asyncHandler };
