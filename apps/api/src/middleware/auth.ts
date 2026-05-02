import type { NextFunction, Request, Response } from "express";

import { ApiException } from "./errors";

export const requireJwt = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : undefined;

  if (!token) {
    return next(
      new ApiException(
        401,
        "UNAUTHORIZED",
        "A bearer token is required for this endpoint.",
      ),
    );
  }

  res.locals.auth = { token };
  return next();
};
