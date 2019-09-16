/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_food', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    food_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pay_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancel_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delete_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tele_num: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'order_food'
  });
};
