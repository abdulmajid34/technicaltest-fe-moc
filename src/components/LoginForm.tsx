import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { CheckSquare } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (data.email === 'user@example.com' && data.password === 'password123') {
        login({ id: '1', email: data.email, name: 'Test User' }, 'dummy-token-12345');
        toast.success('Login berhasil');
        navigate('/');
      } else {
        toast.error('Email atau password salah');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#f9f9f9] text-black">
      {/* Kolom Kiri */}
      <div className="bg-neo-yellow p-8 md:p-12 flex flex-col items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-black relative overflow-hidden">
        {/* Dekorasi Neobrutalism */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-neo-pink border-4 border-black rounded-full mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-neo-blue border-4 border-black mix-blend-multiply opacity-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-12"></div>
        
        <div className="card-neo bg-white max-w-sm w-full text-center z-10 p-8 transform -rotate-2 hover:rotate-0 transition-transform">
          <CheckSquare className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight leading-tight">
            TaskFlow<br/>Manager
          </h1>
          <p className="font-bold text-lg border-t-2 border-black pt-4 mt-2">
            Urus tugasmu dengan gaya.
          </p>
        </div>
      </div>

      {/* Kolom Kanan */}
      <div className="p-8 md:p-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase mb-2">Masuk</h2>
            <div className="card-neo bg-neo-blue inline-block mb-4 p-3">
              <p className="font-bold text-sm">
                Hint Kredensial:<br/>
                Email: <span className="bg-white px-1 border border-black">user@example.com</span><br/>
                Pass: <span className="bg-white px-1 border border-black">password123</span>
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-neo w-full"
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="mt-2 text-sm font-bold bg-red-200 border-2 border-black inline-block px-2">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Password</label>
                <input
                  {...register('password')}
                  type="password"
                  className="input-neo w-full"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm font-bold bg-red-200 border-2 border-black inline-block px-2">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-neo w-full text-lg py-3 uppercase tracking-wide"
              >
                {isLoading ? 'Memproses...' : 'GAS MASUK!'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

