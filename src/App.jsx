import {useEffect, useState} from 'react'
import { databases,ID, DATABASE_ID, COLLECTION_ID, storage, BUCKET_ID} from './appwrite'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)

  const getImageUrl = (imageId) => {
    return storage.getFileView(BUCKET_ID, imageId)
  }

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
if (!newTodo.trim()) return;
try{

  let imageId = ''

  if (image) {
    const uploadedImage = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      image
    )
    imageId = uploadedImage.$id
  }



const createTodo = await databases.createDocument(
  DATABASE_ID,
  COLLECTION_ID,
  ID.unique(),
  {
title: newTodo,
 imageId 
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
if(todo.imagId){
  await storage.deleteFile(BUCKET_ID, todo.imageId)
}

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

  <input
  type="file"  
  accept ="image/*"
  onChange={(event) => setImage(event.target.files[0])}
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
                <div className="todo-content">
                  {todo.imageId && (
                    <img src={getImageUrl(todo.imageId)} alt="Todo" className="todo-image"
                    />
                  )}
                <span>{todo.title}</span>
                <button type="button" onClick={() => deleteTodo(todo.$id)}>
                    Usuń
                </button>
                </div>
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
