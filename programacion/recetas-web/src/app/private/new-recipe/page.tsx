"use client";

import { ChevronLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewRecipePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Almuerzo");
  const [calories, setCalories] = useState(0);
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    const newRecipe = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description: "Receta creada por el usuario",
      category,
      calories: Number(calories),
      image_url: "https://images.unsplash.com/photo-1495195129352-aec325a55b65?auto=format&fit=crop&w=800&q=80",
      ingredients,
      steps,
      is_public: true
    };

    // Guardar en localStorage para persistencia simulada
    const existing = JSON.parse(localStorage.getItem("user_recipes") || "[]");
    localStorage.setItem("user_recipes", JSON.stringify([...existing, newRecipe]));

    setTimeout(() => {
      alert("¡Receta guardada con exito!");
      window.location.href = "/private/my-recipes";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/private" className="flex items-center gap-2 text-orange-600 font-bold">
          <ChevronLeft /> Cancelar
        </Link>
        <button 
          onClick={handleSave}
          disabled={!title || isSaving}
          className="bg-orange-600 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all disabled:opacity-50"
        >
          <Save className="h-5 w-5" /> {isSaving ? "Guardando..." : "Guardar Receta"}
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-4 mt-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Crear Nueva Receta</h1>
        
        <div className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
          <section className="space-y-4">
            <label className="block text-sm font-black uppercase tracking-widest text-gray-400">Titulo de la Receta</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Lasagna de la Abuela" 
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-200 outline-none text-xl font-bold" 
            />
          </section>

          <div className="grid grid-cols-2 gap-6">
            <section className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-400">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-200 outline-none font-bold"
              >
                <option>Almuerzo</option>
                <option>Desayuno</option>
                <option>Cena</option>
                <option>Postre</option>
                <option>Entrante</option>
              </select>
            </section>
            <section className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-400">Calorias Est.</label>
              <input 
                type="number" 
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                placeholder="450" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-200 outline-none font-bold" 
              />
            </section>
          </div>

          <section className="space-y-4">
            <label className="block text-sm font-black uppercase tracking-widest text-gray-400">Ingredientes</label>
            {ingredients.map((val, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  type="text" 
                  value={val}
                  onChange={(e) => {
                    const newIngs = [...ingredients];
                    newIngs[i] = e.target.value;
                    setIngredients(newIngs);
                  }}
                  placeholder="Ingrediente..." 
                  className="flex-1 p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold" 
                />
                <button onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="p-4 text-red-400 hover:text-red-600"><Trash2 /></button>
              </div>
            ))}
            <button onClick={() => setIngredients([...ingredients, ""])} className="flex items-center gap-2 text-orange-600 font-black py-2"><Plus className="h-5 w-5" /> Añadir ingrediente</button>
          </section>

          <section className="space-y-4">
            <label className="block text-sm font-black uppercase tracking-widest text-gray-400">Pasos de Preparacion</label>
            {steps.map((val, i) => (
              <div key={i} className="flex gap-2">
                <span className="p-4 font-black text-orange-600">{i+1}</span>
                <textarea 
                  value={val}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[i] = e.target.value;
                    setSteps(newSteps);
                  }}
                  className="flex-1 p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold" 
                  placeholder="Describe el paso..." 
                />
              </div>
            ))}
            <button onClick={() => setSteps([...steps, ""])} className="flex items-center gap-2 text-orange-600 font-black py-2"><Plus className="h-5 w-5" /> Añadir paso</button>
          </section>
        </div>
      </main>
    </div>
  );
}