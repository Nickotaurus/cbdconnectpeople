
-- Ajouter les champs pour suivre la source des boutiques
ALTER TABLE IF EXISTS public.stores 
ADD COLUMN IF NOT EXISTS source_table text,
ADD COLUMN IF NOT EXISTS source_id text;

-- Créer un index pour faciliter la recherche par source
CREATE INDEX IF NOT EXISTS idx_stores_source ON public.stores (source_table, source_id);

-- Commentaire sur les champs
COMMENT ON COLUMN public.stores.source_table IS 'Nom de la table source (ex: cbd_shops)';
COMMENT ON COLUMN public.stores.source_id IS 'ID de la boutique dans sa table source';
