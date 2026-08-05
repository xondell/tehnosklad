import { PageContainer } from "@/components/layout/page-container";
import { requireAdmin } from "@/features/admin/auth/guard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  return (
    <main className="py-12">
      <PageContainer className="max-w-4xl">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-stone-500">
            Защищённая зона
          </p>
          <h1 className="mt-3 text-3xl font-black">Панель управления</h1>
          <p className="mt-5 text-stone-600">
            Авторизация, серверная проверка роли и RLS подключены. Управление
            товарами и категориями появится на следующем административном этапе;
            фиктивных CRUD-действий здесь нет.
          </p>
        </section>
      </PageContainer>
    </main>
  );
}
