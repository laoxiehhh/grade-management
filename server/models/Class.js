module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Class.associate = models => {
    models.Class.belongsTo(models.Profession);
  };

  return Class;
};
