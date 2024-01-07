import { DataTypes, Model } from "sequelize";
import sequelize from "../../app/app.dbconfig";
import { hashSync } from "bcryptjs";

class Users extends Model {}

Users.init(
  {
    user_id: {
      type: DataTypes.BIGINT({ length: 20 }),
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      set: function (initVal: any) {
        const hashed = hashSync(initVal);
        this.setDataValue("password", hashed);
      },
    },
  },
  { sequelize, tableName: "tbl_users", freezeTableName: true }
);

export default Users;
