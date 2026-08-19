-- Deterministic local-development seed for a clean database.
-- Run with `npm run db:reset:local`; no Auth users or secrets are created.

begin;

insert into public.categories (
  id, presentation_key, sort_order, is_published
) values
  ('10000000-0000-4000-8000-000000000001', 'fridge', 10, false),
  ('10000000-0000-4000-8000-000000000002', 'generic', 20, false),
  ('10000000-0000-4000-8000-000000000003', 'stove', 30, false),
  ('10000000-0000-4000-8000-000000000004', 'generic', 40, false),
  ('10000000-0000-4000-8000-000000000005', 'generic', 50, false),
  ('10000000-0000-4000-8000-000000000006', 'stove', 60, false),
  ('10000000-0000-4000-8000-000000000007', 'generic', 70, false),
  ('10000000-0000-4000-8000-000000000008', 'generic', 80, false),
  ('10000000-0000-4000-8000-000000000009', 'vacuum', 90, false),
  ('10000000-0000-4000-8000-000000000010', 'vacuum', 100, false),
  ('10000000-0000-4000-8000-000000000011', 'generic', 110, false),
  ('10000000-0000-4000-8000-000000000012', 'generic', 120, false),
  ('10000000-0000-4000-8000-000000000013', 'generic', 130, false),
  ('10000000-0000-4000-8000-000000000014', 'generic', 140, false),
  ('10000000-0000-4000-8000-000000000015', 'generic', 150, false);

insert into public.category_translations (
  category_id, locale, name, slug, short_description, description,
  seo_title, seo_description
) values
  ('10000000-0000-4000-8000-000000000001', 'ru', 'Холодильники', 'refrigerators', 'Для свежих продуктов каждый день', 'Холодильники для дома и квартиры.', 'Холодильники в Комрате', 'Холодильники Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000001', 'ro', 'Frigidere', 'refrigerators', 'Pentru produse proaspete în fiecare zi', 'Frigidere pentru casă și apartament.', 'Frigidere în Comrat', 'Frigidere Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000002', 'ru', 'Стиральные машины', 'washing-machines', 'Надёжная забота о ваших вещах', 'Стиральные машины для дома.', 'Стиральные машины в Комрате', 'Стиральные машины Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000002', 'ro', 'Mașini de spălat rufe', 'washing-machines', 'Îngrijire de încredere pentru hainele tale', 'Mașini de spălat rufe pentru casă.', 'Mașini de spălat în Comrat', 'Mașini de spălat Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000003', 'ru', 'Плиты и варочные панели', 'stoves-and-cooktops', 'Удобство и комфорт на вашей кухне', 'Плиты и варочные панели для повседневной готовки.', 'Плиты и панели в Комрате', 'Плиты Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000003', 'ro', 'Plite și aragazuri', 'stoves-and-cooktops', 'Confort și eficiență în bucătăria ta', 'Plite și aragazuri practice pentru gătit.', 'Plite în Comrat', 'Plite Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000004', 'ru', 'Микроволновые печи', 'microwave-ovens', 'Быстрый разогрев и приготовление блюд', 'Микроволновые печи для кухни.', 'Микроволновые печи в Комрате', 'Микроволновые печи Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000004', 'ro', 'Cuptoare cu microunde', 'microwave-ovens', 'Încălzire rapidă și preparare ușoară', 'Cuptoare cu microunde pentru bucătărie.', 'Cuptoare cu microunde în Comrat', 'Cuptoare cu microunde Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000005', 'ru', 'Посудомоечные машины', 'dishwashers', 'Идеальная чистота посуды без хлопот', 'Посудомоечные машины для дома.', 'Посудомоечные машины в Комрате', 'Посудомоечные машины Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000005', 'ro', 'Mașini de spălat vase', 'dishwashers', 'Curățenie impecabilă a vaselor fără efort', 'Mașini de spălat vase pentru casă.', 'Mașini de spălat vase în Comrat', 'Mașini de spălat vase Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000006', 'ru', 'Духовые шкафы', 'ovens', 'Для кулинарных шедевров и выпечки', 'Встраиваемые духовые шкафы.', 'Духовые шкафы в Комрате', 'Духовые шкафы Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000006', 'ro', 'Cuptoare încorporabile', 'ovens', 'Pentru capodopere culinare și copt', 'Cuptoare încorporabile pentru bucătărie.', 'Cuptoare în Comrat', 'Cuptoare Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000007', 'ru', 'Сушильные машины', 'dryers', 'Быстрая и бережная сушка белья', 'Сушильные машины для дома.', 'Сушильные машины в Комрате', 'Сушильные машины Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000007', 'ro', 'Uscătoare de rufe', 'dryers', 'Uscare rapidă și delicată a hainelor', 'Uscătoare de rufe pentru casă.', 'Uscătoare de rufe în Comrat', 'Uscătoare de rufe Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000008', 'ru', 'Кофемашины', 'coffee-machines', 'Ароматный кофе каждый день', 'Кофемашины и кофеварки.', 'Кофемашины в Комрате', 'Кофемашины Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000008', 'ro', 'Espresoare de cafea', 'coffee-machines', 'Cafea aromată în fiecare zi', 'Espresoare și aparate de cafea.', 'Espresoare în Comrat', 'Espresoare Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000009', 'ru', 'Пылесосы', 'vacuums', 'Чистота без лишних усилий', 'Пылесосы для регулярной домашней уборки.', 'Пылесосы в Комрате', 'Пылесосы Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000009', 'ro', 'Aspiratoare', 'vacuums', 'Curățenie fără efort suplimentar', 'Aspiratoare pentru curățenia obișnuită a casei.', 'Aspiratoare în Comrat', 'Aspiratoare Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000010', 'ru', 'Роботы-пылесосы', 'robot-vacuums', 'Автоматическая уборка для вашего дома', 'Роботы-пылесосы для автономной уборки.', 'Роботы-пылесосы в Комрате', 'Роботы-пылесосы Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000010', 'ro', 'Aspiratoare robot', 'robot-vacuums', 'Curățare automată pentru casa ta', 'Aspiratoare robot pentru curățare automată.', 'Aspiratoare robot în Comrat', 'Aspiratoare robot Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000011', 'ru', 'Электрочайники', 'electric-kettles', 'Быстрое кипячение воды', 'Электрические чайники.', 'Электрочайники в Комрате', 'Электрочайники Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000011', 'ro', 'Fierbătoare electrice', 'electric-kettles', 'Fierbere rapidă a apei', 'Fierbătoare electrice pentru bucătărie.', 'Fierbătoare în Comrat', 'Fierbătoare Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000012', 'ru', 'Блендеры', 'blenders', 'Для смузи, коктейлей и соусов', 'Погружные и стационарные блендеры.', 'Блендеры в Комрате', 'Блендеры Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000012', 'ro', 'Blendere', 'blenders', 'Pentru smoothie-uri, cocktailuri și sosuri', 'Blendere de mână și staționare.', 'Blendere în Comrat', 'Blendere Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000013', 'ru', 'Кухонные комбайны', 'food-processors', 'Многофункциональные помощники на кухне', 'Кухонные комбайны и измельчители.', 'Кухонные комбайны в Комрате', 'Кухонные комбайны Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000013', 'ro', 'Roboți de bucătărie', 'food-processors', 'Ajutoare multifuncționale în bucătărie', 'Roboți de bucătărie și tocătoare.', 'Roboți de bucătărie în Comrat', 'Roboți de bucătărie Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000014', 'ru', 'Тостеры и ростеры', 'toasters', 'Хрустящие тосты к завтраку', 'Тостеры и ростеры.', 'Тостеры в Комрате', 'Тостеры Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000014', 'ro', 'Prăjitoare de pâine și roastere', 'toasters', 'Pâine prăjită crocantă pentru micul dejun', 'Prăjitoare de pâine.', 'Prăjitoare de pâine în Comrat', 'Prăjitoare de pâine Tehnosklad în Comrat.'),
  ('10000000-0000-4000-8000-000000000015', 'ru', 'Кондиционеры', 'air-conditioners', 'Комфортный климат в любое время года', 'Сплит-системы и кондиционеры.', 'Кондиционеры в Комрате', 'Кондиционеры Tehnosklad в Комрате.'),
  ('10000000-0000-4000-8000-000000000015', 'ro', 'Aparate de aer condiționat', 'air-conditioners', 'Climat confortabil în orice anotimp', 'Aparate de aer condiționat și sisteme split.', 'Aer condiționat în Comrat', 'Aer condiționat Tehnosklad în Comrat.');

update public.categories set is_published = true;

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

-- Contact defaults are owned by the stage 8 migration. Keeping them out of the
-- seed makes `supabase db reset --local` deterministic and avoids duplicate keys.

commit;
