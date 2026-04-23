import recipes from "@/data/recipes.json";

export const createClient = () => {
  // Simular persistencia con localStorage si estamos en el navegador
  const getStoredUser = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("supabase_user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  };

  return {
    from: (table: string) => ({
      select: () => ({
        eq: () => Promise.resolve({ data: recipes, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null })
      }),
      insert: () => Promise.resolve({ data: null, error: null })
    }),
    auth: {
      getUser: () => {
        const user = getStoredUser() || { email: "invitado@local.com", user_metadata: { full_name: "Invitado" } };
        return Promise.resolve({ data: { user } });
      },
      signInWithOAuth: ({ provider }: { provider: string }) => {
        const mockUser = { email: `usuario_${provider}@test.com`, user_metadata: { full_name: `Usuario ${provider}` } };
        if (typeof window !== "undefined") localStorage.setItem("supabase_user", JSON.stringify(mockUser));
        window.location.href = "/private";
        return Promise.resolve();
      },
      signOut: () => {
        if (typeof window !== "undefined") localStorage.removeItem("supabase_user");
        window.location.href = "/";
        return Promise.resolve();
      }
    }
  };
};
