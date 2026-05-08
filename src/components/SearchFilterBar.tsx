import { useFilterStore } from '../store/filterStore';
import { Search, Filter } from 'lucide-react';

export const SearchFilterBar = () => {
  const { status, searchKeyword, perPage, setStatus, setSearchKeyword, setPerPage } = useFilterStore();

  return (
    <div className="card-neo bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-1/3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-black" />
        </div>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Cari tugas..."
          className="input-neo w-full pl-10"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
        {/* Status Filter */}
        <div className="flex bg-neo-blue border-2 border-black font-bold">
          {(['semua', 'belum selesai', 'selesai'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-2 uppercase text-xs md:text-sm flex-1 border-r-2 last:border-r-0 border-black transition-colors ${
                status === s
                  ? 'bg-black text-white'
                  : 'hover:bg-black/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Per Page Filter */}
        <div className="flex items-center gap-2 font-bold bg-neo-green border-2 border-black px-3 py-1">
          <Filter className="w-4 h-4" />
          <span className="text-sm uppercase">Tampil:</span>
          <select
            value={perPage}
            onChange={(e) => {
              const val = e.target.value;
              setPerPage(val === 'all' ? 'all' : (Number(val) as 5 | 10));
            }}
            className="bg-transparent font-black cursor-pointer outline-none text-black"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="all">ALL</option>
          </select>
        </div>
      </div>
    </div>
  );
};

