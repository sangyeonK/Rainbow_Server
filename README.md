## Rainbow_Server

Rainbow_Server 는 두툼-커플가계부(https://github.com/Nexters/Rainbow/) 의 네트워크 API 기능을 제공하는 어플리케이션 입니다.

필요사항
=============

* [nodejs](http://nodejs.org/)
* mysql or mariadb

설치
================

### 소스 다운로드

    $ git clone https://github.com/sangyeonK/Rainbow_Server
    
### npm package 설치

    $ cd Rainbow_Server/Server && npm install
    
### Database 생성

Database 생성 쿼리파일은 `./Server/schema/Rainbow_Server.sql` 에 위치하고 있습니다.

* mysql 혹은 mariaDB를 설치
* Database에 로그인: `mysql -uUsername -pPassword`
* Database 생성: `mysql> create database rainbow`
* Database 선택: `mysql> use rainbow`
* sql 파일 추출: `mysql> source ./Server/schema/Rainbow_Server.sql`

### Database 설정 수정

접속 Database 설정은 `./Server/common/mysql.js` 파일에 기록되어 있습니다.
기본값은 아래와 같습니다. 환경에 맞게 파일내용을 수정해 주십시오.
```
{
  connectionLimit : 5,
  host      : 'localhost',
  user      : 'rainbow',
  password  : '1q2w3e',
  database  : 'rainbow',
  charset   : 'utf8_general_ci'
}
```

### 포트번호 수정

포트번호는 `./Server/server.js` 파일의 `var port = 80;` 변수로 기록되어 있습니다.
기본값은 80 으로 되어 있으며 변경이 필요할 시 원하는 값으로 변경해 주십시오.

실행
================

    $ cd Server && node server.js
