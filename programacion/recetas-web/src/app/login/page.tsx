"use client";

import { createClient } from "@/utils/supabase/client";
import { ChefHat, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isSent, setIsSaved] = useState(false);

  const handleLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
    });
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio de link magico
    const mockUser = { 
      id: "user_email_" + Math.random().toString(36).substr(2, 5),
      email: email, 
      user_metadata: { full_name: email.split("@")[0] } 
    };
    localStorage.setItem("supabase_user", JSON.stringify(mockUser));
    setIsSaved(true);
    setTimeout(() => {
      window.location.href = "/private";
    }, 1500);
  };

  const handleGuest = () => {
    window.location.href = "/private";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        <div className="text-center">
          <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-orange-200">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-black tracking-tight text-gray-900">
            Bienvenido
          </h2>
          <p className="mt-2 text-sm text-gray-400 font-bold uppercase tracking-widest">
            Tu cocina digital te espera
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className="mt-8 space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electronico..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all font-bold"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95"
          >
            {isSent ? "Iniciando..." : "Entrar con Correo"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-sm font-black"><span className="bg-white px-4 text-gray-300 uppercase tracking-tighter">O usa tus redes</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleLogin("google")}
            className="flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-gray-50 bg-white hover:bg-gray-50 transition-all shadow-sm font-bold"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
            Google
          </button>

          <button
            onClick={() => handleLogin("github")}
            className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-gray-900 text-white hover:bg-black transition-all shadow-lg font-bold"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            GitHub
          </button>
        </div>

        <button
          onClick={handleGuest}
          className="w-full text-center py-4 text-orange-600 font-black hover:bg-orange-50 rounded-2xl transition-all border-2 border-transparent hover:border-orange-100 mt-4 uppercase text-xs tracking-widest"
        >
          Explorar como Invitado
        </button>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm font-black text-gray-300 hover:text-orange-600 transition-colors">
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </div>
  );
}