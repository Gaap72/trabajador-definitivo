"use client";

import { createClient } from "@/utils/supabase/client";
import { ChefHat } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
    });
  };

  const handleGuest = () => {
    window.location.href = "/private";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <ChefHat className="mx-auto h-12 w-12 text-orange-600" />
          <h2 className="mt-6 text-3xl font-black tracking-tight text-gray-900">
            Bienvenido a RecetasWeb
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-medium">
            Accede para guardar tus propias creaciones
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleLogin("google")}
            className="group relative flex w-full justify-center rounded-2xl border border-gray-300 bg-white px-4 py-4 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
          >
            <span className="flex items-center gap-3">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
              Continuar con Google
            </span>
          </button>

          <button
            onClick={() => handleLogin("github")}
            className="group relative flex w-full justify-center rounded-2xl bg-gray-900 px-4 py-4 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-lg"
          >
            <span className="flex items-center gap-3">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              Continuar con GitHub
            </span>
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm font-bold"><span className="bg-white px-4 text-gray-400">O TAMBIEN</span></div>
          </div>

          <button
            onClick={handleGuest}
            className="w-full text-center py-4 text-orange-600 font-black hover:text-orange-700 transition-colors bg-orange-50 rounded-2xl"
          >
            Continuar como Invitado (Sin sesion)
          </button>
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
            Volver a la pagina publica
          </Link>
        </div>
      </div>
    </div>
  );
}