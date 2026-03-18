function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">
        NewsFlow 🚀
      </div>
      <div className="space-x-6 text-gray-600 font-medium">
        <a href="#" className="hover:text-blue-500">Home</a>
        <a href="#" className="hover:text-blue-500">Notizie</a>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
          Entra
        </button>
      </div>
    </nav>
  );
}

export default Navbar;