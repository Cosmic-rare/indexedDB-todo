import { useState } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import Dexie from "dexie"

const db = new Dexie("sampleDatabase")
db.version(1).stores({
  tasks: "++id, title, done"
})

const TaskItem = (props) => {
  const { task } = props

  return (
    <li 
    key={task.id}
    style={{
      cursor: "pointer"
    }}
    onClick={() => {
      db.tasks
        .where({
          id: task.id
        })
        .modify((f) => {f.done = !f.done})
    }}
  >
    <span
      onClick={() => {db.tasks.where({id: task.id}).delete()}}
      style={{marginRight: 6}}
    >
      {"🗑️"}
    </span>
    {task && task.done ? "👌" : "👋"}{" "}
    <span
      style={task.done ? {
        textDecoration: "line-through"
      } : {}}
    >
      {task.title}
    </span>
  </li>)

}

const App = () => {
  const [title, setTitle] = useState("")

  const onHandleSubmit = () => {
    db.tasks.add({
      title: title,
      done: false
    })
    setTitle("")
  }

  const tasks = useLiveQuery(
    () => db.tasks.toArray()
  )

  return (
    <div>
      <h2>ToDo</h2>

      <input
        value={title}
        style={{
          marginRight: 8
        }}
        onChange={(e) => {
          setTitle(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            onHandleSubmit()
          }
        }}
      />

      <button onClick={onHandleSubmit}>Create</button>

      <ul style={{listStyle: "none"}}>
        {tasks?.map(task => <TaskItem key={task.id} task={task} />)}
      </ul>

    </div>
  )
}

export default App
