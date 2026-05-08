import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskForm } from '../../components/TaskForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../../api/mockApi';

vi.mock('../../api/mockApi', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  bulkComplete: vi.fn(),
  bulkDelete: vi.fn(),
}));

describe('TaskForm Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
  });

  it('submits form and calls api.createTask', async () => {
    (api.createTask as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: '1', title: 'New Task', description: 'Desc', completed: false, createdAt: new Date().toISOString() });
    (api.getTasks as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskForm />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Judul tugas...'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByPlaceholderText('Deskripsi (opsional)...'), { target: { value: 'Desc' } });
    fireEvent.click(screen.getByRole('button', { name: /tambah tugas/i }));

    await waitFor(() => {
      // React Query v5 passes a second context arg; check only the first arg
      const [firstArg] = (api.createTask as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(firstArg).toEqual({ title: 'New Task', description: 'Desc' });
    });
  });

  it('shows validation error when title is empty', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TaskForm />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /tambah tugas/i }));

    await waitFor(() => {
      expect(screen.getByText('Judul tugas wajib diisi')).toBeInTheDocument();
    });
    expect(api.createTask).not.toHaveBeenCalled();
  });
});
