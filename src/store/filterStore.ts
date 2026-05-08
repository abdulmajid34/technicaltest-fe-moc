import { create } from 'zustand';

interface FilterState {
  status: 'semua' | 'selesai' | 'belum selesai';
  searchKeyword: string;
  perPage: 5 | 10 | 'all';
  setStatus: (status: 'semua' | 'selesai' | 'belum selesai') => void;
  setSearchKeyword: (keyword: string) => void;
  setPerPage: (perPage: 5 | 10 | 'all') => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  status: 'semua',
  searchKeyword: '',
  perPage: 'all',
  setStatus: (status) => set({ status }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setPerPage: (perPage) => set({ perPage }),
}));

