import { Router } from "express";

import {
  CreateVocabularyRequestSchema,
  IdParamsSchema,
  UpdateVocabularyRequestSchema,
  VocabularyGroupLinkRequestSchema,
  VocabularySearchRequestSchema,
} from "@vocab-nest/contracts";

import { requireJwt } from "../middleware/auth";
import { notImplemented } from "../middleware/errors";
import { validateRequest } from "../middleware/validation";

export const vocabularyRouter = Router();

vocabularyRouter.use(requireJwt);

vocabularyRouter.post(
  "/search",
  validateRequest({ body: VocabularySearchRequestSchema }),
  () => notImplemented("Vocabulary search"),
);

vocabularyRouter.post(
  "/",
  validateRequest({ body: CreateVocabularyRequestSchema }),
  () => notImplemented("Vocabulary creation"),
);

vocabularyRouter.get("/", () => notImplemented("Vocabulary listing"));

vocabularyRouter.get(
  "/:id",
  validateRequest({ params: IdParamsSchema }),
  () => notImplemented("Vocabulary detail lookup"),
);

vocabularyRouter.patch(
  "/:id",
  validateRequest({
    params: IdParamsSchema,
    body: UpdateVocabularyRequestSchema,
  }),
  () => notImplemented("Vocabulary update"),
);

vocabularyRouter.delete(
  "/:id",
  validateRequest({ params: IdParamsSchema }),
  () => notImplemented("Vocabulary deletion"),
);

vocabularyRouter.post(
  "/:id/groups",
  validateRequest({
    params: IdParamsSchema,
    body: VocabularyGroupLinkRequestSchema,
  }),
  () => notImplemented("Vocabulary group assignment"),
);
