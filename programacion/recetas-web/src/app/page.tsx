"use client";

import { useState, useEffect } from "react";
import { Search, ChefHat, Flame, Heart, User, Sparkles } from "lucide-react";
import Link from "next/link";
import recipesData from "@/data/recipes.json";

export default function Home() {
  const [search, setSearch] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipesData);
  const [category, setCategory] = useState("Todo");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    setFavorites(savedFavs);
    const user = localStorage.getItem("supabase_user");
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const filtered = (recipesData as any[]).filter(recipe => {
      const titleMatch = recipe.title.toLowerCase().includes(search.toLowerCase());
      const ingredientMatch = recipe.ingredients.some((i: string) => i.toLowerCase().includes(search.toLowerCase()));
      const matchesSearch = titleMatch || ingredientMatch;
      const matchesCategory = category === "Todo" || recipe.category === category;
      return matchesSearch && matchesCategory;
    });
    setFilteredRecipes(filtered);
  }, [search, category]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(favId => favId !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem("user_favorites", JSON.stringify(newFavs));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-100">
               <ChefHat className="text-white h-7 w-7" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Recetas Web</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/private" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-sm font-black hover:bg-black transition-all shadow-xl active:scale-95">
                <User className="h-4 w-4" /> MI PANEL
              </Link>
            ) : (
              <Link href="/login" className="bg-orange-600 text-white px-6 py-2.5 rounded-2xl text-sm font-black hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95">
                INICIAR SESION
              </Link>
            )}
          </div>
        </div>
      </nav>

      <header className="bg-orange-600 py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-widest mb-8 border border-white/20">
            <Sparkles className="h-4 w-4" /> La mayor coleccion culinaria
          </div>
          <h1 className="text-6xl font-black text-white sm:text-8xl mb-6 tracking-tighter leading-none">Cocinemos algo<br/>increible hoy</h1>
          <p className="text-orange-100 text-2xl font-medium mb-12 max-w-3xl mx-auto">Explora mas de 50 recetas detalladas con ingredientes frescos y pasos guiados para convertirte en un experto.</p>
          
          <div className="mt-8 max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <Search className="absolute left-7 top-6 h-8 w-8 text-orange-600" />
              <input
                type="text"
                placeholder="Busca por nombre o ingrediente (ej: pasta, pollo, limon)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-20 pr-10 py-7 rounded-full border-none focus:ring-0 shadow-2xl text-2xl font-bold text-gray-800 placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-wrap gap-3 mb-20 justify-center">
          {["Todo", "Desayuno", "Almuerzo", "Cena", "Entrante", "Postre"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-10 py-4 rounded-2xl text-sm font-black transition-all border-4 ${
                category === cat ? "bg-orange-600 border-orange-600 text-white shadow-2xl scale-110" : "bg-white border-gray-100 text-gray-400 hover:border-orange-200 hover:text-orange-600 shadow-sm"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="group relative">
                <Link href={`/recipe/${recipe.id}`}>
                  <div className="bg-white rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all duration-700 border border-gray-100 overflow-hidden h-full flex flex-col transform hover:-translate-y-4">
                    <div className="h-72 overflow-hidden relative">
                      <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] shadow-xl border border-orange-50">
                        {recipe.category}
                      </div>
                      <button 
                        onClick={(e) => toggleFavorite(e, recipe.id)}
                        className={`absolute top-8 right-8 p-4 rounded-[1.5rem] transition-all shadow-2xl active:scale-75 z-10 ${favorites.includes(recipe.id) ? "bg-red-500 text-white scale-110" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
                      >
                        <Heart className={`h-6 w-6 ${favorites.includes(recipe.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    <div className="p-10 flex-1 flex flex-col">
                      <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-orange-600 transition-colors leading-[1.1] tracking-tight">{recipe.title}</h3>
                      <p className="text-gray-400 font-bold line-clamp-2 mb-10 leading-relaxed text-lg italic">"{recipe.description}"</p>
                      <div className="mt-auto pt-8 border-t-2 border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-orange-600 bg-orange-50 px-5 py-2.5 rounded-2xl border border-orange-100 shadow-inner">
                          <Flame className="h-5 w-5" />
                          <span className="font-black text-sm">{recipe.calories} KCAL</span>
                        </div>
                        <span className="text-gray-900 font-black text-xs uppercase tracking-widest border-b-4 border-orange-500 pb-1">Ver Guia</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
             <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-gray-100">
                <ChefHat className="h-24 w-24 text-gray-200 mx-auto mb-8 animate-bounce" />
                <h3 className="text-3xl font-black text-gray-400 uppercase tracking-tighter">Sin resultados</h3>
                <p className="text-gray-300 font-bold text-xl mt-2">Busca ingredientes mas comunes como 'Pollo' o 'Pasta'</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}