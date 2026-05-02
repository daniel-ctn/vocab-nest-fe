import { Router } from "express";

import {
  LoginRequestSchema,
  RegisterRequestSchema,
} from "@vocab-nest/contracts";

import { requireJwt } from "../middleware/auth";
import { notImplemented } from "../middleware/errors";
import { validateRequest } from "../middleware/validation";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest({ body: RegisterRequestSchema }),
  () => notImplemented("User registration"),
);

authRouter.post(
  "/login",
  validateRequest({ body: LoginRequestSchema }),
  () => notImplemented("User login"),
);

authRouter.get("/me", requireJwt, () => notImplemented("Current user lookup"));
