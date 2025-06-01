import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function LocalTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchTodos = async () => {
    try {
      const url = "https://todo-server-9nwr.onrender.com/local-todos";
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
      setLoading(false);
      toast.error("Failed to fetch todos.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error fetching todos:", error);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddToAllTodos = async (todo) => {
    try {
      await axios.post('https://todo-server-9nwr.onrender.com/addtodo', {
        title: todo.todo,
        description: todo.description || '',
        // Add other fields as needed
      });
      toast.success('Todo added to All Todos!');
    } catch (error) {
      toast.error('Failed to add todo to All Todos.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">

      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">All Todos</h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col ${
                  todo.completed
                    ? "border-l-4 border-green-500 dark:border-green-400"
                    : "border-l-4 border-yellow-500 dark:border-yellow-400"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{todo.todo}</h3>
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
                    className="ml-2 px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-800 transition"
                  >
                    +
                  </button>
                </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LocalTodos;
