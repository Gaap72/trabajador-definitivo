import recipes from "@/data/recipes.json";

export const createClient = () => ({
  from: (table: string) => ({
    select: () => ({
      eq: () => Promise.resolve({ data: recipes, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null })
    }),
    insert: () => Promise.resolve({ data: null, error: null })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: { email: "usuario@local.com", user_metadata: { full_name: "Usuario Local" } } } }),
    signInWithOAuth: () => { window.location.href = "/private"; return Promise.resolve(); },
    signOut: () => { window.location.href = "/"; return Promise.resolve(); }
  }
});
