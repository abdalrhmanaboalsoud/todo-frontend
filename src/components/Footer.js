import React from 'react';

const socialLinks = [
  { href: 'https://github.com/', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" /></svg>
  ) },
  { href: 'https://twitter.com/', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.7 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.95 3.65A4.48 4.48 0 01.96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.56 1.74 2.17 3.01 4.09 3.05A9.05 9.05 0 010 19.54a12.8 12.8 0 006.92 2.03c8.3 0 12.84-6.87 12.84-12.84 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z" /></svg>
  ) },
  { href: 'https://linkedin.com/', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" /></svg>
  ) },
];

const Footer = () => {
  return (
    <footer className="backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-t border-gray-200 dark:border-gray-800 py-10 mt-8 shadow-inner">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-extrabold flex items-center gap-3 mb-2 drop-shadow-lg">
            <span className="inline-block align-middle text-4xl">📝</span>
            <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              To Do List
            </span>
          </h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-xs">
            Manage your tasks efficiently, everywhere. Stay organized and productive!
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <nav className="flex flex-col md:flex-row gap-4 items-center">
            <a
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
            >
              Home
            </a>
            <a href="/add-todo" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">Add Todo</a>
            <a href="/todos" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">All Todos</a>
            <a href="/todos/completed" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">Completed</a>
            <a href="/api-todos" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">API Todos</a>
            <a href="/local-todos" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">Local Todos</a>
          </nav>
          <div className="flex gap-4 mt-4 md:mt-0">
            {socialLinks.map((link, idx) => (
              <a key={idx} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition">
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="text-center md:text-right text-gray-400 dark:text-gray-500 text-sm mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} To Do List. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;