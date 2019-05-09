const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    Name: DataTypes.STRING,
    Deadline: {
      type: DataTypes.DATE, // 任务截止时间
      allowNull: false,
      get() {
        return moment(this.getDataValue('Deadline')).format('YYYY-MM-DD');
      },
    },
    Desc: DataTypes.STRING,
  });

  Task.associate = models => {
    models.Assessment.hasMany(models.Task);
    models.Task.belongsTo(models.Assessment);
  };

  return Task;
};
