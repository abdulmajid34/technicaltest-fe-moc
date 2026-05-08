import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTask } from '../api/taskQueries';

const taskSchema = z.object({
  title: z.string().min(1, { message: 'Judul tugas wajib diisi' }),
  description: z.string().optional(),
});

type TaskFormInputs = z.infer<typeof taskSchema>;

export const TaskForm = () => {
  const { mutate: createTask, isPending } = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data: TaskFormInputs) => {
    createTask(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6 transition-colors">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tambah Tugas Baru</h3>
      <div className="space-y-4">
        <div>
          <input
            {...register('title')}
            type="text"
            placeholder="Judul tugas..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <textarea
            {...register('description')}
            placeholder="Deskripsi (opsional)..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        >
          {isPending ? 'Menambahkan...' : 'Tambah Tugas'}
        </button>
      </div>
    </form>
  );
};
