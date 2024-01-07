import createHttpError from "http-errors";
import { queryPaginate, sendResponse } from "../../app/app.helper";
import { TControllerVoidPromise } from "../../app/app.types";
import Comments from "../models/model.comments";
import Posts from "../models/model.posts";
import Users from "../models/model.users";

Posts.hasMany(Comments, { foreignKey: "post_id" });
Posts.belongsTo(Users, { foreignKey: "user_id" });
Comments.belongsTo(Users, { foreignKey: "user_id" });

export const createPost: TControllerVoidPromise = async (
  req: any,
  res,
  next
) => {
  try {
    const { user_id } = req?.auth;
    const post = await Posts.create({ user_id, ...req?.body });
    sendResponse(res, 201, { post });
  } catch (error) {
    next(error);
  }
};

export const getPosts: TControllerVoidPromise = async (req, res, next) => {
  try {
    const paginate = queryPaginate(req);
    const { rows, count } = await Posts.findAndCountAll({
      ...paginate,
      include: [
        {
          model: Users,
          attributes: ["user_id", "username"],
          foreignKey: "user_id",
        },
        {
          model: Comments,
          foreignKey: "post_id",
          limit: 100,
          order: [["updatedAt", "DESC"]],
          include: [
            {
              model: Users,
              attributes: ["user_id", "username"],
              foreignKey: "user_id",
            },
          ],
        },
      ],
    });
    sendResponse(res, count !== 0 ? 200 : 404, { posts: rows });
  } catch (error) {
    next(error);
  }
};

export const findPost: TControllerVoidPromise = async (req, res, next) => {
  try {
    const { post_id } = req?.params;
    const post = await Posts.findByPk(post_id, {
      include: [
        {
          model: Users,
          attributes: ["user_id", "username"],
          foreignKey: "user_id",
        },
        {
          model: Comments,
          attributes: ["user_id", "username"],
          foreignKey: "post_id",

          limit: 100,
          order: [["updatedAt", "DESC"]],
          include: [
            {
              model: Users,
              attributes: ["user_id", "username"],
              foreignKey: "user_id",
            },
          ],
        },
      ],
    });
    sendResponse(res, Boolean(post) ? 200 : 404, { post });
  } catch (error) {
    next(error);
  }
};

export const updatePost: TControllerVoidPromise = async (
  req: any,
  res,
  next
) => {
  try {
    const { post_id } = req?.params;
    const post = await Posts.findByPk(post_id);
    if (!Boolean(post)) {
      throw createHttpError.NotFound("Post Not Found");
    } else {
      const { user_id } = req?.auth;
      await post?.update({ ...req?.body, user_id });
      sendResponse(res, 201, { post });
    }
  } catch (error) {
    next(error);
  }
};

export const deletePost: TControllerVoidPromise = async (req, res, next) => {
  try {
    const { post_id } = req?.params;
    const post = await Posts.findByPk(post_id);
    if (!Boolean(post)) {
      sendResponse(res, 204);
    } else {
      await post?.destroy();
      sendResponse(res, 204);
    }
  } catch (error) {
    next(error);
  }
};
