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
      <TodoListStats />
      <TodoListFilters />
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

const todoListFilterState = atom({
  key: "todoListFilterState",
  default: "Show All",
});

const filteredTodoListState = selector({
  key: "filteredTodoListState",
  get: ({get}) => {
    const filter = get(todoListFilterState)
    const list = get(todoListState)

    switch (filter) {
      case "Show Completed":
        return list.filter((item) => item.isComplete);
      case "Show Uncompleted":
        return list.filter((item) => !item.isComplete);
      default:
        return list
    }
  }
});

function TodoListFilters(){
  const [filter, setFilter] = useRecoilState(todoListFilterState)
  const updateFilter = ({target:{value}}) => {
    setFilter(value)
  }

  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show Uncompleted">Uncompleted</option>
      </select>
    </>
  );
}

const todoListStatsState = selector({
  key: "todoListStatsState",
  get: ({get}) => {
    const todoList = get(filteredTodoListState)

    const totalNum = todoList.length
    const totalCompletedNum = todoList.filter(item => item.isComplete).length
    const totalUncompletedNum = totalNum - totalCompletedNum
    const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum

    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted,
    };
  }
});

function TodoListStats() {
  const {
    totalNum,
    totalCompletedNum,
    totalUncompletedNum,
    percentCompleted,
  } = useRecoilValue(todoListStatsState)

  const formattedPercentCompleted = Math.round(percentCompleted * 100)

  return (
    <ul>
      <li>Total items: {totalNum}</li>
      <li>Items completed: {totalCompletedNum}</li>
      <li>Items not completed: {totalUncompletedNum}</li>
      <li>Percent completed: {formattedPercentCompleted}</li>
    </ul>
  );
}

export default App;
