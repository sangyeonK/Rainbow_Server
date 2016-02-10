-- MySQL dump 10.15  Distrib 10.0.20-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: rainbow
-- ------------------------------------------------------
-- Server version	10.0.20-MariaDB
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Account`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Account` (
  `UserSN` bigint(20) NOT NULL,
  `UserID` varchar(45) NOT NULL,
  `UserName` varchar(64) NOT NULL,
  `Password` varchar(256) NOT NULL,
  `GroupSN` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`UserSN`),
  UNIQUE KEY `Account_UserID` (`UserID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Bill`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Bill` (
  `Idx` bigint(20) NOT NULL,
  `GroupSN` bigint(20) NOT NULL,
  `UserSN` bigint(20) NOT NULL,
  `Timestamp` int(11) NOT NULL,
  `Category` varchar(45) NOT NULL,
  `Amount` int(11) NOT NULL,
  `Comment` varchar(256) CHARACTER SET utf8mb4 NOT NULL,
  PRIMARY KEY (`Idx`),
  KEY `bill_GroupSN` (`GroupSN`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Group`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Group` (
  `GroupSN` bigint(20) NOT NULL,
  `CreateTimestamp` int(11) NOT NULL,
  `OwnerSN` bigint(20) NOT NULL,
  `PartnerSN` bigint(20) NOT NULL,
  `InviteCode` char(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Active` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`GroupSN`),
  KEY `Group_OwnerSN` (`OwnerSN`),
  KEY `Group_PartnerSN` (`PartnerSN`),
  KEY `group_InviteCode` (`InviteCode`(4))
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `GroupInvite`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GroupInvite` (
  `Idx` bigint(20) NOT NULL,
  `InvitedUserSN` bigint(20) NOT NULL,
  `InvitingUserSN` bigint(20) NOT NULL,
  `Timestamp` int(11) NOT NULL,
  `GroupSN` bigint(20) NOT NULL,
  PRIMARY KEY (`Idx`),
  KEY `GroupInvite_InvitedUserSN` (`InvitedUserSN`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'rainbow'
--
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spAcceptGroupInvite`(in user_sn bigint, in group_invite_idx bigint)
BEGIN
	declare $groupSN_invite bigint;
    declare $groupSN_current bigint;
    declare $result int;
    
	a: BEGIN
    
    select GroupSN into $groupSN_invite from `GroupInvite` where Idx = group_invite_idx;
    select GroupSN into $groupSN_current from `Account` where UserSN = user_sn;
    
    if $groupSN_current is null then
		set $result = -1;
        leave a;
	elseif $groupSN_invite is null then
		set $result = -2;
        leave a;
	elseif $groupSN_current != 0 then
		set $result = -3;
		leave a;
    end if;

    update `Account` set GroupSN = $groupSN_invite where UserSN = user_sn;    
    update `Group` set PartnerSN = user_sn, Active = 1 where GroupSN = $groupSN_invite;
	delete from `GroupInvite` where InvitedUserSN = user_sn;
    
    set $result = 1;
    
	END;
    
    select $result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spCreateGroup`(in user_sn bigint, in invite_code char(16))
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spGetUserAccount`(in user_sn bigint, in user_id varchar(45), in passwd varchar(256))
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spInsertBill`(in user_sn bigint, in group_sn bigint, in person_type tinyint, in amount int, in bill_timestamp int, in category varchar(45),in hashtags varchar(256),in bill_comment varchar(256))
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spJoin`(IN `p_userID` VARCHAR(45), IN `p_username` VARCHAR(64), IN `p_password` VARCHAR(256))
BEGIN
	declare $result int;
    declare $userSN bigint default 0;
    if exists( select UserSN from `Account` where UserID=p_userID ) then
		set $result = -1;
	else
		insert into `Account` (`UserID`, `UserName`, `Password` ) values ( p_userID , p_username, p_password );
		set $userSN = last_insert_id();
        set $result = 1;		
    end if;

    select $result,$userSN,p_userID as $userID,p_username as $userName;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spRejectGroupInvite`(in user_sn bigint, in group_invite_idx bigint)
BEGIN
	delete from `GroupInvite` where Idx = group_invite_idx;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spShowGroupInvite`(in user_sn bigint)
BEGIN
	SELECT Idx,Account.UserID,GroupInvite.GroupSN FROM rainbow.GroupInvite JOIN rainbow.Account ON 
	Account.UserSN = GroupInvite.InvitingUserSN
	where InvitedUserSN = user_sn order by Idx; 
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spViewBills`(in user_sn bigint, in group_sn bigint, in start_timestamp int, in end_timestamp int)
BEGIN
    select `UserSN`,`UserName`,`Timestamp`,`Category`,`Amount`,`Comment` from `Bill` left join `Account` using (UserSN) where `Bill`.GroupSN = group_sn and `Timestamp` >= start_timestamp and `Timestamp` < end_timestamp order by Idx;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spInviteGroup`(in inviting_user_sn bigint, in inviting_group_sn bigint, in invited_user_id varchar(45) )
BEGIN

	declare $result int;
    
	declare $groupSN bigint;
    
    declare $invited_user_sn bigint;
    declare $invited_group_sn bigint;
    
    a: BEGIN
	select GroupSN into $groupSN from Account where UserSN = inviting_user_sn;
    
    if $groupSN is null then
		set $result = -1;
        leave a;
	elseif $groupSN != inviting_group_sn then
		set $result = -2;
		leave a;
    end if;
    
    select UserSN,GroupSN into $invited_user_sn, $invited_group_sn from Account where UserID = invited_user_id;
    
    if $invited_user_sn is null then
		set $result = -3;
		leave a;
    elseif $invited_group_sn > 0 then
		set $result = -4;
        leave a;
	elseif inviting_user_sn = $invited_user_sn then
		set $result = -5;
        leave a;
    end if;
    
    insert into `GroupInvite` ( `InvitedUserSN`, `InvitingUserSN`, `Timestamp`, `GroupSN` )
		values ( $invited_user_sn, inviting_user_sn, unix_timestamp(), inviting_group_sn );
    
    set $result = 1;
    END;
    
    select $result;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spJoinGroup`(in user_sn bigint, in invite_code char(16))
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spShowGroups`(in user_sn bigint)
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
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-10  9:05:40
