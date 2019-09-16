/*
 Navicat Premium Data Transfer

 Source Server         : turbo
 Source Server Type    : MySQL
 Source Server Version : 80015
 Source Host           : localhost:3306
 Source Schema         : turbo_dev

 Target Server Type    : MySQL
 Target Server Version : 80015
 File Encoding         : 65001

 Date: 12/09/2019 17:11:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for food_type
-- ----------------------------
DROP TABLE IF EXISTS `food_type`;
CREATE TABLE `food_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
--  Records of `food_type`
-- ----------------------------
BEGIN;
INSERT INTO `food_type` VALUES ('1', '1', '主食', '2019-09-16 03:34:16'), ('2', '2', '粥类', '2019-09-16 03:34:16');
COMMIT;

-- ----------------------------
-- Table structure for food
-- ----------------------------
DROP TABLE IF EXISTS `food`;
CREATE TABLE `food` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `price` decimal(30,2) DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `sales` int(11) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `heat` int(11) DEFAULT NULL,
  `content` varchar(200) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `version` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
--  Records of `food`
-- ----------------------------
BEGIN;
INSERT INTO `food` VALUES ('1', '牛肉包子', '2.50', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epoUibXXzs43Bx', '0', '200', '1', '0', '牛肉包子介绍牛肉包子介绍', '2019-09-16 03:34:16', '1'), ('2', '韭菜鸡蛋包子', '2.00', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epoUibXXzs43Bx', '0', '200', '1', '0', '韭菜鸡蛋包子介绍', '2019-09-16 03:34:16', '1'), ('3', '糖油饼', '3.00', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epoUibXXzs43Bx', '0', '200', '1', '0', '糖油饼介绍...', '2019-09-16 03:34:16', '1'), ('4', '豆浆', '3.00', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epoUibXXzs43Bx', '0', '200', '2', '0', '鲜榨豆浆...', '2019-09-16 03:34:16', '1'), ('5', '八宝粥', '3.50', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epoUibXXzs43Bx', '0', '200', '2', '0', '八宝粥...', '2019-09-16 03:34:16', '1');
COMMIT;

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pay` decimal(30,2) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  `pay_time` datetime DEFAULT NULL,
  `cancel_time` datetime DEFAULT NULL,
  `delete_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `trade_num` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for order_food
-- ----------------------------
DROP TABLE IF EXISTS `order_food`;
CREATE TABLE `order_food` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `price` decimal(30,2) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  `pay_time` datetime DEFAULT NULL,
  `cancel_time` datetime DEFAULT NULL,
  `delete_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `tele_num` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tele_num` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `state` int(11) DEFAULT '0',
  `register_time` datetime DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `balance` decimal(30,2) DEFAULT '0.00',
  `score` decimal(30,2) DEFAULT '0.00',
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('15', '13716190068', '管理员', '2', '2019-09-16 03:34:16', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epoUibXXzs43Bx', '9999.00', '9999.00', '111111');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
