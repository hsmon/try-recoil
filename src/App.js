import React, {useState, useCallback} from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback,
} from "recoil";

function App() {
  return (
    <RecoilRoot>
      <CounterButton />
      <AlertButton />
      <RoughButton />
    </RecoilRoot>
  )
}

const counterState = atom({
  key: "counterState",
  default: 0
})

const CounterButton = () => {
  const [count, setCount] = useRecoilState(counterState)
  return (
    <p>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </p>
  )
}

const AlertButton = () => {
  const showAlert = useRecoilCallback(async ({getPromise}) => {
    const counter = await getPromise(counterState)

    console.log(counter)
  },[])

  return (
    <p>
      <button onClick={showAlert}>Show Counter State</button>
    </p>
  )
}

const roughCounterState = selector({
  key: "roughCounterState",
  // getはそのSelectorの値を計算する関数
  get: ({ get }) => Math.floor(get(counterState) / 10), // useRecoilValue(roughValue)
  set: ({ set }, newValue) =>{
    console.log(newValue)
    return set(counterState, newValue * 10);
  }, // useSetRecoilState(setRoughValue)
});

const RoughButton = () => {
  // const roughValue = useRecoilValue(roughCounterState)
  const [roughValue, setRoughValue] = useRecoilState(roughCounterState)
  return (
    <p>
      <button onClick={() => setRoughValue((c) => c + 1)}>{roughValue}</button>
    </p>
  );
}

export const useGlobalCounter = () => {
  const [counter, setCounter] = useRecoilState(counterState)
  const increment = useRecoilCallback(()=> {
    setCounter(c => c + 1)
  },[])
  return [counter, increment]
}

export default App;
