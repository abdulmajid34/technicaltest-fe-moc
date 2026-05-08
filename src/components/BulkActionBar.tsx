import { useBulkDeleteTasks, useBulkCompleteTasks } from '../api/taskQueries';
import { Trash2, CheckCircle2 } from 'lucide-react';

interface BulkActionBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export const BulkActionBar = ({ selectedIds, onClearSelection }: BulkActionBarProps) => {
  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteTasks();
  const { mutate: bulkComplete, isPending: isCompleting } = useBulkCompleteTasks();

  if (selectedIds.length === 0) return null;

  const handleDelete = () => {
    if (window.confirm(`Hapus ${selectedIds.length} tugas terpilih?`)) {
      bulkDelete(selectedIds, {
        onSuccess: () => onClearSelection(),
      });
    }
  };

  const handleComplete = () => {
    bulkComplete(selectedIds, {
      onSuccess: () => onClearSelection(),
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 shadow-xl rounded-full px-6 py-3 flex items-center gap-4 border border-gray-200 dark:border-gray-700 z-50 animate-in slide-in-from-bottom-5">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {selectedIds.length} terpilih
      </span>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
      <button
        onClick={handleComplete}
        disabled={isCompleting}
        className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition-colors"
      >
        <CheckCircle2 className="w-4 h-4" />
        Selesaikan
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Hapus
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
      <button
        onClick={onClearSelection}
        className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Batal
      </button>
    </div>
  );
};
