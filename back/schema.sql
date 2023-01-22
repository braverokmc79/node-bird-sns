
create user `react-nodebird`@`localhost` identified by '1234';
create database react_nodebird CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
grant all privileges on react_nodebird.* to `react-nodebird`@`localhost` ;

create user `nodebird`@`localhost` identified by '1234';
grant all privileges on react_nodebird.* to `nodebird`@`localhost` ;

-- $ npm i sequelize sequelize-cli  mysql mysql2

-- $ npx sequelize init

---$ npx sequelize db:create



CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `PostId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  KEY `PostId` (`PostId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `follow` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `FollowingId` int(11) NOT NULL,
  `FollowerId` int(11) NOT NULL,
  PRIMARY KEY (`FollowingId`,`FollowerId`),
  KEY `FollowerId` (`FollowerId`),
  CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`FollowingId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`FollowerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `hashtags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `src` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PostId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `PostId` (`PostId`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `like` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) NOT NULL,
  `PostId` int(11) NOT NULL,
  PRIMARY KEY (`UserId`,`PostId`),
  KEY `PostId` (`PostId`),
  CONSTRAINT `like_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `like_ibfk_2` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `posthashtag` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `HashtagId` int(11) NOT NULL,
  `PostId` int(11) NOT NULL,
  PRIMARY KEY (`HashtagId`,`PostId`),
  KEY `PostId` (`PostId`),
  CONSTRAINT `posthashtag_ibfk_1` FOREIGN KEY (`HashtagId`) REFERENCES `hashtags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `posthashtag_ibfk_2` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `RetweetId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  KEY `RetweetId` (`RetweetId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`RetweetId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


