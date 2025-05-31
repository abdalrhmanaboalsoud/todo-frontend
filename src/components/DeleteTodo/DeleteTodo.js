import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

function DeleteTodo({ 
  id, 
  onDeleteSuccess, 
  buttonText = "Delete",
  customClassName = "",
  apiEndpoint = "https://todo-server-9nwr.onrender.com/dtodo"
}) {
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const url = `${apiEndpoint}/${id}`;
      await axios.delete(url);
      toast.success("Item deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onDeleteSuccess(id);
    } catch (error) {
      toast.error("Failed to delete item.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error deleting item:", error);
    }
  };

  const defaultClassName = "px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50";

  return (
    <button
      onClick={handleDelete}
      className={`${defaultClassName} ${customClassName}`}
      aria-label={`Delete ${buttonText.toLowerCase()}`}
    >
      {buttonText}
    </button>
  );
}

export default DeleteTodo;
