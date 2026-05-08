import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginForm } from '../../components/LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import * as reactHotToast from 'react-hot-toast';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ isAuthenticated: false, user: null, token: null });
  });

  it('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gas masuk!|masuk/i })).toBeInTheDocument();
  });

  it('shows error for wrong credentials', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'wrong@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /masuk/i }));

    await waitFor(() => {
      expect(reactHotToast.default.error).toHaveBeenCalledWith('Email atau password salah');
    }, { timeout: 2000 });
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('logs in successfully with correct credentials', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /masuk/i }));

    await waitFor(() => {
      expect(reactHotToast.default.success).toHaveBeenCalledWith('Login berhasil');
    }, { timeout: 2000 });
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.email).toBe('user@example.com');
  });
});
