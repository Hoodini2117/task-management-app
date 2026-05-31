import { FaSearch } from 'react-icons/fa';

function TaskFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dueDateFilter,
  onDueDateFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
}) {
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

      <div className="filter-row">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>

        <select
          className="filter-select"
          value={dueDateFilter}
          onChange={(e) => onDueDateFilterChange(e.target.value)}
        >
          <option value="">All Dates</option>
          <option value="today">Due Today</option>
          <option value="tomorrow">Due Tomorrow</option>
          <option value="week">Due This Week</option>
          <option value="overdue">Overdue</option>
        </select>

        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="newest">Newest Created</option>
          <option value="oldest">Oldest Created</option>
          <option value="due-soonest">Due Soonest</option>
          <option value="due-latest">Due Latest</option>
          <option value="priority">High Priority First</option>
          <option value="completed">Recently Completed</option>
        </select>
      </div>
    </div>
  );
}

export default TaskFilters;
