---
title: Rest API의 UnderFetching, OverFetching
date: "2019-06-26"
template: "post"
draft: false
slug: "/posts/underfetching-overfetching/"
description: "rest API의 underfetching, overfetching 개념에 대해 정리한 글입니다."
category: "WEB"
---

[Apollo Client에 관한 글](https://d2.naver.com/helloworld/4245995)을 읽던 중, Rest API의 underfetching, overfetching이라는 개념이 등장해, 해당 개념에 대해 보다 명확한 정리를 하기 위해 이 글을 작성하게 되었습니다.

* **관련 글** : [React에서 Apollo Client 사용하기](bear://x-callback-url/open-note?id=2689D991-68A0-431C-8FB4-E109DD003F95-1462-00000A4861198497)

- - - -

## 어디서 이 단어를 보게 되었을까
Apollo Client는 [graphql](bear://x-callback-url/open-note?id=E3F3AFDD-90F7-4DD4-9FA1-C0222F5AC55A-1462-00001304B8AE5449)을 프론트엔드에서 보다 편리하게 적용할 수 있도록 해주는 툴입니다. Apollo Client에 관련된 내용을 검색하다보니, 공통적으로 나오는 이야기가 있었습니다. 

**널리 사용되고 있는 Restful API의 under-fetching, over-fetching 문제를 해결해주는 API 설계구조**라는 것입니다. under-fetching, over-fetching이 무엇을 말하는지 궁금했습니다.

## UnderFetching과 OverFetching
fetching이라는 것은 가져온다는 것, 즉 API 요청을 통해 필요한 데이터를 가져오는 것입니다. `under`/`over`라는 접두어로 덜, 혹은 과하게 가져온다는 것이라고 대강 예상해보았습니다.

### UnderFetching
하나의 endpoint로 필요한 모든 데이터 요청을 처리하지 못한다는 의미입니다. 여러 번의 API 호출이 필요하므로 요청 횟수가 증가한다는 문제가 있습니다.

SNS 어플을 켰을 때, 타임라인을 보여주기 위해서 알림 정보, 사용자 정보, 타임라인 등 각 정보를 가져올 수 있는 API를 여러 번 요청하는 것을 예시로 들 수 있습니다.

### OverFetching
endpoint로 요청하여 응답 받은 정보가 사용하지 않을 불필요한 데이터를 담고 있는 경우를 말합니다. 필요없는 데이터를 전송하기 때문에 네트워크 낭비가 일어납니다.