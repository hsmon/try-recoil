import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

function App() {
  return (
    <RecoilRoot>
      <TodoList />
    </RecoilRoot>
  )
}

const todoListState = atom({
  key:'todoListState',
  default: []
})

function TodoList() {
  const todoList = useRecoilValue(todoListState)

  return (
    <>
      {/* <TodoListStats /> */}
      {/* <TodoListFilters /> */}
      <TodoItemCreator />
      {todoList.map(todoItem => (
        <TodoItem item={todoItem} />
      ))}
    </>
  )
}

function TodoItemCreator() {
  const [inputValue, setInputValue] = React.useState('')
  const setTodoList = useSetRecoilState(todoListState)

  const addItem = () => {
    setTodoList( oldTodoList => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      }
    ])
  }

  const onChange = ({target: {value}}) => {
    setInputValue(value)
  }

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  )
}

let id = 0
function getId() {
  return id++
}

function TodoItem({item}) {
  const [todoList, setTodoList] = useRecoilState(todoListState)
  const index = todoList.findIndex(listItem => listItem === item)

  const editItemText = ({target:{value}}) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value,
    })

    setTodoList(newList)
  }

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    })

    setTodoList(newList)
  }

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index)

    setTodoList(newList)
  }

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText}/>
      <input type="checkbox" checked={item.isComplete} onChange={toggleItemCompletion}/>
      <button onClick={deleteItem}>X</button>
    </div>
  )
}

function replaceItemAtIndex(array, index, newValue) {
  return [...array.slice(0, index), newValue, ...array.slice(index + 1)]
}

function removeItemAtIndex(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

export default App;
