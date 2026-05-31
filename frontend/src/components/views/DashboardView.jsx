import { useMemo } from 'react';
import StatsCards from '../stats/StatsCards';
import QuickAddWidget from '../dashboard/QuickAddWidget';
import DueTodayPanel from '../dashboard/DueTodayPanel';
import OverduePanel from '../dashboard/OverduePanel';
import UpcomingDeadlines from '../dashboard/UpcomingDeadlines';
import RecentCompletions from '../dashboard/RecentCompletions';
import MomentumCard from '../dashboard/MomentumCard';
import {
  getDueTodayTasks,
  getOverdueTasks,
  getUpcomingTasks,
  getRecentCompletions,
  getCompletedTodayCount,
} from '../../utils/dashboardUtils';

function DashboardView({ tasks, onTaskCreated }) {
  const dueTodayTasks = useMemo(() => getDueTodayTasks(tasks), [tasks]);
  const overdueTasks = useMemo(() => getOverdueTasks(tasks), [tasks]);
  const upcomingTasks = useMemo(() => getUpcomingTasks(tasks), [tasks]);
  const recentCompletions = useMemo(() => getRecentCompletions(tasks), [tasks]);
  const completedTodayCount = useMemo(() => getCompletedTodayCount(tasks), [tasks]);

  return (
    <div className="dashboard-view">
      <StatsCards tasks={tasks} />

      <div className="dashboard-grid">
        <div className="dashboard-col-left">
          <DueTodayPanel tasks={dueTodayTasks} />
          <OverduePanel tasks={overdueTasks} />
        </div>

        <div className="dashboard-col-right">
          <QuickAddWidget onTaskCreated={onTaskCreated} />
          <MomentumCard count={completedTodayCount} />
          <UpcomingDeadlines tasks={upcomingTasks} />
          <RecentCompletions tasks={recentCompletions} />
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
