import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskList } from '../../components/TaskList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../../api/mockApi';
import { useFilterStore } from '../../store/filterStore';

vi.mock('../../api/mockApi', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  bulkComplete: vi.fn(),
  bulkDelete: vi.fn(),
}));

const mockTasks = [
  { id: '1', title: 'Task 1', description: 'Desc 1', completed: false, createdAt: '2026-05-08T00:00:00.000Z' },
  { id: '2', title: 'Task 2', description: 'Desc 2', completed: false, createdAt: '2026-05-08T00:00:00.000Z' },
];

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('Bulk Actions Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFilterStore.setState({ status: 'semua', searchKeyword: '', perPage: 'all' });
  });

  it('handles select all and bulk delete', async () => {
    (api.getTasks as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTasks);
    (api.bulkDelete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(['1', '2']);
    (api.getTasks as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Click "select all" (first checkbox in DOM)
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    // Bulk action bar should appear
    expect(screen.getByText(/2 terpilih/i)).toBeInTheDocument();

    window.confirm = vi.fn().mockReturnValue(true);

    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    await waitFor(() => {
      const [firstArg] = (api.bulkDelete as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(firstArg).toEqual(['1', '2']);
    });
  });

  it('handles bulk complete', async () => {
    (api.getTasks as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTasks);
    (api.bulkComplete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(['1', '2']);
    (api.getTasks as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByRole('button', { name: /selesaikan/i }));

    await waitFor(() => {
      const [firstArg] = (api.bulkComplete as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(firstArg).toEqual(['1', '2']);
    });
  });
});
