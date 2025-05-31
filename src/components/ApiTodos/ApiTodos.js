import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ApiTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);
  const fetchTodos = async () => {
    try {
      const url = "https://todo-server-9nwr.onrender.com/todo/api";
      const response = await axios.get(url);
      setTodos(response.data);
      setLoading(false);
      // toast.success("Todos fetched successfully!", {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      // });
      console.log("Todos fetched:", response.data);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                todo.completed ? "border-l-4 border-green-500" : "border-l-4 border-yellow-500"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{todo.title}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    todo.completed
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <p className="text-gray-600">{todo.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ApiTodos;
