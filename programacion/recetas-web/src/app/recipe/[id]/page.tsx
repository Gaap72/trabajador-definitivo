import { createClient } from "@/utils/supabase/server";
import { ChevronLeft, Flame, Utensils, ListOrdered } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RecipeDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recipes } = await supabase.from("recipes").select("*");
  const recipe = recipes?.find((r: any) => r.id === id);

  if (!recipe) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-orange-600 font-medium">
          <ChevronLeft className="h-5 w-5" /> Volver a recetas
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border">
          <div className="h-80 bg-gray-200 relative">
            <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h1 className="text-4xl font-extrabold text-white">{recipe.title}</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-6 mb-8 text-gray-600">
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-orange-700">{recipe.calories} kcal</span>
              </div>
              <span className="bg-gray-100 px-4 py-2 rounded-full font-medium">{recipe.category}</span>
            </div>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed">{recipe.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Utensils className="text-orange-600" /> Ingredientes
                </h3>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                      {ing}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <ListOrdered className="text-orange-600" /> PreparaciÃ³n
                </h3>
                <div className="space-y-6">
                  {recipe.steps.map((step: string, i: number) => (
                    <div key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 pt-1">{step}</p>
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
