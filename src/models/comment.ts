import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database';

class Comment extends Model {
  public id!: number;

  public postId!: number;

  public content!: string;

  public userId!: number; // assuming userId is the ID of the user who created the comment
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
  },
);

export { Comment };
