"use client";

import { ChefHat, Plus, ChevronLeft, Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user_recipes") || "[]");
    setRecipes(saved);
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <Link href="/private" className="flex items-center gap-2 text-orange-600 mb-8 font-bold">
        <ChevronLeft /> Volver al panel
      </Link>
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <ChefHat className="h-10 w-10 text-orange-600" />
          <h1 className="text-4xl font-black text-gray-900">Mis Creaciones</h1>
        </div>
        <Link href="/private/new-recipe" className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-orange-700 transition-all">
          <Plus /> Nueva Receta
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {recipes.length > 0 ? (
           recipes.map((recipe) => (
             <div key={recipe.id} className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-orange-600">
                    {recipe.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{recipe.title}</h3>
                  <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-3 py-1 rounded-lg w-fit">
                    <Flame className="h-4 w-4" />
                    <span className="font-bold text-xs">{recipe.calories} kcal</span>
                  </div>
                </div>
             </div>
           ))
         ) : (
           <div className="col-span-full bg-white p-12 rounded-[2.5rem] border-4 border-dashed border-gray-100 text-center">
              <p className="text-gray-400 font-bold text-xl mb-4">Aun no tienes recetas propias.</p>
              <Link href="/private/new-recipe" className="text-orange-600 font-black text-lg">Crea tu primera receta aqui</Link>
           </div>
         )}
      </div>
    </div>
  );
}