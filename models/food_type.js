/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('food_type', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'food_type'
  });
};
