import { DataTypes, Model } from "sequelize";
import sequelize from "../../app/app.dbconfig";
import Users from "./model.users";

class AccessTokens extends Model {}

AccessTokens.init(
  {
    at_id: {
      type: DataTypes.BIGINT({ length: 20 }),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    access_token: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    access_status: {
      type: DataTypes.ENUM("Granted", "Denied"),
      allowNull: false,
      defaultValue: "Granted",
    },
    user_id: {
      type: DataTypes.BIGINT({ length: 20 }),
      primaryKey: false,
      autoIncrement: false,
      references: { model: Users, key: Users.primaryKeyAttribute },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "tbl_access_tokens",
    freezeTableName: true,
    timestamps: true,
  }
);

export default AccessTokens;
