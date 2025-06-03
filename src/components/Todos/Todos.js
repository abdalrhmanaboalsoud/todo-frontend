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
  const [sortByCompleted, setSortByCompleted] = useState(true);
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
      {/* Completed Todos Section */}
      <div className={`mb-12 ${sortByCompleted ? 'border-green-100 dark:border-green-700' : 'border-yellow-100 dark:border-yellow-700'} border bg-white dark:bg-gray-900 rounded-2xl shadow p-4`}>
        <h3 className={`text-2xl font-semibold mb-4 text-center ${sortByCompleted ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}`}>Completed Todos</h3>
        <CompletedTodos sortByCompleted={sortByCompleted} onSortChange={setSortByCompleted} />
      </div>
      {/* All Todos Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 text-center sm:text-left">All Todos</h3>
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search todos..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition"
            value={searchParams.get('keyword') || ''}
            onChange={handleSearchChange}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {todos.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg">No todos found.</div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow flex flex-col justify-between min-h-[160px] ${
                  todo.completed ? "border-l-4 border-green-500 dark:border-green-400" : "border-l-4 border-yellow-500 dark:border-yellow-400"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{todo.title || todo.todo}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      todo.completed
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                    }`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{todo.description}</p>
                <div className="flex justify-between items-center gap-2 mt-4">
                  <Link
                    to={`/todos/${todo.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-emerald-800 to-teal-700 text-white shadow hover:from-emerald-900 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l4-4m-4 4l4 4m13-4a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    View Details
                  </Link>
                  <DeleteTodo
                    id={todo.id}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Todos;
