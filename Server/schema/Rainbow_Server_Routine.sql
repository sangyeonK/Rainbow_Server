-- MySQL dump 10.13  Distrib 5.5.27, for Win32 (x86)
--
-- Host: localhost    Database: rainbow
-- ------------------------------------------------------
-- Server version	5.5.27-log

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
-- Dumping routines for database 'rainbow'
--
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `spCreateGroup`(IN `user_sn` BIGINT, IN `invite_code` CHAR(16))
BEGIN

	declare $result int;
    declare $ownerSN bigint;
    declare $ownerName varchar(45);
    declare $partnerSN bigint;
    declare $partnerName varchar(45);
    declare $groupSN bigint;
    declare $active int default 0;
	declare $inviteCode char(16);
    
    a: BEGIN
	select UserName, GroupSN into $ownerName, $groupSN from Account where UserSN = user_sn;
    
    if $groupSN is null then
		set $result = -1;
        leave a;
	elseif $groupSN > 0 then
		set $result = -2;
        leave a;
	elseif exists ( select 1 from `Group` where `InviteCode` = invite_code )then
		set $result = -3;
        leave a;
    end if;
    
    set $inviteCode = invite_code;
    
    insert into `Group` (`CreateTimestamp`, `OwnerSN`,`InviteCode`) values (unix_timestamp(), user_sn, invite_code);
    set $groupSN = last_insert_id();
	update `Account` set `GroupSN` = $groupSN where `UserSN` = user_sn;

    set $result = 1;
    END;
    
    select $result,$groupSN,$ownerName,$partnerName,$inviteCode,$active;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `spGetUserAccount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `spGetUserAccount`(IN `user_sn` BIGINT, IN `user_id` VARCHAR(45), IN `passwd` VARCHAR(256))
BEGIN

    declare $userSN bigint;
    declare $userID varchar(45);
    declare $userName varchar(64);
    declare $groupSN bigint;
    
	declare $ownerSN bigint;
    declare $ownerName varchar(45) default "";
    declare $partnerSN bigint;
    declare $partnerName varchar(45) default "";
    declare $inviteCode char(16) default "";
    declare $active tinyint default 0;
    
	if user_sn = 0 then
		select UserSN,UserID,UserName,GroupSN into $userSN,$userID,$userName,$groupSN from `Account` left join `Group` using ( `groupSN` ) where `UserID`=user_id and `Password` = passwd;
    else 
		select UserSN,UserID,UserName,GroupSN into $userSN,$userID,$userName,$groupSN from `Account` left join `Group` using ( `groupSN` ) where `UserSN`=user_sn;
	end if;

    if $groupSN > 0 then
		select OwnerSN, PartnerSN, InviteCode, Active into $ownerSN, $partnerSN, $inviteCode, $active from `Group` where GroupSN = $groupSN;
		select UserName into $ownerName from `Account` where UserSN = $ownerSN;
		select UserName into $partnerName from `Account` where UserSN = $partnerSN;		
    end if;
    
    select $userSN,$userID,$userName,$groupSN,$ownerName,$partnerName,$inviteCode,$active;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `spInsertBill` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `spInsertBill`(IN `user_sn` BIGINT, IN `group_sn` BIGINT, IN `person_type` TINYINT, IN `amount` INT, IN `bill_timestamp` INT, IN `category` VARCHAR(45), IN `hashtags` VARCHAR(256), IN `bill_comment` VARCHAR(256))
BEGIN

	declare $result int;
	declare $currentGroupSN bigint;
	declare $ownerSN bigint;
    declare $partnerSN bigint;
    declare $paiderSN bigint;
    
    a: BEGIN
    
    select GroupSN into $currentGroupSN from `Account` where UserSN = user_sn;

    if $currentGroupSN is null then
		set $result = -1;
        leave a;
	elseif $currentGroupSN != group_sn then
		set $result = -2;
        leave a;
    end if;
    
    select OwnerSN, PartnerSN into $ownerSN, $partnerSN from `Group` where GroupSN = group_sn; 
    
    if $ownerSN is null then
		set $result = -3;
        leave a;
    end if;
    
    if person_type = 1 then
		if $ownerSN = user_sn then
			set $paiderSN = $ownerSN;
		else 
			set $paiderSN = $partnerSN;
		end if;
    elseif person_type = 2 then
		if $ownerSN = user_sn then
			set $paiderSN = $partnerSN;
		else 
			set $paiderSN = $ownerSN;
		end if;
    end if;
    
    if $paiderSN is null then
		set $result = -4;
        leave a;
    end if;
    
    insert into `Bill` ( `GroupSN`, `UserSN`, `Timestamp`, `Category`, `Amount`, `Comment` ) values
		( group_sn, $paiderSN, bill_timestamp, category, amount, bill_comment );
        
    set $result = 1;
    END;
    
    select $result;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `spJoin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `spJoin`(IN `p_userID` VARCHAR(45), IN `p_username` VARCHAR(64), IN `p_password` VARCHAR(256),IN `p_inviteCode` CHAR(16))
BEGIN
	declare $result int;
	declare $groupSN bigint;
    declare $userSN bigint default 0;
    
    a: BEGIN
    
    if exists( select UserSN from `Account` where UserID=p_userID ) then
		set $result = -1;
	elseif exists ( select 1 from `Group` where `InviteCode` = p_inviteCode ) then
		set $result = -3;
	else
		insert into `Account` (`UserID`, `UserName`, `Password` ) values ( p_userID , p_username, p_password );
		set $userSN = last_insert_id();
		insert into `Group` (`CreateTimestamp`, `OwnerSN`,`InviteCode`) values (unix_timestamp(), $userSN, p_inviteCode);
		set $groupSN = last_insert_id();
		update `Account` set `GroupSN` = $groupSN where `UserSN` = $userSN;

        set $result = 1;		
    end if;
    
    END;
    
    select $result,$userSN,p_userID as $userID,p_username as $userName,$groupSN,p_inviteCode as $inviteCode;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `spJoinGroup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `spJoinGroup`(IN `user_sn` BIGINT, IN `invite_code` CHAR(16))
BEGIN
	
	declare $result int;
    declare $partnerSN bigint;
    declare $currentGroupSN bigint;
    declare $inviteGroupSN bigint;
    
    a: BEGIN
	select GroupSN into $currentGroupSN from `Account` where UserSN = user_sn;
    select GroupSN,PartnerSN into $inviteGroupSN,$partnerSN from `Group` where InviteCode = invite_code;
    
    if $currentGroupSN is null then
		set $result = -1;
        leave a;
	elseif $inviteGroupSN is null then
		set $result = -2;
        leave a;
	elseif $currentGroupSN > 0 then
		set $result = -3;
        leave a;
	elseif $partnerSN > 0 then
		set $result = -4;
        leave a;
    end if;

	update `Account` set `GroupSN` = $inviteGroupSN where `UserSN` = user_sn;
	update `Group` set `PartnerSN` = user_sn, `Active` = 1 where `GroupSN` = $inviteGroupSN;
    
    set $result = 1;
    END;
    
    select $result;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `spShowGroups` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `spShowGroups`(IN `user_sn` BIGINT)
BEGIN

	declare $result int;
    declare $ownerSN bigint;
    declare $ownerName varchar(64);
    declare $partnerSN bigint;
    declare $partnerName varchar(64);
    declare $groupSN bigint;
    declare $active int default 0;
	
    a: BEGIN
	select GroupSN into $groupSN from Account where UserSN = user_sn;
    
    if $groupSN is null then
		set $result = -1;
        leave a;
    end if;
    
    select OwnerSN, PartnerSN, Active into $ownerSN, $partnerSN, $active from `Group` where GroupSN = $groupSN;
    select UserName into $ownerName from `Account` where UserSN = $ownerSN;
    select UserName into $partnerName from `Account` where UserSN = $partnerSN;
    
    set $result = 1;
    END;
    
    select $result,$groupSN,$ownerName,$partnerName,$active;
    
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `spViewBills` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `spViewBills`(IN `user_sn` BIGINT, IN `group_sn` BIGINT, IN `start_timestamp` INT, IN `end_timestamp` INT)
BEGIN
    select `UserSN`,`UserName`,`Timestamp`,`Category`,`Amount`,`Comment` from `Bill` left join `Account` using (UserSN) where `Bill`.GroupSN = group_sn and `Timestamp` >= start_timestamp and `Timestamp` < end_timestamp order by Idx;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-16 16:30:32
