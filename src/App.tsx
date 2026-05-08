import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { SearchFilterBar } from './components/SearchFilterBar';
import { useAuthStore } from './store/authStore';
import { LogOut, CheckSquare } from 'lucide-react';

function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black font-sans pb-12">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-neo-yellow border-b-4 border-black p-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold hidden md:inline">Halo, {user?.name}</span>
            <button
              onClick={logout}
              className="btn-neo !bg-white hover:!bg-red-400 flex items-center gap-2 px-3 py-1 text-sm md:text-base"
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
            <div className="card-neo bg-white !p-0 flex flex-col">
              <div className="p-4 border-b-2 border-black bg-neo-blue">
                <h2 className="text-xl font-black uppercase">Daftar Tugas</h2>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto bg-[#f9f9f9]">
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
