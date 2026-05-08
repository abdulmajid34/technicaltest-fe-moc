import type { Task } from '../types';
import { useUpdateTask, useDeleteTask } from '../api/taskQueries';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

export const TaskItem = ({ task, isSelected, onSelect }: TaskItemProps) => {
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');

  const handleToggleComplete = () => {
    updateTask({ id: task.id, updates: { completed: !task.completed } });
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    updateTask({ id: task.id, updates: { title: editTitle, description: editDesc } }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  const handleDelete = () => {
    if (window.confirm('Yakin ingin menghapus tugas ini?')) {
      deleteTask(task.id);
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${task.completed ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-75' : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm'} transition-all flex gap-4 items-start group`}>
      <div className="pt-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(task.id, e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full px-3 py-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={2}
            />
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} disabled={isUpdating} className="p-1 text-green-600 hover:bg-green-50 rounded">
                <Check className="w-5 h-5" />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className={`transition-all ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                className="w-5 h-5 rounded-full border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
              />
              <h4 className="text-lg font-medium truncate" title={task.title}>{task.title}</h4>
            </div>
            {task.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 pl-7 break-words">{task.description}</p>
            )}
            <p className="mt-2 text-xs text-gray-400 pl-7">
              {new Date(task.createdAt).toLocaleString('id-ID')}
            </p>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
