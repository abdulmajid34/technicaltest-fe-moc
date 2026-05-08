import { useState, useMemo } from 'react';
import { useTasks } from '../api/taskQueries';
import { useFilterStore } from '../store/filterStore';
import { TaskItem } from './TaskItem';
import { BulkActionBar } from './BulkActionBar';
import { Loader2 } from 'lucide-react';

export const TaskList = () => {
  const { data: tasks, isLoading, isError } = useTasks();
  const { status, searchKeyword, perPage } = useFilterStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    let filtered = tasks.filter((task) => {
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

    if (perPage !== 'all') {
      const limit = typeof perPage === 'string' ? parseInt(perPage, 10) : perPage;
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [tasks, status, searchKeyword, perPage]);

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
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 font-bold text-red-500 bg-red-100 border-2 border-black">
        <p>Gagal memuat tugas. Silakan coba lagi.</p>
      </div>
    );
  }

  const allSelected = filteredTasks.length > 0 && selectedIds.length === filteredTasks.length;

  return (
    <div className="space-y-4 relative">
      {filteredTasks.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-5 h-5 border-2 border-black accent-neo-blue cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-shadow"
          />
          <span className="text-sm font-bold uppercase tracking-wide">
            Pilih Semua ({filteredTasks.length})
          </span>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 card-neo bg-gray-100 border-dashed">
          <p className="font-bold text-gray-500 uppercase">Tidak ada tugas yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid gap-2">
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

