import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database';

export class Post extends Model {
  id!: number;

  title!: string;

  mediaUrl!: string;

  mediaWidth!: number;

  mediaHeight!: number;

  isPrivate!: boolean;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaWidth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mediaHeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Post',
  },
);
