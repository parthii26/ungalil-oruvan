-- Navigation items schema
CREATE TABLE IF NOT EXISTS public.navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

-- Public read active items
CREATE POLICY "Public read active navigation items"
ON public.navigation_items
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Service role full access
CREATE POLICY "Service role full access to navigation items"
ON public.navigation_items
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
