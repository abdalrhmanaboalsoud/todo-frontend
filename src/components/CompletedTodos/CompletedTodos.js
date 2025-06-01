import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";

function CompletedTodos({ sortByCompleted: controlledSortByCompleted, onSortChange }) {
    const [searchParams, setSearchParams] = useSearchParams();
    // If no parent handler, manage state internally
    const isControlled = typeof onSortChange === 'function' && onSortChange !== (() => {});
    const [internalSortByCompleted, setInternalSortByCompleted] = useState(true);
    const sortByCompleted = isControlled ? controlledSortByCompleted : internalSortByCompleted;
    const handleSortChange = (e) => {
        if (isControlled) {
            onSortChange(e.target.checked);
        } else {
            setInternalSortByCompleted(e.target.checked);
        }
        setSearchParams({ completed: e.target.checked.toString() });
    };
    const [completedTodos, setCompletedTodos] = useState([]);
    const [loading, setLoading] = useState(true);
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
    useEffect(() => {
        fetchCompletedTodos();
    }, [fetchCompletedTodos]);
    const renderedTodos = useMemo(() => 
        completedTodos.map((todo) => (
            <div 
                key={todo.id} 
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${
                    todo.completed ? 'border-l-4 border-green-500 dark:border-green-400' : 'border-l-4 border-yellow-500 dark:border-yellow-400'
                }`}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{todo.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        todo.completed 
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300" 
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                    }`}>
                        {todo.completed ? "Completed" : "Pending"}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{todo.description}</p>
                {todo.completedAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
                    <span className="text-gray-700 dark:text-gray-200">Show completed first</span>
                </label>
            </div>
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
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