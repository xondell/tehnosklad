-- Deterministic local-development seed for a clean database.
-- Run with `npm run db:reset:local`; no Auth users or secrets are created.

begin;

insert into public.categories (
  id, presentation_key, sort_order, is_published
) values
  ('10000000-0000-4000-8000-000000000001', 'fridge', 10, false),
  ('10000000-0000-4000-8000-000000000002', 'stove', 20, false),
  ('10000000-0000-4000-8000-000000000003', 'vacuum', 30, false);

insert into public.category_translations (
  category_id, locale, name, slug, short_description, description,
  seo_title, seo_description
) values
  ('10000000-0000-4000-8000-000000000001', 'ru', 'Холодильники', 'refrigerators', 'Для свежих продуктов каждый день', 'Холодильники для дома и квартиры.', 'Холодильники в Комрате', 'Холодильники Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000001', 'ro', 'Frigidere', 'refrigerators', 'Pentru produse proaspete în fiecare zi', 'Frigidere pentru casă și apartament.', 'Frigidere în Comrat', 'Frigidere Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000002', 'ru', 'Плиты', 'stoves', 'Удобство на вашей кухне', 'Практичные плиты для повседневной готовки.', 'Плиты в Комрате', 'Плиты Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000002', 'ro', 'Aragazuri', 'stoves', 'Confort pentru bucătăria dumneavoastră', 'Aragazuri practice pentru gătitul zilnic.', 'Aragazuri în Comrat', 'Aragazuri Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000003', 'ru', 'Пылесосы', 'vacuums', 'Чистота без лишних усилий', 'Пылесосы для регулярной домашней уборки.', 'Пылесосы в Комрате', 'Пылесосы Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000003', 'ro', 'Aspiratoare', 'vacuums', 'Curățenie fără efort suplimentar', 'Aspiratoare pentru curățenia obișnuită a casei.', 'Aspiratoare în Comrat', 'Aspiratoare Tehnosklad în Comrat.');

update public.categories set is_published = true;

insert into public.products (
  id, category_id, brand, model, sku, price_minor, old_price_minor,
  availability, is_popular, is_new, sort_order, is_published
) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Nord', 'Cool 300', 'DEMO-NORD-COOL-300', 789000, 849000, 'in_stock', true, false, 10, false),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Vesta', 'Fresh 280', 'DEMO-VESTA-FRESH-280', 699000, null, 'in_stock', false, true, 20, false),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'Orion', 'Frost 360', 'DEMO-ORION-FROST-360', 929000, 999000, 'out_of_stock', true, false, 30, false),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'Doma', 'Line 240', 'DEMO-DOMA-LINE-240', 619000, null, 'in_stock', false, false, 40, false),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', 'Vesta', 'Chef 50', 'DEMO-VESTA-CHEF-50', 529000, 579000, 'in_stock', true, false, 10, false),
  ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000002', 'Nord', 'Heat 60', 'DEMO-NORD-HEAT-60', 689000, null, 'in_stock', false, true, 20, false),
  ('20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000002', 'Orion', 'Flame 50', 'DEMO-ORION-FLAME-50', 459000, null, 'out_of_stock', false, false, 30, false),
  ('20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000002', 'Doma', 'Kitchen 55', 'DEMO-DOMA-KITCHEN-55', 599000, 649000, 'in_stock', true, true, 40, false),
  ('20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000003', 'Nord', 'Air 700', 'DEMO-NORD-AIR-700', 219000, null, 'in_stock', true, false, 10, false),
  ('20000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000003', 'Vesta', 'Clean 900', 'DEMO-VESTA-CLEAN-900', 289000, 319000, 'in_stock', false, true, 20, false),
  ('20000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000003', 'Orion', 'Sweep 500', 'DEMO-ORION-SWEEP-500', 179000, null, 'out_of_stock', false, false, 30, false),
  ('20000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000003', 'Doma', 'Dust 800', 'DEMO-DOMA-DUST-800', 249000, null, 'in_stock', true, true, 40, false);

insert into public.product_translations (
  product_id, locale, name, slug, short_description, description,
  seo_title, seo_description
) values
  ('20000000-0000-4000-8000-000000000001', 'ru', 'Холодильник Nord Cool 300', 'nord-cool-300', 'Практичная двухкамерная модель для дома.', 'Модель с продуманным внутренним пространством.', null, null),
  ('20000000-0000-4000-8000-000000000001', 'ro', 'Frigider Nord Cool 300', 'nord-cool-300', 'Model practic cu două compartimente pentru casă.', 'Model cu spațiu interior bine organizat.', null, null),
  ('20000000-0000-4000-8000-000000000002', 'ru', 'Холодильник Vesta Fresh 280', 'vesta-fresh-280', 'Компактный формат для небольшой кухни.', 'Вариант для повседневного хранения продуктов.', null, null),
  ('20000000-0000-4000-8000-000000000002', 'ro', 'Frigider Vesta Fresh 280', 'vesta-fresh-280', 'Format compact pentru o bucătărie mică.', 'Variantă pentru păstrarea zilnică a produselor.', null, null),
  ('20000000-0000-4000-8000-000000000003', 'ru', 'Холодильник Orion Frost 360', 'orion-frost-360', 'Вместительная модель для семьи.', 'Вместительный холодильник для семейного использования.', null, null),
  ('20000000-0000-4000-8000-000000000003', 'ro', 'Frigider Orion Frost 360', 'orion-frost-360', 'Model încăpător pentru familie.', 'Frigider încăpător pentru utilizarea familiei.', null, null),
  ('20000000-0000-4000-8000-000000000004', 'ru', 'Холодильник Doma Line 240', 'doma-line-240', 'Лаконичное решение для квартиры.', 'Модель с базовым набором возможностей.', null, null),
  ('20000000-0000-4000-8000-000000000004', 'ro', 'Frigider Doma Line 240', 'doma-line-240', 'Soluție simplă pentru apartament.', 'Model cu funcțiile esențiale.', null, null),
  ('20000000-0000-4000-8000-000000000005', 'ru', 'Плита Vesta Chef 50', 'vesta-chef-50', 'Надёжный формат для ежедневной готовки.', 'Плита с понятным управлением.', null, null),
  ('20000000-0000-4000-8000-000000000005', 'ro', 'Aragaz Vesta Chef 50', 'vesta-chef-50', 'Format fiabil pentru gătitul zilnic.', 'Aragaz cu control intuitiv.', null, null),
  ('20000000-0000-4000-8000-000000000006', 'ru', 'Плита Nord Heat 60', 'nord-heat-60', 'Широкая рабочая поверхность.', 'Модель для просторной кухни.', null, null),
  ('20000000-0000-4000-8000-000000000006', 'ro', 'Aragaz Nord Heat 60', 'nord-heat-60', 'Suprafață de lucru mai lată.', 'Model pentru o bucătărie spațioasă.', null, null),
  ('20000000-0000-4000-8000-000000000007', 'ru', 'Плита Orion Flame 50', 'orion-flame-50', 'Компактная техника для кухни.', 'Компактная плита для повседневной готовки.', null, null),
  ('20000000-0000-4000-8000-000000000007', 'ro', 'Aragaz Orion Flame 50', 'orion-flame-50', 'Tehnică compactă pentru bucătărie.', 'Aragaz compact pentru gătitul zilnic.', null, null),
  ('20000000-0000-4000-8000-000000000008', 'ru', 'Плита Doma Kitchen 55', 'doma-kitchen-55', 'Продуманная модель для дома.', 'Вариант с удобной зоной приготовления.', null, null),
  ('20000000-0000-4000-8000-000000000008', 'ro', 'Aragaz Doma Kitchen 55', 'doma-kitchen-55', 'Model bine gândit pentru casă.', 'Variantă cu zonă de gătit comodă.', null, null),
  ('20000000-0000-4000-8000-000000000009', 'ru', 'Пылесос Nord Air 700', 'nord-air-700', 'Лёгкий помощник для ежедневной уборки.', 'Модель для сухой уборки дома.', null, null),
  ('20000000-0000-4000-8000-000000000009', 'ro', 'Aspirator Nord Air 700', 'nord-air-700', 'Ajutor ușor pentru curățenia zilnică.', 'Model pentru curățarea uscată a casei.', null, null),
  ('20000000-0000-4000-8000-000000000010', 'ru', 'Пылесос Vesta Clean 900', 'vesta-clean-900', 'Удобная уборка разных поверхностей.', 'Пылесос с набором базовых насадок.', null, null),
  ('20000000-0000-4000-8000-000000000010', 'ro', 'Aspirator Vesta Clean 900', 'vesta-clean-900', 'Curățenie comodă pentru suprafețe diferite.', 'Aspirator cu accesorii de bază.', null, null),
  ('20000000-0000-4000-8000-000000000011', 'ru', 'Пылесос Orion Sweep 500', 'orion-sweep-500', 'Компактная модель для квартиры.', 'Вариант для регулярной уборки.', null, null),
  ('20000000-0000-4000-8000-000000000011', 'ro', 'Aspirator Orion Sweep 500', 'orion-sweep-500', 'Model compact pentru apartament.', 'Variantă pentru curățenie regulată.', null, null),
  ('20000000-0000-4000-8000-000000000012', 'ru', 'Пылесос Doma Dust 800', 'doma-dust-800', 'Для аккуратной уборки без лишнего шума.', 'Модель для комфортного домашнего использования.', null, null),
  ('20000000-0000-4000-8000-000000000012', 'ro', 'Aspirator Doma Dust 800', 'doma-dust-800', 'Pentru curățenie atentă fără zgomot excesiv.', 'Model pentru utilizare confortabilă acasă.', null, null);

insert into public.attribute_groups (id, code, sort_order) values
  ('30000000-0000-4000-8000-000000000001', 'general', 10);

insert into public.attribute_group_translations (group_id, locale, name) values
  ('30000000-0000-4000-8000-000000000001', 'ru', 'Основные характеристики'),
  ('30000000-0000-4000-8000-000000000001', 'ro', 'Caracteristici principale');

insert into public.attributes (
  id, group_id, code, data_type, is_filterable, sort_order
) values
  ('31000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'capacity', 'text', false, 10),
  ('31000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 'energy_class', 'single_select', true, 20),
  ('31000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', 'feature', 'text', false, 30);

insert into public.attribute_translations (attribute_id, locale, name) values
  ('31000000-0000-4000-8000-000000000001', 'ru', 'Объём / размер'),
  ('31000000-0000-4000-8000-000000000001', 'ro', 'Capacitate / dimensiune'),
  ('31000000-0000-4000-8000-000000000002', 'ru', 'Класс'),
  ('31000000-0000-4000-8000-000000000002', 'ro', 'Clasă'),
  ('31000000-0000-4000-8000-000000000003', 'ru', 'Особенность'),
  ('31000000-0000-4000-8000-000000000003', 'ro', 'Caracteristică');

insert into public.attribute_options (
  id, attribute_id, code, sort_order
) values
  ('32000000-0000-4000-8000-000000000001', '31000000-0000-4000-8000-000000000002', 'a', 10),
  ('32000000-0000-4000-8000-000000000002', '31000000-0000-4000-8000-000000000002', 'a_plus', 20);

insert into public.attribute_option_translations (option_id, locale, label) values
  ('32000000-0000-4000-8000-000000000001', 'ru', 'A'),
  ('32000000-0000-4000-8000-000000000001', 'ro', 'A'),
  ('32000000-0000-4000-8000-000000000002', 'ru', 'A+'),
  ('32000000-0000-4000-8000-000000000002', 'ro', 'A+');

insert into public.category_attributes (
  category_id, attribute_id, is_required, is_filterable, sort_order
)
select category.id, attribute.id, true, attribute.is_filterable, attribute.sort_order
from public.categories as category
cross join public.attributes as attribute;

with seed_values (
  product_id, capacity_ru, capacity_ro, feature_ru, feature_ro, class_code
) as (values
  ('20000000-0000-4000-8000-000000000001'::uuid, '300 л', '300 l', 'две камеры', 'două compartimente', 'a'),
  ('20000000-0000-4000-8000-000000000002'::uuid, '280 л', '280 l', 'нижняя морозильная камера', 'congelator inferior', 'a'),
  ('20000000-0000-4000-8000-000000000003'::uuid, '360 л', '360 l', 'система охлаждения', 'sistem de răcire', 'a_plus'),
  ('20000000-0000-4000-8000-000000000004'::uuid, '240 л', '240 l', 'перенавешиваемая дверь', 'ușă reversibilă', 'a'),
  ('20000000-0000-4000-8000-000000000005'::uuid, '50 см', '50 cm', 'духовой шкаф', 'cuptor', 'a'),
  ('20000000-0000-4000-8000-000000000006'::uuid, '60 см', '60 cm', 'четыре зоны', 'patru zone', 'a'),
  ('20000000-0000-4000-8000-000000000007'::uuid, '50 см', '50 cm', 'эмалированная поверхность', 'suprafață emailată', 'a'),
  ('20000000-0000-4000-8000-000000000008'::uuid, '55 см', '55 cm', 'подсветка духовки', 'iluminarea cuptorului', 'a'),
  ('20000000-0000-4000-8000-000000000009'::uuid, '1,8 л', '1,8 l', 'контейнер', 'recipient', 'a'),
  ('20000000-0000-4000-8000-000000000010'::uuid, '2 л', '2 l', 'регулировка мощности', 'reglarea puterii', 'a'),
  ('20000000-0000-4000-8000-000000000011'::uuid, '1,5 л', '1,5 l', 'компактный корпус', 'carcasă compactă', 'a'),
  ('20000000-0000-4000-8000-000000000012'::uuid, '2,2 л', '2,2 l', 'телескопическая трубка', 'tub telescopic', 'a')
)
insert into public.product_attribute_values (
  id, product_id, attribute_id, ordinal, text_value_key, option_id
)
select md5(product_id::text || ':capacity')::uuid, product_id,
  '31000000-0000-4000-8000-000000000001', 0, 'capacity', null
from seed_values
union all
select md5(product_id::text || ':class')::uuid, product_id,
  '31000000-0000-4000-8000-000000000002', 0, null,
  case class_code
    when 'a_plus' then '32000000-0000-4000-8000-000000000002'::uuid
    else '32000000-0000-4000-8000-000000000001'::uuid
  end
from seed_values
union all
select md5(product_id::text || ':feature')::uuid, product_id,
  '31000000-0000-4000-8000-000000000003', 0, 'feature', null
from seed_values;

with seed_values (
  product_id, capacity_ru, capacity_ro, feature_ru, feature_ro
) as (values
  ('20000000-0000-4000-8000-000000000001'::uuid, '300 л', '300 l', 'две камеры', 'două compartimente'),
  ('20000000-0000-4000-8000-000000000002'::uuid, '280 л', '280 l', 'нижняя морозильная камера', 'congelator inferior'),
  ('20000000-0000-4000-8000-000000000003'::uuid, '360 л', '360 l', 'система охлаждения', 'sistem de răcire'),
  ('20000000-0000-4000-8000-000000000004'::uuid, '240 л', '240 l', 'перенавешиваемая дверь', 'ușă reversibilă'),
  ('20000000-0000-4000-8000-000000000005'::uuid, '50 см', '50 cm', 'духовой шкаф', 'cuptor'),
  ('20000000-0000-4000-8000-000000000006'::uuid, '60 см', '60 cm', 'четыре зоны', 'patru zone'),
  ('20000000-0000-4000-8000-000000000007'::uuid, '50 см', '50 cm', 'эмалированная поверхность', 'suprafață emailată'),
  ('20000000-0000-4000-8000-000000000008'::uuid, '55 см', '55 cm', 'подсветка духовки', 'iluminarea cuptorului'),
  ('20000000-0000-4000-8000-000000000009'::uuid, '1,8 л', '1,8 l', 'контейнер', 'recipient'),
  ('20000000-0000-4000-8000-000000000010'::uuid, '2 л', '2 l', 'регулировка мощности', 'reglarea puterii'),
  ('20000000-0000-4000-8000-000000000011'::uuid, '1,5 л', '1,5 l', 'компактный корпус', 'carcasă compactă'),
  ('20000000-0000-4000-8000-000000000012'::uuid, '2,2 л', '2,2 l', 'телескопическая трубка', 'tub telescopic')
)
insert into public.product_attribute_value_translations (
  value_id, locale, text_value
)
select md5(product_id::text || ':capacity')::uuid, 'ru', capacity_ru from seed_values
union all
select md5(product_id::text || ':capacity')::uuid, 'ro', capacity_ro from seed_values
union all
select md5(product_id::text || ':feature')::uuid, 'ru', feature_ru from seed_values
union all
select md5(product_id::text || ':feature')::uuid, 'ro', feature_ro from seed_values;

update public.products set is_published = true;

insert into public.site_settings (key, locale, value) values
  ('phone_display', 'ru', '+373 69 166 172'),
  ('phone_display', 'ro', '+373 69 166 172'),
  ('phone_href', 'ru', 'tel:+37369166172'),
  ('phone_href', 'ro', 'tel:+37369166172'),
  ('address', 'ru', 'ул. Победы, 97, Комрат'),
  ('address', 'ro', 'str. Victoriei, 97, Comrat'),
  ('open_days', 'ru', 'Вторник–воскресенье'),
  ('open_days', 'ro', 'Marți–duminică'),
  ('open_time', 'ru', '08:00–16:00'),
  ('open_time', 'ro', '08:00–16:00'),
  ('closed_day', 'ru', 'Понедельник — выходной'),
  ('closed_day', 'ro', 'Luni — zi liberă'),
  ('contact_text', 'ru', 'Позвоните нам в часы работы магазина.'),
  ('contact_text', 'ro', 'Sunați-ne în programul magazinului.');

commit;
