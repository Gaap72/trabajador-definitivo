import recipes from "@/data/recipes.json";

// Helper para persistencia local real
const getStoredUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("supabase_user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const createClient = () => {
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
        const user = getStoredUser();
        return Promise.resolve({ data: { user } });
      },
      signInWithOAuth: ({ provider }: { provider: string }) => {
        const mockUser = { 
          id: "user_123",
          email: `usuario_${provider}@test.com`, 
          user_metadata: { full_name: `Usuario ${provider}` } 
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("supabase_user", JSON.stringify(mockUser));
        }
        window.location.href = "/private";
        return Promise.resolve();
      },
      signOut: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("supabase_user");
        }
        window.location.href = "/";
        return Promise.resolve();
      }
    }
  };
};