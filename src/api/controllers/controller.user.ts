import { compareSync } from "bcryptjs";
import createHttpError from "http-errors";
import { sendResponse } from "../../app/app.helper";
import { generateToken } from "../../app/app.service";
import { TControllerVoidPromise } from "../../app/app.types";
import Users from "../models/model.users";

export const loginUser: TControllerVoidPromise = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username } });
    if (!Boolean(user)) {
      throw createHttpError.BadRequest("Invalid Username or Password");
    } else {
      const match_pw = compareSync(password, user?.getDataValue("password"));
      if (!match_pw) {
        throw createHttpError.BadRequest("Invalid Password or Username");
      } else {
        delete user?.dataValues.password;
        const token = await generateToken(user?.dataValues, {
          ...user?.dataValues,
        });
        sendResponse(res, 200, { token, user: { ...user?.dataValues } });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const registerUser: TControllerVoidPromise = async (req, res, next) => {
  try {
    const { username } = req.body;
    const duplicate = await Users.findOne({ where: { username } });
    if (!Boolean(duplicate)) {
      await Users.create(req?.body);
      sendResponse(res, 201);
    } else {
      throw createHttpError.Conflict("Invalid Username or Password");
    }
  } catch (error) {
    next(error);
  }
};
