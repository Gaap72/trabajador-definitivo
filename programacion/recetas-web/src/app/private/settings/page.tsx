"use client";

import { ChevronLeft, User, Shield, Palette, Save, Moon, Sun, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [chefName, setChefName] = useState("Chef Local");
  const [darkMode, setDarkMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Cargar ajustes guardados
    const storedUser = localStorage.getItem("supabase_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setChefName(userData.user_metadata.full_name || "");
    }
    const theme = localStorage.getItem("theme");
    setDarkMode(theme === "dark");
  }, []);

  const handleSave = () => {
    const storedUser = JSON.parse(localStorage.getItem("supabase_user") || "{}");
    const updatedUser = {
      ...storedUser,
      user_metadata: { ...storedUser.user_metadata, full_name: chefName }
    };
    localStorage.setItem("supabase_user", JSON.stringify(updatedUser));
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // En una app real aqui cambiariamos la clase 'dark' en el documento
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-gray-50"} pb-20 transition-colors duration-500`}>
      <nav className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-b"} px-8 py-4 flex items-center justify-between sticky top-0 z-50`}>
        <Link href="/private" className="flex items-center gap-2 text-orange-600 font-bold">
          <ChevronLeft /> Volver al Panel
        </Link>
        <button 
          onClick={handleSave}
          className="bg-orange-600 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
        >
          {isSaved ? <CheckCircle2 className="h-5 w-5" /> : <Save className="h-5 w-5" />}
          {isSaved ? "Guardado!" : "Guardar Cambios"}
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-4 mt-12">
        <h1 className={`text-4xl font-black ${darkMode ? "text-white" : "text-gray-900"} mb-8`}>Ajustes del Perfil</h1>
        
        <div className="space-y-6">
          <div className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"} p-8 rounded-[2.5rem] shadow-xl border`}>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-100 p-3 rounded-2xl"><User className="text-orange-600" /></div>
              <h3 className={`text-xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>Personalizacion del Chef</h3>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-black uppercase text-gray-400">Nombre Publico</label>
              <input 
                type="text" 
                value={chefName}
                onChange={(e) => setChefName(e.target.value)}
                className={`w-full p-4 ${darkMode ? "bg-slate-700 text-white" : "bg-gray-50 text-gray-900"} rounded-2xl border-none focus:ring-4 focus:ring-orange-200 outline-none font-bold text-lg`}
              />
            </div>
          </div>

          <div className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"} p-8 rounded-[2.5rem] shadow-xl border`}>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 p-3 rounded-2xl"><Palette className="text-blue-600" /></div>
              <h3 className={`text-xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>Apariencia y Tema</h3>
            </div>
            <div className={`flex items-center justify-between p-6 ${darkMode ? "bg-slate-700" : "bg-gray-50"} rounded-3xl`}>
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="text-blue-400" /> : <Sun className="text-orange-400" />}
                <span className={`font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>
                  Modo {darkMode ? "Oscuro" : "Claro"}
                </span>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${darkMode ? "bg-orange-600" : "bg-gray-300"}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${darkMode ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </div>

          <div className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"} p-8 rounded-[2.5rem] shadow-xl border`}>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-green-100 p-3 rounded-2xl"><Shield className="text-green-600" /></div>
              <h3 className={`text-xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>Privacidad</h3>
            </div>
            <div className={`flex items-center justify-between p-6 ${darkMode ? "bg-slate-700" : "bg-gray-50"} rounded-3xl`}>
              <span className={`font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>Recetas publicas por defecto</span>
              <div className="w-14 h-8 bg-orange-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}