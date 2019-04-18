module.exports = {
  database: "gradeManagement",
  username: "root",
  password: "whywhy1230",
  sequelizeOption: {
    host: "localhost",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
