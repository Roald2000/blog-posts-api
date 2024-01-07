import { DataTypes, Model } from "sequelize";
import sequelize from "../../app/app.dbconfig";
import Posts from "./model.posts";
import Users from "./model.users";

class Comments extends Model {}

Comments.init(
  {
    comment_id: {
      type: DataTypes.BIGINT({ length: 20 }),
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.BIGINT({ length: 20 }),
      primaryKey: false,
      autoIncrement: false,
      references: { model: Posts, key: "post_id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.BIGINT({ length: 20 }),
      primaryKey: false,
      autoIncrement: false,
      references: { model: Users, key: Users.primaryKeyAttribute },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    comment_content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tbl_comments",
    freezeTableName: true,
    timestamps: true,
  }
);

export default Comments;
