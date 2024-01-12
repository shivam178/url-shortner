import { Request, Response } from "express";

export interface BaseRequestParams {
  req: Request;
  res: Response;
}
