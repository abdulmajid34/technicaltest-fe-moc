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
    <div className={`card-neo !p-3 flex gap-4 items-start group mb-4 text-black ${task.completed ? 'bg-gray-200' : 'bg-white'}`}>
      <div className="pt-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(task.id, e.target.checked)}
          className="w-5 h-5 border-2 border-black accent-neo-blue cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-shadow"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input-neo w-full !py-1 !text-sm"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="input-neo w-full !py-1 !text-sm resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} disabled={isUpdating} className="btn-neo !bg-neo-green !px-2 !py-1">
                <Check className="w-5 h-5" />
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-neo !bg-neo-pink !px-2 !py-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className={`transition-all ${task.completed ? 'line-through opacity-70' : ''}`}>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                className="w-5 h-5 border-2 border-black accent-neo-green cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-shadow"
              />
              <h4 className="text-lg font-black truncate" title={task.title}>{task.title}</h4>
            </div>
            {task.description && (
              <p className="mt-2 text-sm font-medium border-l-4 border-black pl-3 ml-7 break-words">{task.description}</p>
            )}
            <p className="mt-2 text-xs font-bold text-gray-600 pl-7">
              {new Date(task.createdAt).toLocaleString('id-ID')}
            </p>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="btn-neo !bg-neo-blue !px-2 !py-2"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-neo !bg-neo-pink !px-2 !py-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
