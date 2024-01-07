import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";

export type TControllerVoidPromise = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | unknown>;

export type TControllerVoid = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type TControllerErrMiddleWare = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type TGenerateToken = (
  payload: any,
  token_owner?: any
) => Promise<unknown>;

export type TValidateToken = (token: any) => Promise<unknown | any>;

export type TSendResponse = (
  res: Response,
  status: number,
  data?: any | null
) => void;

export type TPaginateArgs = {
  page: any;
  limit: any;
  order_by?: any;
  sort_by?: any;
};

export type TPaginateResult = {
  offset: number | any;
  limit: number | any;
  order?: any[];
};

export type TPaginateQuery = (req: Request) => TPaginateResult;
