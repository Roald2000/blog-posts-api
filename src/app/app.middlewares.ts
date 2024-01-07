import createHttpError from "http-errors";
import { TControllerErrMiddleWare, TControllerVoid } from "./app.types";
import { Log, sendResponse } from "./app.helper";

export const invalidRoute: TControllerVoid = (req, res, next) => {
  next(createHttpError.NotImplemented("Invalid Route"));
};

export const errorHandler: TControllerErrMiddleWare = (err, req, res, next) => {
  Log(err);
  const message = err?.message ?? err?.msg ?? "Internal Server Error";
  const status = err?.status ?? err?.statusCode ?? 500;
  sendResponse(res, status, { message });
};
