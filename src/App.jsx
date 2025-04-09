import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:3001/todos";

  // Mengambil semua tugas ketika komponen dipasang
  useEffect(() => {
    fetchTodos();
  }, []);

  // Mengambil semua tugas dari API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Gagal mengambil data tugas");
      }
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Membuat sebuah tugas baru
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTodoText }),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan todo");
      }

      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoText("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle status tugas menjadi complete
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Gagal mengubah status tugas");
      }

      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      setError(err.message);
    }
  };

  // Menghapus sebuah tugas
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus todo");
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app max-w-[1280px] p-4 lg:p-8 my-0 mx-auto">
      <header className="app-header text-center mb-8 py-5 px-0">
        <h1 className="font-bold text-3xl text-emerald-950">
          To-Do List Sederhana
        </h1>
        <p className="font-normal text-emerald-800">
          Rencana apa yang akan anda lakukan hari ini?
        </p>
      </header>

      <div className="container bg-white rounded-xl p-6">
        {/* Todo Form */}
        <form className="todo-form flex flex-row gap-3 mb-5" onSubmit={addTodo}>
          <input
            className="w-full rounded-full py-2.5 px-4 border border-gray-500 focus:ring focus:ring-emerald-500"
            type="text"
            placeholder="Tambahkan tugas baru..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
          <button
            className="py-2 px-4 bg-emerald-600 font-semibold rounded-full text-white cursor-pointer transition duration-300 hover:bg-emerald-700"
            type="submit"
          >
            Tambah
          </button>
        </form>

        <section id="todo-lists" className="mt-6">
          {/* Pesan error */}
          {error && (
            <div className="error-message text-rose-500 text-center my-2.5 mx-0 p-2.5 bg-[#fadbd8] rounded-sm">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="loading text-center py-5 px-0 text-[#7f8c8d] font-medium">
              Memuat data...
            </div>
          ) : (
            /* Daftar tugas */
            <ul className="todo-list list-none">
              {todos.length === 0 ? (
                <p className="empty-list text-center py-5 px-0 text-emerald-700 font-semibold">
                  Belum ada tugas. Tambahkan tugas baru!
                </p>
              ) : (
                todos.map((todo) => (
                  <li
                    className="todo-item flex justify-between items-center py-4 px-0 border-b border-b-gray-200 last:border-b-0"
                    key={todo.id}
                  >
                    <div className="todo-content flex items-center">
                      <input
                        className="mr-4 scale-125 cursor-pointer"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                      />
                      <span
                        className={`todo-text ${
                          todo.completed
                            ? "completed text-gray-300 line-through"
                            : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <button
                      className="delete-btn bg-rose-500 border-none rounded-full py-1.5 px-3 text-white font-semibold text-sm cursor-pointer transition duration-300 hover:bg-rose-600"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Hapus
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
