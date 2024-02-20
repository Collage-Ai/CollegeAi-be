CREATE DATABASE ai;
USE ai;
CREATE TABLE `category` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `categoryText` VARCHAR(255) NOT NULL,
  `bigCategory` VARCHAR(255)
);
CREATE TABLE `chat` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `aiMsg` TEXT NOT NULL,
  `userMsg` TEXT NOT NULL,
  `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `category` INT NOT NULL,
  `type` VARCHAR(255) NOT NULL
);
CREATE TABLE `skill` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `category` INT NOT NULL
);
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255),
  `email` VARCHAR(255) NOT NULL,
  `education` VARCHAR(255) NOT NULL,
  `major` VARCHAR(255) NOT NULL,
  `career` VARCHAR(255) NOT NULL,
  `collegeStage` VARCHAR(255) NOT NULL,
  `careerExplore` VARCHAR(255) NOT NULL,
  `advantage` VARCHAR(255) NOT NULL
);
