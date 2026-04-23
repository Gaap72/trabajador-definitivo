"use client";

import { useEffect, useState } from "react";
import { Plus, Heart, Search, LogOut, UtensilsCrossed, Home as HomeIcon, Settings, Flame } from "lucide-react";
import Link from "next/link";

export default function PrivatePage() {
  const [user, setUser] = useState<any>(null);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    // Simular recuperacion de usuario persistente
    const storedUser = localStorage.getItem("supabase_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({ email: "chef@invitado.com", user_metadata: { full_name: "Chef Invitado" } });
    }

    const savedFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    setFavCount(savedFavs.length);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r hidden md:flex flex-col shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
             <div className="bg-orange-600 p-2 rounded-xl"><UtensilsCrossed className="text-white h-6 w-6" /></div>
             <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Recetas Web</h1>
          </div>
          <div className="bg-orange-50 p-6 rounded-3xl mb-8 border border-orange-100 shadow-inner">
             <p className="text-xs font-black uppercase text-orange-400 mb-2 tracking-widest leading-none">Estacion de</p>
             <p className="font-black text-orange-900 text-lg truncate">{user?.user_metadata?.full_name || "Cocinero"}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-3">
          <Link href="/" className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-[1.5rem] font-black transition-all">
            <HomeIcon className="h-6 w-6" /> Pagina de Inicio
          </Link>
          <Link href="/private" className="flex items-center gap-4 px-6 py-4 text-orange-600 bg-orange-50 rounded-[1.5rem] font-black transition-all shadow-sm">
            <Search className="h-6 w-6" /> Panel de Control
          </Link>
          <Link href="/private/my-recipes" className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-orange-600 hover:bg-orange-50/50 rounded-[1.5rem] font-black transition-all group">
            <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" /> Mis Creaciones
          </Link>
          <Link href="/private/favorites" className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-orange-600 hover:bg-orange-50/50 rounded-[1.5rem] font-black transition-all group">
            <Heart className="h-6 w-6 group-hover:scale-110 transition-transform" /> Favoritos ({favCount})
          </Link>
          <Link href="/private/settings" className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-orange-600 hover:bg-orange-50/50 rounded-[1.5rem] font-black transition-all group">
            <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform" /> Ajustes de Cuenta
          </Link>
        </nav>

        <div className="p-6 mt-auto border-t border-gray-50">
          <button 
            onClick={() => { localStorage.removeItem("supabase_user"); window.location.href = "/"; }}
            className="flex items-center gap-4 w-full px-6 py-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[1.5rem] font-black transition-all group"
          >
            <LogOut className="h-6 w-6 group-hover:-translate-x-1 transition-transform" /> Salir del Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h2 className="text-6xl font-black text-gray-900 tracking-tight mb-2">¡Hola, Chef!</h2>
            <p className="text-2xl text-gray-400 font-medium">Es un gran momento para crear algo nuevo.</p>
          </div>
          <Link href="/private/new-recipe" className="bg-orange-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-orange-700 transition-all flex items-center gap-4 shadow-[0_20px_50px_rgba(234,88,12,0.3)] active:scale-95 border-b-4 border-orange-800">
            <Plus className="h-7 w-7 stroke-[4]" /> NUEVA RECETA
          </Link>
        </header>

        {/* Buscador de Ingredientes */}
        <section className="mb-20">
          <div className="bg-white p-16 rounded-[4rem] shadow-2xl border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50" />
            <h3 className="text-3xl font-black text-gray-900 mb-8 relative z-10">Buscador Inteligente de Despensa</h3>
            <div className="relative z-10 group">
              <Search className="absolute left-8 top-7 h-10 w-10 text-orange-600 group-focus-within:scale-110 transition-transform" />
              <input
                type="text"
                placeholder="Ingresa ingredientes (ej: pollo, ajo, limon)..."
                className="w-full pl-20 pr-10 py-8 rounded-[2.5rem] bg-gray-50 border-4 border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all text-2xl font-bold shadow-inner placeholder:text-gray-300"
              />
            </div>
            <div className="mt-8 flex gap-3 flex-wrap">
               <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-gray-400 border border-gray-100 shadow-sm italic">Sugerencia: "tomate, cebolla, pasta"</span>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
              <p className="text-4xl font-black text-orange-600 mb-2">{favCount}</p>
              <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Favoritos Guardados</p>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
              <p className="text-4xl font-black text-orange-600 mb-2">0</p>
              <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Mis Recetas Creadas</p>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
              <p className="text-4xl font-black text-green-500 mb-2">100%</p>
              <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Estado de Perfil</p>
           </div>
        </div>
      </main>
    </div>
  );
}