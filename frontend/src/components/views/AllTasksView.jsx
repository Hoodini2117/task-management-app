import { useState, useMemo } from 'react';
import TaskForm from '../tasks/TaskForm';
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
      <TaskForm onTaskCreated={onTaskCreated} />
      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dueDateFilter={dueDateFilter}
        onDueDateFilterChange={setDueDateFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />
      <QuickFilterChips activeChip={activeChip} onChipChange={handleChipChange} />
      <div className="task-count">
        {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
      </div>
      <TaskList tasks={filteredTasks} onDelete={onDelete} onStatusChange={onStatusChange} />
    </div>
  );
}

export default AllTasksView;
