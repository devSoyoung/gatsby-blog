---
title: "[React] Selector Pattern과 Reselect"
date: "2019-08-06"
template: "post"
draft: false
slug: "/posts/selector-pattern-and-reselect/"
description: "React에 Selector 패턴을 적용했을 때의 장점과 reselect 라이브러리에 대해 정리한 글입니다."
category: "React"
---

개발중인 react-native 프로젝트에 redux와 redux-saga를 적용하게 되었습니다. 컴포넌트로부터 데이터 로직을 분리해서 더 관리하기 좋은 코드를 만들기 위함이었습니다.

프로젝트에 redux를 도입하면서 아래와 같은 절차로 데이터 요청을 수행했습니다.
1. 컴포넌트의 `ComponentDidMount`에서 `FETCH_DATA` 액션을 dispatch하면 saga에서 해당 액션을 take합니다.
2. saga에서 API 요청을 수행합니다. 
3. `FETCH_DATA_SUCCESS` 액션을 dispatch해서 가져온 데이터를 store에 저장합니다.

이 상황에서 컴포넌트가 가져온 데이터를 그대로 사용하거나 일부만 사용할 때에는 별로 어려움이 없었습니다. 하지만, 요청한 데이터를 조합해서 새로운 형태로 가져오거나 계산이 필요한 경우 어디에서 해당 작업을 수행할지를 결정하기가 애매했습니다.

찾아보니 오늘 글에서 소개할 selector 패턴을 통해 이 문제를 효율적으로 해결할 수 있었습니다. 오늘 글에서는 selector 패턴과 이 패턴을 더욱 효율적으로 적용할 수 있는 reselect 라이브러리에 대해서 소개하겠습니다. 

## Selector
[이 글](https://godsenal.github.io/2018/07/25/Redux-selector-%ED%8C%A8%ED%84%B4%EA%B3%BC-reselect/)에서 store에 저장하는 액션을 `setter`, selector를 `getter`에 비유해주셨습니다. 쉽게 이해되는 비유라고 생각합니다. 

**selector**는 store에 저장된 state에서 필요한 데이터를 선별적으로 가져오거나, 계산을 수행해서 원하는 형태의 데이터를 가져오는 일을 합니다.

A 컴포넌트와 B 컴포넌트에서 동일한 API를 요청해서 서로 다른 형태로 데이터를 가져온다고 가정해봅시다. A 컴포넌트에서는 결과 중 일부를 계산해서 사용해야 하고, B 컴포넌트에서는 응답받은 결과를 그대로 사용합니다.

```
{
  A_COMP: {
    
  },
  B_COMP: {
  
  },
  // ...
}
```

A 컴포넌트에 대해서만 고려하고 응답 결과를 원하는 형태로 계산해 store에 저장하면 이후 B 컴포넌트를 개발할 때, 원래의 응답 결과를 그대로 사용하기 위해 store에 또 다른 필드를 추가해서 사용해야 합니다. 

이런 컴포넌트가 여러개 생긴다면 store에 저장되는 데이터들이 늘어나고 관리가 어려워질 것입니다.

**selector pattern**을 사용하면 응답 결과는 store에 저장하고 컴포넌트에 필요한 데이터 계산은 selector에게 맡기기 때문에 store를 좀 더 효율적으로 관리할 수 있습니다.

### Selector Example
좀 더 쉬운 이해를 위해서 간단한 예제를 준비했습니다.

FETCH 액션을 dispatch하면 설문(poll) 목록을 가져오는 API를 요청하고 그 결과를 store의 poll에 저장하는 상황을 예시로 들어보겠습니다. `MyComponent`에서는 끝나지 않은 설문(`!poll.is_done`)만을 가져와서 컴포넌트에 제공하고 싶습니다.

> **[주의]** 아래 예제에서 rootReducer 등 redux의 기본적인 예제까지 추가하지는 않았습니다. rootReducer에서 아래의 pollReducer를 combineReducer()로 합쳐서 사용하는 부분은 생략되어 있습니다!

```js
// pollReducers.js
import { createAction, handleActions } from 'redux-actions';
export const actions = {
  FETCH_POLL: '@poll/FETCH_POLL',
  FETCH_POLL_SUCCESS: '@poll/FETCH_POLL_SUCCESS',
};

export const creators = {
  fetchPoll: createAction(actions.FETCH_POLL),
  fetchPollSuccess: createAction(actions.FETCH_POLL_SUCCESS, payload => payload),
};

export const initialState = {
  polls: [],
};

export default pollReducer = {
  [actions.FETCH_POLL_SUCCESS]: (state, action) => ({
    ...state,
    polls: action.payload
  }),
};
```

```js
// selector.js
import { initialState } from './pollReducers';
export const getNotDonePoll = state => {
  if (!state.poll || !state.poll.polls) {
    return initialState.polls;
  }
  return state.poll.polls.filter.map(poll => !poll.is_done);
}
```

```js
// MyComponent.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from './pollReducers';
import { getNotDonePoll } from './selector';

class MyComponent extends Component {
  componentDidMount() {
    const { fetchPoll } = this.props;
    fetchPoll();
  }
  render() {
    return (
      // ..
    );
  }
}

const mapStateToProps = state => ({
  polls: getNotDonePoll(state),
});

const mapDispatchToProps = dispatch => ({
  fetchPoll: () => dispatch(actions.FETCH_POLL),
});

export default connect(
)(MyComponent);
```

컴포넌트에서 props로 store의 값을 가져올 때, 만들었던 selector를 통해 가져오면 state에서 필요한 값만 가져오거나 원하는 형태로 계산해서 가져올 수 있게 됩니다. 컴포넌트마다 다른 형태로 값을 가져오더라도 selector만 관리하면 되기 때문에 store를 깨끗하게 관리할 수 있어요 :)

하지만 저렇게 selector를 사용하면 state가 변경될 때마다 selector 함수가 매번 실행됩니다. 매 state 변경마다 계산을 수행한다면 많은 데이터를 다룰 때에는 성능 상의 이슈가 발생할 수 있습니다. 

## Reselect

이 문제를 해결해주는 것이 바로 **reselect**입니다. 

![Reselect_Image](https://miro.medium.com/max/2000/1*tKjjA3uxJKeirjYf_Ep7tw.jpeg)

Reselector는 위의 selector 역할을 수행하면서 캐싱을 통해 동일한 계산을 방지해서 성능을 향상해줍니다. 파라미터로 전달받은 값이 이전과 같다면, 새롭게 계산하지 않고 저장된 결과 값을 돌려줍니다.

```js
import { createSelector } from 'reselect';
import { initialState } from './friend.reducer';

const selectFriend = state => state.friend || initialState;
const getSearchedFriends = createSelector(
  selectFriend,
  friendState =>
    friendState.friends.filter(item => 
      item.username.includes(friendState.friendSearchInputText),
    ),
);

export default { getSearchedFriends };
```

> `selectFriend`는 state에 friend 값이 있으면 반환하고, 없으면 friend의 초기상태를 반환하도록 예외처리를 고려해서 추가된 코드입니다.

reselect도 위에서 만든 selector처럼 state를 넣어주고, state를 가공할 콜백을 전달하면 됩니다. 이렇게 만든 reselect 함수를 컴포넌트에서 import 하여 `mapStateToProps`에서 state를 전달해 사용하면 됩니다.

지인 중 React 전문가 한 분께 여쭤보았더니 다음과 같은 경우 reselctor 도입을 고려해보면 좋을 것 같다고 말씀해주셨습니다.

1. 데이터가 많아 캐싱이나 최적화가 필요하다.
2. 테스트 코드를 짜서 테스트를 용이하게 하고 싶다.
3. 필요한 데이터를 주는 로직이 전부 다 서버내 구현되어 있지 않다.
4. 받아온 데이터를 처리해야 할 로직이 많다.
5. 서버자원을 조금 아끼고싶다.
  ex) 데이터 일정 부분 필터링, 기존 데이터 값에서 새로운 값을 계산해서 반환(환율 계산)
4. 컴포넌트에서 데이터를 파싱하는 로직을 추가하기보단 파싱된 데이터를 받고 사용만하는 식으로 코드 분리를 하고싶다.

API로 가져온 데이터를 어떻게 처리해야 할지 고민된다면 selector pattern과 reselect에 대해 고려해보시면 좋을 것 같습니다. 아래에는 이 글을 작성하면서 참고했던 좋은 글들을 첨부했습니다. 시간 나실 때 함께 읽어보시면 좋을 것 같습니다 :)

## Reference
*  [redux + reselect](https://medium.com/@ljs0705/redux-reselect-490f9acc1090) 
* [Reselect를 이용하여 React와 Redux 최적화하기](http://guswnsxodlf.github.io/optimize-react-component-using-reselect)
* [Redux - Selector 패턴과 Reselect |   Godsenal’s Blog](https://godsenal.github.io/2018/07/25/Redux-selector-%ED%8C%A8%ED%84%B4%EA%B3%BC-reselect/)
* [What is a Redux selector? - Matthew Holman - Medium](https://medium.com/@matthew.holman/what-is-a-redux-selector-a517acee1fe8)