import type { ErrorRequestHandler, Response } from "express";
import { ZodError } from "zod";

import type { ApiErrorResponse } from "@vocab-nest/contracts";

export class ApiException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiException";
  }
}

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
) => {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  };

  return res.status(statusCode).json(payload);
};

export const notImplemented = (feature: string) => {
  throw new ApiException(
    501,
    "NOT_IMPLEMENTED",
    `${feature} is owned by the Express backend service layer and is not implemented yet.`,
  );
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiException) {
    return sendError(
      res,
      error.statusCode,
      error.code,
      error.message,
      error.details,
    );
  }

  if (error instanceof ZodError) {
    return sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Request validation failed.",
      error.flatten(),
    );
  }

  return sendError(res, 500, "INTERNAL_SERVER_ERROR", "Unexpected API error.");
};
