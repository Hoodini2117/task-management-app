import { FaSearch } from 'react-icons/fa';

function TaskFilters({ search, onSearchChange }) {
  return (
    <div className="task-filters">
      <div className="search-input">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default TaskFilters;
