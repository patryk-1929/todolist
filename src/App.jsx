import {useEffect, useState} from 'react'
import { databases,ID, DATABASE_ID, COLLECTION_ID } from './appwrite'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)

  const getTodos = async () => {
    try {
      setLoading(true)

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      )

      setTodos(response.documents);

    } catch (error) {
      console.error('Błąd pobierania TODO: ', error)

    } finally {
      setLoading(false)
    }
  }

const addTodo = async(event) => {
event.preventDefault()
if (!newTodo.trin()) return;
try{

const createTodo = await databases.createDocument(
  DATABASE_ID,
  COLLECTION_ID,
  ID_unique(),
  {
title: newTodo
  }

)

setTodos((prevTodo) => [createTodo, ...prevTodo])

setNewTodo('')

} catch(error){

  console.error("Bląd przy dodawaniu TODO: ", error)
}

}


const deleteTodo = async (id) => {
  try{

await databases.deleteDocument(
  DATABASE_ID,
  COLLECTION_ID,
  id
)

alert('KLIK')

setTodos(prevTodo => prevTodo.filter((todo) => todo.$id !== id))



  } catch(error){

console.error("Błąd usuwania TODO ", error)

  }
}


  useEffect(() => {
    getTodos()
  }, [])

  return (
    <>
      <div className="app">
        <section className="todo-box">
          <h1>Lista TODO</h1>

        {/* {/*FORM} */}

<form onSubmit={addTodo} className="todo-form">
  <input 
  type="text"
  placeholder="Dodaj nowe zadanie..."
  value={newTodo}
  onChange={(event) => setNewTodo(event.target.value)}
  />
  <button type="submit">
    Dodaj
  </button>
</form>



        { loading ? (
        <p>Ładowanie zadań...</p>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <p>Brak zadań.</p>
          ) : (
            todos.map((todo) => (
              <li key={todo.$id} className="todo-item">
                <span>{todo.title}</span>
                <button type="button" onClick={() => deleteTodo(todo.$id)}>
                    Usuń
                </button>
              </li>
            ))
          )
          }
        </ul>
      ) }

        </section>
      </div>
    </>
  )
}

export default App
