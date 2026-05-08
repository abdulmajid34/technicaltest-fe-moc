import { useFilterStore } from '../store/filterStore';
import { Search } from 'lucide-react';

export const SearchFilterBar = () => {
  const { status, searchKeyword, setStatus, setSearchKeyword } = useFilterStore();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center transition-colors">
      <div className="relative w-full sm:w-1/2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Cari tugas..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-colors"
        />
      </div>
      
      <div className="w-full sm:w-auto flex gap-2">
        {(['semua', 'belum selesai', 'selesai'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors flex-1 sm:flex-none ${
              status === s
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
