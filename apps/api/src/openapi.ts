import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import {
  ApiErrorResponseSchema,
  AuthResponseSchema,
  CreateGroupRequestSchema,
  CreateVocabularyRequestSchema,
  DashboardSummaryResponseSchema,
  DeleteResponseSchema,
  GroupDetailResponseSchema,
  GroupListResponseSchema,
  GroupVocabularyResponseSchema,
  IdParamsSchema,
  LoginRequestSchema,
  MeResponseSchema,
  PracticeCompleteResponseSchema,
  PracticeReviewParamsSchema,
  PracticeReviewRequestSchema,
  PracticeReviewResponseSchema,
  RegisterRequestSchema,
  TodayPracticeResponseSchema,
  UpdateGroupRequestSchema,
  UpdateVocabularyRequestSchema,
  VocabularyDetailResponseSchema,
  VocabularyGroupLinkRequestSchema,
  VocabularyGroupLinkResponseSchema,
  VocabularyListResponseSchema,
  VocabularySearchRequestSchema,
  VocabularySearchResponseSchema,
  createApiSuccessResponseSchema,
} from "@vocab-nest/contracts";
import { z, type ZodTypeAny } from "zod";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const jsonContent = (schema: ZodTypeAny) => ({
  "application/json": {
    schema,
  },
});

const errorResponses = {
  400: {
    description: "Validation error",
    content: jsonContent(ApiErrorResponseSchema),
  },
  401: {
    description: "Authentication required",
    content: jsonContent(ApiErrorResponseSchema),
  },
  500: {
    description: "Unexpected API error",
    content: jsonContent(ApiErrorResponseSchema),
  },
};

const notImplementedResponse = {
  501: {
    description: "Endpoint contract exists but service logic is not implemented yet",
    content: jsonContent(ApiErrorResponseSchema),
  },
};

const secured = [{ bearerAuth: [] }];

registry.registerPath({
  method: "post",
  path: "/auth/register",
  request: {
    body: {
      content: jsonContent(RegisterRequestSchema),
    },
  },
  responses: {
    201: {
      description: "Registered user",
      content: jsonContent(createApiSuccessResponseSchema(AuthResponseSchema)),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  request: {
    body: {
      content: jsonContent(LoginRequestSchema),
    },
  },
  responses: {
    200: {
      description: "Authenticated user",
      content: jsonContent(createApiSuccessResponseSchema(AuthResponseSchema)),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/me",
  security: secured,
  responses: {
    200: {
      description: "Current authenticated user",
      content: jsonContent(createApiSuccessResponseSchema(MeResponseSchema)),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/vocabulary/search",
  security: secured,
  request: {
    body: {
      content: jsonContent(VocabularySearchRequestSchema),
    },
  },
  responses: {
    200: {
      description: "Vocabulary search results",
      content: jsonContent(
        createApiSuccessResponseSchema(VocabularySearchResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/vocabulary",
  security: secured,
  request: {
    body: {
      content: jsonContent(CreateVocabularyRequestSchema),
    },
  },
  responses: {
    201: {
      description: "Created vocabulary item",
      content: jsonContent(
        createApiSuccessResponseSchema(VocabularyDetailResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/vocabulary",
  security: secured,
  responses: {
    200: {
      description: "Vocabulary list",
      content: jsonContent(
        createApiSuccessResponseSchema(VocabularyListResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/vocabulary/{id}",
  security: secured,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    200: {
      description: "Vocabulary item",
      content: jsonContent(
        createApiSuccessResponseSchema(VocabularyDetailResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "patch",
  path: "/vocabulary/{id}",
  security: secured,
  request: {
    params: IdParamsSchema,
    body: {
      content: jsonContent(UpdateVocabularyRequestSchema),
    },
  },
  responses: {
    200: {
      description: "Updated vocabulary item",
      content: jsonContent(
        createApiSuccessResponseSchema(VocabularyDetailResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "delete",
  path: "/vocabulary/{id}",
  security: secured,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    200: {
      description: "Deleted vocabulary item",
      content: jsonContent(createApiSuccessResponseSchema(DeleteResponseSchema)),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/vocabulary/{id}/groups",
  security: secured,
  request: {
    params: IdParamsSchema,
    body: {
      content: jsonContent(VocabularyGroupLinkRequestSchema),
    },
  },
  responses: {
    200: {
      description: "Assigned vocabulary item to group",
      content: jsonContent(
        createApiSuccessResponseSchema(VocabularyGroupLinkResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/groups",
  security: secured,
  request: {
    body: {
      content: jsonContent(CreateGroupRequestSchema),
    },
  },
  responses: {
    201: {
      description: "Created group",
      content: jsonContent(createApiSuccessResponseSchema(GroupDetailResponseSchema)),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/groups",
  security: secured,
  responses: {
    200: {
      description: "Group list",
      content: jsonContent(createApiSuccessResponseSchema(GroupListResponseSchema)),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/groups/{id}",
  security: secured,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    200: {
      description: "Group detail",
      content: jsonContent(createApiSuccessResponseSchema(GroupDetailResponseSchema)),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "patch",
  path: "/groups/{id}",
  security: secured,
  request: {
    params: IdParamsSchema,
    body: {
      content: jsonContent(UpdateGroupRequestSchema),
    },
  },
  responses: {
    200: {
      description: "Updated group",
      content: jsonContent(createApiSuccessResponseSchema(GroupDetailResponseSchema)),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "delete",
  path: "/groups/{id}",
  security: secured,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    200: {
      description: "Deleted group",
      content: jsonContent(createApiSuccessResponseSchema(DeleteResponseSchema)),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/groups/{id}/vocabulary",
  security: secured,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    200: {
      description: "Vocabulary in group",
      content: jsonContent(
        createApiSuccessResponseSchema(GroupVocabularyResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/practice/today",
  security: secured,
  responses: {
    200: {
      description: "Today's practice session",
      content: jsonContent(
        createApiSuccessResponseSchema(TodayPracticeResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/practice/{id}/items/{itemId}/review",
  security: secured,
  request: {
    params: PracticeReviewParamsSchema,
    body: {
      content: jsonContent(PracticeReviewRequestSchema),
    },
  },
  responses: {
    200: {
      description: "Reviewed practice item",
      content: jsonContent(
        createApiSuccessResponseSchema(PracticeReviewResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "post",
  path: "/practice/{id}/complete",
  security: secured,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    200: {
      description: "Completed practice session",
      content: jsonContent(
        createApiSuccessResponseSchema(PracticeCompleteResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

registry.registerPath({
  method: "get",
  path: "/dashboard/summary",
  security: secured,
  responses: {
    200: {
      description: "Dashboard summary",
      content: jsonContent(
        createApiSuccessResponseSchema(DashboardSummaryResponseSchema),
      ),
    },
    ...errorResponses,
    ...notImplementedResponse,
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Vocab Nest API",
    version: "0.0.0",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local Express API",
    },
  ],
});
