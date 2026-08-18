-- Product photos delivered with the application are served from Vercel's static
-- asset directory. They are intentionally read-only: admin uploads continue to
-- use the UUID-based Supabase Storage path required by the existing policies.
alter table public.product_images
  drop constraint product_images_storage_path_check;

alter table public.product_images
  add constraint product_images_storage_path_check check (
    storage_path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(avif|jpe?g|png|webp)$'
    or storage_path ~ '^static/catalog/[a-z0-9_]+\.png$'
  );
