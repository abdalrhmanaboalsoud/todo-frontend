import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ApiTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddToAllTodos = async (todo) => {
    try {
      await axios.post('https://todo-server-9nwr.onrender.com/addtodo', {
        title: todo.todo,
        description: '', // dummyjson doesn't provide description
        completed: todo.completed
      });
      toast.success('Todo added to All Todos!');
    } catch (error) {
      toast.error('Failed to add todo to All Todos.');
    }
  };

  const fetchTodos = async () => {
    try {
      const url = "https://dummyjson.com/todos";
      const response = await axios.get(url);
      setTodos(response.data.todos);
      setLoading(false);
      console.log("Todos fetched:", response.data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to fetch todos. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                todo.completed ? "border-l-4 border-green-500 dark:border-green-400" : "border-l-4 border-yellow-500 dark:border-yellow-400"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{todo.todo}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      todo.completed
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                    }`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                  <button
                    onClick={() => handleAddToAllTodos(todo)}
                    className="px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-800 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ApiTodos;
