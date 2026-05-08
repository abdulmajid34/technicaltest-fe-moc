import { useState, useMemo } from 'react';
import { useTasks } from '../api/taskQueries';
import { useFilterStore } from '../store/filterStore';
import { TaskItem } from './TaskItem';
import { BulkActionBar } from './BulkActionBar';
import { Loader2 } from 'lucide-react';

export const TaskList = () => {
  const { data: tasks, isLoading, isError } = useTasks();
  const { status, searchKeyword } = useFilterStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter((task) => {
      // Filter by status
      if (status === 'selesai' && !task.completed) return false;
      if (status === 'belum selesai' && task.completed) return false;
      
      // Filter by keyword
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        if (!task.title.toLowerCase().includes(keyword)) {
          return false;
        }
      }
      
      return true;
    });
  }, [tasks, status, searchKeyword]);

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => 
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTasks.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Gagal memuat tugas. Silakan coba lagi.</p>
      </div>
    );
  }

  const allSelected = filteredTasks.length > 0 && selectedIds.length === filteredTasks.length;

  return (
    <div className="space-y-4">
      {filteredTasks.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pilih Semua ({filteredTasks.length})
          </span>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Tidak ada tugas yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={selectedIds.includes(task.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <BulkActionBar 
        selectedIds={selectedIds} 
        onClearSelection={() => setSelectedIds([])} 
      />
    </div>
  );
};
