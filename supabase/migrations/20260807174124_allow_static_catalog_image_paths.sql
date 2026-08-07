alter table public.product_images
  drop constraint product_images_check;

alter table public.product_images
  add constraint product_images_check check (
    split_part(storage_path, '/', 1) = product_id::text
    or storage_path ~ '^static/catalog/[a-z0-9_]+[.]png$'
  );
