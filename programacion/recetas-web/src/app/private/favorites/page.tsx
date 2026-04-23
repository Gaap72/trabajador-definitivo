"use client";

import { useState, useEffect } from "react";
import { Heart, ChevronLeft, Trash2, Flame } from "lucide-react";
import Link from "next/link";
import recipesData from "@/data/recipes.json";

export default function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);

  useEffect(() => {
    const savedFavIds = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    const favs = recipesData.filter(r => savedFavIds.includes(r.id));
    setFavoriteRecipes(favs);
  }, []);

  const removeFavorite = (id: string) => {
    const savedFavIds = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    const newIds = savedFavIds.filter((favId: string) => favId !== id);
    localStorage.setItem("user_favorites", JSON.stringify(newIds));
    setFavoriteRecipes(favoriteRecipes.filter(r => r.id !== id));
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <Link href="/private" className="flex items-center gap-2 text-orange-600 mb-8 font-black hover:translate-x-1 transition-transform">
        <ChevronLeft /> VOLVER AL PANEL
      </Link>
      
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-red-100 p-4 rounded-3xl shadow-xl shadow-red-50">
          <Heart className="h-10 w-10 text-red-500 fill-red-500" />
        </div>
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">Mis Favoritos</h1>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">Tu seleccion personalizada</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((recipe) => (
            <div key={recipe.id} className="group relative">
               <Link href={`/recipe/${recipe.id}`}>
                <div className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full">
                  <div className="h-52 overflow-hidden relative">
                    <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavorite(recipe.id); }}
                      className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{recipe.title}</h3>
                    <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-xl w-fit">
                      <Flame className="h-4 w-4" />
                      <span className="font-bold text-xs">{recipe.calories} kcal</span>
                    </div>
                  </div>
                </div>
               </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
             <Heart className="h-20 w-20 text-gray-100 mb-6" />
             <h3 className="text-2xl font-black text-gray-300">Aun no tienes favoritos</h3>
             <p className="text-gray-200 font-medium mb-8">Explora la coleccion y guarda las que mas te gusten.</p>
             <Link href="/" className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-orange-100 hover:scale-105 transition-all">Explorar Recetas</Link>
          </div>
        )}
      </div>
    </div>
  );
}