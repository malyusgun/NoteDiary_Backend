import {sequelize} from "../db.js";
import {DataTypes} from "sequelize";

const User = sequelize.define('user', {
    user_uuid: { type: DataTypes.UUID, allowNull: false },
    nick_name: { type: DataTypes.STRING, primaryKey: true },
    first_name: { type: DataTypes.STRING },
    middle_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone_number: { type: DataTypes.STRING },
    settings: { type: DataTypes.JSON }
})

const Home_entity = sequelize.define('homeEntity', {
    entity_uuid: { type: DataTypes.UUID, primaryKey: true },
    entity_order: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true },
    entity_type: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING },
    text: { type: DataTypes.TEXT },
    image_data: { type: DataTypes.TEXT },
    image_width: { type: DataTypes.INTEGER },
    image_height: { type: DataTypes.INTEGER },
    image_position: { type: DataTypes.STRING },
    table_columns: { type: DataTypes.JSON },
    table_data: { type: DataTypes.JSON },
})

Home_entity.belongsTo(User, { foreignKey: 'nick_name' });

export { User, Home_entity };