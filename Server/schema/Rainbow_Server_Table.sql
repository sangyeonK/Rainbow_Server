-- MySQL dump 10.15  Distrib 10.0.20-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: rainbow
-- ------------------------------------------------------
-- Server version	10.0.20-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Account`
--

DROP TABLE IF EXISTS `Account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Account` (
  `UserSN` bigint(20) NOT NULL AUTO_INCREMENT,
  `UserID` varchar(45) NOT NULL,
  `UserName` varchar(64) NOT NULL,
  `Password` varchar(256) NOT NULL,
  `GroupSN` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`UserSN`),
  UNIQUE KEY `Account_UserID` (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Bill`
--

DROP TABLE IF EXISTS `Bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Bill` (
  `Idx` bigint(20) NOT NULL AUTO_INCREMENT,
  `GroupSN` bigint(20) NOT NULL,
  `UserSN` bigint(20) NOT NULL,
  `Timestamp` int(11) NOT NULL,
  `Category` varchar(45) NOT NULL,
  `Amount` int(11) NOT NULL,
  `Comment` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
  PRIMARY KEY (`Idx`),
  KEY `bill_GroupSN` (`GroupSN`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Group`
--

DROP TABLE IF EXISTS `Group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Group` (
  `GroupSN` bigint(20) NOT NULL AUTO_INCREMENT,
  `CreateTimestamp` int(11) NOT NULL,
  `OwnerSN` bigint(20) NOT NULL,
  `PartnerSN` bigint(20) NOT NULL,
  `InviteCode` char(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Active` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`GroupSN`),
  KEY `Group_OwnerSN` (`OwnerSN`),
  KEY `Group_PartnerSN` (`PartnerSN`),
  KEY `group_InviteCode` (`InviteCode`(4))
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-16  7:13:56
