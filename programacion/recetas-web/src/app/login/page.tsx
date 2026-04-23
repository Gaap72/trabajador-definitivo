"use client";

import { createClient } from "@/utils/supabase/client";
import { ChefHat } from "lucide-react";

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
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
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
