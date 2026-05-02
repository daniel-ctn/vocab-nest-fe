import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { dashboardRouter } from "./routes/dashboard";
import { groupsRouter } from "./routes/groups";
import { authRouter } from "./routes/auth";
import { practiceRouter } from "./routes/practice";
import { vocabularyRouter } from "./routes/vocabulary";
import { errorHandler, sendError } from "./middleware/errors";
import { openApiDocument } from "./openapi";
import { sendSuccess } from "./responses";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) ?? true,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => sendSuccess(res, { ok: true }));
  app.get("/openapi.json", (_req, res) => res.json(openApiDocument));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use("/auth", authRouter);
  app.use("/vocabulary", vocabularyRouter);
  app.use("/groups", groupsRouter);
  app.use("/practice", practiceRouter);
  app.use("/dashboard", dashboardRouter);

  app.use((_req, res) =>
    sendError(res, 404, "NOT_FOUND", "The requested endpoint was not found."),
  );
  app.use(errorHandler);

  return app;
};
