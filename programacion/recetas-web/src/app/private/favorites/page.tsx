import { Heart, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="p-8">
      <Link href="/private" className="flex items-center gap-2 text-orange-600 mb-8">
        <ChevronLeft /> Volver al panel
      </Link>
      <div className="flex items-center gap-3 mb-10">
        <Heart className="h-10 w-10 text-red-500 fill-red-500" />
        <h1 className="text-4xl font-extrabold text-gray-900">Mis Favoritos</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed flex flex-col items-center">
           <p className="text-gray-500 mb-4 italic">TodavÃ­a no has guardado ninguna receta como favorita.</p>
           <Link href="/" className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold">Explorar Recetas</Link>
        </div>
      </div>
    </div>
  );
}
