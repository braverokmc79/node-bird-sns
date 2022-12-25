
create user `react-nodebird`@`localhost` identified by '1234';
create database react_nodebird CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
grant all privileges on react_nodebird.* to `react-nodebird`@`localhost` ;


-- $ npm i sequelize sequelize-cli  mysql mysql2

-- $ npx sequelize init