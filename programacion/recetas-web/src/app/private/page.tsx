import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Plus, Heart, Search, LogOut, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r hidden md:flex flex-col shadow-2xl">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
             <div className="bg-orange-600 p-2 rounded-xl"><UtensilsCrossed className="text-white h-6 w-6" /></div>
             <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Mi Cocina</h1>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl mb-8 border border-gray-100">
             <p className="text-xs font-black uppercase text-gray-400 mb-1 tracking-widest">Chef</p>
             <p className="font-bold text-gray-700 truncate">{user.user_metadata.full_name || user.email}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-3">
          <Link href="/private" className="flex items-center gap-4 px-6 py-4 text-orange-600 bg-orange-50 rounded-[1.5rem] font-black transition-all">
            <Search className="h-6 w-6" /> Explorar
          </Link>
          <Link href="/private/my-recipes" className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-orange-600 hover:bg-orange-50/50 rounded-[1.5rem] font-black transition-all group">
            <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" /> Mis Recetas
          </Link>
          <Link href="/private/favorites" className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-orange-600 hover:bg-orange-50/50 rounded-[1.5rem] font-black transition-all group">
            <Heart className="h-6 w-6 group-hover:scale-110 transition-transform" /> Favoritos
          </Link>
        </nav>

        <div className="p-6 mt-auto">
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-4 w-full px-6 py-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[1.5rem] font-black transition-all group">
              <LogOut className="h-6 w-6 group-hover:-translate-x-1 transition-transform" /> Cerrar SesiÃ³n
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-2">Â¡Hola, Chef!</h2>
            <p className="text-xl text-gray-400 font-medium">Â¿QuÃ© vamos a cocinar hoy?</p>
          </div>
          <Link href="/private/new-recipe" className="bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-orange-700 transition-all flex items-center gap-3 shadow-2xl shadow-orange-200 active:scale-95">
            <Plus className="h-6 w-6 stroke-[3]" /> Nueva Receta
          </Link>
        </header>

        {/* Buscador de Ingredientes */}
        <section className="mb-20">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
            <h3 className="text-2xl font-black text-gray-900 mb-6 relative z-10">Buscador Inteligente</h3>
            <div className="relative z-10">
              <Search className="absolute left-6 top-5 h-8 w-8 text-orange-600" />
              <input
                type="text"
                placeholder="Escribe ingredientes separados por comas..."
                className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all text-xl font-bold shadow-inner"
              />
            </div>
            <p className="mt-6 text-gray-400 font-medium italic">Ejemplo: pollo, tomate, cebolla</p>
          </div>
        </section>

        {/* Stats / Favorites Preview */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <div className="bg-red-100 p-3 rounded-2xl"><Heart className="text-red-500 fill-red-500 h-6 w-6" /></div>
               <h3 className="text-3xl font-black text-gray-900 tracking-tight">Tus Favoritos</h3>
            </div>
            <Link href="/private/favorites" className="text-orange-600 font-black hover:underline text-lg">Ver todos â†’</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
             <div className="bg-white p-12 rounded-[2.5rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center group hover:border-orange-200 transition-colors">
                <div className="bg-gray-50 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform"><Heart className="h-10 w-10 text-gray-200" /></div>
                <p className="text-gray-400 font-black text-xl mb-2">Sin favoritos</p>
                <p className="text-gray-300 font-medium">Guarda las recetas que mÃ¡s te gusten para verlas aquÃ­.</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
