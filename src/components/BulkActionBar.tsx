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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 card-neo bg-neo-yellow px-4 md:px-6 py-3 flex flex-wrap items-center justify-center gap-3 md:gap-4 z-50 animate-in slide-in-from-bottom-5">
      <span className="text-sm font-black uppercase text-black whitespace-nowrap">
        {selectedIds.length} TERPILIH
      </span>
      <div className="w-px h-6 bg-black hidden md:block"></div>
      <button
        onClick={handleComplete}
        disabled={isCompleting}
        className="btn-neo !bg-neo-green !px-3 !py-1 text-sm flex items-center gap-2 whitespace-nowrap"
      >
        <CheckCircle2 className="w-4 h-4" />
        Selesaikan
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="btn-neo !bg-neo-pink !px-3 !py-1 text-sm flex items-center gap-2 whitespace-nowrap"
      >
        <Trash2 className="w-4 h-4" />
        Hapus
      </button>
      <div className="w-px h-6 bg-black hidden md:block"></div>
      <button
        onClick={onClearSelection}
        className="btn-neo !bg-white !px-3 !py-1 text-sm font-black whitespace-nowrap"
      >
        Batal
      </button>
    </div>
  );
};

