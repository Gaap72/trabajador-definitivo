"use client";

import { ChevronLeft, User, Bell, Shield, Palette, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const [chefName, setChefName] = useState("Chef Local");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/private" className="flex items-center gap-2 text-orange-600 font-bold">
          <ChevronLeft /> Volver al Panel
        </Link>
        <button className="bg-orange-600 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
          <Save className="h-5 w-5" /> Guardar Cambios
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-4 mt-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Ajustes del Perfil</h1>
        
        <div className="space-y-6">
          {/* Perfil */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-100 p-3 rounded-2xl"><User className="text-orange-600" /></div>
              <h3 className="text-xl font-black text-gray-900">Personalizacion del Chef</h3>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-black uppercase text-gray-400">Nombre Publico</label>
              <input 
                type="text" 
                value={chefName}
                onChange={(e) => setChefName(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-200 outline-none font-bold text-lg"
              />
            </div>
          </div>

          {/* Apariencia */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 p-3 rounded-2xl"><Palette className="text-blue-600" /></div>
              <h3 className="text-xl font-black text-gray-900">Apariencia y Tema</h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="font-bold text-gray-700">Modo Oscuro (Beta)</span>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-green-100 p-3 rounded-2xl"><Shield className="text-green-600" /></div>
              <h3 className="text-xl font-black text-gray-900">Privacidad</h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="font-bold text-gray-700">Recetas publicas por defecto</span>
              <div className="w-12 h-6 bg-orange-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
