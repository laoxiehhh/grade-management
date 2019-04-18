module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    Name: DataTypes.STRING,
    Score: {
      type: DataTypes.INTEGER, // 该任务的成绩
      allowNull: false
    },
    Deadline: {
      type: DataTypes.DATE, // 任务截止时间
      allowNull: false
    }
  });

  Task.associate = models => {
    models.Assessment.hasMany(models.Task);
  };

  return Task;
};
