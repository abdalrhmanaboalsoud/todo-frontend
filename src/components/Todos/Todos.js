import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import DeleteTodo from "../DeleteTodo/DeleteTodo";
import CompletedTodos from "../CompletedTodos/CompletedTodos";
import { useSearchParams } from 'react-router-dom';


function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleDeleteSuccess = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id)); // Remove deleted todo from state
  };

  
  const fetchTodos = useCallback(async () => {
    try {
      const url = `https://todo-server-9nwr.onrender.com/todos?keyword=${searchParams.get('keyword') || ''}`;
      const response = await axios.get(url);
      setTodos(response.data);
      setLoading(false);
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
  }, [searchParams]); // Add searchParams as dependency

  const handleSearchChange = useCallback((e) => {
    const keyword = e.target.value;
    setSearchParams({ keyword });
    
    if (!keyword) {
      fetchTodos(); // Fetch all todos when search is empty
      return;
    }
    
    setLoading(true);
  }, [setSearchParams, fetchTodos]); // Added fetchTodos as dependency

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword !== null) {
      fetchTodos();
    }
  }, [searchParams, fetchTodos]); // Added fetchTodos as dependency

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // Added fetchTodos as dependency

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search todos..."
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={searchParams.get('keyword') || ''}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Existing Todos content */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Completed Todos</h2>
        <CompletedTodos />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">All Todos</h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col ${
                  todo.completed
                    ? "border-l-4 border-green-500"
                    : "border-l-4 border-yellow-500"
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
                <p className="text-gray-700 mb-4">{todo.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <Link
                    to={`/todos/${todo.id}`}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View Details
                  </Link>
                  <DeleteTodo
                    id={todo.id}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Todos;
