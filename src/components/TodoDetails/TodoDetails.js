import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function TodoDetails() {
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const { id } = useParams();
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
                setLoading(false);
                toast.success('Todo details loaded successfully!');
            } catch (error) {
                console.error('Error fetching todo:', error);
                toast.error('Failed to load todo details');
                setLoading(false);
                // navigate('/todos');
            }
        };

        fetchTodo();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedTodo = { title, description, completed };
            const response = await axios.put(
                `https://todo-server-9nwr.onrender.com/todos/${id}`, 
                updatedTodo
            );
            setTodo(response.data);
            setIsEditing(false);
            toast.success('Todo updated successfully!');
        } catch (error) {
            console.error('Error updating todo:', error);
            toast.error('Failed to update todo');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!todo) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-600">Todo not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-8">
                    {!isEditing ? (
                        // View Mode
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">{todo.title}</h1>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                    >
                                        Edit
                                    </button>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        todo.completed
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        {todo.completed ? "Completed" : "Pending"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="prose max-w-none">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2>
                                <p className="text-gray-600 whitespace-pre-line mb-6">
                                    {todo.description || "No description provided"}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <p>Created: {new Date(todo.created_at).toLocaleString()}</p>
                                    <p>Last Updated: {new Date(todo.updatedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Edit Mode
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="4"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={completed}
                                    onChange={(e) => setCompleted(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Mark as completed</label>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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