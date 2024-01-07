import createHttpError from "http-errors";
import { sign, verify } from "jsonwebtoken";
import AccessTokens from "../api/models/model.access_tokens";
import { sendResponse } from "./app.helper";
import {
  TControllerVoidPromise,
  TGenerateToken,
  TValidateToken,
} from "./app.types";

const AUTH_KEY: any = process.env.AUTH_KEY;
const AUTH_DURATION: any = process.env.AUTH_DURATION;

export const generateToken: TGenerateToken = (
  payload: any,
  { user_id }: any
) => {
  return new Promise(async (res, rej) => {
    if (!Boolean(payload)) {
      rej(createHttpError.BadRequest());
    } else {
      const access_token = sign({ auth: payload }, AUTH_KEY, {
        expiresIn: AUTH_DURATION,
      });
      await AccessTokens.create({
        access_token,
        user_id,
        access_status: "Granted",
      });
      res(access_token);
    }
  });
};

export const validateToken: TValidateToken = (token) => {
  return new Promise(async (res, rej) => {
    if (!Boolean(token)) {
      rej(createHttpError.Forbidden("Invalid Token, Empty"));
    } else {
      const accessToken = await AccessTokens.findOne({
        where: { access_token: token },
      });

      if (!Boolean(accessToken)) {
        rej(createHttpError.Unauthorized("Login To Gain Access"));
      }

      if (accessToken?.dataValues.access_status !== "Granted") {
        rej(createHttpError.Unauthorized("Access Denied"));
      }

      const verifiedToken: any = verify(token, AUTH_KEY);

      if (accessToken?.dataValues.user_id !== verifiedToken?.auth?.user_id) {
        rej(createHttpError.Unauthorized("Access Denied, Invalid User"));
      }

      if (verifiedToken?.exp < Date.now() / 1000) {
        rej(createHttpError.Forbidden("Invalid Token, Expired"));
      } else {
        res(verifiedToken);
      }
    }
  });
};

export const logout: TControllerVoidPromise = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!Boolean(authorization)) {
      throw createHttpError.Unauthorized();
    } else {
      let access_token =
        authorization?.split(" ")[0] === "Bearer"
          ? authorization?.split(" ")[1]
          : authorization;
      const { auth } = await validateToken(access_token);
      const { user_id } = auth;
      await AccessTokens.destroy({
        where: { access_token, user_id, access_status: "Granted" },
      });
      sendResponse(res, 204);
    }
  } catch (error) {
    next(error);
  }
};

export const authenticateToken: TControllerVoidPromise = async (
  req: any,
  res,
  next
) => {
  try {
    const { authorization } = req.headers;
    if (!Boolean(authorization)) {
      throw createHttpError.Unauthorized();
    } else {
      let token =
        authorization?.split(" ")[0] === "Bearer"
          ? authorization?.split(" ")[1]
          : authorization;
      const { auth } = await validateToken(token);
      req.auth = auth;
      next();
    }
  } catch (error) {
    next(error);
  }
};
