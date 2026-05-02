import type { Response } from "express";

import type { ApiSuccessResponse } from "@vocab-nest/contracts";

export const sendSuccess = <Data>(
  res: Response,
  data: Data,
  statusCode = 200,
) => {
  const payload: ApiSuccessResponse<Data> = {
    success: true,
    data,
  };

  return res.status(statusCode).json(payload);
};
