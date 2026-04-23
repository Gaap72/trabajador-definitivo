"use client";

import { createClient } from "@/utils/supabase/client";
import { Github } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Inicia sesiÃ³n en RecetasWeb
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu panel privado para gestionar tus recetas
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleLogin("google")}
            className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
              Continuar con Google
            </span>
          </button>

          <button
            onClick={() => handleLogin("github")}
            className="group relative flex w-full justify-center rounded-md bg-gray-900 px-3 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Continuar con GitHub
            </span>
          </button>
        </div>
        <div className="text-center">
          <a href="/" className="text-sm font-medium text-orange-600 hover:text-orange-500">
            Volver a la pÃ¡gina pÃºblica
          </a>
        </div>
      </div>
    </div>
  );
}
