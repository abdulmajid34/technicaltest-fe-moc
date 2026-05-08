import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { SearchFilterBar } from './components/SearchFilterBar';
import { useAuthStore } from './store/authStore';
import { LogOut } from 'lucide-react';

function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">TaskFlow Manager</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Halo, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </header>

        <main>
          <TaskForm />
          <SearchFilterBar />
          <TaskList />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
