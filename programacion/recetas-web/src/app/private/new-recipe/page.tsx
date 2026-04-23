"use client";

import { ChevronLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewRecipePage() {
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/private" className="flex items-center gap-2 text-orange-600 font-bold">
          <ChevronLeft /> Cancelar
        </Link>
        <button className="bg-orange-600 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200">
          <Save className="h-5 w-5" /> Guardar Receta
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-4 mt-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Crear Nueva Receta</h1>
        
        <div className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
          <section className="space-y-4">
            <label className="block text-sm font-black uppercase tracking-widest text-gray-400">TÃ­tulo de la Receta</label>
            <input type="text" placeholder="Ej: Lasagna de la Abuela" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-200 outline-none text-xl font-bold" />
          </section>

          <div className="grid grid-cols-2 gap-6">
            <section className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-400">CategorÃ­a</label>
              <select className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-200 outline-none font-bold">
                <option>Almuerzo</option>
                <option>Desayuno</option>
                <option>Cena</option>
                <option>Postre</option>
              </select>
            </section>
            <section className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-400">CalorÃ­as Est.</label>
              <input type="number" placeholder="450" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-200 outline-none font-bold" />
            </section>
          </div>

          <section className="space-y-4">
            <label className="block text-sm font-black uppercase tracking-widest text-gray-400">Ingredientes</label>
            {ingredients.map((_, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" placeholder="Ingrediente..." className="flex-1 p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold" />
                <button onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="p-4 text-red-400 hover:text-red-600"><Trash2 /></button>
              </div>
            ))}
            <button onClick={() => setIngredients([...ingredients, ""])} className="flex items-center gap-2 text-orange-600 font-black py-2"><Plus className="h-5 w-5" /> AÃ±adir ingrediente</button>
          </section>

          <section className="space-y-4">
            <label className="block text-sm font-black uppercase tracking-widest text-gray-400">Pasos de PreparaciÃ³n</label>
            {steps.map((_, i) => (
              <div key={i} className="flex gap-2">
                <span className="p-4 font-black text-orange-600">{i+1}</span>
                <textarea className="flex-1 p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold" placeholder="Describe el paso..." />
              </div>
            ))}
            <button onClick={() => setSteps([...steps, ""])} className="flex items-center gap-2 text-orange-600 font-black py-2"><Plus className="h-5 w-5" /> AÃ±adir paso</button>
          </section>
        </div>
      </main>
    </div>
  );
}
