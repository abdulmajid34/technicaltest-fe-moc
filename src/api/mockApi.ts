import type { Task } from '../types';
import { getFromStorage, setToStorage } from '../utils/localStorageHelpers';

const simulateLatency = <T>(data: T, shouldFail = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // simulate random error (5% probability)
      if (shouldFail && Math.random() < 0.05) {
        reject(new Error('Network error simulated!'));
      } else {
        resolve(data);
      }
    }, 800 + Math.random() * 200); // 800 - 1000ms latency
  });
};

const getStoredTasks = (): Task[] => {
  return getFromStorage<Task[]>('tasks', []);
};

const saveStoredTasks = (tasks: Task[]) => {
  setToStorage('tasks', tasks);
};

export const getTasks = async (): Promise<Task[]> => {
  const tasks = getStoredTasks();
  return simulateLatency(tasks, true);
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): Promise<Task> => {
  const tasks = getStoredTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    title: taskData.title,
    description: taskData.description || '',
    completed: false,
    createdAt: new Date().toISOString(),
  };
  const newTasks = [newTask, ...tasks];
  saveStoredTasks(newTasks);
  return simulateLatency(newTask, true);
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const tasks = getStoredTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) throw new Error('Task not found');
  
  const updatedTask = { ...tasks[taskIndex], ...updates };
  tasks[taskIndex] = updatedTask;
  saveStoredTasks(tasks);
  
  return simulateLatency(updatedTask, true);
};

export const deleteTask = async (id: string): Promise<string> => {
  const tasks = getStoredTasks();
  const newTasks = tasks.filter((t) => t.id !== id);
  saveStoredTasks(newTasks);
  return simulateLatency(id, true);
};

export const bulkDelete = async (ids: string[]): Promise<string[]> => {
  const tasks = getStoredTasks();
  const newTasks = tasks.filter((t) => !ids.includes(t.id));
  saveStoredTasks(newTasks);
  return simulateLatency(ids, true);
};

export const bulkComplete = async (ids: string[]): Promise<string[]> => {
  const tasks = getStoredTasks();
  const newTasks = tasks.map((t) => {
    if (ids.includes(t.id)) {
      return { ...t, completed: true };
    }
    return t;
  });
  saveStoredTasks(newTasks);
  return simulateLatency(ids, true);
};
