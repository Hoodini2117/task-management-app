import { useState, useMemo } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import TaskModal from '../tasks/TaskModal';
import TaskFilters from '../tasks/TaskFilters';
import QuickFilterChips from '../tasks/QuickFilterChips';
import TaskList from '../tasks/TaskList';
import { filterBySearch, filterByDueDate, filterByPriority, applyQuickFilter, sortTasks } from '../../utils/taskUtils';

function AllTasksView({ tasks, onTaskCreated, onDelete, onStatusChange }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeChip, setActiveChip] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const handleChipChange = (chip) => {
    setActiveChip(chip);
    if (chip === 'all') {
      setStatusFilter('');
      setDueDateFilter('');
      setPriorityFilter('');
    }
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (statusFilter === 'archived') {
      result = result.filter((t) => t.is_archived);
    } else if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter && !t.is_archived);
    }

    result = filterBySearch(result, search);
    result = filterByDueDate(result, dueDateFilter);
    result = filterByPriority(result, priorityFilter);

    if (activeChip !== 'all') {
      result = applyQuickFilter(result, activeChip);
    }

    result = sortTasks(result, sortBy);

    return result;
  }, [tasks, search, statusFilter, dueDateFilter, priorityFilter, sortBy, activeChip]);

  return (
    <div className="tasks-view">
      {/* Top Bar: Search + New Task */}
      <div className="tasks-top-bar">
        <div className="search-input">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-new-task" onClick={() => setShowModal(true)}>
          <FaPlus />
          <span>New Task</span>
        </button>
      </div>

      {/* Quick Filter Chips */}
      <QuickFilterChips activeChip={activeChip} onChipChange={handleChipChange} />

      {/* Advanced Filters */}
      <TaskFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dueDateFilter={dueDateFilter}
        onDueDateFilterChange={setDueDateFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Task Count */}
      <div className="task-count">
        {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
      </div>

      {/* Task List */}
      <TaskList tasks={filteredTasks} onDelete={onDelete} onStatusChange={onStatusChange} />

      {/* New Task Modal */}
      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onTaskCreated={async (data) => {
            await onTaskCreated(data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default AllTasksView;
