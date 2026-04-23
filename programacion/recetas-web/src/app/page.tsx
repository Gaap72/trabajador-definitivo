"use client";

import { useState, useEffect } from "react";
import { Search, ChefHat, Flame } from "lucide-react";
import Link from "next/link";
import recipesData from "@/data/recipes.json";

export default function Home() {
  const [search, setSearch] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipesData);
  const [category, setCategory] = useState("Todo");

  useEffect(() => {
    const filtered = recipesData.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) || 
                           recipe.ingredients.some(i => i.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "Todo" || recipe.category === category;
      return matchesSearch && matchesCategory;
    });
    setFilteredRecipes(filtered);
  }, [search, category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="text-orange-600 h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">RecetasWeb</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors">
              Iniciar SesiÃ³n
            </Link>
          </div>
        </div>
      </nav>

      <header className="bg-orange-600 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Encuentra tu prÃ³xima receta</h1>
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Busca por nombre o ingrediente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-none focus:ring-4 focus:ring-orange-300 shadow-2xl text-lg"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {["Todo", "Desayuno", "Almuerzo", "Cena", "Entrante"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                category === cat ? "bg-orange-600 border-orange-600 text-white shadow-lg" : "bg-white border-gray-200 text-gray-600 hover:border-orange-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredRecipes.map((recipe) => (
            <Link href={`/recipe/${recipe.id}`} key={recipe.id} className="group">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-orange-600 uppercase tracking-tighter">
                    {recipe.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{recipe.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">{recipe.description}</p>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                      <Flame className="h-4 w-4" />
                      <span className="font-bold text-xs">{recipe.calories} kcal</span>
                    </div>
                    <span className="text-orange-600 font-bold text-sm">Ver Receta â†’</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
