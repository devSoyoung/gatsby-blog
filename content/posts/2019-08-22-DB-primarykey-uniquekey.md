---
title: "[DB] Primary Key와 Unique Index의 구분"
date: "2019-08-22"
template: "post"
draft: true
slug: "/posts/primarykey-vs-uniqueindex/"
description: "Database의 Primary Key와 Unique Index의 차이에 대해 정리한 글입니다."
category: "Database"
---

데이터베이스의 **Primary Key**와 **Unique Index**는 둘 다 값이 중복되지 않는다는 특성을 가지고 있어 다소 헷갈렸습니다. 이 두 가지를 명확히 구분하고 정리하고자 이 글을 작성하게 되었습니다.

## Primary Key
Primary Key(기본키)는 하나의 릴레이션(테이블)에서 튜플(행)을 유일하게 구별할 수 있는 속성을 의미합니다.

* Null 값을 가질 수 없다.
* 기본키로 정의된 속성에는 동일한 값이 중복되어 저장될 수 없다.

Primary Key는 위의 두 가지 특정을 가집니다. Null 값을 가지면 해당 속성으로 튜플을 구별할 수 없기 때문입니다.

## Index