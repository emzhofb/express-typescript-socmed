import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../utils/database';

// User attributes interface
export interface UserAttributes {
  id?: number; // Optional because Sequelize auto-generates it
  username: string;
  password: string;
}

// User class extending Sequelize Model and implementing UserAttributes
export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number; // Non-null assertion because Sequelize will ensure these exist

  public username!: string;

  public password!: string;

  // Timestamps (if enabled in Sequelize)
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Optional: Explicit table name
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  },
);

// Hook to hash the password before saving to the database
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

export default User;
