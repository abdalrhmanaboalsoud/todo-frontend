import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";


function CompletedTodos() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [completedTodos, setCompletedTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortByCompleted, setSortByCompleted] = useState(true); // Default to true to show completed todos first
    
    const fetchCompletedTodos = useCallback(async () => {
        try {
            const url = `https://todo-server-9nwr.onrender.com/todos/completed?completed=${sortByCompleted}`;
            const response = await axios.get(url);
            setCompletedTodos(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching todos:", error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed to fetch todos");
        }
    }, [sortByCompleted]);

    // Update URL and fetch todos when sorting changes
    const handleSortChange = (e) => {
        setSortByCompleted(e.target.checked);
        // Update URL params to match backend expectation
        setSearchParams({ completed: e.target.checked.toString() });
    };

    useEffect(() => {
        fetchCompletedTodos();
    }, [fetchCompletedTodos]); // Added fetchCompletedTodos as dependency

    const renderedTodos = useMemo(() => 
        completedTodos.map((todo) => (
            <div 
                key={todo.id} 
                className={`bg-white p-4 rounded-lg shadow-md ${
                    todo.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'
                }`}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{todo.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                        todo.completed 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                    }`}>
                        {todo.completed ? "Completed" : "Pending"}
                    </span>
                </div>
                <p className="text-gray-600">{todo.description}</p>
                {todo.completedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                        Completed on: {new Date(todo.completedAt).toLocaleDateString()}
                    </p>
                )}
            </div>
        )), 
        [completedTodos]
    );
    
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Add sorting control */}
            <div className="mb-6">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={sortByCompleted}
                        onChange={handleSortChange}
                        className="form-checkbox h-4 w-4 text-indigo-600"
                    />
                    <span className="text-gray-700">Show completed first</span>
                </label>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {renderedTodos}
                </div>
            )}
        </div>
    );
}

export default CompletedTodos;