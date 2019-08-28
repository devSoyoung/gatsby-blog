---
title: "[React] Hooks 이해하기: useState, useEffect"
date: "2019-08-28"
template: "post"
draft: false
slug: "/posts/react-hooks-1/"
description: "React의 새로운 API인 Hooks가 무엇이며 왜 등장하게 되었는지에 대해 간략히 정리했습니다. 덧붙여서 내장 Hooks인 useEffect와 useState의 예제 코드도 함께 정리했습니다."
category: "React"
---

![hooks_title_image](https://miro.medium.com/max/3280/1*FqE6fY4CpEg7soZ4IPoWdQ.jpeg)

Hooks는 [React v16.8](https://www.youtube.com/watch?v=dpw9EHDh2bM)에 새롭게 도입된 기능입니다. **함수형 컴포넌트에도 state를 제공**하는 API 입니다. 그 동안 어떤 기능인지 살펴보는 것을 미루고 있었는데, 근래의 `create-react-app`이나 보일러 플레이트에서 함수형 컴포넌트를 기본으로 하는 것을 보고 *'이제는 공부해봐야겠다'*는 생각이 들어서 정리하게 되었습니다 👻

## 😱 Before Hooks..

Hooks는 함수형 컴포넌트에 state를 제공함으로써 상태 관련 로직의 재사용을 이전보다 훨씬 쉽게 만들어줍니다. 그렇다면 Hooks가 나타나기 전, 우리는 **상태 관련 로직을 어떻게 재사용**했을까요?

React의 가장 기본이 되는 단위는 **컴포넌트**입니다. 그래서 우리는 공통된 로직을 분리해 하나의 컴포넌트로 만들었고, 재활용했습니다. React에 대해 어느 정도 익숙해지고 나면 듣게 되는 **HOC(Higher-Order Component)** 패턴이 바로 그 예시입니다. 

### HOC(Higher-Order Component)
HOC는 **input**으로 컴포넌트를 받아 **output**으로 컴포넌트를 반환합니다. 대부분의 React 프로젝트에서 사용하고 있는 Redux가 HOC 패턴으로 구현되었습니다.

```js
import { Component } from 'React';

export const Enhance = ComposedComponent => class extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }
  componentDidMount() {
    this.setState({ data: 'Hello' });
  }
  render() {
    return <ComposedComponent {...this.props} data={this.state.data} />;
  }
};
```

```js
import { Enhance } from "./Enhance";

class MyComponent {
  render() {
    if (!this.data) 
      return <div>Waiting...</div>;
    
    return <div>{this.data}</div>;
  }
}

export default Enhance(MyComponent); // Enhanced component
```

로직이 담긴 **Enhance 컴포넌트**로 **MyComponent**를 감싸서 공통된 로직을 **MyComponent나 또 다른 컴포넌트**로 전달할 수 있습니다.

> HOC나 컴포넌트에 대한 더 자세한 설명은 [이 글](https://medium.com/little-big-programming/react%EC%9D%98-%EA%B8%B0%EB%B3%B8-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90-92c923011818)을 참고해주세요.

### Render Props

또 다른 방법으로는 Render Props 패턴이 있습니다. 자주 사용되는 React Router 라이브러리가 이 패턴을 따라 구현되었습니다. 

Render Props 패턴으로 구현된 컴포넌트는 자체적으로 rendering 로직을 구현하는 대신 React element 요소를 반환하고 이를 호출하는 함수를 사용합니다. Render Props 패턴을 구현한 코드는 [여기](https://medium.com/@la.place/react-render-props-pattern-1c53a6b9645c)에서 확인할 수 있습니다.

> Render Props 패턴에 대한 더 자세한 설명은 [이 글](https://reactjs.org/docs/render-props.html)을 참고해주세요.

재사용 되는 로직을 함수로 분리한다는 것은 당연하게 느껴집니다. 하지만 지금까지 React에서 함수는 local state를 가질 수 없었기 때문에 위에서 본 것과 같이 복잡한 패턴(HOC, Render Props)을 사용해 왔습니다.

단지 로직의 재사용을 위해서 Component Tree에 또 하나의 depth가 추가되어야 한다니. **함수가 상태를 가질 수 있다면, 상태 로직을 재사용하는 방법을 보다 쉽게 바꿀 수 있지 않을까요?**

## 🧐 What Are Hooks?

Hook는 바로 이런 문제를 해결합니다. 내장된 Hooks(`useState`, `useEffect`)로 함수에 state, lifecycle 등을 제공합니다. Hook이라는 이름은 *함수에 state와 lifecycle을 끌고와서 넣어준다는 의미로 지은 것일까요?*

![gvsc_image](../image/gvsc_hooks.png)

Hooks는 **일반 JavaScript 함수**입니다. 그렇기 때문에, Hooks를 활용하는 Custom Hooks를 만들어서 상태를 가지는 로직을 함수로 쉽게 분리할 수 있습니다. Custom Hooks 자체가 React에서 지원하는 기능은 아니지만, Hooks가 디자인 된 방식을 통해 자연스럽게 사용이 가능해지는 것입니다.

## 🤩 Hooks API: useEffect, useState

Hooks가 제공하는 내장 API에는 useEffect와 useState가 있습니다.

### useState
함수에 state를 끌어오는 useState 입니다. initialState를 파라미터로 받고, state와 state를 변경할 수 있는 setState 함수를 반환합니다. 

```js
import { useState } from 'react';

const Example = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>{`count: ${count}`}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
};

export default Example;
``` 

useState가 반환하는 첫 번째 인자인 state와 두 번째 인자인 setState를 [비구조화 할당 문법](https://poiemaweb.com/es6-destructuring)을 통해 count, setCount로 받아서 사용할 수 있게 됩니다. **setCount로 state를 변경하면 렌더링이 다시 일어납니다.**

Example은 함수이기 때문에, **렌더링 할 컴포넌트 대신 값을 반환**해도 됩니다.

```js
import { useState } from 'react';

const useCount = (gap) => {
  const [count, setCount] = useState(0);
  
  const increaseCount = () => {
    setCount(count + gap);
  }
  
  const decreaseCount = () => {
    setCount(count - gap);
  }
  
  return {
    count,
    increaseCount,
    decreaseCount,
  }
}

export default useCount;
```

위 예제처럼 **Custom Hook**을 만들면 useCount를 원하는 컴포넌트에서 호출하고, count, increaseCount, decreaseCount를 받아서 사용할 수 있게 됩니다. gap을 다르게 해서 +1 버튼, +2 버튼, +3 버튼 등 원하는 만큼 마음껏 생성할 수 있습니다. 

increaseCount와 decreaseCount에서 setCount를 실행하기 때문에, 이 두 함수를 호출하면 렌더링이 다시 일어날 것입니다.

> **[주의]** use~는 Custom Hook의 naming rule입니다. 이 rule을 지키면 lint에서 hooks와 관련된 규칙들을 점검해줄 수 있기 때문에 따르는 것을 권장합니다. 

### useEffect

componentDidMount 등의 **Life Cycle API**는 useEffect로 사용할 수 있습니다. Life Cycle API에서 우리가 수행했던 API 요청, DOM 조작 등이 side effect이기 때문에, useEffect라는 이름의 API가 되었습니다.

클래스 컴포넌트에서의 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`는 **useEffect**로 실행됩니다. 

```js
function useEffect(effect: EffectCallback, inputs?: InputIdentityList)
```

render가 발생할 때마다 *(componentDidMount: 초기, componentDidUpdate: 매번)* **effect**가 실행됩니다.   두 번째 파라미터인 **inputs**를 통해 특정한 상태가 update 되었을 때만 effect가 실행되도록 설정해줄 수 있습니다.

```js
import { useState, useEffect } from 'react';

export function Data() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.getData()
      .then((response) => { setData(response) });
  }, []);

  const isLoading = (data == null);
  if (isLoading) {
    return 'Loading..';
  }
  return data;
}
```

위의 예제는 useEffect의 inputs에 빈 배열을 넘겨서 최초(componentDidMount)에만 실행되도록 하였습니다. **useEffect는 여러 개 사용될 수 있기 때문**에, 각 state 마다 정의해 줄 수도 있고, 예제처럼 최초에 실행되는 것만 정의해주어도 됩니다.

그렇다면 componentWillUnmount는 어떻게 실행될까요?

```js
useEffect(() => {
  window.addEventListener("mousemove", logMousePosition);
  return () => {
    window.removeEventListener("mousemove", logMousePosition);
  };
}, []);
```

effect 함수의 return 값이 있는 경우 hook의 cleanup 함수로 인식하고 다음 effect가 실행되기 전에 실행해줍니다. componentWillUnmount는 컴포넌트가 사라지기 전에 한 번만 실행했지만, cleanup 함수는 **새로운 effect 실행 전에 매번 호출**된다는 차이가 있습니다.

위의 예제에서는 inputs로 빈 배열을 넘겨주었기 때문에, unmount 될 때 한 번만 실행됩니다.

## 🤑 Hooks를 사용했을 때 얻는 이점

* **Functional Component**로 통일
* **Custom Hooks** : 보다 쉬운 상태 로직 재사용
* **useEffect** : 라이프 사이클 API에 흩어져 있던 로직 묶

Hooks는 HOC나 render-props 같은 패턴이 가져오는 Component Tree의 불필요한 중첩을 없애줄 수 있습니다. 복잡한 패턴을 적용하지 않고 보다 직관적으로 로직을 재사용할 수 있습니다.

뿐만 아니라 그간 함수형과 클래스형 두 가지 타입 *ㅡ상태가 있는 경우는 클래스형 컴포넌트로, 뷰만 관리하는 경우는 함수형 컴포넌트로 개발하는 등ㅡ* 을 오가면서 개발했던 것을 함수형 컴포넌트로 통일할 수 있습니다.

클래스형 컴포넌트에서 componentDidMount와 componentWillUnmount에 흩어져있던 관련 코드도 state 마다 묶을 수 있기 때문에 좀 더 연관성 있는 코드끼리 모을 수 있습니다.

## 🤗 글을 마무리하며

이번 글을 쓰면서 Hooks가 왜 필요한지 이해하기 위해 꽤 많은 글을 읽었습니다. 그 중 아래 Reference 첫 번째 글인 **Making Sense of React Hooks**가 많은 도움이 되었습니다.

미루고 미뤄왔던 Hooks에 대해 공부해서 뿌듯하지만, 이해하는데에 꽤 많이 시간이 걸렸다는 건 그 동안 상태 관련 로직을 재사용하는 것에 대해 그다지 고려해보지 않았다는 증거인 것 같아서 한편으로는 많이 반성하기도 했습니다. 

Redux나 React Router가 어떤 패턴으로 만들어졌는지에 대해서도 이번 글을 정리하면서 알게 되었는데, 앞으로는 라이브러리를 쓸 때에도 사용하는 것에만 급급하기보다는 어떤 방식으로 구현되었는지 관심을 가져야겠다는 생각이 들었습니다 :)

***
## Reference
* [Making Sense of React Hooks](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)
* [React의 기본, 컴포넌트를 알아보자](https://medium.com/little-big-programming/react%EC%9D%98-%EA%B8%B0%EB%B3%B8-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%A5%BC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90-92c923011818)
* [리액트(React) 이해 4 - Higher Order Component(HOC)로 컴포넌트 재사용 하기](https://www.vobour.com/%EB%A6%AC%EC%95%A1%ED%8A%B8-react-%EC%9D%B4%ED%95%B4-4-higher-order-component)
* [[React] Render Props Pattern](https://blog.naver.com/PostView.nhn?blogId=backsajang420&logNo=221325867683&categoryNo=77&parentCategoryNo=0)
* [React의 새로운 패러다임, React Hooks](https://velog.io/@vies00/React-Hooks)