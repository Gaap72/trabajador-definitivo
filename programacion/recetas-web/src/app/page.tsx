"use client";

import { useState, useEffect } from "react";
import { Search, ChefHat, Flame, Heart } from "lucide-react";
import Link from "next/link";
import recipesData from "@/data/recipes.json";

export default function Home() {
  const [search, setSearch] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipesData);
  const [category, setCategory] = useState("Todo");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Cargar favoritos del almacenamiento local
    const savedFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    setFavorites(savedFavs);
  }, []);

  useEffect(() => {
    const filtered = recipesData.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) || 
                           recipe.ingredients.some(i => i.toLowerCase().includes(search.toLowerCase()));
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
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="text-orange-600 h-8 w-8" />
            <span className="text-xl font-black text-gray-900 tracking-tighter">RecetasWeb</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-100">
              Panel Privado
            </Link>
          </div>
        </div>
      </nav>

      <header className="bg-orange-600 py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
           <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-black text-white sm:text-7xl mb-6 tracking-tight">Tu proxima receta empieza aqui</h1>
          <p className="text-orange-100 text-xl font-medium mb-10">Explora platos increibles, saludables y faciles de preparar.</p>
          <div className="mt-8 max-w-2xl mx-auto relative">
            <Search className="absolute left-6 top-5 h-8 w-8 text-orange-600" />
            <input
              type="text"
              placeholder="Busca pasta, pollo, postres..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-6 rounded-full border-none focus:ring-8 focus:ring-orange-300 shadow-2xl text-xl font-bold text-gray-800"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-3 mb-16 justify-center">
          {["Todo", "Desayuno", "Almuerzo", "Cena", "Entrante", "Postre"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-sm font-black transition-all border-2 ${
                category === cat ? "bg-orange-600 border-orange-600 text-white shadow-xl scale-105" : "bg-white border-gray-100 text-gray-400 hover:border-orange-500 hover:text-orange-600 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="group relative">
                <Link href={`/recipe/${recipe.id}`}>
                  <div className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 overflow-hidden h-full flex flex-col transform hover:-translate-y-2">
                    <div className="h-64 overflow-hidden relative">
                      <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-xs font-black text-orange-600 uppercase tracking-widest shadow-sm">
                        {recipe.category}
                      </div>
                      {/* Boton de Favoritos Flotante */}
                      <button 
                        onClick={(e) => toggleFavorite(e, recipe.id)}
                        className={`absolute top-6 right-6 p-3 rounded-2xl transition-all shadow-xl active:scale-90 ${favorites.includes(recipe.id) ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 hover:text-red-500"}`}
                      >
                        <Heart className={`h-6 w-6 ${favorites.includes(recipe.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-orange-600 transition-colors leading-tight">{recipe.title}</h3>
                      <p className="text-gray-500 font-medium line-clamp-2 mb-8 leading-relaxed text-lg">{recipe.description}</p>
                      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-2xl">
                          <Flame className="h-5 w-5" />
                          <span className="font-black text-sm">{recipe.calories} kcal</span>
                        </div>
                        <span className="text-gray-900 font-black text-sm uppercase tracking-tighter">Detalles</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
             <div className="col-span-full py-32 text-center">
                <ChefHat className="h-20 w-20 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-400">No encontramos esa receta...</h3>
                <p className="text-gray-300 font-medium">Intenta con otros ingredientes o categorias.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}