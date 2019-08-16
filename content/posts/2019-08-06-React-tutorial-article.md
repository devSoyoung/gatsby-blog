---
title: "[번역] React Tutorial: Components, Hooks, and Performance"
date: "2019-08-06"
template: "post"
draft: false
slug: "/posts/react-tutorial-article/"
description: "React Tutorial: Components, Hooks, and Performance article을 번역한 글입니다."
category: "React"
tags:
  - "React"
  - "Frontend"
---

* 원글 출처 : [React Tutorial: Components, Hooks, and Performance](https://www.toptal.com/react/react-tutorial-pt2)

[First part of our React tutorial](https://www.toptal.com/react/react-tutorial-pt1)에서 지적된 바와 같이, React로 프로젝트를 시작하는 것은 비교적 쉽습니다. Create React App(CRA)를 사용해서 새 프로젝트를 초기화하고 개발을 시작합니다. 슬프게도 시간이 지날수록 코드를 유지하기 어려운 상황을 만날 수 있고, React가 처음이라면 더더욱 그럴겁니다. 컴포넌트가 불필요하게 커지거나, 컴포넌트가 될 수 있지만 그렇게 하지 않은 요소로 될 수 있습니다. 결국 여기저기에 반복된 코드를 사용하게 될 수 있습니다.

그곳이 당신이 React 여정을 시작하기 위해 노력해야 하는 지점입니다. ㅡ React의 방식으로 생각하는 것으로.

새로운 앱이나 React 애플리케이션으로 전환해야 할 필요가 있는 설계에 접근할때마다, 당신의 스케치에 어떤 컴포넌트가 있어야 할지, 관리하기 쉽게 스케치를 어떻게 쪼갤 수 있을지, 어떤 요소가 반복되어야 할지 먼저 결정하세요. “나중에 유용할”지도 모르는 코드를 추가하는 것을 최대한 피하세요. ㅡ 구미가 당길지는 모르나, 그 미래가 영원히 오지 않을 수 있고, 당신은 수많은 설정 가능한 옵션을 가진 그 여분의 일반적인 함수/컴포넌트를 유지하게 될 것입니다.

![image](https://uploads.toptal.io/blog/image/129144/toptal-blog-image-1550483251362-76ef921666d84b4f8437e4865414ebd6.png)

또한, 컴포넌트의 길이가 window 높이의 2-3배 보다 길다면, (가능하다면) 분리할 가치가 있을 것입니다. ㅡ 나중에 읽기가 더 쉬워집니다.

## Controlled vs. Uncontrolled Components in React
대부분의 애플리케이션에서 무언가를 입력하게 해주고, 파일을 업로드하고, 영역을 선택하는 등의 입력과 사용자와의 상호작용 형식의 필요성이 있습니다. React는 두 가지의 구별되는 방식으로 사용자 상호작용을 다룹니다. ㅡ controlled와 uncontrolled 컴포넌트입니다.

이름에서 제안하듯이, controlled components의 가치는 사용자와 상호작용 하는 element로 값을 제공함으로써 React에 의해 제어된다는 것입니다. 반면에 uncontrolled elements는 value 속성을 가지지 않습니다. 우리가 React state에 발생하는 하나의 원천(=store)을 가지고 있는 덕에 우리가 보고 있는 것과 우리의 state에서 현재 가지고 있는 것에 불일치가 없습니다. 개발자는 form의 사용자 상호작용에 응답할 함수를 전달하는 것이 필요하고, 그 함수는 form의 상태를 변경할 것입니다.

```js
class ControlledInput extends React.Component {
 state = {
   value: ""
 };

 onChange = (e) => this.setState({ value: e.target.value });

 render() {
   return (
     <input value={this.state.value} onChange={this.onChange}/>
   );
 }
}
```

React의 uncontrolled components에서 우리는 값의 변화를 신경쓰지 않지만 정확한 값을 알고싶다면 ref를 통해서 간단하게 접근합니다.

```js
class UncontrolledInput extends React.Component {
  input = React.createRef();
   
  getValue = () => {
    console.log(this.input.current.value);
  };
  
  render() {
    return (
      <input ref={this.input} />
    );
  }
}
```

그래서 어떤 것이 언제 쓰어야 할까요? 저는 controlled components는 대부분의 경우 적절한 방법이지만,  몇 가지 예외가 있다고 말할 것입니다. 예를 들어 React에서 uncontrolled components를 사용해야 하는 경우는 file 형식의 input이 필요한 때입니다. 이 입력값은 읽기 전용이며, 프로그래밍적으로 설정될 수 없기 떄문입니다(사용자 입력이 필요합니다). 또한, controlled components가 읽고 작업하기 더 쉽다는 것을 알게 되었습니다. controlled components의 유효성 검사는 rerender에 기반하고, state는 변경될 수 있으며, 우리는 입력에 대해 무언가 잘못되었음(예: 형식이나 값이 비었음)을 쉽게 표시할 수 있습니다.

## Refs
우리는 이미 `refs`에 대해 언급했는데, `refs`는 16.8 버전에서 hooks가 등장하기 전까지 class components에서 사용 가능한 특별한 기능입니다. 

Refs는 reference를 통해 (ref를 첨부하는 타입에 따라) 개발자가 React Component나 DOM 요소에 접근할 수 있게 해줍니다. `ref` 사용을 피하고 반드시 필요한 경우에만 사용하는 것은 좋은 방법으로 여겨졌습니다. `ref`를 사용하는 것이 코드를 다소 읽기 어렵게 만들고 위에서 아래로 데이터가 전달되는*(top-to-bottom data flow)* 방식을 벗어나기 때문입니다. 그러나, 특히 DOM 요소에서 `ref`가 필요한 경우(예: focus를 코드적으로 옮겨야 할 때)가 있습니다. React component 요소에 ref를 붙이면 붙인 요소 내에서 자유롭게 method를 사용할 수 있습니다. 여전히 이 방법은 이것을 처리할 더 나은 방법이 있기 때문에 피해야 한다고 여겨집니다. (예: state를 끌어올리고, 함수를 부모 요소로 이동합니다.)

또한 Refs는 수행될 수 있는 세 가지의 다른 방식이 있습니다:

* string 문자열을 사용하는 방법(legacy이고 피해야 할 방식입니다.)
* ref 속성에 설정되는 callback 함수를 사용하는 방법
* `React.creteRef()`를 사용해서 ref를 생성하고, class의 속성에 연결해서 이 속성을 통해 접근하는 방법(references는 componentDidMount lifecycl에서부터 사용 가능한 것으로 알려져 있습니다.)

