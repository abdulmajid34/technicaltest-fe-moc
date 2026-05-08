import { render, screen, waitFor, act } from '@testing-library/react';
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
  { id: '2', title: 'Task 2', description: 'Desc 2', completed: true, createdAt: '2026-05-08T00:00:00.000Z' },
  { id: '3', title: 'Another One', description: '', completed: false, createdAt: '2026-05-08T00:00:00.000Z' },
];

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('TaskList & Filter Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFilterStore.setState({ status: 'semua', searchKeyword: '', perPage: 'all' });
  });

  it('renders loading state initially and then tasks', async () => {
    (api.getTasks as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTasks);

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (api.getTasks as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network Error'));

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText(/gagal memuat tugas/i)).toBeInTheDocument();
    });
  });

  it('filters by status', async () => {
    (api.getTasks as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTasks);

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Change filter via store directly (avoids multi-button selector issue)
    act(() => {
      useFilterStore.setState({ status: 'selesai' });
    });

    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('filters by search keyword', async () => {
    (api.getTasks as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTasks);

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    act(() => {
      useFilterStore.setState({ searchKeyword: 'Another' });
    });

    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Another One')).toBeInTheDocument();
    });
  });

  it('paginates using perPage', async () => {
    const manyMockTasks = Array.from({ length: 6 }, (_, i) => ({
      id: String(i + 1),
      title: `Task ${i + 1}`,
      description: `Desc ${i + 1}`,
      completed: false,
      createdAt: '2026-05-08T00:00:00.000Z',
    }));
    (api.getTasks as ReturnType<typeof vi.fn>).mockResolvedValueOnce(manyMockTasks);

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 6')).toBeInTheDocument();
    });

    act(() => {
      useFilterStore.setState({ perPage: 5 });
    });

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 5')).toBeInTheDocument();
      expect(screen.queryByText('Task 6')).not.toBeInTheDocument();
    });
  });
});
