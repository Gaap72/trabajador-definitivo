import recipes from "@/data/recipes.json";
import { ChevronLeft, Flame, Utensils, ListOrdered } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = (recipes as any[]).find((r) => r.id === id);

  if (!recipe) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-orange-600 font-bold hover:scale-105 transition-transform">
            <ChevronLeft className="h-5 w-5" /> Volver
          </Link>
          <span className="text-gray-400 font-medium text-sm">RecetasWeb Premium</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="h-[28rem] relative group">
            <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
              <span className="bg-orange-600 text-white w-fit px-4 py-1 rounded-full text-xs font-black uppercase mb-4 shadow-lg tracking-widest">
                {recipe.category}
              </span>
              <h1 className="text-5xl font-black text-white drop-shadow-2xl">{recipe.title}</h1>
            </div>
          </div>

          <div className="p-12">
            <div className="flex items-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-orange-200">
                <Flame className="h-6 w-6" />
                <span className="text-xl font-black">{recipe.calories} kcal</span>
              </div>
            </div>

            <p className="text-2xl text-gray-500 italic mb-16 leading-relaxed font-medium">"{recipe.description}"</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-orange-100 p-3 rounded-2xl"><Utensils className="text-orange-600 h-6 w-6" /></div>
                  <h3 className="text-2xl font-black text-gray-900">Ingredientes</h3>
                </div>
                <ul className="space-y-4">
                  {recipe.ingredients.map((ing: string, i: number) => (
                    <li key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-700 hover:bg-white hover:shadow-md transition-all">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-orange-100 p-3 rounded-2xl"><ListOrdered className="text-orange-600 h-6 w-6" /></div>
                  <h3 className="text-2xl font-black text-gray-900">Preparacion</h3>
                </div>
                <div className="space-y-8">
                  {recipe.steps.map((step: string, i: number) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black group-hover:bg-orange-600 transition-colors shadow-lg">
                        {i + 1}
                      </div>
                      <p className="text-gray-600 text-lg font-medium leading-snug pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}