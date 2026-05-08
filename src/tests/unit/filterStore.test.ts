import { describe, it, expect, beforeEach } from 'vitest';
import { useFilterStore } from '../../store/filterStore';

describe('filterStore', () => {
  beforeEach(() => {
    useFilterStore.setState({
      status: 'semua',
      searchKeyword: '',
      perPage: 5,
    });
  });

  it('should initialize with default values', () => {
    const state = useFilterStore.getState();
    expect(state.status).toBe('semua');
    expect(state.searchKeyword).toBe('');
    expect(state.perPage).toBe(5);
  });

  it('should set status', () => {
    useFilterStore.getState().setStatus('selesai');
    expect(useFilterStore.getState().status).toBe('selesai');
  });

  it('should set search keyword', () => {
    useFilterStore.getState().setSearchKeyword('test keyword');
    expect(useFilterStore.getState().searchKeyword).toBe('test keyword');
  });

  it('should set per page', () => {
    useFilterStore.getState().setPerPage(10);
    expect(useFilterStore.getState().perPage).toBe(10);
    
    useFilterStore.getState().setPerPage('all');
    expect(useFilterStore.getState().perPage).toBe('all');
  });
});
