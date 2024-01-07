import createHttpError from "http-errors";
import { queryPaginate, sendResponse } from "../../app/app.helper";
import { TControllerVoidPromise } from "../../app/app.types";
import Comments from "../models/model.comments";
import { isPostValid } from "../models/model.posts";
import Users from "../models/model.users";

Comments.belongsTo(Users, { foreignKey: "user_id" });

export const createComment: TControllerVoidPromise = async (
  req: any,
  res,
  next
) => {
  try {
    const { post_id } = req?.body;
    await isPostValid(post_id);
    const { user_id } = req?.auth;
    await Comments.create({ ...req?.body, user_id });
    sendResponse(res, 201);
  } catch (error) {
    next(error);
  }
};

export const updateComment: TControllerVoidPromise = async (
  req: any,
  res,
  next
) => {
  try {
    const { post_id } = req?.body;
    await isPostValid(post_id);
    const { comment_id } = req?.params;
    const { user_id } = req?.auth;
    const comment = await Comments.findByPk(comment_id);
    if (!Boolean(comment)) {
      throw createHttpError.NotFound("Comment Not Found");
    } else {
      await comment?.update({ ...req?.body, user_id });
      sendResponse(res, 201, { comment });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteComment: TControllerVoidPromise = async (req, res, next) => {
  try {
    const { comment_id } = req?.params;
    const comment = await Comments.findByPk(comment_id);
    if (!Boolean(comment)) {
      sendResponse(res, 204);
    } else {
      await comment?.destroy();
      sendResponse(res, 204);
    }
  } catch (error) {
    next(error);
  }
};

export const getComments: TControllerVoidPromise = async (req, res, next) => {
  try {
    const { post_id } = req?.params;
    await isPostValid(post_id);
    const paginate = queryPaginate(req);
    const { rows, count } = await Comments.findAndCountAll({
      ...paginate,
      where: { post_id },
      include: [
        {
          model: Users,
          foreignKey: "user_id",
          attributes: ["user_id", "username"],
        },
      ],
    });
    sendResponse(res, count !== 0 ? 200 : 404, { comments: rows });
  } catch (error) {
    next(error);
  }
};
