-- Schema for RecetasWeb

CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    calories INTEGER,
    image_url TEXT,
    is_public BOOLEAN DEFAULT true,
    original_recipe_id UUID REFERENCES public.recipes(id), -- For republished favorite recipes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
    amount NUMERIC,
    unit TEXT,
    UNIQUE(recipe_id, ingredient_id)
);

CREATE TABLE public.recipe_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    instruction TEXT NOT NULL,
    UNIQUE(recipe_id, step_number)
);

CREATE TABLE public.favorites (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, recipe_id)
);

-- RLS (Row Level Security)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public categories are viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public ingredients are viewable by everyone." ON public.ingredients FOR SELECT USING (true);
CREATE POLICY "Public recipes are viewable by everyone." ON public.recipes FOR SELECT USING (is_public = true);
CREATE POLICY "Recipe ingredients viewable by everyone." ON public.recipe_ingredients FOR SELECT USING (true);
CREATE POLICY "Recipe steps viewable by everyone." ON public.recipe_steps FOR SELECT USING (true);

-- Auth user policies
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can create recipes." ON public.recipes FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own recipes." ON public.recipes FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own recipes." ON public.recipes FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Users can view their own private recipes." ON public.recipes FOR SELECT USING (auth.uid() = author_id AND is_public = false);

CREATE POLICY "Users can manage ingredients of own recipes." ON public.recipe_ingredients FOR ALL USING (
    EXISTS (SELECT 1 FROM public.recipes WHERE id = recipe_id AND author_id = auth.uid())
);
CREATE POLICY "Users can manage steps of own recipes." ON public.recipe_steps FOR ALL USING (
    EXISTS (SELECT 1 FROM public.recipes WHERE id = recipe_id AND author_id = auth.uid())
);

CREATE POLICY "Users can view own favorites." ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites." ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites." ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Profile trigger on Auth User creation
CREATE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
