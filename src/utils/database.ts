import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: false, // Disable logging in production
});

export default sequelize;
