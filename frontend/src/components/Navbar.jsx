import { FaTasks } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FaTasks className="navbar-icon" />
        <h1>Task Manager</h1>
      </div>
    </nav>
  );
}

export default Navbar;
