import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          📝 Todo App
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/add-todo" className="hover:underline">
            Add Todo
          </Link>
          <Link to="/todos" className="hover:underline">
            All Todos
          </Link>
          <Link to="/todos/completed" className="hover:underline">
            Completed
          </Link>
          <Link to="/api-todos" className="hover:underline">
            API Todos
          </Link>
          <Link to="/local-todos" className="hover:underline">
            Local Todos
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;