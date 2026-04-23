import recipes from "@/data/recipes.json";

export const createClient = async () => ({
  from: (table: string) => ({
    select: () => ({
      eq: () => Promise.resolve({ data: recipes, error: null })
    })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: { email: "usuario@local.com", user_metadata: { full_name: "Usuario Local" } } } })
  }
});
