import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask, bulkDelete, bulkComplete } from './mockApi';
import type { Task } from '../types';
import toast from 'react-hot-toast';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTaskParams) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        title: newTaskParams.title,
        description: newTaskParams.description || '',
        completed: false,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        return [optimisticTask, ...(old || [])];
      });

      return { previousTasks };
    },
    onError: (_err, _newTask, context) => {
      toast.error('Gagal menambahkan tugas');
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSuccess: () => {
      toast.success('Tugas berhasil ditambahkan');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        if (!old) return old;
        return old.map((task) => (task.id === id ? { ...task, ...updates } : task));
      });

      return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
      toast.error('Gagal memperbarui tugas');
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        if (!old) return old;
        return old.filter((task) => task.id !== id);
      });

      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      toast.error('Gagal menghapus tugas');
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSuccess: () => {
      toast.success('Tugas berhasil dihapus');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useBulkDeleteTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDelete,
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        if (!old) return old;
        return old.filter((task) => !ids.includes(task.id));
      });

      return { previousTasks };
    },
    onError: (_err, _ids, context) => {
      toast.error('Gagal menghapus tugas terpilih');
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSuccess: () => {
      toast.success('Tugas terpilih berhasil dihapus');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useBulkCompleteTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkComplete,
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        if (!old) return old;
        return old.map((task) => (ids.includes(task.id) ? { ...task, completed: true } : task));
      });

      return { previousTasks };
    },
    onError: (_err, _ids, context) => {
      toast.error('Gagal menyelesaikan tugas terpilih');
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSuccess: () => {
      toast.success('Tugas terpilih ditandai selesai');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
