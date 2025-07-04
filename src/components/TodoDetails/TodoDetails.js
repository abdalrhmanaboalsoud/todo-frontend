import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ThemeContext } from '../../ThemeContext';

function TodoDetails() {
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const { id } = useParams();
    const { darkMode } = useContext(ThemeContext);
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchTodo = async () => {
            // Check if id is not a number
            if (isNaN(id)) {
                toast.error('Invalid todo ID');
                // navigate('/todos');
                return;
            }

            try {
                const response = await axios.get(`https://todo-server-9nwr.onrender.com/spesific-todo/${id}`);
                const todoData = response.data;
                setTodo(todoData);
                setTitle(todoData.title);
                setDescription(todoData.description);
                setCompleted(todoData.completed);
                setPriority(todoData.priority || 'medium');
                // Format due_date for input type="date" (YYYY-MM-DD)
                if (todoData.due_date) {
                    const date = new Date(todoData.due_date);
                    const formattedDate = date.toISOString().split('T')[0];
                    setDueDate(formattedDate);
                } else {
                    setDueDate('');
                }
                // Format updated_at timestamp
                if (todoData.updated_at) {
                    const date = new Date(todoData.updated_at);
                    setUpdatedAt(date.toLocaleString());
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching todo:', error);
                setLoading(false);
                // navigate('/todos');
            }
        };

        fetchTodo();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedTodo = { title, description, completed, priority, due_date: dueDate || null }; // Use null if due date is empty
            const response = await axios.patch(
                `https://todo-server-9nwr.onrender.com/utodo/${id}`, 
                updatedTodo
            );
            // Update all local state with the response data
            setTodo(response.data);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setCompleted(response.data.completed);
            setPriority(response.data.priority || 'medium');
            if (response.data.due_date) {
                const date = new Date(response.data.due_date);
                setDueDate(date.toISOString().split('T')[0]);
            } else {
                setDueDate('');
            }
            if (response.data.updated_at) {
                const date = new Date(response.data.updated_at);
                setUpdatedAt(date.toLocaleString());
            }
            setIsEditing(false);
            toast.success('Todo updated successfully!');
        } catch (error) {
            console.error('Error updating todo:', error);
            toast.error('Failed to update todo. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-[60vh] ${darkMode ? 'dark' : ''}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
        );
    }

    if (!todo) {
        return (
            <div className={`container mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                    <p className="text-red-600 dark:text-red-200">Todo not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`container mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
            <div className={`max-w-2xl mx-auto rounded-lg shadow-md overflow-hidden ${darkMode ? 'dark:bg-gray-800 bg-gray-900' : 'bg-white'}`}>
                <div className="p-8">
                    {!isEditing ? (
                        // View Mode
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{todo.title}</h1>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                                    >
                                        Edit
                                    </button>
                                    <span className={`px-3 py-3 rounded-full text-sm ${
                                        todo.completed
                                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                    }`}>
                                        {todo.completed ? "Completed" : "Pending"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="prose max-w-none">
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority</h2>
                                    <p className="text-gray-600 dark:text-gray-400 capitalize">{todo.priority || 'medium'}</p>
                                </div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</h2>
                                    <p className="text-gray-600 dark:text-gray-400">{todo.due_date ? new Date(todo.due_date).toLocaleString() : 'No due date'}</p>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h2>
                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line mb-6">
                                    {todo.description || "No description provided"}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                    <p>Created: {new Date(todo.created_at).toLocaleString()}</p>
                                    <p>Last Updated: {updatedAt || 'Not available'}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Edit Mode
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                                    rows="4"
                                />
                            </div>
                            <div className="flex items-center px-3 py-3">
                                <input
                                    type="checkbox"
                                    checked={completed}
                                    onChange={(e) => setCompleted(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded dark:bg-gray-700 dark:checked:bg-indigo-600"
                                />
                                <label className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Mark as completed</label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TodoDetails;