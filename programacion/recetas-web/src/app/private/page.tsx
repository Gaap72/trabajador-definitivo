import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Plus, Heart, Search, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default async function PrivatePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-orange-600">Mi Cocina</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/private" className="flex items-center gap-3 px-4 py-2 text-orange-600 bg-orange-50 rounded-lg font-medium">
            <Search className="h-5 w-5" /> Explorar
          </Link>
          <Link href="/private/my-recipes" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Plus className="h-5 w-5" /> Mis Recetas
          </Link>
          <Link href="/private/favorites" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Heart className="h-5 w-5" /> Favoritos
          </Link>
        </nav>
        <div className="p-4 border-t">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">
              <LogOut className="h-5 w-5" /> Cerrar SesiÃ³n
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Bienvenido, {user.user_metadata.full_name || user.email}</h2>
            <p className="text-gray-500">Busca recetas por ingredientes para cocinar hoy.</p>
          </div>
          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nueva Receta
          </button>
        </header>

        {/* Buscador de Ingredientes */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border mb-8">
          <h3 className="text-lg font-bold mb-4">Buscador por Ingredientes (Parte Privada)</h3>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Escribe ingredientes separados por comas (ej: tomate, albahaca, queso)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Favorites Grid Placeholder */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            <h3 className="text-xl font-bold text-gray-900">Tus Favoritos Recientes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="bg-gray-100 h-40 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                AÃºn no tienes favoritos
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
