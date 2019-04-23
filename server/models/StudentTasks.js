module.exports = (sequelize, DataTypes) => {
  const StudentTasks = sequelize.define('StudentTasks', {
    Score: {
      type: DataTypes.INTEGER // 该任务的成绩
    }
  });

  StudentTasks.associate = models => {
    models.Student.belongsToMany(models.Task, { through: 'StudentTasks' });
    models.Task.belongsToMany(models.Student, { through: 'StudentTasks' });
  };

  return StudentTasks;
};
