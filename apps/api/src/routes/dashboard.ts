import { Router } from "express";

import { requireJwt } from "../middleware/auth";
import { notImplemented } from "../middleware/errors";

export const dashboardRouter = Router();

dashboardRouter.use(requireJwt);

dashboardRouter.get("/summary", () =>
  notImplemented("Dashboard summary lookup"),
);
