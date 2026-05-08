import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as api from '../../api/mockApi';

describe('mockApi', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5); 
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('getTasks should return empty array initially', async () => {
    const promise = api.getTasks();
    vi.runAllTimers();
    const tasks = await promise;
    expect(tasks).toEqual([]);
  });

  it('createTask should add a new task', async () => {
    const promise = api.createTask({ title: 'Test Task', description: 'Desc' });
    vi.runAllTimers();
    const task = await promise;
    
    expect(task).toHaveProperty('id');
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('Desc');
    expect(task.completed).toBe(false);

    const getPromise = api.getTasks();
    vi.runAllTimers();
    const tasks = await getPromise;
    expect(tasks).toHaveLength(1);
  });

  it('should throw error randomly based on Math.random', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // Trigger simulateNetworkLatency error
    const promise = api.getTasks();
    vi.runAllTimers();
    
    await expect(promise).rejects.toThrow('Network error simulated!');
  });
});
