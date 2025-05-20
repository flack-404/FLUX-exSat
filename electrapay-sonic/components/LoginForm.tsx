'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser } from '@/lib/auth';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export function LoginForm({ type }: { type: 'organization' | 'employee' }) {
  const router = useRouter();
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const user = authenticateUser(email, password);
    
    if (user && user.type === type) {
      sessionStorage.setItem('user', JSON.stringify(user));
      router.push(`/dashboard/${type}`);
    } else {
      setError('Invalid credentials');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-700 p-4 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-200">Email</label>
        <div className="relative">
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
            placeholder="you@example.com"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-5 w-5" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-200">Password</label>
        <div className="relative">
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
            placeholder="••••••••"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-5 w-5" />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        Login
      </button>
    </form>
  );
}

