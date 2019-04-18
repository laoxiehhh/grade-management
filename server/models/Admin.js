module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Telephone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Admin;
};
