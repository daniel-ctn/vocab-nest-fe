import { Router } from "express";

import {
  CreateGroupRequestSchema,
  IdParamsSchema,
  UpdateGroupRequestSchema,
} from "@vocab-nest/contracts";

import { requireJwt } from "../middleware/auth";
import { notImplemented } from "../middleware/errors";
import { validateRequest } from "../middleware/validation";

export const groupsRouter = Router();

groupsRouter.use(requireJwt);

groupsRouter.post(
  "/",
  validateRequest({ body: CreateGroupRequestSchema }),
  () => notImplemented("Group creation"),
);

groupsRouter.get("/", () => notImplemented("Group listing"));

groupsRouter.get(
  "/:id",
  validateRequest({ params: IdParamsSchema }),
  () => notImplemented("Group detail lookup"),
);

groupsRouter.patch(
  "/:id",
  validateRequest({ params: IdParamsSchema, body: UpdateGroupRequestSchema }),
  () => notImplemented("Group update"),
);

groupsRouter.delete(
  "/:id",
  validateRequest({ params: IdParamsSchema }),
  () => notImplemented("Group deletion"),
);

groupsRouter.get(
  "/:id/vocabulary",
  validateRequest({ params: IdParamsSchema }),
  () => notImplemented("Group vocabulary listing"),
);
