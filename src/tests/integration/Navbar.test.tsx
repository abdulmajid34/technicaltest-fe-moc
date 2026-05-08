import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../../App';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar Component (Dashboard)', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
  });

  it('shows navbar correctly and handles logout', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'fake',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Halo, Test User')).toBeInTheDocument();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0');

    const logoutBtn = screen.getByRole('button', { name: /keluar/i });
    fireEvent.click(logoutBtn);

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('has neobrutalism classes on elements', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const logoutBtn = screen.getByRole('button', { name: /keluar/i });
    expect(logoutBtn).toHaveClass('btn-neo');
  });
});
