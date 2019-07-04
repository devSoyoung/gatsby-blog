---
title: node-gyp rebuild 오류 해결과정
date: "2019-07-04"
template: "post"
draft: false
slug: "/posts/node-gyp-rebuild-error/"
description: "scrypt를 npm으로 설치하는 과정에서 겪었던 node-gyp rebuild 오류 해결 과정을 정리한 글입니다."
category: "Error"
tags:
  - "error"
---

얼마 전, 새로운 회사에서 인턴을 시작하게 되었습니다. 또 다시 공포의 개발환경 구축 시간이 찾아왔습니다. 설치, 설정 과정에서 워낙 오류가 자주 발생하는 편이라 개발환경 구축하는 시간을 제일 두려워합니다. 물론, 새로운 것을 많이 배울 수 있는 좋은 시간이기는 합니다.

## 어떤 오류가 발생했는가
`npm install`로 필요한 라이브러리를 설치할 때 `scrypt`가 프로젝트에 포함되어 있었는데 이 라이브러리의 설치 과정에서 오류가 발생했습니다.

에러가 발생한 지점은 `node-gyp rebuild` 명령어를 실행했을 때 였습니다. 발생한 오류는 총 **2가지**입니다. 하나를 해결하니 또 다른 에러가 발생하더군요ㅎㅎ

아래에 두 가지 에러의 종류와 해결 과정을 정리해보았습니다. 같은 에러로 고통받는 분들께 도움이 되었으면 좋겠습니다. Mac OS 기준입니다.

### 첫 번째 오류 : Python version

```
node-gyp rebuild

gyp ERR! configure error
gyp ERR! stack Error: Command failed: /Users/cutelee/anaconda3/bin/python -c import sys; print “%s.%s.%s” % sys.version_info[:3];
gyp ERR! stack   File “<string>“, line 1
gyp ERR! stack     import sys; print “%s.%s.%s” % sys.version_info[:3];
gyp ERR! stack                                ^
gyp ERR! stack SyntaxError: invalid syntax
gyp ERR! stack
gyp ERR! stack     at ChildProcess.exithandler (child_process.js:281:12)
gyp ERR! stack     at emitTwo (events.js:126:13)
gyp ERR! stack     at ChildProcess.emit (events.js:214:7)
gyp ERR! stack     at maybeClose (internal/child_process.js:915:16)
gyp ERR! stack     at Socket.stream.socket.on (internal/child_process.js:336:11)
gyp ERR! stack     at emitOne (events.js:116:13)
gyp ERR! stack     at Socket.emit (events.js:211:7)
gyp ERR! stack     at Pipe._handle.close [as _onclose] (net.js:561:12)
```

에러 메세지를 보고 python과 관련된 문제임을 추측했습니다. 구글링 해본 결과, python 2.7 버전을 사용하라는 의견이 있어 해당 버전으로 변경 후 다시 설치를 시도했습니다. 여전히 오류가 발생했지만, 이전과 다른 오류메세지를 보고 해당 문제를 해결했음을 알 수 있습니다.

node-gyp 라이브러리의 [git](https://github.com/nodejs/node-gyp#on-macos)에 있는 README를 보니 3.x버전은 추천하지 않는다고 적혀있었습니다.

### 두 번째 오류 : command-line tool
```
node-gyp rebuild

(...)

No Xcode or CLT version detected!
```

Xcode나 CLT가 감지되지 않았다는 새로운 에러가 발생했습니다. 구글링 하면서 찾은 [글](https://github.com/nodejs/node-gyp/issues/773)에 이미 이 내용과 관련된 글을 읽어서 [Xcode를 설치](http://osxdaily.com/2014/02/12/install-command-line-tools-mac-os-x/)하여 금방 오류를 해결할 수 있었습니다.