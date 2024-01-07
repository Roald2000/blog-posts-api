import { DataTypes, Model } from "sequelize";
import sequelize from "../../app/app.dbconfig";
import Users from "./model.users";
import createHttpError from "http-errors";

class Posts extends Model {}

Posts.init(
  {
    post_id: {
      type: DataTypes.BIGINT({ length: 20 }),
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT({ length: 20 }),
      primaryKey: false,
      autoIncrement: false,
      references: { model: Users, key: Users.primaryKeyAttribute },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    post_topic: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    post_description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "tbl_posts",
    freezeTableName: true,
    timestamps: true,
  }
);

export function isPostValid(post_id: any): Promise<unknown> {
  return new Promise(async (res, rej) => {
    const post = await Posts.findByPk(post_id);
    if (!Boolean(post)) {
      rej(createHttpError.NotFound("Comment Failed, Post Not Found"));
    } else {
      res(post);
    }
  });
}

export default Posts;
