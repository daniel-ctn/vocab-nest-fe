import { Router } from "express";

import {
  IdParamsSchema,
  PracticeReviewParamsSchema,
  PracticeReviewRequestSchema,
} from "@vocab-nest/contracts";

import { requireJwt } from "../middleware/auth";
import { notImplemented } from "../middleware/errors";
import { validateRequest } from "../middleware/validation";

export const practiceRouter = Router();

practiceRouter.use(requireJwt);

practiceRouter.get("/today", () => notImplemented("Daily practice lookup"));

practiceRouter.post(
  "/:id/items/:itemId/review",
  validateRequest({
    params: PracticeReviewParamsSchema,
    body: PracticeReviewRequestSchema,
  }),
  () => notImplemented("Practice item review"),
);

practiceRouter.post(
  "/:id/complete",
  validateRequest({ params: IdParamsSchema }),
  () => notImplemented("Practice completion"),
);
