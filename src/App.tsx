import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { SearchFilterBar } from './components/SearchFilterBar';
import { useAuthStore } from './store/authStore';
import { LogOut, CheckSquare, Star, Triangle, Sun, Moon } from 'lucide-react';

function Dashboard() {
  const { user, logout, isDarkMode, toggleDarkMode } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-zinc-900 text-black dark:text-white font-sans pb-12 relative z-0 overflow-x-hidden transition-colors duration-300">
      {/* Dekorasi Background / Stickers */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden transition-opacity duration-300">
        <div className="absolute top-32 left-10 w-24 h-24 bg-neo-pink border-4 border-black rounded-full opacity-30 dark:opacity-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
        <div className="absolute top-64 right-12 w-20 h-20 bg-neo-blue border-4 border-black rotate-12 opacity-30 dark:opacity-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-neo-green border-4 border-black rounded-tl-3xl rotate-45 opacity-30 dark:opacity-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
        <Star className="absolute bottom-20 right-1/4 w-16 h-16 text-neo-yellow fill-neo-yellow opacity-40 dark:opacity-100 rotate-[20deg] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] stroke-black stroke-[2]" />
        <Triangle className="absolute top-1/3 left-1/3 w-12 h-12 text-neo-pink fill-neo-pink opacity-40 dark:opacity-100 -rotate-[15deg] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] stroke-black stroke-[2]" />
      </div>

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-neo-yellow dark:bg-neo-blue border-b-4 border-black p-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold hidden md:inline">Halo, {user?.name}</span>
            
            <button
              onClick={toggleDarkMode}
              className="btn-neo !bg-white hover:!bg-gray-200 !text-black !p-2 flex items-center justify-center rounded-full"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={logout}
              className="btn-neo !bg-white hover:!bg-red-400 !text-black flex items-center gap-2 px-3 py-1 text-sm md:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Kolom Kiri - List Tugas */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <SearchFilterBar />
            <div className="card-neo bg-white dark:bg-zinc-800 !p-0 flex flex-col transition-colors duration-300">
              <div className="p-4 border-b-2 border-black dark:border-white bg-neo-blue dark:bg-neo-blue transition-colors duration-300">
                <h2 className="text-xl font-black uppercase dark:text-white text-black">Daftar Tugas</h2>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto bg-[#f9f9f9] dark:bg-zinc-900 transition-colors duration-300">
                <TaskList />
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Form Tambah */}
          <div className="lg:col-span-1">
            <TaskForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
