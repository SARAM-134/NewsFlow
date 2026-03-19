import React from 'react';

function Navbar() {
  return (
    <nav className="bg-white p-4 shadow-md flex items-center justify-between sticky top-0 z-50">
  
      <h1 className="text-2xl font-bold text-blue-600">NewsFlow</h1>
      
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
        Accedi
      </button>
    </nav>
  );
}

export default Navbar;