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

  const defaultClassName = "px-3 py-1 text-sm font-semibold bg-gradient-to-r from-red-800 to-red-600 text-white hover:from-red-900 hover:to-red-700 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50";

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
