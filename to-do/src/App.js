/* eslint-disable no-unused-vars */
import './App.css'


import { useState, useEffect } from 'react'
import { BsTrash,  BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs"

const API = "http://localhost:5000"


function App() {
    const [title, setTitle] = useState("")
    const [time, setTime] = useState("")
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(false)

    // Carregas as tarefas da pagina //
    useEffect(() => {

      const loadData = async() => {
        setLoading(true)

      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)// Retorna o valor em formato de objeto
        .catch((err) => console.log(err))

      setLoading(false)

      setTodos(res)
    }
    loadData()
    }, [])


    // Função para enviar a tarefa a ser realizada //
    const handleSubmit = async(e) => { 
      //async === Asyncrona ele envia para o back-end mas não sabe quando volta, ficara aguardando.
      e.preventDefault()

      const todo = {
        id: Math.random(),
        title,
        time,
        done: false,
      }

      await fetch(API + "/todos", {// formato da URL
        method: "POST", // Metodo de envio os dados
        body: JSON.stringify(todo),//Transforma as informações do front em string
        headers:{
          "Content-type": "application/json",
        },
      })
      //Atualização da lista toda vez que é inserido uma nova tarefa.
      setTodos((prevState) => [...prevState, todo])
      setTitle("")
      setTime("")
    }

    const handleDelete = async (id) => {
      await fetch(API + "/todos/" + id, {// formato da URL
        method: "DELETE", // Metodo de envio os dados
      })
      setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
    }

    const handleEdit = async (todo) => {
      todo.done = !todo.done

      const data = await fetch(API + "/todos/" + todo.id,{
        method: "PUT",
        body: JSON.stringify(todo),
        headers:{
          "Content-type": "application/json",
        },
        })
        setTodos((prevState) => 
        prevState.map((t) => (t.id === data.id ? (t = data) : t))
      )
    }

    if (loading) {
      return <p>Carregando...</p>
    }

    return ( 
      <div className="App">

        <div className="todo-header">
          <h1>React Todo</h1>
        </div>

        <div className="form-todo">
          <h2>Insira a sua próxima tarefa</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">              
              <label htmlFor="title">O que você vai fazer?</label>
              <input
               type="text" 
               name="title" 
               placeholder="Título da tarefa" 
               // Estou inserindo no titulo o valor que inseri no input //
               onChange={(e) => setTitle(e.target.value)} 
               value={title || ""} 
               required
               />
            </div>
            <div className="form-control">
              <label htmlFor="time">Duração:</label>
              <input
               type="text" 
               name="time" 
               placeholder="Tempo estimado (em horas)" 
               // Estou inserindo no titulo o valor que inseri no input //
               onChange={(e) => setTime(e.target.value)} 
               value={time || ""} 
               required
               />
            </div>
            <input type="submit" value="Criar tarefa"/>

          </form>
        </div>

        <div className="list-todo">
          <h2>Lista de tarefas:</h2>
          {todos.length === 0 && <p>Não há tarefas!</p>}
          {todos.map((todo) => (
            <div className="todo" key={todo.id}>
              <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
              <p>Duração: {todo.time}</p>
              <div className="actions">
                <span onClick={() => handleEdit(todo)} >
                  {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill /> }
                </span>
                <BsTrash onClick={() => handleDelete(todo.id)}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

export default App;