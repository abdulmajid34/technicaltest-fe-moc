import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTask } from '../api/taskQueries';
import { Plus } from 'lucide-react';

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
    <form onSubmit={handleSubmit(onSubmit)} className="card-neo bg-neo-blue flex flex-col">
      <div className="border-b-2 border-black pb-2 mb-4 bg-white px-2 py-1 inline-block w-max border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black uppercase text-black">Tambah Tugas Baru</h3>
      </div>
      <div className="space-y-4">
        <div>
          <input
            {...register('title')}
            type="text"
            placeholder="Judul tugas..."
            className="input-neo w-full"
          />
          {errors.title && <p className="mt-2 text-sm font-bold bg-red-200 border-2 border-black inline-block px-2">{errors.title.message}</p>}
        </div>
        <div>
          <textarea
            {...register('description')}
            placeholder="Deskripsi (opsional)..."
            rows={3}
            className="input-neo w-full resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="btn-neo w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {isPending ? 'MENAMBAHKAN...' : 'TAMBAH TUGAS'}
        </button>
      </div>
    </form>
  );
};

