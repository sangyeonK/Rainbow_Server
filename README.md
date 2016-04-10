## Rainbow_Server

Rainbow_Server 는 두툼-커플가계부(https://github.com/Nexters/Rainbow/) 의 네트워크 API 기능을 제공하는 어플리케이션 입니다.

필요사항
=============

* [nodejs](http://nodejs.org/)
* mysql or mariadb
* git

설치 
================
( 사용자의 HOME 경로를 기준으로 설명합니다. )
### 소스 다운로드

    $ cd ~ 
    $ git clone https://github.com/sangyeonK/Rainbow_Server
  
    
### npm package 설치

    $ cd ~/Rainbow_Server/Server
    $ npm install
    
### Database 생성

Database 생성 쿼리파일은 `Server/schema/` 에 위치하고 있습니다.

`Server/schema/Rainbow_Server_Table.sql` : 테이블 생성 쿼리문
`Server/schema/Rainbow_Server_Routine.sql` : 저장 프로시저 생성 쿼리문

* mysql 혹은 mariaDB를 설치
* Database에 로그인: `mysql -uUsername -pPassword`
* Database 생성: `mysql> create database rainbow;`
* Database 선택: `mysql> use rainbow;`
* sql 파일 추출(테이블): `mysql> source ~/Rainbow_Server/Server/schema/Rainbow_Server_Table.sql`
* sql 파일 추출(저장 프로시저): `mysql> source ~/Rainbow_Server/Server/schema/Rainbow_Server_Routine.sql`

### Database 설정 수정

접속 Database 설정은 `Server/config/mysql.json` 파일에 기록되어 있습니다.

OS의 NODE_ENV 변수에 따른 설정값을 사용합니다.( 지정한 값이 없다면 development 가 default로 사용됩니다. )

기본값은 아래와 같습니다. 환경에 맞게 파일내용을 수정해 주십시오.
```
{
  "connectionLimit" : 5,
  "host"      : "localhost",
  "port"      : 3306,
  "user"      : "rainbow",
  "password"  : "1q2w3e",
  "database"  : "rainbow"
}
```

### 서버 설정 수정

서버 설정값은 `Server/config/server.json` 파일에 기록되어 있습니다.

```
{
  "port" : 80,  //포트번호 ( 기본값 80 )
  "sessionBaseKey" : "1234567890abcdefhijklmnopqrstuvw",  //세션토큰 생성시 사용할 키 값
  "passwordSecretKey" : "1234567890abcdefhijklmnopqrstuvw"  //패스워드 암호화 에 사용할 키 값
}
```

키 값은 32자 이내의 숫자,영문자 혼용으로 지정이 가능합니다.
실제 사용시에는 기본값으로 주어지는 키 대신 다른값을 사용해 주십시오.

실행
================

    $ cd ~/Rainbow_Server/Server && node server.js

테스트
================

    $ cd ~/Rainbow_Server/Server && npm test
    
* 테스트 시 Database에 데이터를 기록하고 삭제하는 과정이 포함되어 있습니다. 개발환경 에서만 사용해 주십시오.
