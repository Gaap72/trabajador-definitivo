import { ChefHat, Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function MyRecipesPage() {
  return (
    <div className="p-8">
      <Link href="/private" className="flex items-center gap-2 text-orange-600 mb-8">
        <ChevronLeft /> Volver al panel
      </Link>
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <ChefHat className="h-10 w-10 text-orange-600" />
          <h1 className="text-4xl font-extrabold text-gray-900">Mis Creaciones</h1>
        </div>
        <button className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-orange-700 transition-all">
          <Plus /> Nueva Receta
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="bg-white p-12 rounded-3xl border-2 border-dashed text-center">
            <p className="text-gray-400">AnÃ­mate a publicar tu primera receta.</p>
         </div>
      </div>
    </div>
  );
}
