import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
      isDarkMode: false,
    });
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isDarkMode).toBe(false);
  });

  it('should handle login correctly', () => {
    const user = { id: '1', email: 'test@example.com', name: 'Test User' };
    const token = 'fake-token';
    
    useAuthStore.getState().login(user, token);
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
  });

  it('should handle logout correctly', () => {
    const user = { id: '1', email: 'test@example.com', name: 'Test User' };
    const token = 'fake-token';
    
    useAuthStore.getState().login(user, token);
    useAuthStore.getState().logout();
    
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('should toggle dark mode', () => {
    useAuthStore.getState().toggleDarkMode();
    expect(useAuthStore.getState().isDarkMode).toBe(true);
    
    useAuthStore.getState().toggleDarkMode();
    expect(useAuthStore.getState().isDarkMode).toBe(false);
  });
});
