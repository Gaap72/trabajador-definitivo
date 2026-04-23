"use client";

import { useState, useEffect, use } from "react";
import recipes from "@/data/recipes.json";
import { ChevronLeft, Flame, Utensils, ListOrdered, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const recipe = (recipes as any[]).find((r) => r.id === id);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    setIsFavorite(savedFavs.includes(id));
  }, [id]);

  if (!recipe) return notFound();

  const toggleFavorite = () => {
    const savedFavs = JSON.parse(localStorage.getItem("user_favorites") || "[]");
    let newFavs;
    if (savedFavs.includes(id)) {
      newFavs = savedFavs.filter((favId: string) => favId !== id);
    } else {
      newFavs = [...savedFavs, id];
    }
    localStorage.setItem("user_favorites", JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white/80 backdrop-blur-md border-b px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-orange-600 font-black hover:scale-105 transition-transform">
            <ChevronLeft className="h-6 w-6" /> VOLVER
          </Link>
          <div className="flex gap-4">
            <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors"><Share2 className="h-6 w-6" /></button>
            <button 
              onClick={toggleFavorite}
              className={`p-2 transition-all active:scale-90 ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
            >
              <Heart className={`h-7 w-7 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="h-[32rem] relative group">
            <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-12">
              <div className="flex gap-3 mb-6">
                <span className="bg-orange-600 text-white px-5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                  {recipe.category}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white px-5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-widest">
                  Premium
                </span>
              </div>
              <h1 className="text-6xl font-black text-white drop-shadow-2xl mb-4">{recipe.title}</h1>
              <p className="text-orange-100 text-xl font-medium max-w-2xl line-clamp-2">{recipe.description}</p>
            </div>
          </div>

          <div className="p-12 md:p-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Columna Izquierda: Info e Ingredientes */}
              <div className="lg:col-span-1 space-y-12">
                <section className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 shadow-inner">
                   <div className="flex items-center gap-4 mb-6">
                     <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-200"><Flame className="text-white h-6 w-6" /></div>
                     <div>
                        <p className="text-xs font-black text-orange-400 uppercase tracking-widest leading-none">Energia</p>
                        <p className="text-2xl font-black text-orange-900">{recipe.calories} kcal</p>
                     </div>
                   </div>
                   <div className="h-px bg-orange-200 w-full mb-6" />
                   <p className="text-orange-700 font-medium italic">Informacion nutricional estimada por porcion basada en ingredientes frescos.</p>
                </section>

                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-orange-100 p-3 rounded-2xl"><Utensils className="text-orange-600 h-6 w-6" /></div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Ingredientes</h3>
                  </div>
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ing: string, i: number) => (
                      <li key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-700 hover:bg-white hover:shadow-xl hover:border-orange-200 transition-all cursor-default">
                        <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Columna Derecha: Pasos */}
              <div className="lg:col-span-2">
                <section>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="bg-gray-900 p-3 rounded-2xl"><ListOrdered className="text-white h-6 w-6" /></div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Pasos de Preparacion</h3>
                  </div>
                  <div className="space-y-10 relative">
                    <div className="absolute left-6 top-0 w-1 h-full bg-gray-100 -z-10 rounded-full" />
                    {recipe.steps.map((step: string, i: number) => (
                      <div key={i} className="flex gap-8 group">
                        <div className="flex-shrink-0 w-12 h-12 bg-white border-4 border-gray-900 text-gray-900 rounded-[1.25rem] flex items-center justify-center font-black text-xl group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white transition-all shadow-xl">
                          {i + 1}
                        </div>
                        <div className="pt-2">
                           <p className="text-gray-700 text-xl font-bold leading-relaxed group-hover:text-gray-900 transition-colors">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}