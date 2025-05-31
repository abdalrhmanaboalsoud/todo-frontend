import "./App.css";
import React from "react";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is imported
import AddTodo from "./components/AddTodo/AddTodo"; // Import your AddTodo component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/NavBar"; // Import your Navbar component
import Footer from "./components/Footer";
import ApiTodos from "./components/ApiTodos/ApiTodos";
import Todos from "./components/Todos/Todos"; // Import your Todos component
import TodoDetails from "./components/TodoDetails/TodoDetails"; // Import your TodoDetails component
import CompletedTodos from "./components/CompletedTodos/CompletedTodos"; // Import your CompletedTodos component
import LocalTodos from "./components/LocalTodos/LocalTodos";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Navbar /> {/* Include the Navbar component */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Todos />} />
            <Route path="/add-todo" element={<AddTodo />} />
            <Route path="/api-todos" element={<ApiTodos />} />
            <Route path="/todos/completed" element={<CompletedTodos />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/todos/:id" element={<TodoDetails />} />{" "}
            <Route path="/local-todos" element={<LocalTodos />} />
            {/* Add more routes as needed */}
            {/* Must come last */}
          </Routes>
        </main>
        <Footer /> {/* Include the Footer component */}
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
export default App;
