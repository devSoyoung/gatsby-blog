---
title: "Redux와 Redux 미들웨어 - thunk, saga"
date: "2019-07-18"
template: "post"
draft: false
slug: "/posts/redux-middleware/"
description: "React의 상태관리 라이브러리인 Redux와 Redux의 미들웨어 thunk, saga에 대해 정리한 글입니다."
category: "React"
tags:
  - "React"
  - "Frontend"
---

대부분의 React 애플리케이션에서 Redux나 MobX 같은 상태관리 라이브러리를 사용합니다. 컴포넌트의 props와 state 만으로 상태를 관리하기엔 우리가 만드는 앱은 너무 복잡합니다. 그래서 저도 Redux를 사용했습니다. 

![image:7BD2BC16-DC63-46EE-9230-9AF75B1DC56A-48703-000195CE8972A47E/redux-example-css-tricks-opt.pg_.png](https://user-images.githubusercontent.com/42922453/61430954-c3e78880-a966-11e9-9faf-c2d8846ca70f.png)

## Redux
Redux는 Flux 패턴을 구현했습니다. MVC 패턴에서 모델과 뷰의 양방향 데이터 전달로 인해 발생하는 상태 관리의 어려움을 해결하고자 데이터의 흐름을 단방향으로 통일했습니다.

* **참고링크** : [Redux를 이해하자 - landvibe - Medium](https://medium.com/@ljs0705/redux%EB%A5%BC-%EC%9D%B4%ED%95%B4%ED%95%98%EC%9E%90-7c9e8de0ab7f)

![image:5B55B8BD-BBF6-44C4-9527-A79F8BB51C5E-48703-0001AE056D9272F9/999442465BA51F4D22.png](http://webframeworks.kr/tutorials/react/imgs/complex_mvc.png)

아래의 그림은 Flux 패턴을 검색하면 볼 수 있는 대표적인 그림입니다.

![image:6E9BA44A-CEA6-42B2-88A1-CF593FC8141D-48703-0001937EF415C032/flux-simple-f8-diagram-with-client-action-1300w.png](https://cdn-images-1.medium.com/max/1600/0*yL_sMDp3GiGb9CuE.png)

이 Flux 패턴을 그대로 적용하면 hot-reloading 할 때 기존의 상태와 이벤트 구독이 사라진다는 문제점이 있습니다. 이를 해결하기 위해 Redux에서는 Flux의 store가 가지고 있는 **상태 변환을 위한 로직**과 **현재 애플리케이션의 상태**를 분리해서 reducer를 만들고, reducer가 상태 변환 로직을 가지도록 합니다.

* **참고링크** : [핫 리로딩(hot reloading)과 시간 여행 디버깅(time travel debugging)이 도대체 무엇일까? - bestalign’s dev blog](https://bestalign.github.io/2015/10/27/redux-hot-reloading-and-time-travel-debugging/)

![image:E22EC3CC-E2FA-4D75-882A-EB7CE40800AE-48703-000193A5969AA995/JYrQR.png](https://blog.novoda.com/content/images/2018/03/redux-architecture-overview.png)

그래서 Redux는 이렇게 동작합니다. 변화가 일어나면 Action(type에 대한 정보를 가진 객체)을 만들고, (각 액션에 맞게 미리 정의해 둔) Reducer가 새로운 상태를 만들어 store를 갱신합니다. 컴포넌트(View)들은 store를 (`connect()`로) 구독하고 있다가 상태 변화를 반영합니다.

> Flux의 dispatcher는 Store의 dispatch 메소드로 제공됩니다.

액션을 만들고, 그에 맞는 리듀서를 정의해서 리덕스를 적용하는 것 자체는 사실 그렇게 복잡하지 않은 것 같습니다. 

### 일반적인 Redux 예제

```javascript
// userActions.js
export function loginSuccess(username) {
  return {
    type: 'LOGIN_SUCCESS',
    payload: {
      username,
    }
  }
};
```

```js
// userReducer.js
export const initialState = {
  isLogin: false,
  username: '',
};

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,		// es6 spread 문법
		isLogin: true,
        username: action.payload.username,
	  };
      
    default:
      return state;
	}
}

export default userReducer;
```

```js
// reducers.js
import { combineReducers } from 'redux';
import userReducer from './userReducer';
const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
```

```js
// store.js
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  {},		// initial state
);

export default store;
```

```js
// App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { loginSuccess } from './userActions';

class App extends React.Component {
  render() {
    const username = 'Lily';
    store.dispatch(loginSuccess(username));
    /* store.dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { username },
    }); */
    console.log(store.getState());
  
    return (
      <Provider store={store}>
        // components
      </Provider>
    );
  }
}
```

* [combineReducers · Redux](https://redux.js.org/api/combinereducers)

## Redux Middleware
하지만 API 요청, 비동기 작업과 관련된 상태 관리를 위해 미들웨어를 적용하면서 리덕스에 대한 어려움이 기하급수적으로 증가한다고 생각합니다. 

![image:C0AEED6F-5F56-43D9-B6E1-B61F65CB48FF-48703-000194BCD3EE5016/redux-architecture-overview.png](https://i.stack.imgur.com/JYrQR.png)

* **미들웨어** : dispatch() 메소드를 통해 store로 가고 있는 액션을 가로채는 코드
	* [Redux-Thunk vs Redux-Saga를 비교해 봅시다!](https://velog.io/@dongwon2/Redux-Thunk-vs-Redux-Saga%EB%A5%BC-%EB%B9%84%EA%B5%90%ED%95%B4-%EB%B4%85%EC%8B%9C%EB%8B%A4-)

API 요청을 하면 REQUEST 액션을 디스패치해서 로딩 아이콘을 띄우고, 요청에 대한 처리가 완료되면 결과에 따라 SUCCESS나 FAILURE 액션을 디스패치 하는 방식으로 많이 활용됩니다.

대표적인 미들웨어는 thunk, saga 두 가지가 있습니다. 각각 스타일이 약간 다릅니다. redux와 미들웨어를 동시에 적용하면서 혼란스러웠던 경험이 있기 때문에, 두 미들웨어의 스타일에 대해 정리하면서 혼란스러웠던 부분을 해결하고 싶었습니다.

## Redux-thunk
thunk 미들웨어는 객체가 아니라 함수를 반환하는 **액션 생성자**를 만들 수 있게 해줍니다. 특정 액션을 몇 초 후에 실행하거나, 현재 상태에 따라 액션이 실행되지 않게 할 수 있습니다.

```js
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

const increment = gap => {
  return {
    type: INCREMENT_COUNTER,
    payload: { gap }
  }
}

const incrementAsync = (sec, gap) => dispatch => {
  setTimeout(() => {
    dispatch(increment(gap));
  }, sec);
}
```

thunk에서 액션생성자는 필요한 값을 파라미터로 받아 **함수를 리턴**합니다. 클로저 패턴을 사용하기 때문에, 익숙하지 않다면 다소 코드가 낯설게 느껴질 수 있습니다. 저는 저 코드를 처음 봤을 때, Arrow 함수 자체에 익숙하지 않아 저 코드가 동작한다는 사실조차 신기했습니다. :P

```js
function incrementAsync(sec, gap) {
  return function(dispatch) {
    setTimeout(() => {
      dispatch(increment(gap));
    }, sec);
  }
}
```

조금 더 익숙한 형태의 코드로 쓰면 이렇게 됩니다. sec, gap을 return문에 정의된 function에서 사용하는 클로저 패턴입니다. 리턴 함수에서 getState로 현재 store의 상태를 받으면, store 상태에 따라 dispatch를 수행할지 여부도 결정할 수 있습니다.

```js
function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();
    if (counter % 2 === 0) {
      return;
    }​
    dispatch(increment());
  };
}
```

* **참고링크** : [React -redux thunk, redux saga](https://ideveloper2.tistory.com/53)

이 thunk 미들웨어의 문제점은 action에서 너무 많은 일을 한다는 점입니다. 액션생성자는 type과 payload가 담긴 **객체를 생성해서 반환**하는 역할을 수행하기로 했는데, thunk 미들웨어에서는 API 요청이나 비동기 처리가 껴서 본래 역할이 모호해집니다. 어떨 때는 객체를 반환하고, 어떨 때는 함수를 반환합니다.

> thunk 미들웨어와 관련된 더 자세한 내용은 [여기](https://codeburst.io/understanding-redux-thunk-6dbae0241817)를 참고해주세요.

## Redux-saga
saga 미들웨어는 **액션에 대한 리스너**입니다. thunk처럼 액션 생성자가 함수를 반환하지 않고 일관되게 객체를 반환하기 때문에, 그런 부분에서 오는 모호함이 해결됩니다. ES6에서 새롭게 등장한 제너레이터 문법을 사용하고 있어, 처음에 좀 낯설게 느껴졌습니다. 

```js
// saga.js
import { call, put, takeLatest } from 'redux-saga/effetcs';
import axios from 'axios';

// api
const RequestApi = axios.create();
const signin = signinAccountData => {
  return RequestApi.post('/account/signin', { ...signinAccountData });
};


// Action Creator
const signinRequest = () => {
  return { type: 'ACCOUNT_SIGNIN_REQUEST' };
}
const signinSuccess = response => {
  return {
    type: 'ACCOUNT_SIGNIN_SUCCESS',
    payload: response,
  }
}
const signinFailure = error => {
  return { 
    type: 'ACCOUNT_SIGNIN_FAILURE', 
    payload: error,
  };
}


// Saga
export function* signin(action) {
  try {
    yield put(signinRequest());
    const response = yield call(signin, action.payload);
    yield put(signinSuccess(response));
  } catch (error) {
    yield put(signinFailure(error));
  }
}

export const accountSagas = [
  takeLatest('ACCOUNT_SIGNIN_INDEX', signin),
];
```

put, call, takeLatest 외에도 몇 가지 미들웨어에서 제공하는 메소드가 있습니다. 위 코드에 나온 메소드만 간략하게 정리했습니다. 더 자세한 내용은 [이 글](https://gracefullight.dev/2017/12/06/Why-redux-saga/)의 2-3 부분을 보시면 도움 될 것 같습니다.

* `put` : 액션을 호출하는 `dispatch()`의 역할을 수행합니다.
* `call` : Function.prototype.call() 함수와 같습니다.
* `takeLatest` : 액션 호출시에 같은 액션이 실행 중이면 그 액션은 파기되고 마지막 호출만 실행됩니다. POST, PUT, DELETE 같은 리소스 변경 메소드에 사용합니다.
* `takeEvery` : `takeLatest`와 다르게 모든 액션마다 실행됩니다. GET 메소드에 사용합니다.

이렇게 생성한 Saga는 store를 생성할 때, 연결하고 listen을 수행하도록 실행시켜주면 됩니다.

```js
// rootSaga.js
import { all } from 'redux-saga/effects';
import { accountSagas } from './account/account.saga';

export default function* rootSaga() {
  yield all([...accountSagas]);
}
```
`all()`은 `Promise.all()`과 같습니다. yield 구문은 순차적으로 실행되기 때문에, 여러 개의 사가를 동시에 수행할 수 있도록 하기 위해 `all()` 메소드를 사용합니다.

```js

```

*** 
## Reference
* https://orezytivarg.github.io/from-redux-thunk-to-sagas/