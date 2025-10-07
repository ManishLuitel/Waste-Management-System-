import { Link } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem("token");
  return (
     <nav className="sticky top-0 z-50 bg-green-700 text-white shadow-lg px-6 py-4 flex justify-between items-center">
           <div className="flex items-center space-x-2 animate-fade-in">
             <span className="text-2xl">🌱</span>
             <h1 className="font-bold text-xl md:text-2xl">Banepa Waste Management</h1>
           </div>
           <div className="space-x-4 md:space-x-6 font-medium hidden sm:flex">
             <Link to="/" className="hover:text-gray-300 transition px-3 py-1 rounded hover:bg-green-600">Home</Link>
             <Link to="/schedule" className="hover:text-gray-300 transition px-3 py-1 rounded hover:bg-green-600">Schedule</Link>
             <Link to="/special-request" className="hover:text-gray-300 transition px-3 py-1 rounded hover:bg-green-600">Special Request</Link>
             <Link to="/contact" className="hover:text-gray-300 transition px-3 py-1 rounded hover:bg-green-600">Contact</Link>
             <Link to="/compost-request" className="hover:text-gray-300 transition px-3 py-1 rounded hover:bg-green-600">Compost Request</Link>
             <Link to="/compost-request" className="hover:text-gray-300 transition px-3 py-1 rounded hover:bg-green-600">View Compost</Link>
           
           </div>
           <button className="sm:hidden text-xl">☰</button>
         </nav>
  );
}
