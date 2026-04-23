import { createClient } from "@/utils/supabase/server";
import { Search, ChefHat, Flame, Clock } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*, categories(name)")
    .eq("is_public", true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="text-orange-600 h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">RecetasWeb</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
              Panel Privado
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-orange-600 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Encuentra tu prÃ³xima receta favorita
          </h1>
          <p className="mt-4 text-xl text-orange-100">
            Cientos de recetas organizadas por categorÃ­as con informaciÃ³n nutricional completa.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar recetas por nombre o ingrediente..."
              className="w-full pl-10 pr-4 py-3 rounded-full border-none focus:ring-2 focus:ring-orange-300 shadow-xl"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recetas Destacadas</h2>
          <div className="flex gap-2">
            {/* CategorÃ­as - Placeholder */}
            {["Todo", "Desayuno", "Almuerzo", "Cena", "Postres"].map((cat) => (
              <button key={cat} className="px-4 py-1.5 rounded-full bg-white border text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes?.length ? (
            recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border">
                <div className="h-48 bg-gray-200 relative">
                  {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Sin Imagen</div>
                  )}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 uppercase tracking-wider">
                    {recipe.categories?.name || "General"}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{recipe.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span>{recipe.calories || 0} kcal</span>
                    </div>
                    <Link href={`/recipe/${recipe.id}`} className="font-semibold text-orange-600 hover:underline">
                      Ver receta
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500">No se encontraron recetas pÃºblicas todavÃ­a.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
