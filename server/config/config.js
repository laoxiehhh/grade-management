module.exports = {
  database: 'gradeManagement',
  username: 'root',
  password: 'whywhy1230',
  sequelizeOption: {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00',

    define: {
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      }
    }
  }
};
