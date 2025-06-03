import "./App.css";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is imported
import AddTodo from "./components/AddTodo/AddTodo"; // Import your AddTodo component
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/NavBar"; // Import your Navbar component
import Footer from "./components/Footer";
import ApiTodos from "./components/ApiTodos/ApiTodos";
import Todos from "./components/Todos/Todos"; // Import your Todos component
import TodoDetails from "./components/TodoDetails/TodoDetails"; // Import your TodoDetails component
import CompletedTodos from "./components/CompletedTodos/CompletedTodos"; // Import your CompletedTodos component
import LocalTodos from "./components/LocalTodos/LocalTodos";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import GoogleCallback from "./components/Auth/GoogleCallback";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col">
          <Router>
            <Navbar /> {/* Include the Navbar component */}
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<GoogleCallback />} />

                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Todos />
                  </ProtectedRoute>
                } />
                <Route path="/add-todo" element={
                  <ProtectedRoute>
                    <AddTodo />
                  </ProtectedRoute>
                } />
                <Route path="/api-todos" element={
                  <ProtectedRoute>
                    <ApiTodos />
                  </ProtectedRoute>
                } />
                <Route path="/todos/completed" element={
                  <ProtectedRoute>
                    <CompletedTodos />
                  </ProtectedRoute>
                } />
                <Route path="/todos" element={
                  <ProtectedRoute>
                    <Todos />
                  </ProtectedRoute>
                } />
                <Route path="/todos/:id" element={
                  <ProtectedRoute>
                    <TodoDetails />
                  </ProtectedRoute>
                } />
                <Route path="/local-todos" element={
                  <ProtectedRoute>
                    <LocalTodos />
                  </ProtectedRoute>
                } />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
