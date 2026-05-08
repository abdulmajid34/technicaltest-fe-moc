import { create } from 'zustand';

interface FilterState {
  status: 'semua' | 'selesai' | 'belum selesai';
  searchKeyword: string;
  setStatus: (status: 'semua' | 'selesai' | 'belum selesai') => void;
  setSearchKeyword: (keyword: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  status: 'semua',
  searchKeyword: '',
  setStatus: (status) => set({ status }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}));
