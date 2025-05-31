import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Todo App</h3>
            <p className="text-gray-400">Manage your tasks efficiently</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav>
              <button 
                onClick={() => {/* Add action */}} 
                className="block text-gray-400 hover:text-white mb-2"
              >
                About
              </button>
              <button 
                onClick={() => {/* Add action */}} 
                className="block text-gray-400 hover:text-white"
              >
                Contact
              </button>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;