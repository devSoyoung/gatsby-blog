---
title: "[MySQL] 터미널에서 sudo 없이 mysql 접속이 불가능 할 때"
date: "2019-07-10"
template: "post"
draft: false
slug: "/posts/mysql-sudo-login/"
description: "터미널에서 mysql을 실행할 때, sudo로만 로그인이 가능한 문제를 해결하는 방법에 대한 글입니다."
category: "Database"
tags:
  - "Database"
  - "Mysql"
---

터미널에서 mysql을 실행하니 다음과 같은 오류가 발생했습니다.

```
ERROR 1045 (28000): Access denied for user 'cutelee'@'localhost' (using password: NO)
```

패스워드를 사용하지 않은 문제인가 싶어서 `-p` 옵션을 주어 패스워드를 입력하고 접속을 시도해보았습니다. 그랬더니 이번에는 다음 메세지와 함께 동일한 오류가 발생했습니다.

```
ERROR 1045 (28000): Access denied for user 'cutelee'@'localhost' (using password: YES)
```

혹시나 하는 마음에 `sudo mysql -p` 로 시도하니 로그인에 성공했습니다. 왜 sudo로만 가능한지 궁금해서 구글링해본 결과 다음과 같은 답변을 발견했습니다.

```
Only the root user needs sudo requirement to login to mysql. 
I resolved this by creating a new user and granting access to the required databases:
	CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
	GRANT ALL PRIVILEGES ON database_name.* TO newuser'@'localhost';

now newuser can login without sudo requirement:
	mysql -u newuser -p
```
* 답변 링크 :  [Connect to mysql server without sudo - stackoverflow](https://stackoverflow.com/questions/37239970/connect-to-mysql-server-without-sudo)  

root 사용자만 sudo로 접속이 필요하기 때문에, 새로운 사용자를 만들어서 해당 사용자로 접속을 시도하면 패스워드만으로 접속이 가능하다는 답변이었습니다.

## 사용자 생성하기
```sql
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
```

## 권한 부여하기
```sql
GRANT ALL PRIVILEGES ON database_name.* TO newuser'@'localhost';
```

위 명령어를 입력하면 해당 데이터베이스에 대한 **모든 권한**을 사용자에게 부여하게 됩니다.