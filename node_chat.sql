-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3306
-- Létrehozás ideje: 2018. Ápr 28. 10:49
-- Kiszolgáló verziója: 5.7.19
-- PHP verzió: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `node_chat`
--
CREATE DATABASE IF NOT EXISTS `node_chat` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `node_chat`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `file_manager_activity`
--

DROP TABLE IF EXISTS `file_manager_activity`;
CREATE TABLE IF NOT EXISTS `file_manager_activity` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(2) NOT NULL,
  `activity_id` int(2) NOT NULL,
  `value` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `file_manager_activity`
--

INSERT INTO `file_manager_activity` (`id`, `user_id`, `activity_id`, `value`) VALUES
(6, 1, 4, 'file_manager_files/proba'),
(2, 2, 4, 'file_manager_files/ezmi'),
(3, 1, 5, 'file_manager_files/fb.jpg'),
(4, 1, 5, 'file_manager_files/regiesujborito2.jpg,file_manager_files/regiesujlogofeher.png'),
(5, 1, 5, 'file_manager_files/regiesujborito2.jpg,file_manager_files/regiesujlogofeher.png'),
(7, 1, 4, 'file_manager_files/proba'),
(9, 1, 4, 'file_manager_files/fallout'),
(10, 1, 5, 'file_manager_files/fallout'),
(11, 1, 3, 'file_manager_files/fb-cover.jpg'),
(12, 1, 3, 'file_manager_files/fb-cover.jpg'),
(13, 1, 3, 'file_manager_files/fb-cover.jpg'),
(14, 1, 3, 'file_manager_files/fb.jpg'),
(15, 1, 2, 'file_manager_files/fb-cover.jpg'),
(16, 1, 2, 'file_manager_files/7.jpg,file_manager_files/unreal.jpg'),
(17, 1, 2, 'file_manager_files/7.jpg,file_manager_files/unreal.jpg'),
(18, 1, 3, 'file_manager_files/unrealagain.jpg'),
(19, 2, 3, 'file_manager_files/fb.jpg'),
(20, 1, 2, 'file_manager_files/unrealagain.jpg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `file_manager_activity_types`
--

DROP TABLE IF EXISTS `file_manager_activity_types`;
CREATE TABLE IF NOT EXISTS `file_manager_activity_types` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `description` varchar(200) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `file_manager_activity_types`
--

INSERT INTO `file_manager_activity_types` (`id`, `description`) VALUES
(1, 'filedownload'),
(2, 'filedelete'),
(3, 'fileupload'),
(4, 'dircreate'),
(5, 'dirdelete');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `last_log` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `last_log`) VALUES
(1, 'Tibor', '3edcvfr4', '2018-04-27 14:36:54'),
(2, 'Viki', 'sokrajz', '2018-04-27 14:37:30'),
(3, 'Geri', 'muppavagyok', '2018-04-19 14:42:54'),
(4, 'tom', 'tomtom', '2018-04-27 18:29:44');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
